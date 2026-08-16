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
          gsap.delayedCall(0.25, onFinish);
        },
      });

      // Initial states for text
      gsap.set(brandRef.current, { opacity: 0 });
      gsap.set(lettersRef.current, {
        y: 140,
        opacity: 0,
        scale: 0.15,
        rotateX: 55,
      });
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });

      // Wait a bit after camera entrance then explode PICSDOM
      tl.to({}, { duration: 0.35 }); // small buffer after camera ready

      // PICSDOM letters explode out — big, bold, heavy
      tl.to(brandRef.current, {
        opacity: 1,
        duration: 0.05,
      });

      tl.to(lettersRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 0.9,
        stagger: 0.075,
        ease: "back.out(2.4)",
      });

      // Extra heavy punch
      tl.to(
        brandRef.current,
        {
          scale: 1.18,
          duration: 0.3,
          ease: "power3.out",
        },
        "-=0.4"
      ).to(brandRef.current, {
        scale: 1,
        duration: 0.45,
        ease: "elastic.out(1, 0.45)",
      });

      // Gold line
      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
        },
        "-=0.55"
      );

      // Hold then elegant fade out of whole splash
      tl.to(
        rootRef.current,
        {
          opacity: 0,
          scale: 1.05,
          duration: 0.65,
          ease: "power2.inOut",
          delay: 0.7,
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
      {/* Soft ambient gold glow */}
      <div className="absolute h-[500px] w-[500px] rounded-full bg-gold/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Real 3D Camera */}
        <div className="mb-6 sm:mb-8">
          <Camera3D onReady={() => setCameraReady(true)} />
        </div>

        {/* Bold PICSDOM text — heavy & large */}
        <div
          ref={brandRef}
          className="flex items-center justify-center select-none"
          style={{ perspective: "900px" }}
        >
          {brand.split("").map((letter, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              className="inline-block font-sans text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white"
              style={{
                textShadow:
                  "0 0 60px rgba(197,168,128,0.6), 0 0 25px rgba(197,168,128,0.35), 0 8px 35px rgba(0,0,0,0.7)",
                letterSpacing: "-0.035em",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Gold underline */}
        <div
          ref={lineRef}
          className="mt-5 h-[2px] w-44 origin-center bg-linear-to-r from-transparent via-gold to-transparent"
        />
      </div>
    </div>
  );
}
