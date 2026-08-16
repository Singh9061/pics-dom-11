import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SplashScreen({ onFinish, duration = 3800 }) {
  const rootRef = useRef(null);
  const cameraRef = useRef(null);
  const apertureRef = useRef(null);
  const brandRef = useRef(null);
  const lettersRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // slight pause then call finish
          gsap.delayedCall(0.15, onFinish);
        },
      });

      // Initial states
      gsap.set(cameraRef.current, { scale: 0.35, opacity: 0, y: 40, rotate: -8 });
      gsap.set(apertureRef.current, { scale: 0.8, opacity: 0 });
      gsap.set(brandRef.current, { opacity: 0 });
      gsap.set(lettersRef.current, { y: 80, opacity: 0, scale: 0.4 });

      // 1. Camera flies in
      tl.to(cameraRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      // 2. Aperture ring appears + blinks (pulse glow)
      tl.to(
        apertureRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(2)",
        },
        "-=0.35"
      );

      // Blink / pulse the aperture ring 3 times
      tl.to(apertureRef.current, {
        filter: "drop-shadow(0 0 18px #c5a880) drop-shadow(0 0 8px #c5a880)",
        duration: 0.22,
        yoyo: true,
        repeat: 5,
        ease: "power1.inOut",
      });

      // 3. PICSDOM letters explode out big & bold
      tl.to(
        brandRef.current,
        {
          opacity: 1,
          duration: 0.1,
        },
        "-=0.1"
      );

      tl.to(
        lettersRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: "back.out(1.7)",
        },
        "-=0.05"
      );

      // Extra punch: slight overscale then settle
      tl.to(
        brandRef.current,
        {
          scale: 1.08,
          duration: 0.25,
          ease: "power2.out",
        },
        "-=0.25"
      ).to(brandRef.current, {
        scale: 1,
        duration: 0.35,
        ease: "power2.inOut",
      });

      // 4. Hold a moment then fade everything out
      tl.to(
        rootRef.current,
        {
          opacity: 0,
          scale: 1.04,
          duration: 0.55,
          ease: "power2.inOut",
          delay: 0.45,
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [onFinish]);

  const brand = "PICSDOM";

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Soft ambient gold glow */}
      <div className="absolute h-80 w-80 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

      {/* Camera + Brand container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Stylized Sony-style mirrorless body */}
        <div ref={cameraRef} className="relative mb-10">
          <svg
            width="220"
            height="150"
            viewBox="0 0 220 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
          >
            {/* Body */}
            <rect
              x="18"
              y="38"
              width="184"
              height="92"
              rx="14"
              fill="#1a1a1a"
              stroke="#333"
              strokeWidth="2"
            />
            {/* Top plate */}
            <rect
              x="38"
              y="22"
              width="100"
              height="22"
              rx="6"
              fill="#141414"
              stroke="#2a2a2a"
              strokeWidth="1.5"
            />
            {/* Mode dial */}
            <circle cx="52" cy="33" r="9" fill="#222" stroke="#444" strokeWidth="1.5" />
            <circle cx="52" cy="33" r="4" fill="#111" />
            {/* Shutter button */}
            <circle cx="78" cy="33" r="6" fill="#2a2a2a" stroke="#555" strokeWidth="1" />
            {/* Grip texture hint */}
            <rect x="160" y="50" width="32" height="68" rx="6" fill="#111" />

            {/* Lens barrel */}
            <circle cx="95" cy="84" r="48" fill="#0d0d0d" stroke="#333" strokeWidth="3" />
            <circle cx="95" cy="84" r="40" fill="#151515" stroke="#2a2a2a" strokeWidth="2" />

            {/* Aperture ring (the blinking part) */}
            <g ref={apertureRef}>
              <circle
                cx="95"
                cy="84"
                r="32"
                fill="none"
                stroke="#c5a880"
                strokeWidth="4"
                strokeDasharray="8 6"
              />
              <circle cx="95" cy="84" r="26" fill="none" stroke="#c5a880" strokeWidth="1.5" opacity="0.6" />
              {/* Aperture blades suggestion */}
              <circle cx="95" cy="84" r="18" fill="#0a0a0a" stroke="#c5a880" strokeWidth="1.2" />
              <path
                d="M95 66 L102 84 L95 102 L88 84 Z"
                fill="#c5a880"
                opacity="0.35"
              />
              <path
                d="M77 84 L95 91 L113 84 L95 77 Z"
                fill="#c5a880"
                opacity="0.25"
              />
            </g>

            {/* Small Sony-style badge */}
            <text
              x="155"
              y="72"
              fill="#666"
              fontSize="9"
              fontFamily="system-ui, sans-serif"
              letterSpacing="1"
            >
              α
            </text>
          </svg>
        </div>

        {/* Bold PICSDOM text */}
        <div
          ref={brandRef}
          className="flex items-center justify-center select-none"
          style={{ perspective: "600px" }}
        >
          {brand.split("").map((letter, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              className="inline-block font-sans text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white"
              style={{
                textShadow: "0 0 40px rgba(197,168,128,0.45), 0 4px 20px rgba(0,0,0,0.5)",
                letterSpacing: "-0.02em",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Tiny gold underline that appears with brand */}
        <div className="mt-4 h-px w-32 bg-linear-to-r from-transparent via-gold to-transparent opacity-80" />
      </div>
    </div>
  );
}
