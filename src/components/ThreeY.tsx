"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useCms } from "./CmsContext";

// ── 1:1 Favicon Brand Monogram Architectural Geometry ────────
// Faithfully matches public/favicon.ico:
// 1. Red Left Ribbon & Left Stem Pillar with hollow cut-out window
// 2. Red Right Ribbon Loop with hollow cut-out window
// 3. Ivory Architectural Interlocking Diagonal Ribbon, Right Stem & Base
// Zero balls or spheres.

function createRedLeftShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Outer boundary (Counter-Clockwise)
  shape.moveTo(-0.328, -0.122);
  shape.lineTo(-0.328, -1.122);
  shape.lineTo(-0.144, -0.928);
  shape.lineTo(-0.144, -0.122);
  shape.lineTo(-0.456, 1.117);
  shape.lineTo(-1.167, 1.117);
  shape.closePath();

  // Negative-space window hole (Clockwise)
  const hole = new THREE.Path();
  hole.moveTo(-0.822, 0.95);
  hole.lineTo(-0.489, 0.95);
  hole.lineTo(-0.311, 0.339);
  hole.lineTo(-0.644, 0.339);
  hole.closePath();
  shape.holes.push(hole);

  return shape;
}

function createRedRightShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Outer boundary (Counter-Clockwise)
  shape.moveTo(0.078, 0.617);
  shape.lineTo(0.45, 0.061);
  shape.lineTo(1.161, 1.117);
  shape.lineTo(0.372, 1.117);
  shape.closePath();

  // Negative-space window hole (Clockwise)
  const hole = new THREE.Path();
  hole.moveTo(0.483, 0.95);
  hole.lineTo(0.817, 0.95);
  hole.lineTo(0.489, 0.45);
  hole.lineTo(0.306, 0.617);
  hole.closePath();
  shape.holes.push(hole);

  return shape;
}

function createIvoryRibbonShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Outer boundary (Counter-Clockwise)
  shape.moveTo(-0.144, 0.517);
  shape.lineTo(0.139, 0.017);
  shape.lineTo(0.139, -0.928);
  shape.lineTo(-0.144, -0.928);
  shape.lineTo(-0.328, -1.122);
  shape.lineTo(0.322, -1.122);
  shape.lineTo(0.322, 0.061);
  shape.lineTo(-0.356, 1.117);
  shape.lineTo(-0.456, 1.117);
  shape.closePath();

  return shape;
}

// ── Classic block Y shape (fallback in Design Studio) ────────
function createClassicYShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const t = 0.22; // stem half-width

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

// ── The 3D Sculpture Mesh (Interactive Mouse/Touch Drag-to-Rotate) ──
function YMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const mouse = useMousePosition();
  const { viewport } = useThree();
  const cms = useCms();
  const effects = cms.overrides.effects;
  const isDark = cms.themeMode === "dark" || cms.overrides.themePreset === "apple-glass";
  const isGlass = cms.overrides.themePreset === "apple-glass" || effects?.yMaterial === "glass";
  const yMaterial = isGlass ? "glass" : (effects?.yMaterial || "obsidian");
  const yShapeType = effects?.yShape || "brand";
  const speedMult = effects?.ySpeed ?? 1.0;

  // Interaction & Physics state
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const userRotation = useRef({ x: 0, y: 0 });
  const rotVelocity = useRef({ x: 0, y: 0 });
  const lastInteractTime = useRef(0);

  // Elastic spring rebound & hover states
  const scaleImpulse = useRef(0);
  const scaleVelocity = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // Responsive scale: cleanly sized to breathe harmoniously with hero text
  const isMobile = viewport.width < 5;
  const responsiveScale = isMobile ? Math.min(0.85, viewport.width / 4.5) : 1.1;
  const posY = isMobile ? -0.15 : 0;

  // Extrude settings for architectural bevels
  const extrudeSettings: THREE.ExtrudeGeometryOptions = useMemo(
    () => ({
      depth: 0.34,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.035,
      bevelOffset: 0,
      bevelSegments: 8,
      curveSegments: 16,
    }),
    []
  );

  // Geometries for Brand Favicon parts (1:1 with favicon.ico)
  const redLeftGeo = useMemo(() => new THREE.ExtrudeGeometry(createRedLeftShape(), extrudeSettings), [extrudeSettings]);
  const redRightGeo = useMemo(() => new THREE.ExtrudeGeometry(createRedRightShape(), extrudeSettings), [extrudeSettings]);
  const ivoryRibbonGeo = useMemo(() => {
    const ivorySettings = { ...extrudeSettings, depth: 0.36 };
    return new THREE.ExtrudeGeometry(createIvoryRibbonShape(), ivorySettings);
  }, [extrudeSettings]);

  // Classic single block fallback geometry
  const classicGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(createClassicYShape(), extrudeSettings);
    geo.center();
    return geo;
  }, [extrudeSettings]);

  // Global window listeners for drag-to-rotate
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
    prevPointer.current = { x: e.clientX, y: e.clientY };
    rotVelocity.current = { x: 0, y: 0 };
    lastInteractTime.current = performance.now();

    // Tactile spring bounce on click
    scaleVelocity.current = 0.32;
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

    // Organic continuous floating oscillation (gentle forward-facing motion)
    const autoRotX = Math.sin(t * 0.7) * 0.09;
    const autoRotY = Math.sin(t * 0.5) * 0.16;
    const floatY = Math.sin(t * 1.1) * 0.07;

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
    const hoverScale = hovered ? 1.04 : 1.0;
    const activeScale = active ? 0.98 : 1.0;
    const currentScale = responsiveScale * hoverScale * activeScale * (1 + scaleImpulse.current);
    groupRef.current.scale.set(currentScale, currentScale, currentScale);

    // Apply rotation: user drag + gentle float + desktop mouse tilt
    groupRef.current.rotation.x = userRotation.current.x + autoRotX - mouse.y * 0.14;
    groupRef.current.rotation.y = userRotation.current.y + autoRotY + mouse.x * 0.22;
    groupRef.current.position.y = posY + floatY;
  });

  // ── Multi-Facet Materials Calibrated to Match favicon.ico ──
  const { redMatProps, ivoryMatProps, classicMatProps } = useMemo(() => {
    // 1. Apple Liquid Glass Theme
    if (isGlass) {
      return {
        redMatProps: {
          color: "#FF4A1C",
          emissive: "#3D0E05",
          emissiveIntensity: 0.35,
          roughness: 0.02,
          metalness: 0.03,
          transmission: 0.94,
          thickness: 2.2,
          ior: 1.52,
          attenuationColor: "#FFA07A",
          attenuationDistance: 2.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
        },
        ivoryMatProps: {
          color: "#FFFFFF",
          emissive: "#1B2848",
          emissiveIntensity: 0.28,
          roughness: 0.02,
          metalness: 0.04,
          transmission: 0.98,
          thickness: 2.2,
          ior: 1.54,
          attenuationColor: "#D2E3FC",
          attenuationDistance: 2.5,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
        },
        classicMatProps: {
          color: "#FFFFFF",
          emissive: "#1B2848",
          emissiveIntensity: 0.3,
          roughness: 0.02,
          metalness: 0.04,
          transmission: 0.98,
          thickness: 2.2,
          ior: 1.52,
          attenuationColor: "#D2E3FC",
          attenuationDistance: 2.5,
          clearcoat: 1.0,
        },
      };
    }

    // 2. Explicit Material Overrides from Design Studio
    if (yMaterial === "gold") {
      const gold = {
        color: "#D4AF37",
        emissive: "#332402",
        emissiveIntensity: 0.3,
        roughness: 0.14,
        metalness: 0.95,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
      };
      return {
        redMatProps: gold,
        ivoryMatProps: { ...gold, color: "#F5E6A3" },
        classicMatProps: gold,
      };
    }

    if (yMaterial === "chrome") {
      const chrome = {
        color: "#F2F2F2",
        emissive: "#111111",
        emissiveIntensity: 0.1,
        roughness: 0.03,
        metalness: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
      };
      return {
        redMatProps: chrome,
        ivoryMatProps: chrome,
        classicMatProps: chrome,
      };
    }

    if (yMaterial === "wireframe") {
      const wire = {
        color: isDark ? "#E6EBF5" : "#FF4A1C",
        emissive: isDark ? "#CBD5E1" : "#FF4A1C",
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.5,
        wireframe: true,
      };
      return {
        redMatProps: wire,
        ivoryMatProps: wire,
        classicMatProps: wire,
      };
    }

    // 3. Dark Mode: Dual-Tone Brand Architecture Matching favicon.ico
    // Both Left & Right Arms + Left Stem are Vermilion Red, Central Ribbon & Right Stem are Satin Platinum Ivory
    if (isDark) {
      return {
        redMatProps: {
          color: "#FF4A1C", // Bold Vermilion Red lacquer (matches favicon.ico red facets)
          emissive: "#4A1005",
          emissiveIntensity: 0.32,
          roughness: 0.14,
          metalness: 0.04,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
        },
        ivoryMatProps: {
          color: "#FFFFFF", // Radiant Satin Platinum Ivory (matches favicon.ico white ribbon)
          emissive: "#1E2538",
          emissiveIntensity: 0.28,
          roughness: 0.14,
          metalness: 0.04,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
        },
        classicMatProps: {
          color: "#E6EBF5",
          emissive: "#121624",
          emissiveIntensity: 0.18,
          roughness: 0.22,
          metalness: 0.35,
          clearcoat: 1.0,
        },
      };
    }

    // 4. Light (Paper) Mode: Authentic Favicon Dual-Tone Matching favicon.ico
    // Both Left & Right Arms + Left Stem are Vermilion Red lacquer, Central Ribbon & Right Stem are Architectural Ivory Porcelain
    return {
      redMatProps: {
        color: "#FF4A1C", // Bold Vermilion Red lacquer
        emissive: "#501206",
        emissiveIntensity: 0.36,
        roughness: 0.12,
        metalness: 0.03,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
      },
      ivoryMatProps: {
        color: "#FAF8F5", // Radiant Architectural Ivory Porcelain
        emissive: "#2A2722",
        emissiveIntensity: 0.25,
        roughness: 0.12,
        metalness: 0.03,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
      },
      classicMatProps: {
        color: "#161514",
        emissive: "#2A1005",
        emissiveIntensity: 0.18,
        roughness: 0.07,
        metalness: 0.92,
        clearcoat: 1.0,
      },
    };
  }, [yMaterial, isDark, isGlass]);

  const pointerHandlers = {
    onPointerDown: handlePointerDown,
    onPointerOver: (e: any) => {
      e.stopPropagation();
      setHovered(true);
      if (!isDragging.current) document.body.style.cursor = "grab";
    },
    onPointerOut: (e: any) => {
      e.stopPropagation();
      setHovered(false);
      if (!isDragging.current) document.body.style.cursor = "default";
    },
  };

  return (
    <group ref={groupRef} scale={responsiveScale} position={[0, posY, 0]}>
      {yShapeType === "classic" ? (
        // Fallback classic single block Y
        <mesh geometry={classicGeo} castShadow receiveShadow {...pointerHandlers}>
          <meshPhysicalMaterial {...classicMatProps} reflectivity={1.0} />
        </mesh>
      ) : (
        // 1:1 Favicon Brand Monogram (Red Left Arm & Stem + Red Right Loop + Interlocking Ivory Ribbon, NO ball)
        <group {...pointerHandlers}>
          {/* Part 1: Red Left Ribbon & Left Stem Pillar */}
          <mesh geometry={redLeftGeo} castShadow receiveShadow>
            <meshPhysicalMaterial {...redMatProps} reflectivity={1.0} />
          </mesh>

          {/* Part 2: Red Right Ribbon Loop */}
          <mesh geometry={redRightGeo} castShadow receiveShadow>
            <meshPhysicalMaterial {...redMatProps} reflectivity={1.0} />
          </mesh>

          {/* Part 3: Ivory Interlocking Diagonal Ribbon & Right Stem Pillar */}
          <mesh geometry={ivoryRibbonGeo} position={[0, 0, 0.01]} castShadow receiveShadow>
            <meshPhysicalMaterial {...ivoryMatProps} reflectivity={1.0} />
          </mesh>
        </group>
      )}
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
        {/* Studio Lighting calibrated for 360° rotation across light, dark, and Apple Liquid Glass */}
        <ambientLight intensity={isGlass ? 2.4 : isDark ? 2.6 : 2.5} />
        {/* Direct Front Fill Light for crisp, luminous front face illumination */}
        <directionalLight
          position={[0, 0, 7]}
          intensity={isGlass ? 3.0 : isDark ? 2.8 : 3.2}
          color="#FFFFFF"
        />
        {/* Front-Right Key Light */}
        <directionalLight
          position={[5, 7, 6]}
          intensity={isGlass ? 4.5 : isDark ? 3.6 : 3.8}
          color="#FFFFFF"
        />
        {/* Front-Left Key Light (illuminates the Left Wing and hollow window!) */}
        <directionalLight
          position={[-5, 7, 6]}
          intensity={isGlass ? 3.4 : isDark ? 3.2 : 3.6}
          color={isDark ? "#FFFFFF" : "#FFF7ED"}
        />
        {/* Back Rim / Kicker Light (ensures rotated backside has brilliant edge speculars) */}
        <directionalLight
          position={[0, 5, -6]}
          intensity={2.2}
          color="#FFFFFF"
        />
        {/* Front Specular Glint */}
        <directionalLight
          position={[0, 3, 5]}
          intensity={2.0}
          color="#FFFFFF"
        />
        {/* Bottom Rim Light */}
        <pointLight
          position={[0, -4, 3]}
          intensity={isDark ? 1.6 : 2.0}
          color={isGlass ? "#38BDF8" : isDark ? "#CBD5E1" : "#FF6A28"}
        />
        <pointLight
          position={[0, 2, 4]}
          intensity={isGlass ? 2.8 : isDark ? 2.2 : 1.8}
          color="#FFFFFF"
        />

        <Suspense fallback={null}>
          <YMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}


