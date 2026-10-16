"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";

// ── Custom Y shape built from ExtrudeGeometry ────────────────
function createYShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const t = 0.22; // stem half-width

  // Y glyph: two arms going up-left and up-right, then a stem going down
  // Start at bottom of stem
  shape.moveTo(-t, -1.5);
  shape.lineTo(-t, -0.1);
  // Left arm going up-left
  shape.lineTo(-1.1, 1.5);
  shape.lineTo(-0.7, 1.5);
  shape.lineTo(0, 0.35);
  // Right arm going up-right
  shape.lineTo(0.7, 1.5);
  shape.lineTo(1.1, 1.5);
  shape.lineTo(t, -0.1);
  // Back down the stem
  shape.lineTo(t, -1.5);
  shape.lineTo(-t, -1.5);

  return shape;
}

// ── The 3D Y mesh ────────────────────────────────────────────
function YMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const mouse = useMousePosition();

  const geometry = useMemo(() => {
    const shape = createYShape();
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.04,
      bevelOffset: 0,
      bevelSegments: 12,
      curveSegments: 24,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Cursor-reactive tilt
    const targetRX = -mouse.y * 0.35;
    const targetRY = mouse.x * 0.5;

    groupRef.current.rotation.x +=
      (targetRX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y +=
      (targetRY - groupRef.current.rotation.y) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.3}>
        <mesh ref={meshRef} geometry={geometry} castShadow>
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.3}
            chromaticAberration={0.04}
            anisotropy={0.05}
            distortion={0.15}
            distortionScale={0.2}
            temporalDistortion={0.04}
            iridescence={0.2}
            iridescenceIOR={1.4}
            iridescenceThicknessRange={[0, 1200]}
            roughness={0.04}
            transmission={1}
            ior={1.35}
            color="#F5F0E8"
            attenuationColor="#FF4A1C"
            attenuationDistance={0.8}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function ThreeY({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      style={{ width: "100%", height: "100%", ...style }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[4, 6, 5]}
          intensity={1.5}
          castShadow
        />
        <directionalLight
          position={[-4, -4, 3]}
          intensity={0.4}
          color="#FF4A1C"
        />
        <pointLight position={[0, 0, 4]} intensity={0.6} color="#EFEBE3" />

        <Environment preset="studio" />

        <YMesh />
      </Canvas>
    </div>
  );
}
