import { Suspense, useEffect, useMemo, useRef, useState, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { c1_pic1 } from "../../Assets/picture/client1";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Error boundary so WebGL never blanks the site ---------- */
class WebGLSafe extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.error) return this.props.fallback ?? null;
    return this.props.children;
  }
}

/* ---------- Procedural camera lens (no external HDR) ---------- */
function GlassDisc({ position, radius = 0.55, opacity = 0.18, color = "#a8c4d4" }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[radius, radius, 0.04, 64]} />
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={opacity}
        metalness={0.1}
        roughness={0.05}
        transmission={0.85}
        thickness={0.4}
        ior={1.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function LensAssembly({ progressRef }) {
  const group = useRef();
  const barrel = useRef();

  useFrame(() => {
    const p = progressRef.current || 0;
    // Travel forward through the lens (Z)
    if (group.current) {
      group.current.position.z = THREE.MathUtils.lerp(0, 8, p);
      group.current.rotation.z = p * 0.35;
    }
  });

  const rings = useMemo(() => {
    const items = [];
    for (let i = 0; i < 8; i++) {
      const t = i / 7;
      items.push({
        z: -0.3 - i * 0.35,
        r: 1.15 - t * 0.35,
        metal: 0.85,
      });
    }
    return items;
  }, []);

  return (
    <group ref={group}>
      {/* Outer barrel rings */}
      {rings.map((r, i) => (
        <mesh key={i} position={[0, 0, r.z]} ref={i === 0 ? barrel : undefined}>
          <torusGeometry args={[r.r, 0.06, 16, 64]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={r.metal}
            roughness={0.25}
            envMapIntensity={0.4}
          />
        </mesh>
      ))}

      {/* Focus ring markings */}
      <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.03, 12, 64]} />
        <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Glass elements — user travels through these */}
      <GlassDisc position={[0, 0, -0.8]} radius={0.7} opacity={0.22} />
      <GlassDisc position={[0, 0, -1.4]} radius={0.62} opacity={0.2} color="#b8d4e8" />
      <GlassDisc position={[0, 0, -2.0]} radius={0.55} opacity={0.18} color="#d4e8f0" />
      <GlassDisc position={[0, 0, -2.6]} radius={0.48} opacity={0.15} />

      {/* Front element looking at user */}
      <mesh position={[0, 0, 0.15]}>
        <circleGeometry args={[0.72, 64]} />
        <meshPhysicalMaterial
          color="#2a3540"
          metalness={0.3}
          roughness={0.1}
          transmission={0.6}
          thickness={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Aperture blades hint (center) */}
      <mesh position={[0, 0, 0.05]}>
        <ringGeometry args={[0.12, 0.28, 6]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene({ progressRef }) {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 3, 4]} intensity={1.2} color="#fff5e6" />
      <pointLight position={[-3, -1, 2]} intensity={0.5} color="#c5a880" />
      <spotLight
        position={[0, 0, 5]}
        angle={0.5}
        penumbra={0.6}
        intensity={1.4}
        color="#ffffff"
      />
      <LensAssembly progressRef={progressRef} />
    </>
  );
}

/* ---------- CSS fallback lens (if WebGL fails / mobile) ---------- */
function CssLens({ progress }) {
  const scale = 1 + progress * 4;
  const opacity = Math.max(0, 1 - progress * 1.1);
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
      <div
        className="relative rounded-full"
        style={{
          width: "min(70vw, 420px)",
          height: "min(70vw, 420px)",
          transform: `scale(${scale})`,
          opacity,
          transition: "none",
        }}
      >
        {[1, 0.85, 0.7, 0.55, 0.4, 0.28].map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 m-auto rounded-full border border-white/15"
            style={{
              width: `${s * 100}%`,
              height: `${s * 100}%`,
              boxShadow:
                i === 0
                  ? "inset 0 0 60px rgba(197,168,128,0.15), 0 0 40px rgba(0,0,0,0.8)"
                  : "inset 0 0 20px rgba(255,255,255,0.06)",
              background:
                i === 5
                  ? "radial-gradient(circle, rgba(40,50,60,0.5) 0%, transparent 70%)"
                  : "transparent",
            }}
          />
        ))}
        <div className="absolute inset-0 m-auto h-[18%] w-[18%] rounded-full border-2 border-gold/40 bg-black/80" />
      </div>
    </div>
  );
}

/* ---------- SVG aperture iris ---------- */
function ApertureIris({ open }) {
  const blades = 8;
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <clipPath id="iris-clip">
          <circle cx="50" cy="50" r={open * 55} />
        </clipPath>
      </defs>
      <g style={{ opacity: open >= 0.98 ? 0 : 1, transition: "opacity 0.2s" }}>
        {Array.from({ length: blades }).map((_, i) => {
          const angle = (i / blades) * 360;
          return (
            <polygon
              key={i}
              points="50,50 50,0 62,2"
              fill="#050505"
              transform={`rotate(${angle} 50 50) scale(${1 - open * 0.85})`}
              style={{ transformOrigin: "50px 50px" }}
            />
          );
        })}
        <circle
          cx="50"
          cy="50"
          r={Math.max(2, 48 * (1 - open))}
          fill="#050505"
        />
      </g>
    </svg>
  );
}

export default function LensHero() {
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [useCss, setUseCss] = useState(false);
  const featuredSrc = c1_pic1;

  useEffect(() => {
    // Prefer CSS lens on small / low-power devices
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (mobile || reduce) setUseCss(true);

    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setProgress(self.progress);
      },
    });

    return () => st.kill();
  }, []);

  // progress phases:
  // 0–0.55  zoom into / through lens
  // 0.55–0.75 aperture opens
  // 0.75–1   featured photo fully revealed
  const lensPhase = Math.min(1, progress / 0.55);
  const apertureOpen = Math.max(0, Math.min(1, (progress - 0.55) / 0.2));
  const photoReveal = Math.max(0, Math.min(1, (progress - 0.7) / 0.25));
  const lensVisible = progress < 0.72;

  return (
    <section ref={sectionRef} className="relative h-[320vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Featured photograph — revealed after aperture snap */}
        <div
          className="absolute inset-0 z-10"
          style={{
            opacity: photoReveal,
            transform: `scale(${1.08 - photoReveal * 0.08})`,
          }}
        >
          <img
            src={featuredSrc}
            alt="Featured archive"
            className="h-full w-full object-cover"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-8 md:p-12">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold">
              Featured Archive
            </p>
            <h2 className="mt-2 font-serif text-2xl font-light tracking-[0.15em] text-white md:text-4xl">
              Timeless Legacies
            </h2>
          </div>
        </div>

        {/* 3D / CSS lens */}
        <div
          className="absolute inset-0 z-20"
          style={{
            opacity: lensVisible ? 1 - photoReveal * 0.5 : 0,
            pointerEvents: "none",
          }}
        >
          {useCss ? (
            <CssLens progress={lensPhase} />
          ) : (
            <WebGLSafe fallback={<CssLens progress={lensPhase} />}>
              <Canvas
                camera={{ position: [0, 0, 3.2], fov: 42, near: 0.1, far: 40 }}
                dpr={[1, 1.5]}
                gl={{
                  antialias: true,
                  alpha: false,
                  powerPreference: "high-performance",
                }}
                onCreated={({ gl }) => {
                  gl.setClearColor("#050505");
                }}
                onError={() => setUseCss(true)}
              >
                <Suspense fallback={null}>
                  <Scene progressRef={progressRef} />
                </Suspense>
              </Canvas>
            </WebGLSafe>
          )}
        </div>

        {/* Aperture iris overlay */}
        <div
          className="absolute inset-0 z-30"
          style={{
            opacity: progress > 0.5 && progress < 0.95 ? 1 : progress <= 0.5 ? 0 : 0,
            pointerEvents: "none",
          }}
        >
          <ApertureIris open={apertureOpen} />
        </div>

        {/* Minimal UI — only early in scroll */}
        <div
          className="absolute inset-x-0 bottom-10 z-40 flex flex-col items-center text-center"
          style={{ opacity: Math.max(0, 1 - progress * 3) }}
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-white/50">
            Scroll to enter the lens
          </p>
          <div className="mt-3 h-10 w-px bg-linear-to-b from-gold/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
