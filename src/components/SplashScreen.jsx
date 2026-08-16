import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Camera3D from "./Camera3D";

export default function SplashScreen({ onFinish }) {
  const rootRef = useRef(null);
  const flashRef = useRef(null);
  const brandRef = useRef(null);
  const subRef = useRef(null);
  const lineRef = useRef(null);
  const camContainerRef = useRef(null);
  const [camReady, setCamReady] = useState(false);
  const hasPlayed = useRef(false);

  // Shutter click sound
  const playShutter = () => {
    try {
      const audio = new Audio(
        "https://orangefreesounds.com/wp-content/uploads/2022/03/Camera-sound.mp3"
      );
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } catch (e) {
      // silent fail if autoplay blocked
    }
  };

  useEffect(() => {
    if (!camReady || hasPlayed.current) return;
    hasPlayed.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(0.35, onFinish);
        },
      });

      gsap.set(flashRef.current, { opacity: 0 });
      gsap.set(brandRef.current, { opacity: 0, y: 60, scale: 0.85 });
      gsap.set(subRef.current, { opacity: 0, y: 20 });
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
      gsap.set(camContainerRef.current, { opacity: 1 });

      // Brief hold so the 3D camera finish its own turn
      tl.to({}, { duration: 0.35 });

      // Shutter flash + sound
      tl.add(() => playShutter());
      tl.to(flashRef.current, {
        opacity: 0.92,
        duration: 0.05,
        ease: "power1.out",
      });
      tl.to(flashRef.current, {
        opacity: 0,
        duration: 0.32,
        ease: "power2.out",
      });

      // Professional PICSDOM (matching homepage hero style)
      tl.to(
        brandRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.15"
      );

      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.65,
          ease: "power2.out",
        },
        "-=0.55"
      );

      tl.to(
        subRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.45"
      );

      // Hold then elegant fade out
      tl.to(rootRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.7,
        ease: "power2.inOut",
        delay: 1.1,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [camReady, onFinish]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-black overflow-hidden"
      style={{ perspective: "1400px" }}
    >
      {/* Soft gold glow */}
      <div className="absolute h-[520px] w-[520px] rounded-full bg-gold/15 blur-3xl pointer-events-none" />

      {/* Shutter flash */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-50 bg-white"
      />

      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Real 3D Camera */}
        <div
          ref={camContainerRef}
          className="mb-6 sm:mb-8 flex items-center justify-center"
        >
          <Camera3D onReady={() => setCamReady(true)} />
        </div>

        {/* Professional brand block – same language as homepage hero */}
        <div className="flex flex-col items-center text-center">
          <h1
            ref={brandRef}
            className="font-serif text-5xl sm:text-7xl md:text-8xl font-light tracking-[0.22em] text-white uppercase leading-none"
            style={{
              textShadow:
                "0 0 60px rgba(197,168,128,0.35), 0 8px 40px rgba(0,0,0,0.55)",
            }}
          >
            PICSDOM
          </h1>

          <div
            ref={lineRef}
            className="mt-5 mb-3 h-px w-32 origin-center bg-linear-to-r from-transparent via-gold to-transparent"
          />

          <p
            ref={subRef}
            className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.45em] text-gold/90"
          >
            Luxury Wedding & Heritage Photography · Raebareli
          </p>
        </div>
      </div>
    </div>
  );
}
