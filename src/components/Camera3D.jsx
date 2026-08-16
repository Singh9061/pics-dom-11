import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function CameraModel({ apertureRef, groupRef, onMounted }) {
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1a1a",
        metalness: 0.85,
        roughness: 0.25,
      }),
    []
  );
  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0d0d0d",
        metalness: 0.9,
        roughness: 0.2,
      }),
    []
  );
  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c5a880",
        metalness: 0.95,
        roughness: 0.15,
        emissive: "#c5a880",
        emissiveIntensity: 0.2,
      }),
    []
  );
  const lensMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#111",
        metalness: 0.7,
        roughness: 0.3,
      }),
    []
  );
  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#1a1a1a",
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.45,
        thickness: 0.5,
        transparent: true,
      }),
    []
  );

  // subtle idle float rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        0.25 + Math.sin(state.clock.elapsedTime * 0.35) * 0.1;
      groupRef.current.rotation.x =
        0.05 + Math.sin(state.clock.elapsedTime * 0.28) * 0.05;
    }
  });

  useEffect(() => {
    // Tell parent that the 3D objects are mounted
    if (groupRef.current && apertureRef.current) {
      onMounted?.();
    }
  }, [onMounted]);

  return (
    <group ref={groupRef} position={[0, -0.15, 0]} scale={0.2}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} material={bodyMat} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.35, 1.1]} />
      </mesh>

      {/* Top plate */}
      <mesh position={[-0.25, 0.78, 0]} material={darkMat} castShadow>
        <boxGeometry args={[1.5, 0.28, 0.95]} />
      </mesh>

      {/* Mode dial */}
      <mesh position={[-0.85, 0.95, 0.15]} material={bodyMat} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.12, 24]} />
      </mesh>
      <mesh position={[-0.85, 1.02, 0.15]} material={darkMat}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
      </mesh>

      {/* Shutter button */}
      <mesh position={[-0.45, 0.95, 0.25]} material={bodyMat}>
        <cylinderGeometry args={[0.11, 0.11, 0.08, 16]} />
      </mesh>

      {/* Grip */}
      <mesh position={[0.95, -0.05, 0.15]} material={darkMat} castShadow>
        <boxGeometry args={[0.45, 1.15, 0.85]} />
      </mesh>

      {/* Lens barrel outer */}
      <mesh position={[-0.15, 0, 0.75]} material={lensMat} castShadow>
        <cylinderGeometry args={[0.72, 0.78, 0.55, 48]} />
      </mesh>

      {/* Lens middle */}
      <mesh position={[-0.15, 0, 1.05]} material={darkMat}>
        <cylinderGeometry args={[0.62, 0.68, 0.35, 48]} />
      </mesh>

      {/* Aperture ring group */}
      <group ref={apertureRef} position={[-0.15, 0, 1.25]}>
        <mesh material={goldMat}>
          <torusGeometry args={[0.58, 0.06, 16, 64]} />
        </mesh>
        <mesh material={goldMat} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.48, 0.025, 12, 48]} />
        </mesh>
        <mesh material={darkMat}>
          <circleGeometry args={[0.42, 32]} />
        </mesh>
        <mesh position={[0, 0, 0.02]} material={glassMat}>
          <circleGeometry args={[0.35, 32]} />
        </mesh>
      </group>

      {/* Hot shoe */}
      <mesh position={[-0.15, 0.95, -0.15]} material={darkMat}>
        <boxGeometry args={[0.55, 0.08, 0.35]} />
      </mesh>
    </group>
  );
}

export default function Camera3D({ onReady }) {
  const groupRef = useRef();
  const apertureRef = useRef();
  const hasAnimated = useRef(false);

  const handleMounted = () => {
    if (hasAnimated.current || !groupRef.current || !apertureRef.current) return;
    hasAnimated.current = true;

    // Initial state already set in JSX (scale 0.2)
    gsap.set(groupRef.current.rotation, { x: 0.5, y: -0.8, z: 0.2 });
    gsap.set(groupRef.current.position, { y: -0.9 });

    const tl = gsap.timeline({
      onComplete: () => {
        onReady?.();
      },
    });

    // Heavy fly-in
    tl.to(groupRef.current.scale, {
      x: 1.15,
      y: 1.15,
      z: 1.15,
      duration: 1.25,
      ease: "power4.out",
    });
    tl.to(
      groupRef.current.rotation,
      {
        x: 0.05,
        y: 0.25,
        z: 0,
        duration: 1.25,
        ease: "power3.out",
      },
      0
    );
    tl.to(
      groupRef.current.position,
      {
        y: -0.15,
        duration: 1.25,
        ease: "power3.out",
      },
      0
    );

    // Aperture blink + glow feel via scale
    tl.to(
      apertureRef.current.scale,
      {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 0.18,
        yoyo: true,
        repeat: 6,
        ease: "power1.inOut",
      },
      0.95
    );

    // Continuous slow spin of aperture ring
    tl.to(
      apertureRef.current.rotation,
      {
        z: Math.PI * 4,
        duration: 6,
        ease: "none",
        repeat: -1,
      },
      0.9
    );
  };

  // Fallback: if for some reason onMounted never fires, still call onReady
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasAnimated.current) {
        hasAnimated.current = true;
        onReady?.();
      }
    }, 2200);
    return () => clearTimeout(t);
  }, [onReady]);

  return (
    <div
      className="w-[280px] h-[220px] sm:w-[360px] sm:h-[280px] md:w-[420px] md:h-[320px]"
      style={{ touchAction: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 32 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 7, 6]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#c5a880" />
        <pointLight position={[0, 0.5, 3.5]} intensity={0.7} color="#c5a880" />

        <CameraModel
          apertureRef={apertureRef}
          groupRef={groupRef}
          onMounted={handleMounted}
        />

        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.5}
          scale={9}
          blur={2.8}
          far={3}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
