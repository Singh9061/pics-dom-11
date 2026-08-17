import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { FiCamera } from "react-icons/fi";

export default function SplashScreen({ onFinish }) {
  const rootRef = useRef(null);
  const welcomeRef = useRef(null);
  const brandRef = useRef(null);
  const familyRef = useRef(null);
  const lineRef = useRef(null);
  const tagRef = useRef(null);
  const iconRef = useRef(null);
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

      // Initial state
      gsap.set(iconRef.current, { opacity: 0, scale: 0.6 });
      gsap.set(welcomeRef.current, { opacity: 0, y: 24 });
      gsap.set(brandRef.current, { opacity: 0, y: 40 });
      gsap.set(familyRef.current, { opacity: 0, y: 20 });
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
      gsap.set(tagRef.current, { opacity: 0, y: 16 });

      // 1. Camera icon fade in
      tl.to(iconRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
      });

      // 2. "Welcome to"
      tl.to(
        welcomeRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
        "-=0.25"
      );

      // 3. PICS DOM (same language as homepage hero)
      tl.to(
        brandRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
        },
        "-=0.2"
      );

      // 4. Family in gold italic
      tl.to(
        familyRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
        "-=0.35"
      );

      // 5. Gold line
      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
        },
        "-=0.25"
      );

      // 6. Tagline
      tl.to(
        tagRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // Hold, then elegant fade out
      tl.to(rootRef.current, {
        opacity: 0,
        duration: 0.65,
        ease: "power2.inOut",
        delay: 1.15,
      });
    }, rootRef);

    // Fail-safe
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
      {/* Soft gold ambient glow – matches site luxury tone */}
      <div className="pointer-events-none absolute h-[480px] w-[480px] rounded-full bg-gold/10 blur-3xl" />

      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Camera icon – same as hero tagline */}
        <div ref={iconRef} className="mb-6 text-gold">
          <FiCamera size={22} className="opacity-90" />
        </div>

        {/* Welcome to */}
        <p
          ref={welcomeRef}
          className="mb-4 text-xs uppercase tracking-[0.35em] text-white/70 sm:text-sm"
        >
          Welcome to
        </p>

        {/* PICS DOM – homepage hero typography */}
        <h1
          ref={brandRef}
          className="font-serif text-4xl font-light uppercase tracking-[0.22em] text-white sm:text-5xl md:text-7xl leading-tight"
        >
          Pics Dom
        </h1>

        {/* Family – gold italic like "Legacies" on homepage */}
        <p
          ref={familyRef}
          className="mt-2 font-serif text-2xl font-semibold italic tracking-[0.12em] text-gold sm:text-3xl md:text-4xl"
        >
          Family
        </p>

        {/* Gold divider */}
        <div
          ref={lineRef}
          className="mt-6 mb-4 h-px w-28 origin-center bg-linear-to-r from-transparent via-gold to-transparent sm:w-36"
        />

        {/* Tagline */}
        <p
          ref={tagRef}
          className="text-[10px] uppercase tracking-[0.4em] text-white/55 sm:text-xs"
        >
          Luxury Wedding & Heritage Photography · Raebareli
        </p>
      </div>
    </div>
  );
}
