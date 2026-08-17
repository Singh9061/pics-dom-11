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
  const apertureWrapRef = useRef(null);
  const apertureRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const ring4Ref = useRef(null);
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
          gsap.delayedCall(0.15, safeFinish);
        },
      });

      // Initial
      gsap.set(welcomeRef.current, { opacity: 0, y: 18 });
      gsap.set(brandRef.current, { opacity: 0 });
      gsap.set(["#pics-letters", "#dom-d", "#dom-m", "#rae-text"], {
        opacity: 0,
        y: 24,
      });
      gsap.set(familyRef.current, { opacity: 0, y: 14 });
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
      gsap.set(tagRef.current, { opacity: 0, y: 10 });
      gsap.set(apertureRef.current, {
        scale: 0,
        rotation: -540,
        opacity: 0,
      });
      gsap.set(
        [ring1Ref.current, ring2Ref.current, ring3Ref.current, ring4Ref.current],
        { scale: 0, opacity: 0 }
      );
      gsap.set(flashRef.current, { opacity: 0 });
      gsap.set(glowRef.current, { scale: 0, opacity: 0 });

      // ===== PHASE 1: O is born — tiny point in the middle of DOM =====
      tl.to(brandRef.current, { opacity: 1, duration: 0.01 });

      tl.to(apertureRef.current, {
        scale: 0.35,
        opacity: 1,
        rotation: -360,
        duration: 0.55,
        ease: "power3.out",
      });

      // Glow from O center
      tl.to(
        glowRef.current,
        {
          scale: 1,
          opacity: 0.7,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // ===== PHASE 2: HEAVY — rings explode OUT from the O =====
      // Ring 1 (innermost) — passes through O size first
      tl.to(
        ring1Ref.current,
        {
          scale: 1,
          opacity: 0.9,
          duration: 0.45,
          ease: "power4.out",
        },
        "-=0.25"
      );
      // Ring 2
      tl.to(
        ring2Ref.current,
        {
          scale: 1,
          opacity: 0.65,
          duration: 0.55,
          ease: "power4.out",
        },
        "-=0.3"
      );
      // Ring 3
      tl.to(
        ring3Ref.current,
        {
          scale: 1,
          opacity: 0.4,
          duration: 0.65,
          ease: "power4.out",
        },
        "-=0.4"
      );
      // Ring 4 (widest)
      tl.to(
        ring4Ref.current,
        {
          scale: 1,
          opacity: 0.22,
          duration: 0.75,
          ease: "power4.out",
        },
        "-=0.5"
      );

      // Continuous spin on rings (opposite directions)
      gsap.to(ring1Ref.current, {
        rotation: 360,
        duration: 5,
        ease: "none",
        repeat: -1,
      });
      gsap.to(ring2Ref.current, {
        rotation: -360,
        duration: 7,
        ease: "none",
        repeat: -1,
      });
      gsap.to(ring3Ref.current, {
        rotation: 360,
        duration: 10,
        ease: "none",
        repeat: -1,
      });
      gsap.to(ring4Ref.current, {
        rotation: -360,
        duration: 14,
        ease: "none",
        repeat: -1,
      });

      // ===== PHASE 3: O heavy spin + scale through the rings =====
      tl.to(
        apertureRef.current,
        {
          scale: 1.5,
          rotation: 0,
          duration: 0.7,
          ease: "power4.out",
        },
        "-=0.55"
      );

      // Shutter flash — light passes through O
      tl.to(
        flashRef.current,
        {
          opacity: 0.9,
          duration: 0.05,
        },
        "-=0.1"
      );
      tl.to(flashRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });

      // O settles to final size with bounce
      tl.to(apertureRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.45)",
      });

      // Pulse beats through O
      tl.to(apertureRef.current, {
        scale: 1.22,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        ease: "power1.inOut",
      });

      // Keep O spinning forever during splash
      gsap.to(apertureRef.current, {
        rotation: "+=720",
        duration: 8,
        ease: "none",
        repeat: -1,
      });

      // ===== PHASE 4: Letters appear around the living O =====
      tl.to(
        "#pics-letters",
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.55"
      );
      tl.to(
        "#dom-d",
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.35"
      );
      tl.to(
        "#dom-m",
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.3"
      );
      tl.to(
        "#rae-text",
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
        "-=0.25"
      );

      // Welcome (above)
      tl.to(
        welcomeRef.current,
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.5"
      );

      // Family
      tl.to(
        familyRef.current,
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
        "-=0.25"
      );

      // Line + tag
      tl.to(
        lineRef.current,
        { scaleX: 1, opacity: 1, duration: 0.45, ease: "power2.out" },
        "-=0.15"
      );
      tl.to(
        tagRef.current,
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );

      // ===== EXIT: rings keep expanding past O then fade =====
      tl.to(
        [ring1Ref.current, ring2Ref.current, ring3Ref.current, ring4Ref.current],
        {
          scale: 2.8,
          opacity: 0,
          duration: 0.85,
          ease: "power2.in",
          stagger: 0.06,
        },
        "+=0.85"
      );

      tl.to(
        rootRef.current,
        { opacity: 0, duration: 0.55, ease: "power2.inOut" },
        "-=0.4"
      );
    }, rootRef);

    const failSafe = setTimeout(safeFinish, 7000);
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
      {/* Full-screen shutter flash */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-50 bg-white"
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p
          ref={welcomeRef}
          className="mb-5 text-xs uppercase tracking-[0.4em] text-white/65 sm:text-sm"
        >
          Welcome to
        </p>

        {/* ===== LOGO with O as animation origin ===== */}
        <div
          ref={brandRef}
          className="relative flex flex-col items-center justify-center text-white select-none"
        >
          {/* Rings + glow are ANCHORED on the aperture O */}
          <div className="flex items-center font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-wider leading-none uppercase">
            <span id="pics-letters">PICS</span>

            <span className="ml-2 sm:ml-3 flex items-center">
              <span id="dom-d">D</span>

              {/* === O WRAPPER: rings expand FROM here === */}
              <span
                ref={apertureWrapRef}
                className="relative inline-flex items-center justify-center mx-0.5 sm:mx-1"
                style={{ width: "1.15em", height: "1.15em" }}
              >
                {/* Gold glow from O */}
                <span
                  ref={glowRef}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/40 blur-2xl"
                  style={{ width: "180%", height: "180%" }}
                />

                {/* Ring 1 – closest to O, expands through it */}
                <span
                  ref={ring1Ref}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold"
                  style={{
                    width: "160%",
                    height: "160%",
                    boxShadow: "0 0 24px rgba(197,168,128,0.55)",
                  }}
                />
                {/* Ring 2 */}
                <span
                  ref={ring2Ref}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/70"
                  style={{
                    width: "240%",
                    height: "240%",
                    boxShadow: "0 0 36px rgba(197,168,128,0.35)",
                  }}
                />
                {/* Ring 3 */}
                <span
                  ref={ring3Ref}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30"
                  style={{
                    width: "340%",
                    height: "340%",
                  }}
                />
                {/* Ring 4 – widest, fills background from O */}
                <span
                  ref={ring4Ref}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25"
                  style={{
                    width: "480%",
                    height: "480%",
                  }}
                />

                {/* The actual aperture O */}
                <span
                  ref={apertureRef}
                  className="relative z-10 inline-flex text-gold drop-shadow-[0_0_18px_rgba(197,168,128,0.8)]"
                  style={{ transformOrigin: "center center" }}
                >
                  <CameraApertureIcon className="w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14" />
                </span>
              </span>

              <span id="dom-m">M</span>
            </span>
          </div>

          <span
            id="rae-text"
            className="mt-2 sm:mt-3 font-sans text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.5em] uppercase opacity-90"
          >
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
