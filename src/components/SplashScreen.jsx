import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { cameraImage } from "../Assets/cameraImage";

export default function SplashScreen({ onFinish }) {
  const rootRef = useRef(null);
  const camWrapRef = useRef(null);
  const camRef = useRef(null);
  const flashRef = useRef(null);
  const brandRef = useRef(null);
  const subRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(0.35, onFinish);
        },
      });

      // Initial states
      gsap.set(camWrapRef.current, {
        opacity: 0,
        scale: 0.55,
        rotateY: -55,
        rotateX: 18,
        y: 80,
        filter: "blur(12px)",
      });
      gsap.set(flashRef.current, { opacity: 0 });
      gsap.set(brandRef.current, { opacity: 0, y: 60, scale: 0.85 });
      gsap.set(subRef.current, { opacity: 0, y: 20 });
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });

      // 1. Camera flies in + turns (3D)
      tl.to(camWrapRef.current, {
        opacity: 1,
        scale: 1,
        rotateY: 12,
        rotateX: 6,
        y: 0,
        filter: "blur(0px)",
        duration: 1.35,
        ease: "power4.out",
      });

      // Slight extra turn
      tl.to(camWrapRef.current, {
        rotateY: -8,
        duration: 0.7,
        ease: "power2.inOut",
      });

      // 2. Shutter click flash
      tl.to(flashRef.current, {
        opacity: 0.92,
        duration: 0.07,
        ease: "power1.out",
      });
      tl.to(flashRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
      });

      // Small settle after click
      tl.to(camWrapRef.current, {
        rotateY: 0,
        rotateX: 2,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.15");

      // 3. Professional PICSDOM + RAEBARELI
      tl.to(brandRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
      }, "-=0.2");

      tl.to(subRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.45");

      tl.to(lineRef.current, {
        scaleX: 1,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
      }, "-=0.5");

      // Hold then fade
      tl.to(rootRef.current, {
        opacity: 0,
        scale: 1.03,
        duration: 0.7,
        ease: "power2.inOut",
        delay: 0.9,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [onFinish]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-black overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient glow */}
      <div className="absolute h-[480px] w-[480px] rounded-full bg-gold/15 blur-3xl pointer-events-none" />

      {/* Full-screen shutter flash */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-50 bg-white"
      />

      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Real camera photo with 3D transform */}
        <div
          ref={camWrapRef}
          className="mb-10 sm:mb-12"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <img
            ref={camRef}
            src={cameraImage}
            alt="Sony α7"
            className="w-[280px] sm:w-[360px] md:w-[420px] h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
            draggable={false}
          />
        </div>

        {/* Professional brand */}
        <div className="flex flex-col items-center text-center">
          <h1
            ref={brandRef}
            className="font-serif text-5xl sm:text-7xl md:text-8xl font-light tracking-[0.18em] text-white uppercase"
            style={{
              textShadow: "0 0 40px rgba(197,168,128,0.35), 0 4px 30px rgba(0,0,0,0.5)",
            }}
          >
            PICSDOM
          </h1>

          <div
            ref={lineRef}
            className="mt-4 mb-3 h-px w-24 origin-center bg-linear-to-r from-transparent via-gold to-transparent"
          />

          <p
            ref={subRef}
            className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.45em] text-gold/90"
          >
            Raebareli
          </p>
        </div>
      </div>
    </div>
  );
}
