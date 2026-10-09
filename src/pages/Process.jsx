import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiMessageCircle,
  FiCompass,
  FiCamera,
  FiEdit3,
  FiGift,
  FiArrowRight,
} from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    icon: FiMessageCircle,
    title: "Inquiry & Vision",
    subtitle: "The first conversation",
    copy: "Share your date, venue, and the feeling you want preserved. We listen closely — culture, family dynamics, and the quiet moments that matter most — then craft a tailored proposal.",
  },
  {
    num: "02",
    icon: FiCompass,
    title: "Planning & Blueprint",
    subtitle: "Shot list · Timeline · Style",
    copy: "Together we map the day: rituals, light windows, family portraits, and candid windows. You receive a clear timeline and creative direction so nothing sacred is rushed or missed.",
  },
  {
    num: "03",
    icon: FiCamera,
    title: "The Shoot Day",
    subtitle: "Presence over performance",
    copy: "Our team moves with the energy of the celebration — discrete, anticipatory, and fully present. From baraat to pheras to the last quiet glance, every frame is intentional.",
  },
  {
    num: "04",
    icon: FiEdit3,
    title: "Curation & Craft",
    subtitle: "Select · Grade · Refine",
    copy: "Every image is reviewed by hand. Colour, tone, and emotion are refined to honour your heritage palette. You receive a private gallery of the strongest frames — never a dump of thousands.",
  },
  {
    num: "05",
    icon: FiGift,
    title: "Delivery & Archive",
    subtitle: "Heirlooms for generations",
    copy: "High-resolution files, a curated online gallery, and optional fine-art prints or albums. Your story is archived so it can be revisited — and passed on — for decades.",
  },
];

export default function Process() {
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(".process-hero-el", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.15,
      });

      // Vertical progress line fill on scroll
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".workflow-track",
              start: "top 60%",
              end: "bottom 40%",
              scrub: 0.6,
            },
          }
        );
      }

      // Each step reveal
      stepsRef.current.forEach((el, i) => {
        if (!el) return;
        const isLeft = i % 2 === 0;

        gsap.from(el.querySelector(".step-card"), {
          x: isLeft ? -60 : 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });

        gsap.from(el.querySelector(".step-node"), {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.8)",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });
      });

      // CTA section
      gsap.from(".process-cta-el", {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".process-cta",
          start: "top 80%",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative w-full overflow-x-hidden bg-[#050505] text-white">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 pb-20 pt-32 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.08),transparent_65%)]" />

        <span className="process-hero-el relative z-10 mb-5 block text-[10px] uppercase tracking-[0.45em] text-gold/80">
          How we work
        </span>
        <h1 className="process-hero-el relative z-10 max-w-4xl font-serif text-4xl font-light uppercase leading-tight tracking-[0.12em] sm:text-5xl md:text-6xl">
          From first conversation
          <br />
          to{" "}
          <span className="font-semibold italic text-gold">lasting legacy</span>
        </h1>
        <p className="process-hero-el relative z-10 mx-auto mt-8 max-w-xl text-sm leading-8 tracking-wide text-white/55 font-light">
          A clear, considered path — so you can be fully present on your day while we
          archive every sacred moment with intention.
        </p>
      </section>

      {/* ── Workflow track ── */}
      <section className="workflow-track relative mx-auto max-w-5xl px-6 pb-32 md:px-12">
        {/* Center line (desktop) */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/10 md:block">
          <div
            ref={lineRef}
            className="origin-top h-full w-full bg-gradient-to-b from-gold via-gold/70 to-gold/20"
            style={{ transform: "scaleY(0)" }}
          />
        </div>

        <div className="space-y-16 md:space-y-28">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isLeft = i % 2 === 0;

            return (
              <div
                key={step.num}
                ref={(el) => (stepsRef.current[i] = el)}
                className={`relative flex flex-col items-center md:flex-row ${
                  isLeft ? "md:justify-start" : "md:justify-end"
                }`}
              >
                {/* Node on center line */}
                <div className="step-node absolute left-1/2 top-0 z-20 hidden -translate-x-1/2 md:flex">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-[#0a0a0a] shadow-[0_0_24px_rgba(197,168,128,0.25)]">
                    <Icon size={18} className="text-gold" />
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`step-card relative w-full max-w-md rounded-2xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-sm transition-colors duration-300 hover:border-gold/25 hover:bg-white/[0.05] md:w-[42%] ${
                    isLeft ? "md:mr-auto md:pr-4" : "md:ml-auto md:pl-4"
                  }`}
                >
                  {/* Mobile icon */}
                  <div className="mb-5 flex items-center gap-4 md:hidden">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                      <Icon size={16} className="text-gold" />
                    </div>
                    <span className="font-mono text-xs tracking-widest text-gold/70">
                      {step.num}
                    </span>
                  </div>

                  <div className="mb-1 hidden items-center justify-between md:flex">
                    <span className="font-mono text-xs tracking-widest text-gold/70">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="mt-2 font-serif text-2xl font-light tracking-[0.08em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-gold/60">
                    {step.subtitle}
                  </p>
                  <p className="mt-5 text-sm leading-7 tracking-wide text-white/50 font-light">
                    {step.copy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="process-cta relative border-t border-gold/10 bg-[#050505] px-6 py-24 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.06),transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="process-cta-el block text-[10px] uppercase tracking-[0.4em] text-gold/80">
            Ready when you are
          </span>
          <h2 className="process-cta-el mt-4 font-serif text-3xl font-light tracking-[0.1em] sm:text-4xl">
            Let's begin your{" "}
            <span className="font-semibold italic text-gold">archive</span>
          </h2>
          <p className="process-cta-el mx-auto mt-6 max-w-md text-sm leading-7 text-white/50 font-light">
            Share your date and a few details. We'll reply with availability and a
            thoughtful next step.
          </p>

          <div className="process-cta-el mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex h-12 w-52 items-center justify-center gap-3 bg-gold px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-gold-hover"
            >
              <span>Start Inquiry</span>
              <FiArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              to="/gallery"
              className="inline-flex h-12 w-52 items-center justify-center border border-white/25 bg-white/5 px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
