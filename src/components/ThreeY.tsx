"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useCms } from "./CmsContext";

// ── Bespoke Brand Favicon 3D Y Geometry ──────────────────────
// Faithfully reproduces the architectural monogram with hollow negative-space windows
function createBrandFaviconYShape(): THREE.Shape {
  const shape = new THREE.Shape();

  // Outer boundary (Counter-Clockwise)
  // Base of stem
  shape.moveTo(-0.28, -1.35);
  shape.lineTo(0.28, -1.35);
  
  // Right side of stem
  shape.lineTo(0.28, -0.05);
  
  // Right arm outer chevron diagonal
  shape.lineTo(0.72, 0.48);
  shape.lineTo(1.18, 1.35);
  
  // Right arm top flat edge
  shape.lineTo(0.68, 1.35);
  
  // Right arm inner slope towards center crotch
  shape.lineTo(0.25, 0.52);
  shape.lineTo(0.0, 0.16);
  
  // Left arm inner slope towards center crotch
  shape.lineTo(-0.25, 0.52);
  shape.lineTo(-0.68, 1.35);
  
  // Left arm top flat edge
  shape.lineTo(-1.18, 1.35);
  
  // Left arm outer chevron diagonal
  shape.lineTo(-0.72, 0.48);
  
  // Left side of stem
  shape.lineTo(-0.28, -0.05);
  shape.closePath();

  // Hole 1: Left arm angular negative-space window (Clockwise)
  const leftHole = new THREE.Path();
  leftHole.moveTo(-0.92, 1.15);
  leftHole.lineTo(-0.72, 1.15);
  leftHole.lineTo(-0.48, 0.72);
  leftHole.lineTo(-0.65, 0.52);
  leftHole.closePath();
  shape.holes.push(leftHole);

  // Hole 2: Right arm angular negative-space window (Clockwise)
  const rightHole = new THREE.Path();
  rightHole.moveTo(0.72, 1.15);
  rightHole.lineTo(0.92, 1.15);
  rightHole.lineTo(0.65, 0.52);
  rightHole.lineTo(0.48, 0.72);
  rightHole.closePath();
  shape.holes.push(rightHole);

  // Hole 3: Stem vertical architectural slot (Clockwise)
  const stemHole = new THREE.Path();
  stemHole.moveTo(-0.09, -1.15);
  stemHole.lineTo(-0.09, -0.15);
  stemHole.lineTo(0.09, -0.15);
  stemHole.lineTo(0.09, -1.15);
  stemHole.closePath();
  shape.holes.push(stemHole);

  return shape;
}

// ── Classic block Y shape (fallback if user wants classic) ────
function createClassicYShape(): THREE.Shape {
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

// ── The 3D Y mesh (Interactive Mouse/Touch Drag-to-Rotate) ────
function YMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const mouse = useMousePosition();
  const { viewport } = useThree();
  const cms = useCms();
  const effects = cms.overrides.effects;
  const isDark = cms.themeMode === "dark" || cms.overrides.themePreset === "apple-glass";
  const isGlass = cms.overrides.themePreset === "apple-glass" || effects?.yMaterial === "glass";
  const yMaterial = isGlass ? "glass" : (effects?.yMaterial || "obsidian");
  const speedMult = effects?.ySpeed ?? 1.0;

  // Interaction & Physics state
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const prevPointer = useRef({ x: 0, y: 0 });
  const userRotation = useRef({ x: 0, y: 0 });
  const rotVelocity = useRef({ x: 0, y: 0 });
  const lastInteractTime = useRef(0);

  // Elastic spring rebound & hover states
  const scaleImpulse = useRef(0);
  const scaleVelocity = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // Responsive scale: fits cleanly between text on mobile portrait & desktop
  const isMobile = viewport.width < 5;
  const responsiveScale = isMobile ? Math.min(0.88, viewport.width / 4.4) : 1.15;
  const posY = isMobile ? -0.15 : 0;

  const geometry = useMemo(() => {
    const yShapeType = effects?.yShape || "brand";
    const shape = yShapeType === "classic" ? createClassicYShape() : createBrandFaviconYShape();
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 8, // Optimized 60fps
      curveSegments: 16,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  }, [effects?.yShape]);

  // Global window listeners for drag-to-rotate so dragging stays smooth anywhere on screen
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevPointer.current.x;
      const dy = e.clientY - prevPointer.current.y;
      prevPointer.current = { x: e.clientX, y: e.clientY };

      const sensitivity = 0.0075;
      userRotation.current.y += dx * sensitivity;
      userRotation.current.x += dy * sensitivity;

      rotVelocity.current = {
        x: dy * sensitivity,
        y: dx * sensitivity,
      };
      lastInteractTime.current = performance.now();
    };

    const onPointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        setActive(false);
        document.body.style.cursor = hovered ? "grab" : "default";
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [hovered]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    isDragging.current = true;
    setActive(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    prevPointer.current = { x: e.clientX, y: e.clientY };
    rotVelocity.current = { x: 0, y: 0 };
    lastInteractTime.current = performance.now();

    // Tactile spring bounce on click
    scaleVelocity.current = 0.35;
    document.body.style.cursor = "grabbing";
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime() * speedMult;

    // Harmonic spring oscillator for tactile rebound
    const k = 180;
    const c = 14;
    const force = -k * scaleImpulse.current - c * scaleVelocity.current;
    scaleVelocity.current += force * dt;
    scaleImpulse.current += scaleVelocity.current * dt;

    // Organic continuous floating oscillation
    const autoRotX = Math.sin(t * 0.7) * 0.12;
    const autoRotY = Math.sin(t * 0.5) * 0.22;
    const floatY = Math.sin(t * 1.1) * 0.08;

    // Drag inertia & momentum decay
    if (!isDragging.current) {
      userRotation.current.x += rotVelocity.current.x;
      userRotation.current.y += rotVelocity.current.y;
      rotVelocity.current.x *= Math.pow(0.92, dt * 60);
      rotVelocity.current.y *= Math.pow(0.92, dt * 60);

      // When idle for over 1.5 seconds, gently ease user rotation back towards front face
      const idleTime = (performance.now() - lastInteractTime.current) / 1000;
      if (idleTime > 1.5) {
        userRotation.current.x *= Math.pow(0.96, dt * 60);
        userRotation.current.y *= Math.pow(0.96, dt * 60);
      }
    }

    // Scale blending (hover swell + spring rebound)
    const hoverScale = hovered ? 1.05 : 1.0;
    const activeScale = active ? 0.98 : 1.0;
    const currentScale = responsiveScale * hoverScale * activeScale * (1 + scaleImpulse.current);
    groupRef.current.scale.set(currentScale, currentScale, currentScale);

    // Apply rotation: user drag + float + gentle desktop mouse tilt
    groupRef.current.rotation.x = userRotation.current.x + autoRotX - mouse.y * 0.15;
    groupRef.current.rotation.y = userRotation.current.y + autoRotY + mouse.x * 0.25;
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
          color: isDark ? "#E6EBF5" : "#FF4A1C",
          emissive: isDark ? "#121624" : "#4A0E00",
          emissiveIntensity: isDark ? 0.15 : 0.35,
          roughness: isDark ? 0.22 : 0.1,
          metalness: isDark ? 0.35 : 0.85,
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
          color: isDark ? "#E6EBF5" : "#FF4A1C",
          emissive: isDark ? "#CBD5E1" : "#FF4A1C",
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
          // In dark mode: radiant sculptural satin platinum (luminous, luxurious, harmonizes with white YEAB text)
          // In light mode: classic obsidian ink sculpture
          color: isDark ? "#E6EBF5" : "#161514",
          emissive: isDark ? "#121624" : "#2A1005",
          emissiveIntensity: isDark ? 0.15 : 0.18,
          roughness: isDark ? 0.22 : 0.07,
          metalness: isDark ? 0.35 : 0.92,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
          wireframe: false,
        };
    }
  }, [yMaterial, isDark]);

  return (
    <group ref={groupRef} scale={responsiveScale} position={[0, posY, 0]}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        castShadow
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          if (!isDragging.current) {
            document.body.style.cursor = "grab";
          }
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          if (!isDragging.current) {
            document.body.style.cursor = "default";
          }
        }}
      >
        <meshPhysicalMaterial
          {...matProps}
          reflectivity={1.0}
          ior={matProps.ior ?? 1.65}
        />
      </mesh>
    </group>
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
        touchAction: "pan-y",
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
        <ambientLight intensity={isGlass ? 1.8 : isDark ? 2.4 : 1.4} />
        <directionalLight
          position={[5, 8, 6]}
          intensity={isGlass ? 4.5 : 3.4}
          color="#FFFFFF"
        />
        <directionalLight
          position={[-6, -4, 4]}
          intensity={isGlass ? 3.0 : isDark ? 2.4 : 2.8}
          color={isGlass ? "#38BDF8" : isDark ? "#CBD5E1" : "#FF4A1C"}
        />
        <directionalLight
          position={[-5, 6, -3]}
          intensity={2.0}
          color={isGlass ? "#FFFFFF" : isDark ? "#E2E8F0" : "#E8F0FE"}
        />
        <pointLight
          position={[0, -4, 3]}
          intensity={isDark ? 1.6 : 2.2}
          color={isGlass ? "#38BDF8" : isDark ? "#94A3B8" : "#FF7A3D"}
        />
        <pointLight
          position={[0, 2, 4]}
          intensity={isGlass ? 2.8 : isDark ? 2.4 : 1.8}
          color="#FFFFFF"
        />

        <Suspense fallback={null}>
          <YMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
