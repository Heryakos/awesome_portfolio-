"use client";

import { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useCms } from "./CmsContext";

// ── Custom Y shape built from ExtrudeGeometry ────────────────
function createYShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const t = 0.22; // stem half-width

  // Y glyph: two arms going up-left and up-right, then a stem going down
  shape.moveTo(-t, -1.4);
  shape.lineTo(-t, -0.1);
  shape.lineTo(-1.05, 1.4);
  shape.lineTo(-0.65, 1.4);
  shape.lineTo(0, 0.35);
  shape.lineTo(0.65, 1.4);
  shape.lineTo(1.05, 1.4);
  shape.lineTo(t, -0.1);
  shape.lineTo(t, -1.4);
  shape.lineTo(-t, -1.4);

  return shape;
}

// ── High-End Optical Shockwave Ring ──────────────────────────
interface ShockwaveRing {
  id: number;
  pos: [number, number, number];
  scale: number;
  opacity: number;
  maxScale: number;
  color: string;
}

function ShockwaveGroup({
  rings,
  onDone,
}: {
  rings: ShockwaveRing[];
  onDone: (id: number) => void;
}) {
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i];
      r.scale += (r.maxScale - r.scale) * 6.5 * dt + 0.04;
      r.opacity -= 1.8 * dt;
      if (r.opacity <= 0 || r.scale >= r.maxScale * 0.98) {
        onDone(r.id);
      }
    }
  });

  if (rings.length === 0) return null;

  return (
    <group>
      {rings.map((r) => (
        <mesh key={r.id} position={r.pos} scale={[r.scale, r.scale, 1]}>
          <ringGeometry args={[0.12, 0.22, 64]} />
          <meshBasicMaterial
            color={r.color}
            transparent
            opacity={Math.max(0, r.opacity)}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Delicate Optical Stardust / Diamond Glints ───────────────
interface StardustParticle {
  id: number;
  pos: [number, number, number];
  vel: [number, number, number];
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

function StardustGroup({
  sparks,
  onDone,
}: {
  sparks: StardustParticle[];
  onDone: (id: number) => void;
}) {
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.pos[0] += s.vel[0] * dt;
      s.pos[1] += s.vel[1] * dt;
      s.pos[2] += s.vel[2] * dt;
      s.vel[0] *= 0.93; // smooth drag
      s.vel[1] *= 0.93;
      s.vel[2] *= 0.93;
      s.life -= dt * 2.2;
      if (s.life <= 0) {
        onDone(s.id);
      }
    }
  });

  if (sparks.length === 0) return null;

  return (
    <group>
      {sparks.map((s) => {
        const progress = Math.max(0, s.life / s.maxLife);
        const currentSize = s.size * Math.sin(progress * Math.PI);
        return (
          <mesh key={s.id} position={s.pos}>
            <octahedronGeometry args={[Math.max(0.005, currentSize), 0]} />
            <meshBasicMaterial
              color={s.color}
              transparent
              opacity={Math.min(1, progress * 1.6)}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── The 3D Y mesh (Universal Mobile & Desktop Performance) ────
function YMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null!);
  const mouse = useMousePosition();
  const { viewport } = useThree();
  const cms = useCms();
  const effects = cms.overrides.effects;
  const isDark = cms.themeMode === "dark" || cms.overrides.themePreset === "apple-glass";
  const isGlass = cms.overrides.themePreset === "apple-glass" || effects?.yMaterial === "glass";
  const yMaterial = isGlass ? "glass" : (effects?.yMaterial || "obsidian");
  const speedMult = effects?.ySpeed ?? 1.0;

  // Spring physics for elastic bounce & gyro spin
  const [hovered, setHovered] = useState(false);
  const scaleImpulse = useRef(0);
  const scaleVelocity = useRef(0);
  const spinVelocity = useRef(0);
  const extraRotY = useRef(0);
  const pulseEnergy = useRef(0);

  const [rings, setRings] = useState<ShockwaveRing[]>([]);
  const [stardust, setStardust] = useState<StardustParticle[]>([]);

  // Responsive scale: on mobile portrait (Samsung Galaxy S20, iPhone),
  // dynamically scale so the Y fits between the text without clipping
  const isMobile = viewport.width < 5;
  const responsiveScale = isMobile ? Math.min(0.88, viewport.width / 4.4) : 1.15;
  const posY = isMobile ? -0.15 : 0;

  const geometry = useMemo(() => {
    const shape = createYShape();
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 8, // Optimized for 60fps on mobile
      curveSegments: 16,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }, []);

  const triggerImpactFX = (origin: THREE.Vector3) => {
    // 1. Dual Shockwave Rings (Fast primary ring + trailing secondary ring)
    const shockPalette = isGlass
      ? ["#38BDF8", "#FFFFFF"]
      : ["#FF4A1C", "#FF9E7A"];

    const newRings: ShockwaveRing[] = [
      {
        id: Math.random() + Date.now(),
        pos: [origin.x, origin.y, origin.z + 0.08],
        scale: 0.15,
        opacity: 0.95,
        maxScale: 3.2,
        color: shockPalette[0],
      },
      {
        id: Math.random() + Date.now() + 1,
        pos: [origin.x, origin.y, origin.z + 0.04],
        scale: 0.1,
        opacity: 0.7,
        maxScale: 2.4,
        color: shockPalette[1],
      },
    ];
    setRings((prev) => [...prev.slice(-4), ...newRings]);

    // 2. High-speed optical stardust diamond glints
    const glintPalette = isGlass
      ? ["#FFFFFF", "#38BDF8", "#67E8F9", "#E0F2FE"]
      : ["#FF4A1C", "#FF8C38", "#FFD700", "#FFFFFF"];

    const created: StardustParticle[] = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.4 + Math.random() * 2.8;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;
      created.push({
        id: Math.random() + Date.now() + i,
        pos: [
          origin.x + (Math.random() - 0.5) * 0.15,
          origin.y + (Math.random() - 0.5) * 0.15,
          origin.z + 0.1,
        ],
        vel: [
          Math.cos(angle) * Math.cos(phi) * speed,
          Math.sin(angle) * Math.cos(phi) * speed + 0.4,
          Math.sin(phi) * speed + 0.5,
        ],
        size: 0.024 + Math.random() * 0.022,
        color: glintPalette[Math.floor(Math.random() * glintPalette.length)],
        life: 0.7 + Math.random() * 0.3,
        maxLife: 1.0,
      });
    }
    setStardust((prev) => [...prev.slice(-40), ...created]);

    // 3. Material tactile energy pulse (surge)
    pulseEnergy.current = 1.25;
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    // 1. Elastic bounce spring impulse
    scaleVelocity.current = 0.65;
    // 2. Gyro spin kick impulse
    spinVelocity.current += Math.PI * 1.8;
    // 3. Trigger optical ripple and glints
    const pt = e.point ? e.point : new THREE.Vector3(0, posY, 0.4);
    triggerImpactFX(pt);
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime() * speedMult;

    // Organic continuous floating rotation
    const autoRotX = Math.sin(t * 0.7) * 0.14;
    const autoRotY = Math.cos(t * 0.5) * 0.22;
    const floatY = Math.sin(t * 1.1) * 0.08;

    // Physics calculations (Harmonic Oscillator)
    const k = 170; // Spring stiffness
    const c = 12; // Damping coefficient
    const force = -k * scaleImpulse.current - c * scaleVelocity.current;
    scaleVelocity.current += force * dt;
    scaleImpulse.current += scaleVelocity.current * dt;

    // Gyro spin decay (exponential drag)
    extraRotY.current += spinVelocity.current * dt;
    spinVelocity.current *= Math.pow(0.86, dt * 60);

    // Decay material energy pulse
    pulseEnergy.current *= Math.pow(0.89, dt * 60);
    if (matRef.current) {
      const baseEmissive = isGlass ? 0.3 : (isDark ? 0.28 : 0.18);
      matRef.current.emissiveIntensity = baseEmissive + pulseEnergy.current * 1.2;
    }

    // Hover scale & spring scale blending
    const hoverScale = hovered ? 1.04 : 1.0;
    const currentScale = responsiveScale * hoverScale * (1 + scaleImpulse.current);
    groupRef.current.scale.set(currentScale, currentScale, currentScale);

    // Blend autonomous float with desktop mouse tilt & extra rotational impulse
    const targetRX = autoRotX - mouse.y * 0.35;
    const targetRY = autoRotY + mouse.x * 0.45 + extraRotY.current;

    groupRef.current.rotation.x += (targetRX - groupRef.current.rotation.x) * 0.06;
    groupRef.current.rotation.y += (targetRY - groupRef.current.rotation.y) * 0.08;
    groupRef.current.position.y = posY + floatY;
  });

  // Material properties per theme preset
  const matProps = useMemo(() => {
    switch (yMaterial) {
      case "glass":
        return {
          color: "#FFFFFF",
          emissive: "#1b2848",
          emissiveIntensity: 0.3,
          roughness: 0.02,
          metalness: 0.04,
          transmission: 0.98,
          thickness: 2.2,
          ior: 1.52, // Optical crown glass
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          attenuationColor: "#d2e3fc",
          attenuationDistance: 2.5,
          wireframe: false,
        };
      case "vermilion":
        return {
          color: "#FF4A1C",
          emissive: "#4A0E00",
          emissiveIntensity: 0.35,
          roughness: 0.1,
          metalness: 0.85,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
          wireframe: false,
        };
      case "gold":
        return {
          color: "#D4AF37",
          emissive: "#332402",
          emissiveIntensity: 0.3,
          roughness: 0.14,
          metalness: 0.95,
          clearcoat: 0.9,
          clearcoatRoughness: 0.1,
          wireframe: false,
        };
      case "chrome":
        return {
          color: "#F2F2F2",
          emissive: "#111111",
          emissiveIntensity: 0.1,
          roughness: 0.03,
          metalness: 1.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.03,
          wireframe: false,
        };
      case "wireframe":
        return {
          color: "#FF4A1C",
          emissive: "#FF4A1C",
          emissiveIntensity: 0.8,
          roughness: 0.1,
          metalness: 0.5,
          clearcoat: 0,
          clearcoatRoughness: 0,
          wireframe: true,
        };
      case "obsidian":
      default:
        return {
          // In dark mode, use sleek titanium sheen with glowing vermilion rim bevel
          color: isDark ? "#282a32" : "#161514",
          emissive: isDark ? "#FF4A1C" : "#2A1005",
          emissiveIntensity: isDark ? 0.28 : 0.18,
          roughness: 0.07,
          metalness: 0.92,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
          wireframe: false,
        };
    }
  }, [yMaterial, isDark]);

  return (
    <>
      <group ref={groupRef} scale={responsiveScale} position={[0, posY, 0]}>
        <mesh
          ref={meshRef}
          geometry={geometry}
          castShadow
          receiveShadow
          onClick={handleClick}
          onPointerDown={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <meshPhysicalMaterial
            ref={matRef}
            {...matProps}
            reflectivity={1.0}
            ior={matProps.ior ?? 1.65}
          />
        </mesh>
      </group>

      {/* Optical Shockwaves */}
      <ShockwaveGroup
        rings={rings}
        onDone={(id) => setRings((prev) => prev.filter((r) => r.id !== id))}
      />

      {/* Radiant Stardust Diamond Glints */}
      <StardustGroup
        sparks={stardust}
        onDone={(id) => setStardust((prev) => prev.filter((s) => s.id !== id))}
      />
    </>
  );
}

export default function ThreeY({ style }: { style?: React.CSSProperties }) {
  const cms = useCms();
  const isDark = cms.themeMode === "dark" || cms.overrides.themePreset === "apple-glass";
  const isGlass = cms.overrides.themePreset === "apple-glass" || cms.overrides.effects?.yMaterial === "glass";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        ...style,
      }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, typeof window !== "undefined" && window.devicePixelRatio > 2 ? 2 : 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [0, 0, 5.8], fov: 44 }}
      >
        {/* Studio Lighting calibrated for light, dark, and Apple Liquid Glass */}
        <ambientLight intensity={isDark ? 1.8 : 1.4} />
        <directionalLight
          position={[5, 8, 6]}
          intensity={isGlass ? 4.5 : 3.4}
          color="#FFFFFF"
        />
        <directionalLight
          position={[-6, -4, 4]}
          intensity={isGlass ? 3.0 : 2.8}
          color={isGlass ? "#38BDF8" : "#FF4A1C"}
        />
        <directionalLight
          position={[-5, 6, -3]}
          intensity={2.0}
          color={isGlass ? "#FFFFFF" : "#E8F0FE"}
        />
        <pointLight
          position={[0, -4, 3]}
          intensity={2.2}
          color={isGlass ? "#38BDF8" : "#FF7A3D"}
        />
        <pointLight
          position={[0, 2, 4]}
          intensity={isGlass ? 2.8 : 1.8}
          color="#FFFFFF"
        />

        <Suspense fallback={null}>
          <YMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
