import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import {
  c1_pic1,
  c1_pic3,
  c1_pic5,
  c1_pic7,
  c1_pic8,
  c1_pic10,
} from "../../Assets/picture/client1";
import { c2_pic2, c2_pic11 } from "../../Assets/picture/client2";

gsap.registerPlugin(ScrollTrigger);

const MUSEUM = [
  { src: c1_pic10, title: "Sacred Phere", z: 0 },
  { src: c2_pic2, title: "Royal Baraat", z: -14 },
  { src: c1_pic1, title: "Crimson Sindoor", z: -28 },
  { src: c1_pic5, title: "Palace Union", z: -42 },
  { src: c1_pic7, title: "Firelight", z: -56 },
  { src: c1_pic8, title: "Golden Hour", z: -70 },
  { src: c2_pic11, title: "Legacy", z: -84 },
  { src: c1_pic3, title: "Quiet Glance", z: -98 },
];

function playTone(freq, dur, type, vol) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.value = vol || 0.04;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.stop(ctx.currentTime + dur);
  } catch (_) {}
}

function playShutter() {
  playTone(180, 0.08, "triangle", 0.05);
  setTimeout(() => playTone(90, 0.12, "square", 0.03), 40);
}

function PhotoPlane({ url, position, index, activeIndex, mouse }) {
  const tex = useTexture(url);
  const mesh = useRef();
  const mat = useRef();
  const scaleTarget = useRef(new THREE.Vector3(1, 0.66, 1));

  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
  }, [tex]);

  useFrame(() => {
    if (!mesh.current) return;
    const on = index === activeIndex;
    scaleTarget.current.set(on ? 1.15 : 0.9, on ? 0.76 : 0.6, 1);
    mesh.current.scale.lerp(scaleTarget.current, 0.06);
    const depth = on ? 1.2 : 0.35;
    mesh.current.rotation.y = THREE.MathUtils.lerp(
      mesh.current.rotation.y,
      mouse.current.x * 0.25 * depth,
      0.08
    );
    mesh.current.rotation.x = THREE.MathUtils.lerp(
      mesh.current.rotation.x,
      -mouse.current.y * 0.15 * depth,
      0.08
    );
    if (mat.current) {
      mat.current.opacity = THREE.MathUtils.lerp(
        mat.current.opacity,
        on ? 1 : 0.32,
        0.08
      );
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[4.6, 3.05]} />
      <meshBasicMaterial
        ref={mat}
        map={tex}
        transparent
        opacity={0.32}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function Dust({ count = 350 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = -Math.random() * 110;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#c5a880"
        transparent
        opacity={0.4}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function CameraRig({ progress, mouse }) {
  const { camera } = useThree();
  useFrame(() => {
    const z = -progress.current * 14;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z + 6, 0.08);
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.current.x * 0.8,
      0.06
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mouse.current.y * 0.4,
      0.06
    );
    camera.lookAt(mouse.current.x * 0.3, mouse.current.y * 0.15, z - 4);
  });
  return null;
}

function MuseumScene({ progress, mouse, activeIndex }) {
  return (
    <>
      <color attach="background" args={["#050308"]} />
      <ambientLight intensity={0.95} />
      <Dust />
      <CameraRig progress={progress} mouse={mouse} />
      {MUSEUM.map((item, i) => (
        <PhotoPlane
          key={item.title}
          url={item.src}
          index={i}
          activeIndex={activeIndex}
          mouse={mouse}
          position={[0, 0, item.z]}
        />
      ))}
    </>
  );
}

function ImmersiveWorld({ onExit }) {
  const progress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const apertureRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState(MUSEUM[0].title);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => setReady(true) });
    if (apertureRef.current) {
      gsap.set(apertureRef.current, { clipPath: "circle(0% at 50% 50%)" });
      tl.to(apertureRef.current, {
        clipPath: "circle(150% at 50% 50%)",
        duration: 1.35,
        ease: "power3.inOut",
      });
    }
    playShutter();
    return () => tl.kill();
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onWheel = (e) => {
      e.preventDefault();
      progress.current = THREE.MathUtils.clamp(
        progress.current + e.deltaY * 0.0018,
        0,
        MUSEUM.length - 1.01
      );
      const idx = Math.round(progress.current);
      setActiveIndex(idx);
      setTitle(MUSEUM[idx].title);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  const onCreated = useCallback(({ gl }) => {
    gl.setClearColor("#050308");
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <div
        ref={apertureRef}
        className="absolute inset-0 z-20 bg-black"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      />

      <Canvas
        camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 200 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={onCreated}
      >
        <Suspense fallback={null}>
          <MuseumScene
            progress={progress}
            mouse={mouse}
            activeIndex={activeIndex}
          />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_120px_rgba(0,0,0,0.75)]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

      <div className="absolute left-6 top-6 z-30 md:left-10 md:top-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70">
          Pics Dom · Living Archive
        </p>
        <h3 className="mt-2 font-serif text-2xl font-light tracking-[0.12em] text-white md:text-3xl">
          {title}
        </h3>
        <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/40">
          {activeIndex + 1} / {MUSEUM.length}
        </p>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-3">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
          Scroll to travel · Move to look
        </p>
        <div className="h-px w-48 overflow-hidden bg-white/15">
          <div
            className="h-full bg-gold transition-all duration-300"
            style={{
              width: ((activeIndex + 1) / MUSEUM.length) * 100 + "%",
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            playShutter();
            onExit();
          }}
          className="mt-2 border border-white/30 px-6 py-2 text-[10px] uppercase tracking-[0.3em] text-white/80 transition-colors hover:border-gold hover:text-gold"
        >
          Exit Experience
        </button>
      </div>

      {!ready && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          <div className="h-16 w-16 animate-pulse rounded-full border border-gold/40" />
        </div>
      )}
    </div>
  );
}

export default function CinematicGallery() {
  const [immersive, setImmersive] = useState(false);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    document.body.style.overflow = immersive ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [immersive]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      cards.forEach((el, i) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          scale: 0.94,
          duration: 0.9,
          delay: i * 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-[#08060c] py-24 md:py-32"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(80,40,100,0.25)_0%,transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center md:px-8">
          <p className="text-[10px] uppercase tracking-[0.45em] text-gold/70">
            4D Photography Museum
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light tracking-[0.12em] text-white md:text-5xl">
            Through the lens
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/40">
            Enter a volumetric archive — travel through depth, look with your
            cursor, feel the lens.
          </p>

          <button
            type="button"
            onClick={() => {
              playShutter();
              setImmersive(true);
            }}
            className="mt-10 inline-flex items-center gap-3 border border-gold/50 bg-gold/10 px-10 py-4 text-[11px] uppercase tracking-[0.35em] text-gold transition-all hover:bg-gold hover:text-black"
          >
            Enter Experience
          </button>

          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
            {MUSEUM.slice(0, 4).map((item, i) => (
              <div
                key={item.title}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="group relative aspect-4/3 overflow-hidden bg-black"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.2em] text-white/80">
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/gallery"
              className="text-[11px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-gold"
            >
              Or browse classic gallery →
            </Link>
          </div>
        </div>
      </section>

      {immersive && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white/50">
              Loading museum…
            </div>
          }
        >
          <ImmersiveWorld onExit={() => setImmersive(false)} />
        </Suspense>
      )}
    </>
  );
}
