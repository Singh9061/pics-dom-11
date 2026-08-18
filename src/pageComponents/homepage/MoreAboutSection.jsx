import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const studioStats = [
  { value: "08+", label: "Years of Legacy" },
  { value: "250+", label: "Weddings Documented" },
  { value: "15+", label: "Palaces & Destinations" },
];

export default function MoreAboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });

      gsap.from(".stat-item", {
        y: 30,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: ".stat-grid",
          start: "top 90%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full border-t border-white/10 bg-[#050505] px-6 py-24 md:px-12 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <span className="about-reveal mb-4 block text-xs uppercase tracking-[0.3em] text-gold/70">
              The Heritage Philosophy
            </span>

            <h2 className="about-reveal mb-8 font-serif text-3xl font-light uppercase leading-tight tracking-[0.12em] text-white sm:text-4xl md:text-5xl">
              Documenting sacred traditions, <br />
              capturing{" "}
              <span className="font-semibold italic text-gold">raw emotion</span>.
            </h2>

            <blockquote className="about-reveal max-w-2xl border-l-2 border-gold/40 pl-6 font-serif text-lg italic leading-relaxed text-white/50">
              "A wedding isn't just a fleeting event; it is the breathtaking
              convergence of heritage, families, and two souls. We don't just
              take pictures—we archive your legacy."
            </blockquote>

            <div className="about-reveal mt-10">
              <Link
                to="/about"
                className="group inline-flex h-12 items-center gap-4 border border-gold/40 bg-transparent px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-gold hover:bg-gold hover:text-black"
              >
                <span>Discover Our Journey</span>
                <FiArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          <div className="flex h-full flex-col justify-between pt-2 lg:col-span-5 lg:pt-12">
            <p className="about-reveal mb-12 text-sm leading-7 tracking-wide text-white/45 lg:mb-16">
              Founded on the belief that pristine Indian wedding imagery requires
              deep cultural intuition and technical mastery, our studio serves as
              a fine-art haven for royal palace unions, intimate heritage
              elopements, and cinematic portraiture. We craft custom-tailored
              visual narratives that honor your family's grandest celebrations.
            </p>

            <div className="stat-grid grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {studioStats.map(({ value, label }) => (
                <div key={label} className="stat-item text-center sm:text-left">
                  <div className="font-serif text-2xl font-light tracking-wide text-white sm:text-3xl md:text-4xl">
                    {value}
                  </div>
                  <div className="mt-2 text-[10px] uppercase leading-normal tracking-widest text-gold/70">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
