import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import LensHero from "../pageComponents/homepage/LensHero";

export default function ThroughTheLens() {
  return (
    <div className="relative w-full bg-[#050505] text-white overflow-x-hidden">
      {/* Immersive 3D lens scroll experience */}
      <LensHero />

      {/* Closing narrative + CTAs */}
      <section className="relative border-t border-gold/10 bg-[#050505] px-6 py-24 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.07),transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="block text-[10px] uppercase tracking-[0.4em] text-gold/80">
            Through the Lens
          </span>
          <h2 className="mt-4 font-serif text-3xl font-light tracking-[0.12em] sm:text-4xl md:text-5xl">
            Every frame is a{" "}
            <span className="font-semibold italic text-gold">legacy</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 tracking-wide text-white/60 font-light">
            Step beyond the glass. Our lens captures the quiet glances, sacred
            rituals, and unscripted joy that turn a wedding day into an heirloom
            archive — preserved for generations.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/gallery"
              className="group inline-flex h-12 w-52 items-center justify-center gap-3 bg-gold px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-gold-hover"
            >
              <span>View Archives</span>
              <FiArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-12 w-52 items-center justify-center border border-white/25 bg-white/5 px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Reserve Date
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
