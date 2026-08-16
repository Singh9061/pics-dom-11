import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function CameraModel({ apertureRef, groupRef }) {
  const bodyMat = new THREE.MeshStandardMaterial({
    color: "#1a1a1a",
    metalness: 0.85,
    roughness: 0.25,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: "#0d0d0d",
    metalness: 0.9,
    roughness: 0.2,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: "#c5a880",
    metalness: 0.95,
    roughness: 0.15,
    emissive: "#c5a880",
    emissiveIntensity: 0.15,
  });
  const lensMat = new THREE.MeshStandardMaterial({
    color: "#111",
    metalness: 0.7,
    roughness: 0.3,
  });

  // subtle idle float rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]} scale={1.15}>
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
        {/* Outer gold ring */}
        <mesh material={goldMat}>
          <torusGeometry args={[0.58, 0.06, 16, 64]} />
        </mesh>
        {/* Inner ring */}
        <mesh material={goldMat} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.48, 0.025, 12, 48]} />
        </mesh>
        {/* Aperture blades suggestion (dark center) */}
        <mesh material={darkMat}>
          <circleGeometry args={[0.42, 32]} />
        </mesh>
        {/* Center glass */}
        <mesh position={[0, 0, 0.02]} material={new THREE.MeshPhysicalMaterial({
          color: "#1a1a1a",
          metalness: 0.1,
          roughness: 0.05,
          transmission: 0.4,
          thickness: 0.5,
          transparent: true,
        })}>
          <circleGeometry args={[0.35, 32]} />
        </mesh>
      </group>

      {/* Hot shoe */}
      <mesh position={[-0.15, 0.95, -0.15]} material={darkMat}>
        <boxGeometry args={[0.55, 0.08, 0.35]} />
      </mesh>

      {/* Small α badge plane */}
      <mesh position={[0.7, 0.25, 0.56]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.45, 0.18]} />
        <meshBasicMaterial color="#888" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function Camera3D({ onReady }) {
  const groupRef = useRef();
  const apertureRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    if (!groupRef.current || !apertureRef.current) return;

    // Initial state
    gsap.set(groupRef.current.scale, { x: 0.2, y: 0.2, z: 0.2 });
    gsap.set(groupRef.current.rotation, { x: 0.4, y: -0.6, z: 0.15 });
    gsap.set(groupRef.current.position, { y: -0.8 });

    // Entrance animation
    const tl = gsap.timeline({
      onComplete: () => onReady?.(),
    });

    tl.to(groupRef.current.scale, {
      x: 1.15,
      y: 1.15,
      z: 1.15,
      duration: 1.2,
      ease: "power4.out",
    });
    tl.to(
      groupRef.current.rotation,
      {
        x: 0.05,
        y: 0.25,
        z: 0,
        duration: 1.2,
        ease: "power3.out",
      },
      0
    );
    tl.to(
      groupRef.current.position,
      {
        y: -0.15,
        duration: 1.2,
        ease: "power3.out",
      },
      0
    );

    // Aperture blink / pulse
    tl.to(
      apertureRef.current.scale,
      {
        x: 1.15,
        y: 1.15,
        z: 1.15,
        duration: 0.2,
        yoyo: true,
        repeat: 5,
        ease: "power1.inOut",
      },
      0.9
    );

    // Slow continuous aperture rotation
    tl.to(
      apertureRef.current.rotation,
      {
        z: Math.PI * 2,
        duration: 3.5,
        ease: "none",
        repeat: -1,
      },
      0.8
    );

    return () => tl.kill();
  }, [onReady]);

  return (
    <div
      ref={canvasRef}
      className="w-[280px] h-[220px] sm:w-[340px] sm:h-[260px] md:w-[400px] md:h-[300px]"
      style={{ touchAction: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0.6, 4.2], fov: 35 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[4, 6, 5]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#c5a880" />
        <pointLight position={[0, 0, 3]} intensity={0.6} color="#c5a880" />

        <CameraModel apertureRef={apertureRef} groupRef={groupRef} />

        <ContactShadows
          position={[0, -1.1, 0]}
          opacity={0.45}
          scale={8}
          blur={2.5}
          far={2.5}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
