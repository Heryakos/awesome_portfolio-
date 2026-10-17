"use client";

import { useRef, useMemo, Suspense } from "react";
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

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * speedMult;

    // Organic continuous floating rotation (works smoothly on mobile touchscreens)
    const autoRotX = Math.sin(t * 0.7) * 0.14;
    const autoRotY = Math.cos(t * 0.5) * 0.22;
    const floatY = Math.sin(t * 1.1) * 0.08;

    // Blend autonomous float with desktop mouse tilt
    const targetRX = autoRotX - mouse.y * 0.35;
    const targetRY = autoRotY + mouse.x * 0.45;

    groupRef.current.rotation.x += (targetRX - groupRef.current.rotation.x) * 0.06;
    groupRef.current.rotation.y += (targetRY - groupRef.current.rotation.y) * 0.06;
    groupRef.current.position.y = posY + floatY;
  });

  // Material properties per theme preset
  const matProps = useMemo(() => {
    switch (yMaterial) {
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
    <group ref={groupRef} scale={responsiveScale} position={[0, posY, 0]}>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          {...matProps}
          reflectivity={1.0}
          ior={1.65}
        />
      </mesh>
    </group>
  );
}

export default function ThreeY({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
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
        {/* 
          100% Self-Contained Studio Lighting (Zero External Downloads):
          Loads in 0ms, works completely offline, and never hangs on low internet.
        */}
        <ambientLight intensity={1.4} />

        {/* Studio Key Light — crisp top-right highlight */}
        <directionalLight position={[5, 8, 6]} intensity={3.2} color="#FFFFFF" />

        {/* Vermilion Signature Rim Light — gives the iconic warm glow */}
        <directionalLight position={[-6, -4, 4]} intensity={2.6} color="#FF4A1C" />

        {/* Cool Specular Fill Light from top left */}
        <directionalLight position={[-5, 6, -3]} intensity={1.6} color="#E8F0FE" />

        {/* Warm Bottom Bounce Light */}
        <pointLight position={[0, -4, 3]} intensity={2.0} color="#FF7A3D" />

        {/* Front Specular Glint */}
        <pointLight position={[0, 2, 4]} intensity={1.4} color="#FFFFFF" />

        <Suspense fallback={null}>
          <YMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
