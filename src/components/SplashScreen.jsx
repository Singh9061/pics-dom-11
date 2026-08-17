import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const CameraApertureIcon = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" />
    <polygon
      points="50,15 82,34 70,72 50,85 18,66 30,28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
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
  const picsRef = useRef(null);
  const dRef = useRef(null);
  const mRef = useRef(null);
  const raeRef = useRef(null);
  const familyRef = useRef(null);
  const lineRef = useRef(null);
  const tagRef = useRef(null);
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
    // Ensure overlay cannot block the site
    if (rootRef.current) {
      rootRef.current.style.pointerEvents = "none";
      rootRef.current.style.opacity = "0";
    }
    try {
      onFinish?.();
    } catch (_) {}
  };

  useEffect(() => {
    // Hard guarantee: leave splash no matter what
    const hardExit = setTimeout(safeFinish, 4500);

    const ctx = gsap.context(() => {
      const els = [
        welcomeRef.current,
        picsRef.current,
        dRef.current,
        mRef.current,
        raeRef.current,
        familyRef.current,
        lineRef.current,
        tagRef.current,
        apertureRef.current,
        ring1Ref.current,
        ring2Ref.current,
        ring3Ref.current,
        ring4Ref.current,
        flashRef.current,
        glowRef.current,
        rootRef.current,
      ];

      // Skip animation if refs missing
      if (!rootRef.current || !apertureRef.current) {
        safeFinish();
        return;
      }

      gsap.set(welcomeRef.current, { opacity: 0, y: 16 });
      gsap.set([picsRef.current, dRef.current, mRef.current, raeRef.current], {
        opacity: 0,
        y: 20,
      });
      gsap.set(familyRef.current, { opacity: 0, y: 12 });
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
      gsap.set(tagRef.current, { opacity: 0, y: 10 });
      gsap.set(apertureRef.current, { scale: 0, rotation: -400, opacity: 0 });
      gsap.set(
        [ring1Ref.current, ring2Ref.current, ring3Ref.current, ring4Ref.current],
        { scale: 0, opacity: 0 }
      );
      gsap.set(flashRef.current, { opacity: 0 });
      gsap.set(glowRef.current, { scale: 0.3, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => safeFinish(),
      });

      // 1. Glow + O birth from center of DOM
      tl.to(glowRef.current, {
        scale: 1.2,
        opacity: 0.65,
        duration: 0.5,
        ease: "power2.out",
      });

      tl.to(
        apertureRef.current,
        {
          scale: 0.4,
          opacity: 1,
          rotation: -200,
          duration: 0.45,
          ease: "power3.out",
        },
        "-=0.3"
      );

      // 2. Rings explode OUT from O (pass through O)
      tl.to(
        ring1Ref.current,
        { scale: 1, opacity: 0.85, duration: 0.4, ease: "power3.out" },
        "-=0.15"
      );
      tl.to(
        ring2Ref.current,
        { scale: 1, opacity: 0.55, duration: 0.5, ease: "power3.out" },
        "-=0.3"
      );
      tl.to(
        ring3Ref.current,
        { scale: 1, opacity: 0.35, duration: 0.55, ease: "power3.out" },
        "-=0.35"
      );
      tl.to(
        ring4Ref.current,
        { scale: 1, opacity: 0.2, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );

      // Spin rings (finite, not infinite — so timeline can complete)
      tl.to(
        ring1Ref.current,
        { rotation: 180, duration: 2.2, ease: "none" },
        0.4
      );
      tl.to(
        ring2Ref.current,
        { rotation: -140, duration: 2.2, ease: "none" },
        0.4
      );
      tl.to(
        ring3Ref.current,
        { rotation: 100, duration: 2.2, ease: "none" },
        0.4
      );
      tl.to(
        ring4Ref.current,
        { rotation: -80, duration: 2.2, ease: "none" },
        0.4
      );

      // 3. Heavy O spin + scale through rings
      tl.to(
        apertureRef.current,
        {
          scale: 1.45,
          rotation: 20,
          duration: 0.55,
          ease: "power4.out",
        },
        "-=1.6"
      );

      // Shutter flash through O
      tl.to(
        flashRef.current,
        { opacity: 0.85, duration: 0.05 },
        "-=0.05"
      );
      tl.to(flashRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      // O settle + pulse
      tl.to(apertureRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.35,
        ease: "back.out(2)",
      });
      tl.to(apertureRef.current, {
        scale: 1.15,
        duration: 0.1,
        yoyo: true,
        repeat: 3,
        ease: "power1.inOut",
      });

      // 4. Brand letters around O
      tl.to(
        picsRef.current,
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.35"
      );
      tl.to(
        dRef.current,
        { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
        "-=0.28"
      );
      tl.to(
        mRef.current,
        { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
        "-=0.25"
      );
      tl.to(
        raeRef.current,
        { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
        "-=0.2"
      );

      tl.to(
        welcomeRef.current,
        { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
        "-=0.45"
      );
      tl.to(
        familyRef.current,
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.2"
      );
      tl.to(
        lineRef.current,
        { scaleX: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.15"
      );
      tl.to(
        tagRef.current,
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        "-=0.15"
      );

      // 5. Exit — rings expand past O, then fade whole splash
      tl.to(
        [ring1Ref.current, ring2Ref.current, ring3Ref.current, ring4Ref.current],
        {
          scale: 2.5,
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
          stagger: 0.04,
        },
        "+=0.55"
      );

      tl.to(
        rootRef.current,
        {
          opacity: 0,
          duration: 0.45,
          ease: "power2.inOut",
          onStart: () => {
            if (rootRef.current) rootRef.current.style.pointerEvents = "none";
          },
        },
        "-=0.25"
      );
    }, rootRef);

    return () => {
      clearTimeout(hardExit);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black overflow-hidden"
    >
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

        <div className="relative flex flex-col items-center justify-center text-white select-none">
          <div className="flex items-center font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-wider leading-none uppercase">
            <span ref={picsRef}>PICS</span>

            <span className="ml-2 sm:ml-3 flex items-center">
              <span ref={dRef}>D</span>

              {/* O = aperture — all rings expand from here */}
              <span
                className="relative inline-flex items-center justify-center mx-0.5 sm:mx-1"
                style={{ width: "1.15em", height: "1.15em" }}
              >
                <span
                  ref={glowRef}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/40 blur-2xl"
                  style={{ width: "180%", height: "180%" }}
                />
                <span
                  ref={ring1Ref}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold"
                  style={{
                    width: "160%",
                    height: "160%",
                    boxShadow: "0 0 24px rgba(197,168,128,0.55)",
                  }}
                />
                <span
                  ref={ring2Ref}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/70"
                  style={{
                    width: "240%",
                    height: "240%",
                    boxShadow: "0 0 36px rgba(197,168,128,0.35)",
                  }}
                />
                <span
                  ref={ring3Ref}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30"
                  style={{ width: "340%", height: "340%" }}
                />
                <span
                  ref={ring4Ref}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25"
                  style={{ width: "480%", height: "480%" }}
                />

                <span
                  ref={apertureRef}
                  className="relative z-10 inline-flex text-gold drop-shadow-[0_0_18px_rgba(197,168,128,0.8)]"
                  style={{ transformOrigin: "center center" }}
                >
                  <CameraApertureIcon className="w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14" />
                </span>
              </span>

              <span ref={mRef}>M</span>
            </span>
          </div>

          <span
            ref={raeRef}
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
