import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { herosection_video } from "../../Assets/video";

export default function HeroSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative flex h-screen w-full items-end justify-center overflow-hidden bg-black transform-gpu">
      {/* Full-bleed video — no darkening / blur so footage stays clear */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=60"
          className="h-full w-full object-cover"
          src={herosection_video}
        />
      </div>

      {/* Soft gradient only at bottom — keeps most of the video fully visible */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[42%] bg-linear-to-t from-black/75 via-black/30 to-transparent" />

      {/* Minimal bottom content */}
      <div className="relative z-20 mx-auto w-full max-w-4xl px-6 pb-16 pt-10 text-center text-white md:pb-20">
        <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-white/70 sm:text-xs">
          Luxury Wedding & Heritage Photography · Raebareli
        </p>

        <h1 className="font-serif text-3xl font-light uppercase tracking-[0.18em] text-white sm:text-4xl md:text-5xl">
          Timeless{" "}
          <span className="font-semibold italic tracking-[0.12em] text-gold">
            Legacies
          </span>
        </h1>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/gallery"
            className="flex h-11 items-center justify-center bg-gold px-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-gold-hover w-48 sm:w-auto"
          >
            View Gallery
          </Link>
          <Link
            to="/contact"
            className="flex h-11 items-center justify-center border border-white/40 bg-white/10 px-7 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/20 w-48 sm:w-auto"
          >
            Reserve Date
          </Link>
        </div>

        <div className="mt-8 flex justify-center text-white/40">
          <FiChevronDown size={16} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
}
