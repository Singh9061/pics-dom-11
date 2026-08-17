import React, { useRef, useEffect, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

function CameraModel({ apertureRef, groupRef, onMounted, idle = true }) {
  const mats = useMemo(() => {
    const body = new THREE.MeshStandardMaterial({
      color: "#1c1c1e",
      metalness: 0.72,
      roughness: 0.28,
    });
    const rubber = new THREE.MeshStandardMaterial({
      color: "#0a0a0a",
      metalness: 0.05,
      roughness: 0.92,
    });
    const darkMetal = new THREE.MeshStandardMaterial({
      color: "#111113",
      metalness: 0.88,
      roughness: 0.22,
    });
    const silver = new THREE.MeshStandardMaterial({
      color: "#c8c8c8",
      metalness: 0.95,
      roughness: 0.18,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: "#c5a880",
      metalness: 0.98,
      roughness: 0.12,
      emissive: "#c5a880",
      emissiveIntensity: 0.12,
    });
    const lensBlack = new THREE.MeshStandardMaterial({
      color: "#0e0e0e",
      metalness: 0.65,
      roughness: 0.35,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#0a1520",
      metalness: 0.05,
      roughness: 0.02,
      transmission: 0.55,
      thickness: 0.6,
      ior: 1.55,
      transparent: true,
      envMapIntensity: 1.2,
    });
    const screen = new THREE.MeshStandardMaterial({
      color: "#050508",
      metalness: 0.3,
      roughness: 0.15,
      emissive: "#0a0a12",
      emissiveIntensity: 0.15,
    });
    return { body, rubber, darkMetal, silver, gold, lensBlack, glass, screen };
  }, []);

  useFrame((state) => {
    if (!idle || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = 0.18 + Math.sin(t * 0.28) * 0.04;
    groupRef.current.rotation.x = 0.06 + Math.sin(t * 0.22) * 0.02;
  });

  useEffect(() => {
    // Wait one frame so refs are attached
    const id = requestAnimationFrame(() => {
      if (groupRef.current && apertureRef.current) {
        onMounted?.();
      }
    });
    return () => cancelAnimationFrame(id);
  }, [onMounted, groupRef, apertureRef]);

  return (
    <group ref={groupRef} position={[0, -0.12, 0]} scale={1}>
      <RoundedBox
        args={[2.55, 1.42, 1.18]}
        radius={0.08}
        smoothness={4}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={mats.body} attach="material" />
      </RoundedBox>

      <mesh position={[-0.08, 0.02, 0.58]} castShadow>
        <boxGeometry args={[1.9, 1.15, 0.08]} />
        <primitive object={mats.darkMetal} attach="material" />
      </mesh>

      <RoundedBox
        args={[0.58, 1.28, 0.95]}
        radius={0.06}
        smoothness={4}
        position={[1.12, -0.05, 0.12]}
        castShadow
      >
        <primitive object={mats.rubber} attach="material" />
      </RoundedBox>
      {[-0.35, -0.15, 0.05, 0.25].map((y, i) => (
        <mesh key={i} position={[1.38, y, 0.12]}>
          <boxGeometry args={[0.06, 0.04, 0.72]} />
          <primitive object={mats.darkMetal} attach="material" />
        </mesh>
      ))}

      <RoundedBox
        args={[1.65, 0.38, 1.05]}
        radius={0.04}
        smoothness={3}
        position={[-0.22, 0.82, -0.02]}
        castShadow
      >
        <primitive object={mats.darkMetal} attach="material" />
      </RoundedBox>

      <mesh position={[-0.35, 1.05, -0.15]} castShadow>
        <boxGeometry args={[0.85, 0.32, 0.55]} />
        <primitive object={mats.body} attach="material" />
      </mesh>
      <mesh position={[-0.35, 1.08, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.12, 24]} />
        <primitive object={mats.rubber} attach="material" />
      </mesh>
      <mesh position={[-0.35, 1.08, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
        <primitive object={mats.glass} attach="material" />
      </mesh>

      <mesh position={[-0.2, 1.18, -0.05]}>
        <boxGeometry args={[0.52, 0.07, 0.32]} />
        <primitive object={mats.silver} attach="material" />
      </mesh>
      <mesh position={[-0.2, 1.22, -0.05]}>
        <boxGeometry args={[0.38, 0.03, 0.22]} />
        <primitive object={mats.darkMetal} attach="material" />
      </mesh>

      <mesh position={[-0.95, 1.02, 0.22]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.14, 32]} />
        <primitive object={mats.body} attach="material" />
      </mesh>
      <mesh position={[-0.95, 1.1, 0.22]}>
        <cylinderGeometry args={[0.14, 0.14, 0.05, 24]} />
        <primitive object={mats.darkMetal} attach="material" />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              -0.95 + Math.cos(a) * 0.16,
              1.12,
              0.22 + Math.sin(a) * 0.16,
            ]}
          >
            <boxGeometry args={[0.02, 0.03, 0.04]} />
            <primitive object={mats.silver} attach="material" />
          </mesh>
        );
      })}

      <mesh position={[-0.48, 1.02, 0.32]} castShadow>
        <cylinderGeometry args={[0.12, 0.13, 0.1, 20]} />
        <primitive object={mats.body} attach="material" />
      </mesh>
      <mesh position={[-0.48, 1.08, 0.32]}>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
        <primitive object={mats.silver} attach="material" />
      </mesh>

      <mesh position={[0.35, 0.95, -0.35]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 24]} />
        <primitive object={mats.darkMetal} attach="material" />
      </mesh>

      <mesh position={[0.15, 0.05, -0.6]}>
        <boxGeometry args={[1.35, 0.95, 0.04]} />
        <primitive object={mats.screen} attach="material" />
      </mesh>
      <mesh position={[0.15, 0.05, -0.58]}>
        <boxGeometry args={[1.22, 0.82, 0.02]} />
        <meshStandardMaterial color="#0c1018" metalness={0.2} roughness={0.1} />
      </mesh>

      <mesh position={[-0.12, 0.02, 0.72]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.78, 0.78, 0.12, 64]} />
        <primitive object={mats.gold} attach="material" />
      </mesh>

      <mesh position={[-0.12, 0.02, 0.95]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.74, 0.76, 0.38, 64]} />
        <primitive object={mats.lensBlack} attach="material" />
      </mesh>

      <mesh position={[-0.12, 0.02, 1.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.28, 64]} />
        <primitive object={mats.rubber} attach="material" />
      </mesh>
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              -0.12 + Math.cos(a) * 0.73,
              0.02 + Math.sin(a) * 0.73,
              1.22,
            ]}
            rotation={[0, 0, a]}
          >
            <boxGeometry args={[0.03, 0.04, 0.22]} />
            <primitive object={mats.darkMetal} attach="material" />
          </mesh>
        );
      })}

      <mesh position={[-0.12, 0.02, 1.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.68, 0.7, 0.22, 64]} />
        <primitive object={mats.lensBlack} attach="material" />
      </mesh>

      <group ref={apertureRef} position={[-0.12, 0.02, 1.58]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 0.1, 64]} />
          <primitive object={mats.gold} attach="material" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]}>
          <torusGeometry args={[0.55, 0.04, 12, 64]} />
          <primitive object={mats.silver} attach="material" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.48, 0.52, 0.06, 48]} />
          <primitive object={mats.darkMetal} attach="material" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.08]}>
          <circleGeometry args={[0.42, 48]} />
          <primitive object={mats.glass} attach="material" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.1]}>
          <circleGeometry args={[0.32, 32]} />
          <meshPhysicalMaterial
            color="#061018"
            metalness={0.1}
            roughness={0.05}
            transmission={0.5}
            thickness={0.3}
            transparent
          />
        </mesh>
      </group>

      <mesh position={[-0.12, 0.02, 1.68]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.025, 8, 48]} />
        <primitive object={mats.darkMetal} attach="material" />
      </mesh>

      <mesh position={[-1.2, 0.55, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.18, 12]} />
        <primitive object={mats.silver} attach="material" />
      </mesh>
      <mesh position={[1.35, 0.55, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.18, 12]} />
        <primitive object={mats.silver} attach="material" />
      </mesh>
    </group>
  );
}

export default function Camera3D({ onReady }) {
  const groupRef = useRef();
  const apertureRef = useRef();
  const hasAnimated = useRef(false);
  const [enableIdle, setEnableIdle] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  const finish = () => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    setEnableIdle(true);
    try {
      onReady?.();
    } catch (_) {}
  };

  const handleMounted = () => {
    if (hasAnimated.current || !groupRef.current || !apertureRef.current) return;

    try {
      gsap.set(groupRef.current.rotation, { x: 0.55, y: -1.05, z: 0.15 });
      gsap.set(groupRef.current.position, { y: -1.1, z: -0.3 });
      gsap.set(groupRef.current.scale, { x: 0.35, y: 0.35, z: 0.35 });

      const tl = gsap.timeline({
        onComplete: () => finish(),
      });

      tl.to(
        groupRef.current.scale,
        { x: 1, y: 1, z: 1, duration: 1.35, ease: "power4.out" },
        0
      );
      tl.to(
        groupRef.current.rotation,
        { x: 0.08, y: 0.22, z: 0, duration: 1.35, ease: "power3.out" },
        0
      );
      tl.to(
        groupRef.current.position,
        { y: -0.12, z: 0, duration: 1.35, ease: "power3.out" },
        0
      );

      tl.to(groupRef.current.rotation, {
        y: 0.12,
        duration: 0.55,
        ease: "power2.inOut",
      });

      tl.to(
        apertureRef.current.scale,
        {
          x: 1.12,
          y: 1.12,
          z: 1.12,
          duration: 0.12,
          yoyo: true,
          repeat: 3,
          ease: "power1.inOut",
        },
        1.15
      );

      tl.to(
        apertureRef.current.rotation,
        { z: Math.PI * 3, duration: 8, ease: "none", repeat: -1 },
        1.0
      );
    } catch (err) {
      console.warn("Camera3D animation failed:", err);
      finish();
    }
  };

  // Hard fallback so splash never hangs / crashes the app
  useEffect(() => {
    const t = setTimeout(() => finish(), 2800);
    return () => clearTimeout(t);
  }, []);

  if (webglFailed) {
    return (
      <div className="w-[300px] h-[240px] sm:w-[400px] sm:h-[310px] md:w-[480px] md:h-[360px] flex items-center justify-center">
        <div className="w-24 h-24 rounded-full border-2 border-gold/40 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-gold/60" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-[300px] h-[240px] sm:w-[400px] sm:h-[310px] md:w-[480px] md:h-[360px]"
      style={{ touchAction: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0.35, 5.2], fov: 28 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onError={(err) => {
          console.warn("WebGL Canvas error:", err);
          setWebglFailed(true);
          finish();
        }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[4.5, 6, 5]} intensity={1.8} />
        <directionalLight position={[-5, 2, -2]} intensity={0.55} color="#c5a880" />
        <pointLight position={[0, 0.8, 3.2]} intensity={0.9} color="#e8d5b5" />
        <spotLight
          position={[2, 4, 3]}
          angle={0.4}
          penumbra={0.6}
          intensity={1.1}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <CameraModel
            apertureRef={apertureRef}
            groupRef={groupRef}
            onMounted={handleMounted}
            idle={enableIdle}
          />
          <ContactShadows
            position={[0, -1.25, 0]}
            opacity={0.45}
            scale={10}
            blur={2.6}
            far={4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
