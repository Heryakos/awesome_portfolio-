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

// ── Particle Sparkles System ──────────────────────────────────
interface SparkleParticle {
  id: number;
  pos: [number, number, number];
  vel: [number, number, number];
  size: number;
  color: string;
  life: number;
}

function SparklesGroup({
  sparks,
  onDone,
}: {
  sparks: SparkleParticle[];
  onDone: (id: number) => void;
}) {
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.pos[0] += s.vel[0] * dt;
      s.pos[1] += s.vel[1] * dt;
      s.pos[2] += s.vel[2] * dt;
      s.vel[1] -= 1.8 * dt; // subtle gravity
      s.life -= dt * 1.8;
      if (s.life <= 0) {
        onDone(s.id);
      }
    }
  });

  if (sparks.length === 0) return null;

  return (
    <group>
      {sparks.map((s) => (
        <mesh key={s.id} position={s.pos}>
          <sphereGeometry args={[s.size * Math.max(0.2, s.life), 8, 8]} />
          <meshBasicMaterial
            color={s.color}
            transparent
            opacity={Math.min(1, s.life * 1.5)}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── The 3D Y mesh (Universal Mobile & Desktop Performance) ────
function YMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const mouse = useMousePosition();
  const { viewport } = useThree();
  const cms = useCms();
  const effects = cms.overrides.effects;
  const yMaterial = effects?.yMaterial || "obsidian";
  const speedMult = effects?.ySpeed ?? 1.0;

  // Spring physics for elastic bounce & gyro spin
  const [hovered, setHovered] = useState(false);
  const scaleImpulse = useRef(0);
  const scaleVelocity = useRef(0);
  const spinVelocity = useRef(0);
  const extraRotY = useRef(0);
  const [sparks, setSparks] = useState<SparkleParticle[]>([]);

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

  const spawnSparkles = (origin: THREE.Vector3) => {
    const palette = ["#FF4A1C", "#FFD700", "#FFFFFF", "#38BDF8", "#FF7A3D"];
    const created: SparkleParticle[] = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const speed = 1.2 + Math.random() * 2.2;
      created.push({
        id: Math.random() + Date.now() + i,
        pos: [
          origin.x + (Math.random() - 0.5) * 0.2,
          origin.y + (Math.random() - 0.5) * 0.2,
          origin.z + 0.2,
        ],
        vel: [
          Math.cos(theta) * Math.cos(phi) * speed,
          Math.sin(phi) * speed + 0.8,
          Math.sin(theta) * Math.cos(phi) * speed + 0.5,
        ],
        size: 0.038 + Math.random() * 0.03,
        color: palette[Math.floor(Math.random() * palette.length)],
        life: 1.0,
      });
    }
    setSparks((prev) => [...prev.slice(-32), ...created]);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    // 1. Elastic bounce spring impulse
    scaleVelocity.current = 0.65;
    // 2. Gyro spin kick impulse
    spinVelocity.current += Math.PI * 1.8;
    // 3. Sparkle burst
    const pt = e.point ? e.point : new THREE.Vector3(0, posY, 0.4);
    spawnSparkles(pt);
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
          emissive: "#0A101D",
          emissiveIntensity: 0.1,
          roughness: 0.04,
          metalness: 0.05,
          transmission: 0.94,
          thickness: 1.4,
          ior: 1.54,
          clearcoat: 1.0,
          clearcoatRoughness: 0.03,
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
          color: "#161514",
          emissive: "#2A1005",
          emissiveIntensity: 0.2,
          roughness: 0.06,
          metalness: 0.88,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          wireframe: false,
        };
    }
  }, [yMaterial]);

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
            {...matProps}
            reflectivity={1.0}
            ior={matProps.ior ?? 1.65}
          />
        </mesh>
      </group>
      <SparklesGroup
        sparks={sparks}
        onDone={(id) => setSparks((prev) => prev.filter((s) => s.id !== id))}
      />
    </>
  );
}

export default function ThreeY({ style }: { style?: React.CSSProperties }) {
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
        {/* 100% Self-Contained Studio Lighting */}
        <ambientLight intensity={1.4} />
        <directionalLight position={[5, 8, 6]} intensity={3.2} color="#FFFFFF" />
        <directionalLight position={[-6, -4, 4]} intensity={2.6} color="#FF4A1C" />
        <directionalLight position={[-5, 6, -3]} intensity={1.6} color="#E8F0FE" />
        <pointLight position={[0, -4, 3]} intensity={2.0} color="#FF7A3D" />
        <pointLight position={[0, 2, 4]} intensity={1.4} color="#FFFFFF" />

        <Suspense fallback={null}>
          <YMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
