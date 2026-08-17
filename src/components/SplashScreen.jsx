import React, { useEffect, useRef, useState, Component } from "react";
import gsap from "gsap";
import Camera3D from "./Camera3D";

/** Catches 3D/WebGL crashes so the rest of the site still loads */
class CameraErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("Camera3D crashed:", error);
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-[300px] h-[240px] sm:w-[400px] sm:h-[310px] md:w-[480px] md:h-[360px] flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-gold/40 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border border-gold/60" />
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function SplashScreen({ onFinish }) {
  const rootRef = useRef(null);
  const flashRef = useRef(null);
  const brandRef = useRef(null);
  const subRef = useRef(null);
  const lineRef = useRef(null);
  const camContainerRef = useRef(null);
  const [camReady, setCamReady] = useState(false);
  const hasPlayed = useRef(false);
  const finished = useRef(false);

  const safeFinish = () => {
    if (finished.current) return;
    finished.current = true;
    try {
      onFinish?.();
    } catch (_) {}
  };

  const playShutter = () => {
    try {
      const audio = new Audio(
        "https://orangefreesounds.com/wp-content/uploads/2022/03/Camera-sound.mp3"
      );
      audio.volume = 0.6;
      audio.play().catch(() => {});
    } catch (e) {
      // silent fail
    }
  };

  // Absolute fail-safe: never leave user on blank splash forever
  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasPlayed.current) {
        hasPlayed.current = true;
        safeFinish();
      }
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!camReady || hasPlayed.current) return;
    hasPlayed.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.delayedCall(0.35, safeFinish);
        },
      });

      if (flashRef.current) gsap.set(flashRef.current, { opacity: 0 });
      if (brandRef.current) gsap.set(brandRef.current, { opacity: 0, y: 60, scale: 0.85 });
      if (subRef.current) gsap.set(subRef.current, { opacity: 0, y: 20 });
      if (lineRef.current) gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
      if (camContainerRef.current) gsap.set(camContainerRef.current, { opacity: 1 });

      tl.to({}, { duration: 0.35 });

      tl.add(() => playShutter());
      if (flashRef.current) {
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
      }

      if (brandRef.current) {
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
      }

      if (lineRef.current) {
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
      }

      if (subRef.current) {
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
      }

      if (rootRef.current) {
        tl.to(rootRef.current, {
          opacity: 0,
          scale: 1.02,
          duration: 0.7,
          ease: "power2.inOut",
          delay: 1.1,
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [camReady]);

  const markReady = () => setCamReady(true);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black overflow-hidden"
      style={{ perspective: "1400px" }}
    >
      <div className="absolute h-[520px] w-[520px] rounded-full bg-gold/15 blur-3xl pointer-events-none" />

      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-50 bg-white"
      />

      <div className="relative z-10 flex flex-col items-center px-4">
        <div
          ref={camContainerRef}
          className="mb-6 sm:mb-8 flex items-center justify-center"
        >
          <CameraErrorBoundary onError={markReady}>
            <Camera3D onReady={markReady} />
          </CameraErrorBoundary>
        </div>

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
