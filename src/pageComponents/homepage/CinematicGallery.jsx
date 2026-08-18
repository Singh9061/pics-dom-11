import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const WORLDS = [
  { src: c1_pic10, title: "Sacred Phere", sub: "Heritage Ritual" },
  { src: c2_pic2, title: "Royal Baraat", sub: "Procession" },
  { src: c1_pic1, title: "Crimson Sindoor", sub: "Intimate" },
  { src: c1_pic5, title: "Palace Union", sub: "Destination" },
  { src: c1_pic7, title: "Firelight", sub: "Sangeet" },
  { src: c1_pic8, title: "Golden Hour", sub: "Portrait" },
  { src: c2_pic11, title: "Legacy", sub: "Family Archive" },
  { src: c1_pic3, title: "Quiet Glance", sub: "Candid" },
];

const SPACING = 16;

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
  playTone(200, 0.07, "triangle", 0.05);
  setTimeout(() => playTone(85, 0.14, "square", 0.025), 35);
}

/* ---- volumetric photo: main plane + soft depth layers ---- */
function PhotoWorld({
  url,
  index,
  activeIndex,
  mouse,
  breakAmount,
}) {
  const tex = useTexture(url);
  const group = useRef();
  const main = useRef();
  const back = useRef();
  const fore = useRef();

  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
  }, [tex]);

  useFrame(() => {
    if (!group.current) return;
    const on = index === activeIndex;
    const focus = on ? 1 : 0.25;

    // multi-layer parallax (depth-map feel without AI maps)
    const mx = mouse.current.x;
    const my = mouse.current.y;
    if (back.current) {
      back.current.position.x = mx * -0.35;
      back.current.position.y = my * -0.2;
      back.current.material.opacity = THREE.MathUtils.lerp(
        back.current.material.opacity,
        on ? 0.45 : 0.1,
        0.08
      );
    }
    if (main.current) {
      main.current.position.x = mx * 0.15;
      main.current.position.y = my * 0.1;
      main.current.material.opacity = THREE.MathUtils.lerp(
        main.current.material.opacity,
        on ? 1 - breakAmount.current * 0.9 : 0.2,
        0.1
      );
      main.current.scale.setScalar(
        THREE.MathUtils.lerp(main.current.scale.x, on ? 1 : 0.85, 0.08)
      );
    }
    if (fore.current) {
      fore.current.position.x = mx * 0.55;
      fore.current.position.y = my * 0.35;
      fore.current.material.opacity = THREE.MathUtils.lerp(
        fore.current.material.opacity,
        on ? 0.22 : 0.05,
        0.08
      );
    }

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mx * 0.2 * focus,
      0.08
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -my * 0.12 * focus,
      0.08
    );
  });

  const z = -index * SPACING;

  return (
    <group ref={group} position={[0, 0, z]}>
      {/* environment / background layer */}
      <mesh ref={back} position={[0, 0, -0.8]} scale={[5.2, 3.5, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.1}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* subject */}
      <mesh ref={main} position={[0, 0, 0]} scale={[4.4, 2.9, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.2}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* foreground glass / near layer */}
      <mesh ref={fore} position={[0, 0, 0.6]} scale={[4.6, 3.05, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.05}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* particle field — used for dust + break/rebuild */
function ParticleField({ count = 500, breakAmount, mouse }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = -Math.random() * (WORLDS.length * SPACING + 10);
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.015;
    const s = 1 + breakAmount.current * 2.5;
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, s, 0.08));
    ref.current.position.x = mouse.current.x * 0.3;
    ref.current.position.y = mouse.current.y * 0.2;
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
        size={0.04}
        color="#c5a880"
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function CameraRig({ progress, mouse }) {
  const { camera } = useThree();
  useFrame(() => {
    const z = -progress.current * SPACING + 5.5;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.07);
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.current.x * 0.9,
      0.05
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mouse.current.y * 0.45,
      0.05
    );
    camera.lookAt(
      mouse.current.x * 0.35,
      mouse.current.y * 0.2,
      z - SPACING * 0.4
    );
  });
  return null;
}

function UniverseScene({ progress, mouse, activeIndex, breakAmount }) {
  return (
    <>
      <color attach="background" args={["#040208"]} />
      <ambientLight intensity={1} />
      <ParticleField breakAmount={breakAmount} mouse={mouse} />
      <CameraRig progress={progress} mouse={mouse} />
      {WORLDS.map((w, i) => (
        <PhotoWorld
          key={w.title}
          url={w.src}
          index={i}
          activeIndex={activeIndex}
          mouse={mouse}
          breakAmount={breakAmount}
        />
      ))}
    </>
  );
}

/* ---- Full 4D immersive mode ---- */
function FourDMode({ onExit }) {
  const progress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const breakAmount = useRef(0);
  const apertureRef = useRef(null);
  const veilRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [title, setTitle] = useState(WORLDS[0].title);
  const [sub, setSub] = useState(WORLDS[0].sub);
  const lastIndex = useRef(0);
  const transitioning = useRef(false);

  // aperture open on enter
  useEffect(() => {
    const el = apertureRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { clipPath: "circle(0% at 50% 50%)" },
      {
        clipPath: "circle(150% at 50% 50%)",
        duration: 1.5,
        ease: "power3.inOut",
      }
    );
    playShutter();
  }, []);

  // signature: Capture → Freeze → Break → Rebuild on world change
  const triggerBreakRebuild = useCallback((nextIdx) => {
    if (transitioning.current) return;
    transitioning.current = true;
    playShutter();
    const obj = { v: 0 };
    gsap
      .timeline({
        onComplete: () => {
          transitioning.current = false;
          breakAmount.current = 0;
        },
      })
      .to(obj, {
        v: 1,
        duration: 0.35,
        ease: "power2.in",
        onUpdate: () => {
          breakAmount.current = obj.v;
        },
      })
      .add(() => {
        setActiveIndex(nextIdx);
        setTitle(WORLDS[nextIdx].title);
        setSub(WORLDS[nextIdx].sub);
      })
      .to(obj, {
        v: 0,
        duration: 0.55,
        ease: "power2.out",
        onUpdate: () => {
          breakAmount.current = obj.v;
        },
      });
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onWheel = (e) => {
      e.preventDefault();
      if (transitioning.current) return;
      const next =
        progress.current + (e.deltaY > 0 ? 0.045 : -0.045);
      progress.current = THREE.MathUtils.clamp(
        next,
        0,
        WORLDS.length - 1.001
      );
      const idx = Math.round(progress.current);
      if (idx !== lastIndex.current) {
        lastIndex.current = idx;
        triggerBreakRebuild(idx);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("wheel", onWheel);
    };
  }, [triggerBreakRebuild]);

  const onCreated = useCallback(({ gl }) => {
    gl.setClearColor("#040208");
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <div
        ref={apertureRef}
        className="absolute inset-0 z-30 bg-black"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      />

      <Canvas
        camera={{ position: [0, 0, 6], fov: 48, near: 0.1, far: 250 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={onCreated}
      >
        <Suspense fallback={null}>
          <UniverseScene
            progress={progress}
            mouse={mouse}
            activeIndex={activeIndex}
            breakAmount={breakAmount}
          />
        </Suspense>
      </Canvas>

      {/* lens simulation overlays */}
      <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_140px_rgba(0,0,0,0.8)]" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.6)_100%)]" />
      <div
        ref={veilRef}
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.1] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E)",
          backgroundSize: "150px",
        }}
      />

      {/* HUD */}
      <div className="absolute left-6 top-6 z-40 md:left-12 md:top-10">
        <p className="text-[10px] uppercase tracking-[0.45em] text-gold/70">
          Pics Dom · 4D Universe
        </p>
        <h3 className="mt-2 font-serif text-2xl font-light tracking-[0.1em] text-white md:text-4xl">
          {title}
        </h3>
        <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-white/45">
          {sub}
        </p>
        <p className="mt-4 text-[10px] tracking-[0.3em] text-white/30">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(WORLDS.length).padStart(2, "0")}
        </p>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-40 flex flex-col items-center gap-3">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">
          Scroll · travel through worlds · Move · look
        </p>
        <div className="h-px w-56 bg-white/10">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{
              width: ((activeIndex + 1) / WORLDS.length) * 100 + "%",
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            playShutter();
            onExit();
          }}
          className="mt-2 border border-white/25 px-7 py-2 text-[10px] uppercase tracking-[0.3em] text-white/75 transition-colors hover:border-gold hover:text-gold"
        >
          Exit 4D Mode
        </button>
      </div>
    </div>
  );
}

/* ---- Normal site section + entry ---- */
export default function CinematicGallery() {
  const [mode4d, setMode4d] = useState(false);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    document.body.style.overflow = mode4d ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mode4d]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;
    const ctx = gsap.context(() => {
      cards.forEach((el, i) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.85,
          delay: i * 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(90,40,110,0.22)_0%,transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center md:px-8">
          <p className="text-[10px] uppercase tracking-[0.45em] text-gold/70">
            Signature Experience
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light tracking-[0.12em] text-white md:text-5xl">
            Through the lens
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/40">
            Normal site stays fast. Enter 4D Mode when you want the full
            photography universe — portal travel, depth, lens.
          </p>

          <button
            type="button"
            onClick={() => {
              playShutter();
              setMode4d(true);
            }}
            className="mt-10 inline-flex items-center gap-3 border border-gold/60 bg-gold/10 px-12 py-4 text-[11px] uppercase tracking-[0.4em] text-gold transition-all duration-300 hover:bg-gold hover:text-black"
          >
            Enter 4D Mode
          </button>

          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
            {WORLDS.slice(0, 4).map((w, i) => (
              <button
                key={w.title}
                type="button"
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                onClick={() => {
                  playShutter();
                  setMode4d(true);
                }}
                className="group relative aspect-4/3 overflow-hidden bg-black text-left"
              >
                <img
                  src={w.src}
                  alt={w.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.2em] text-white/85">
                  {w.title}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/gallery"
              className="text-[11px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-gold"
            >
              Classic gallery →
            </Link>
          </div>
        </div>
      </section>

      {mode4d && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-sm tracking-widest text-white/40">
              OPENING APERTURE…
            </div>
          }
        >
          <FourDMode onExit={() => setMode4d(false)} />
        </Suspense>
      )}
    </>
  );
}
