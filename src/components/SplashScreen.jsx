import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Camera3D from "./Camera3D";

export default function SplashScreen({ onFinish }) {
  const rootRef = useRef(null);
  const brandRef = useRef(null);
  const lettersRef = useRef([]);
  const lineRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    if (!cameraReady) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(0.3, onFinish);
        },
      });

      gsap.set(brandRef.current, { opacity: 0 });
      gsap.set(lettersRef.current, {
        y: 150,
        opacity: 0,
        scale: 0.12,
        rotateX: 60,
      });
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });

      // Small buffer after camera animation
      tl.to({}, { duration: 0.4 });

      // PICSDOM heavy reveal
      tl.to(brandRef.current, { opacity: 1, duration: 0.05 });

      tl.to(lettersRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 0.95,
        stagger: 0.08,
        ease: "back.out(2.5)",
      });

      tl.to(
        brandRef.current,
        {
          scale: 1.2,
          duration: 0.32,
          ease: "power3.out",
        },
        "-=0.45"
      ).to(brandRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
      });

      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.6"
      );

      // Hold then fade whole splash
      tl.to(
        rootRef.current,
        {
          opacity: 0,
          scale: 1.04,
          duration: 0.7,
          ease: "power2.inOut",
          delay: 0.8,
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [cameraReady, onFinish]);

  const brand = "PICSDOM";

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      <div className="absolute h-[520px] w-[520px] rounded-full bg-gold/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 sm:mb-6">
          <Camera3D onReady={() => setCameraReady(true)} />
        </div>

        <div
          ref={brandRef}
          className="flex items-center justify-center select-none"
          style={{ perspective: "1000px" }}
        >
          {brand.split("").map((letter, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              className="inline-block font-sans text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white"
              style={{
                textShadow:
                  "0 0 60px rgba(197,168,128,0.65), 0 0 25px rgba(197,168,128,0.4), 0 8px 40px rgba(0,0,0,0.75)",
                letterSpacing: "-0.04em",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div
          ref={lineRef}
          className="mt-5 h-[2px] w-48 origin-center bg-linear-to-r from-transparent via-gold to-transparent"
        />
      </div>
    </div>
  );
}
