import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/* Same aperture icon as Navbar – the O in DOM */
const CameraApertureIcon = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" />
    <polygon points="50,15 82,34 70,72 50,85 18,66 30,28" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M50 10 L78 36 L62 38 Z" />
    <path d="M85 38 L72 74 L58 62 Z" />
    <path d="M72 76 L36 84 L40 68 Z" />
    <path d="M34 84 L14 54 L30 52 Z" />
    <path d="M14 52 L30 18 L42 30 Z" />
    <path d="M32 18 L68 12 L56 28 Z" />
  </svg>
);

export default function SplashScreen({ onFinish }) {
  const rootRef = useRef(null);
  const welcomeRef = useRef(null);
  const brandRef = useRef(null);
  const familyRef = useRef(null);
  const lineRef = useRef(null);
  const tagRef = useRef(null);
  const apertureRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const flashRef = useRef(null);
  const glowRef = useRef(null);
  const finished = useRef(false);

  const safeFinish = () => {
    if (finished.current) return;
    finished.current = true;
    try {
      onFinish?.();
    } catch (_) {}
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(0.2, safeFinish);
        },
      });

      // ---- Initial states ----
      gsap.set(welcomeRef.current, { opacity: 0, y: 20 });
      gsap.set(brandRef.current, { opacity: 0, y: 40, scale: 0.85 });
      gsap.set(familyRef.current, { opacity: 0, y: 16 });
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
      gsap.set(tagRef.current, { opacity: 0, y: 12 });
      gsap.set(apertureRef.current, {
        rotation: -180,
        scale: 0.2,
        opacity: 0,
      });
      gsap.set([ring1Ref.current, ring2Ref.current, ring3Ref.current], {
        scale: 0.3,
        opacity: 0,
      });
      gsap.set(flashRef.current, { opacity: 0 });
      gsap.set(glowRef.current, { scale: 0.5, opacity: 0 });

      // 1. Background glow blooms
      tl.to(glowRef.current, {
        scale: 1.4,
        opacity: 0.55,
        duration: 0.9,
        ease: "power2.out",
      });

      // 2. Expanding aperture rings (heavy background motion)
      tl.to(
        ring1Ref.current,
        {
          scale: 1,
          opacity: 0.7,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.55"
      );
      tl.to(
        ring2Ref.current,
        {
          scale: 1.35,
          opacity: 0.45,
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.55"
      );
      tl.to(
        ring3Ref.current,
        {
          scale: 1.75,
          opacity: 0.25,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.7"
      );

      // Continuous slow spin on outer rings
      gsap.to(ring1Ref.current, {
        rotation: 360,
        duration: 8,
        ease: "none",
        repeat: -1,
      });
      gsap.to(ring2Ref.current, {
        rotation: -360,
        duration: 12,
        ease: "none",
        repeat: -1,
      });
      gsap.to(ring3Ref.current, {
        rotation: 360,
        duration: 16,
        ease: "none",
        repeat: -1,
      });

      // 3. Welcome to
      tl.to(
        welcomeRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        },
        "-=0.6"
      );

      // 4. Brand block fades in
      tl.to(
        brandRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: "power3.out",
        },
        "-=0.25"
      );

      // 5. HEAVY aperture O animation — spin + scale burst + settle
      tl.to(
        apertureRef.current,
        {
          rotation: 360,
          scale: 1.35,
          opacity: 1,
          duration: 0.9,
          ease: "power4.out",
        },
        "-=0.45"
      );
      // Overshoot settle
      tl.to(apertureRef.current, {
        scale: 1,
        rotation: 360 + 20,
        duration: 0.35,
        ease: "power2.inOut",
      });
      tl.to(apertureRef.current, {
        rotation: 360,
        duration: 0.25,
        ease: "power2.out",
      });

      // Shutter flash on O
      tl.to(
        flashRef.current,
        {
          opacity: 0.85,
          duration: 0.06,
          ease: "power1.out",
        },
        "-=0.15"
      );
      tl.to(flashRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
      });

      // Pulse the O a few times
      tl.to(apertureRef.current, {
        scale: 1.18,
        duration: 0.12,
        yoyo: true,
        repeat: 3,
        ease: "power1.inOut",
      });

      // Keep O slowly spinning for the rest of splash
      gsap.to(apertureRef.current, {
        rotation: "+=360",
        duration: 6,
        ease: "none",
        repeat: -1,
      });

      // 6. Family
      tl.to(
        familyRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.35"
      );

      // 7. Gold line
      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2"
      );

      // 8. Tagline
      tl.to(
        tagRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.25"
      );

      // Rings expand out & fade as we exit
      tl.to(
        [ring1Ref.current, ring2Ref.current, ring3Ref.current],
        {
          scale: "+=0.6",
          opacity: 0,
          duration: 0.7,
          ease: "power2.in",
          stagger: 0.05,
        },
        "+=0.9"
      );

      // Final fade
      tl.to(
        rootRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "-=0.35"
      );
    }, rootRef);

    const failSafe = setTimeout(safeFinish, 6500);

    return () => {
      ctx.revert();
      clearTimeout(failSafe);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Ambient gold glow behind logo */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-gold/20 blur-3xl"
      />

      {/* Expanding aperture rings – heavy background motion around the O */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          ref={ring1Ref}
          className="absolute h-40 w-40 sm:h-52 sm:w-52 rounded-full border border-gold/50"
          style={{ boxShadow: "0 0 40px rgba(197,168,128,0.25)" }}
        />
        <div
          ref={ring2Ref}
          className="absolute h-56 w-56 sm:h-72 sm:w-72 rounded-full border border-white/20"
          style={{ boxShadow: "0 0 60px rgba(197,168,128,0.12)" }}
        />
        <div
          ref={ring3Ref}
          className="absolute h-72 w-72 sm:h-96 sm:w-96 rounded-full border border-gold/20"
        />
      </div>

      {/* Shutter flash */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-40 bg-white"
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.65)_100%)]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p
          ref={welcomeRef}
          className="mb-5 text-xs uppercase tracking-[0.4em] text-white/65 sm:text-sm"
        >
          Welcome to
        </p>

        {/* ===== LOGO ===== */}
        <div
          ref={brandRef}
          className="flex flex-col items-center justify-center text-white select-none"
        >
          <div className="flex items-center font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-wider leading-none uppercase">
            <span>PICS</span>
            <span className="ml-2 sm:ml-3 flex items-center">
              D
              {/* Heavy-animated O (aperture) */}
              <span
                ref={apertureRef}
                className="inline-flex mx-0.5 sm:mx-1 text-gold drop-shadow-[0_0_20px_rgba(197,168,128,0.65)]"
                style={{ transformOrigin: "center center" }}
              >
                <CameraApertureIcon className="w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14" />
              </span>
              M
            </span>
          </div>

          <span className="mt-2 sm:mt-3 font-sans text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.5em] uppercase opacity-90">
            RAEBARELI
          </span>
        </div>

        <p
          ref={familyRef}
          className="mt-5 font-serif text-xl sm:text-2xl md:text-3xl font-semibold italic tracking-[0.15em] text-gold"
        >
          Family
        </p>

        <div
          ref={lineRef}
          className="mt-5 mb-4 h-px w-28 origin-center bg-linear-to-r from-transparent via-gold to-transparent sm:w-40"
        />

        <p
          ref={tagRef}
          className="text-[10px] uppercase tracking-[0.35em] text-white/50 sm:text-xs"
        >
          Luxury Wedding & Heritage Photography
        </p>
      </div>
    </div>
  );
}
