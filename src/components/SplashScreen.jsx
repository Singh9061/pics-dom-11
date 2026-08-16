import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { cameraImage } from "../Assets/cameraImage";

export default function SplashScreen({ onFinish }) {
  const rootRef = useRef(null);
  const camWrapRef = useRef(null);
  const flashRef = useRef(null);
  const brandRef = useRef(null);
  const subRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(0.4, onFinish);
        },
      });

      gsap.set(camWrapRef.current, {
        opacity: 0,
        scale: 0.5,
        rotateY: -60,
        rotateX: 20,
        y: 90,
        filter: "blur(14px)",
      });
      gsap.set(flashRef.current, { opacity: 0 });
      gsap.set(brandRef.current, { opacity: 0, y: 70, scale: 0.8 });
      gsap.set(subRef.current, { opacity: 0, y: 25 });
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });

      // Camera flies in + 3D turn
      tl.to(camWrapRef.current, {
        opacity: 1,
        scale: 1,
        rotateY: 15,
        rotateX: 8,
        y: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power4.out",
      });

      // Extra turn
      tl.to(camWrapRef.current, {
        rotateY: -10,
        duration: 0.75,
        ease: "power2.inOut",
      });

      // Shutter click flash
      tl.to(flashRef.current, {
        opacity: 0.95,
        duration: 0.06,
        ease: "power1.out",
      });
      tl.to(flashRef.current, {
        opacity: 0,
        duration: 0.28,
        ease: "power2.out",
      });

      // Settle
      tl.to(
        camWrapRef.current,
        {
          rotateY: 0,
          rotateX: 3,
          duration: 0.55,
          ease: "power2.out",
        },
        "-=0.15"
      );

      // Professional PICSDOM
      tl.to(
        brandRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.95,
          ease: "power3.out",
        },
        "-=0.25"
      );

      tl.to(
        subRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
        },
        "-=0.5"
      );

      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.55"
      );

      // Hold then fade
      tl.to(rootRef.current, {
        opacity: 0,
        scale: 1.03,
        duration: 0.75,
        ease: "power2.inOut",
        delay: 1.0,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [onFinish]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-black overflow-hidden"
      style={{ perspective: "1400px" }}
    >
      <div className="absolute h-[500px] w-[500px] rounded-full bg-gold/18 blur-3xl pointer-events-none" />

      {/* Shutter flash */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-50 bg-white"
      />

      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Camera with 3D transform */}
        <div
          ref={camWrapRef}
          className="mb-10 sm:mb-12"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <img
            src={cameraImage}
            alt="Sony Alpha"
            className="w-[260px] sm:w-[340px] md:w-[400px] h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.75)]"
            draggable={false}
            style={{ backfaceVisibility: "hidden" }}
          />
        </div>

        {/* Professional brand block */}
        <div className="flex flex-col items-center text-center">
          <h1
            ref={brandRef}
            className="font-serif text-5xl sm:text-7xl md:text-8xl font-light tracking-[0.2em] text-white uppercase"
            style={{
              textShadow:
                "0 0 50px rgba(197,168,128,0.4), 0 6px 35px rgba(0,0,0,0.6)",
            }}
          >
            PICSDOM
          </h1>

          <div
            ref={lineRef}
            className="mt-4 mb-3 h-px w-28 origin-center bg-linear-to-r from-transparent via-gold to-transparent"
          />

          <p
            ref={subRef}
            className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.5em] text-gold/90"
          >
            Raebareli
          </p>
        </div>
      </div>
    </div>
  );
}
