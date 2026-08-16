import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SplashScreen({ onFinish }) {
  const rootRef = useRef(null);
  const cameraRef = useRef(null);
  const apertureRef = useRef(null);
  const brandRef = useRef(null);
  const lettersRef = useRef([]);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(0.2, onFinish);
        },
      });

      // Initial states
      gsap.set(cameraRef.current, {
        scale: 0.25,
        opacity: 0,
        y: 60,
        rotate: -12,
        filter: "blur(8px)",
      });
      gsap.set(apertureRef.current, { scale: 0.6, opacity: 0, rotate: -90 });
      gsap.set(brandRef.current, { opacity: 0 });
      gsap.set(lettersRef.current, {
        y: 120,
        opacity: 0,
        scale: 0.2,
        rotateX: 40,
      });
      gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });

      // 1. Camera flies in with heavy ease
      tl.to(cameraRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        rotate: 0,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power4.out",
      });

      // 2. Aperture ring pops + rotates into place
      tl.to(
        apertureRef.current,
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.45,
          ease: "back.out(2.5)",
        },
        "-=0.55"
      );

      // Aperture blinks + subtle continuous spin while glowing
      tl.to(apertureRef.current, {
        filter:
          "drop-shadow(0 0 22px #c5a880) drop-shadow(0 0 10px #c5a880) drop-shadow(0 0 4px #fff)",
        duration: 0.18,
        yoyo: true,
        repeat: 7,
        ease: "power1.inOut",
      });

      // Keep a slow rotate on the aperture during blinks
      tl.to(
        apertureRef.current,
        {
          rotate: 360,
          duration: 2.2,
          ease: "none",
        },
        "-=1.6"
      );

      // 3. PICSDOM letters explode out — big, bold, heavy
      tl.to(
        brandRef.current,
        {
          opacity: 1,
          duration: 0.05,
        },
        "-=0.4"
      );

      tl.to(
        lettersRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.07,
          ease: "back.out(2.2)",
        },
        "-=0.15"
      );

      // Extra heavy punch: overscale + settle
      tl.to(
        brandRef.current,
        {
          scale: 1.15,
          duration: 0.28,
          ease: "power3.out",
        },
        "-=0.35"
      ).to(brandRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
      });

      // Gold line expands under brand
      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.5"
      );

      // 4. Hold then elegant fade out
      tl.to(
        rootRef.current,
        {
          opacity: 0,
          scale: 1.06,
          duration: 0.6,
          ease: "power2.inOut",
          delay: 0.55,
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
      <div className="absolute h-96 w-96 rounded-full bg-gold/20 blur-3xl pointer-events-none animate-pulse" />

      {/* Camera + Brand container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Stylized Sony M5-style mirrorless body */}
        <div ref={cameraRef} className="relative mb-12">
          <svg
            width="240"
            height="160"
            viewBox="0 0 240 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_16px_50px_rgba(0,0,0,0.7)]"
          >
            {/* Body */}
            <rect
              x="20"
              y="42"
              width="200"
              height="100"
              rx="16"
              fill="#1a1a1a"
              stroke="#333"
              strokeWidth="2.5"
            />
            {/* Top plate */}
            <rect
              x="42"
              y="24"
              width="110"
              height="24"
              rx="7"
              fill="#141414"
              stroke="#2a2a2a"
              strokeWidth="1.5"
            />
            {/* Mode dial */}
            <circle cx="56" cy="36" r="10" fill="#222" stroke="#444" strokeWidth="1.5" />
            <circle cx="56" cy="36" r="4.5" fill="#111" />
            {/* Shutter button */}
            <circle cx="84" cy="36" r="7" fill="#2a2a2a" stroke="#555" strokeWidth="1.2" />
            {/* Grip */}
            <rect x="175" y="55" width="35" height="75" rx="7" fill="#111" />

            {/* Lens barrel */}
            <circle cx="105" cy="92" r="52" fill="#0d0d0d" stroke="#333" strokeWidth="3.5" />
            <circle cx="105" cy="92" r="43" fill="#151515" stroke="#2a2a2a" strokeWidth="2" />

            {/* Aperture ring (blinking + rotating part) */}
            <g ref={apertureRef} style={{ transformOrigin: "105px 92px" }}>
              <circle
                cx="105"
                cy="92"
                r="35"
                fill="none"
                stroke="#c5a880"
                strokeWidth="5"
                strokeDasharray="10 7"
              />
              <circle
                cx="105"
                cy="92"
                r="28"
                fill="none"
                stroke="#c5a880"
                strokeWidth="1.8"
                opacity="0.7"
              />
              {/* Aperture blades */}
              <circle cx="105" cy="92" r="20" fill="#0a0a0a" stroke="#c5a880" strokeWidth="1.4" />
              <path
                d="M105 72 L113 92 L105 112 L97 92 Z"
                fill="#c5a880"
                opacity="0.4"
              />
              <path
                d="M85 92 L105 100 L125 92 L105 84 Z"
                fill="#c5a880"
                opacity="0.3"
              />
            </g>

            {/* Sony α M5 badge */}
            <text
              x="168"
              y="78"
              fill="#888"
              fontSize="11"
              fontFamily="system-ui, sans-serif"
              letterSpacing="1.5"
              fontWeight="500"
            >
              α M5
            </text>
          </svg>
        </div>

        {/* Bold PICSDOM text — heavy & large */}
        <div
          ref={brandRef}
          className="flex items-center justify-center select-none"
          style={{ perspective: "800px" }}
        >
          {brand.split("").map((letter, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              className="inline-block font-sans text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white"
              style={{
                textShadow:
                  "0 0 50px rgba(197,168,128,0.55), 0 0 20px rgba(197,168,128,0.3), 0 6px 30px rgba(0,0,0,0.6)",
                letterSpacing: "-0.03em",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Gold underline */}
        <div
          ref={lineRef}
          className="mt-5 h-[2px] w-40 origin-center bg-linear-to-r from-transparent via-gold to-transparent"
        />
      </div>
    </div>
  );
}
