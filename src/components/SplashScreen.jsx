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
    <polygon points="50,15 82,34 70,72 50,85 18,66 30,28" fill="none" />
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
          gsap.delayedCall(0.25, safeFinish);
        },
      });

      gsap.set(welcomeRef.current, { opacity: 0, y: 20 });
      gsap.set(brandRef.current, { opacity: 0, y: 36, scale: 0.92 });
      gsap.set(familyRef.current, { opacity: 0, y: 16 });
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
      gsap.set(tagRef.current, { opacity: 0, y: 12 });
      gsap.set(apertureRef.current, { rotation: -90, opacity: 0.4 });

      // Welcome to
      tl.to(welcomeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });

      // Brand logo block
      tl.to(
        brandRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.2"
      );

      // Aperture spin into place
      tl.to(
        apertureRef.current,
        {
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.55"
      );

      // Family
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

      // Gold line
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

      // Tagline
      tl.to(
        tagRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        "-=0.25"
      );

      // Hold + fade out
      tl.to(rootRef.current, {
        opacity: 0,
        duration: 0.65,
        ease: "power2.inOut",
        delay: 1.2,
      });
    }, rootRef);

    const failSafe = setTimeout(safeFinish, 5000);

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
      <div className="pointer-events-none absolute h-[480px] w-[480px] rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Welcome to */}
        <p
          ref={welcomeRef}
          className="mb-5 text-xs uppercase tracking-[0.4em] text-white/65 sm:text-sm"
        >
          Welcome to
        </p>

        {/* ===== LOGO: same as Navbar / screenshot ===== */}
        <div
          ref={brandRef}
          className="flex flex-col items-center justify-center text-white select-none"
        >
          {/* PICS D◉M */}
          <div className="flex items-center font-extrabold text-4xl sm:text-5xl md:text-7xl tracking-wider leading-none uppercase">
            <span>PICS</span>
            <span className="ml-2 sm:ml-3 flex items-center">
              D
              <span ref={apertureRef} className="inline-flex mx-0.5 sm:mx-1 text-white">
                <CameraApertureIcon className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12" />
              </span>
              M
            </span>
          </div>

          {/* RAEBARELI */}
          <span className="mt-2 sm:mt-3 font-sans text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.5em] uppercase opacity-90">
            RAEBARELI
          </span>
        </div>

        {/* Family */}
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
