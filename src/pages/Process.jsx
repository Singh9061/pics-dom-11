import { useEffect, useRef, useState } from "react";
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
    accent: "Listen · Propose · Align",
  },
  {
    num: "02",
    icon: FiCompass,
    title: "Planning & Blueprint",
    subtitle: "Shot list · Timeline · Style",
    copy: "Together we map the day: rituals, light windows, family portraits, and candid windows. You receive a clear timeline and creative direction so nothing sacred is rushed or missed.",
    accent: "Map · Schedule · Direct",
  },
  {
    num: "03",
    icon: FiCamera,
    title: "The Shoot Day",
    subtitle: "Presence over performance",
    copy: "Our team moves with the energy of the celebration — discrete, anticipatory, and fully present. From baraat to pheras to the last quiet glance, every frame is intentional.",
    accent: "Anticipate · Capture · Honour",
  },
  {
    num: "04",
    icon: FiEdit3,
    title: "Curation & Craft",
    subtitle: "Select · Grade · Refine",
    copy: "Every image is reviewed by hand. Colour, tone, and emotion are refined to honour your heritage palette. You receive a private gallery of the strongest frames — never a dump of thousands.",
    accent: "Select · Grade · Polish",
  },
  {
    num: "05",
    icon: FiGift,
    title: "Delivery & Archive",
    subtitle: "Heirlooms for generations",
    copy: "High-resolution files, a curated online gallery, and optional fine-art prints or albums. Your story is archived so it can be revisited — and passed on — for decades.",
    accent: "Deliver · Archive · Legacy",
  },
];

export default function Process() {
  const rootRef = useRef(null);
  const lineFillRef = useRef(null);
  const stepsRef = useRef([]);
  const progressLabelRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop } = context.conditions;

        // ── Hero entrance (Process page hero only — not site homepage) ──
        gsap.from(".process-hero-el", {
          y: 50,
          opacity: 0,
          filter: "blur(8px)",
          duration: 1.15,
          stagger: 0.14,
          ease: "power3.out",
          delay: 0.1,
        });

        // ── Progress line + active step tracking ──
        if (lineFillRef.current) {
          gsap.fromTo(
            lineFillRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".workflow-track",
                start: "top 55%",
                end: "bottom 35%",
                scrub: 0.8,
                onUpdate: (self) => {
                  const idx = Math.min(
                    steps.length - 1,
                    Math.floor(self.progress * steps.length)
                  );
                  setActiveStep(idx);
                  if (progressLabelRef.current) {
                    progressLabelRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
                  }
                },
              },
            }
          );
        }

        // ── Each step: heavy reveal ──
        stepsRef.current.forEach((el, i) => {
          if (!el) return;
          const isLeft = i % 2 === 0;
          const card = el.querySelector(".step-card");
          const node = el.querySelector(".step-node");
          const numEl = el.querySelector(".step-num");
          const bar = el.querySelector(".step-accent-bar");
          const glow = el.querySelector(".step-glow");

          // Card: slide + blur + slight rotate
          if (card) {
            gsap.fromTo(
              card,
              {
                x: isDesktop ? (isLeft ? -100 : 100) : 0,
                y: isDesktop ? 0 : 60,
                opacity: 0,
                filter: "blur(12px)",
                rotateY: isDesktop ? (isLeft ? -8 : 8) : 0,
              },
              {
                x: 0,
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                rotateY: 0,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 82%",
                  toggleActions: "play none none none",
                },
              }
            );
          }

          // Node: scale burst + pulse ring
          if (node) {
            gsap.fromTo(
              node,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.65,
                ease: "back.out(2.2)",
                scrollTrigger: {
                  trigger: el,
                  start: "top 82%",
                  toggleActions: "play none none none",
                },
              }
            );
          }

          // Giant number fade
          if (numEl) {
            gsap.fromTo(
              numEl,
              { opacity: 0, y: 30, scale: 0.85 },
              {
                opacity: 0.07,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                },
              }
            );
          }

          // Accent bar grow
          if (bar) {
            gsap.fromTo(
              bar,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.9,
                ease: "power3.out",
                delay: 0.25,
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                },
              }
            );
          }

          // Soft glow pulse when in view
          if (glow) {
            gsap.fromTo(
              glow,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                  trigger: el,
                  start: "top 70%",
                  end: "bottom 40%",
                  toggleActions: "play reverse play reverse",
                },
              }
            );
          }
        });

        // ── CTA ──
        gsap.from(".process-cta-el", {
          y: 40,
          opacity: 0,
          filter: "blur(6px)",
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-cta",
            start: "top 82%",
          },
        });
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-hidden bg-[#050505] text-white"
      style={{ perspective: "1200px" }}
    >
      {/* Floating progress HUD */}
      <div className="pointer-events-none fixed bottom-8 right-6 z-40 hidden md:block">
        <div className="rounded-full border border-gold/20 bg-black/60 px-4 py-2 backdrop-blur-md">
          <span
            ref={progressLabelRef}
            className="font-mono text-[10px] tracking-[0.25em] text-gold/80"
          >
            01 / 05
          </span>
        </div>
      </div>

      {/* ── Process page intro (not site hero) ── */}
      <section className="relative flex min-h-[72vh] flex-col items-center justify-center px-6 pb-24 pt-32 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.09),transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(197,168,128,0.6) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />

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

        {/* Mini step dots preview */}
        <div className="process-hero-el relative z-10 mt-14 flex items-center gap-3">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeStep ? "w-8 bg-gold" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Workflow track ── */}
      <section className="workflow-track relative mx-auto max-w-5xl px-6 pb-36 md:px-12">
        {/* Center spine */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/8 md:block">
          <div
            ref={lineFillRef}
            className="origin-top h-full w-full bg-gradient-to-b from-gold via-gold/60 to-transparent"
            style={{ transform: "scaleY(0)" }}
          />
        </div>

        <div className="space-y-20 md:space-y-32">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isLeft = i % 2 === 0;
            const isActive = activeStep === i;

            return (
              <div
                key={step.num}
                ref={(el) => (stepsRef.current[i] = el)}
                className={`relative flex flex-col items-center md:flex-row ${
                  isLeft ? "md:justify-start" : "md:justify-end"
                }`}
              >
                {/* Center node */}
                <div className="step-node absolute left-1/2 top-2 z-20 hidden -translate-x-1/2 md:flex">
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500 ${
                      isActive
                        ? "border-gold bg-gold/15 shadow-[0_0_40px_rgba(197,168,128,0.45)]"
                        : "border-gold/35 bg-[#0a0a0a] shadow-[0_0_20px_rgba(197,168,128,0.15)]"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-gold" : "text-gold/70"} />
                    {/* Pulse ring */}
                    <span
                      className={`absolute inset-0 rounded-full border border-gold/40 ${
                        isActive ? "animate-ping opacity-40" : "opacity-0"
                      }`}
                    />
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`step-card relative w-full max-w-md overflow-hidden rounded-2xl border p-8 backdrop-blur-sm transition-all duration-500 md:w-[44%] ${
                    isActive
                      ? "border-gold/35 bg-white/[0.06] shadow-[0_20px_60px_rgba(197,168,128,0.08)]"
                      : "border-white/8 bg-white/[0.03] hover:border-gold/20 hover:bg-white/[0.05]"
                  } ${
                    isLeft ? "md:mr-auto" : "md:ml-auto"
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Soft glow blob */}
                  <div
                    className="step-glow pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-3xl opacity-0"
                  />

                  {/* Giant watermark number */}
                  <span className="step-num pointer-events-none absolute -right-2 -top-4 font-serif text-[7rem] font-light leading-none text-white select-none">
                    {step.num}
                  </span>

                  {/* Mobile icon row */}
                  <div className="relative z-10 mb-5 flex items-center gap-4 md:hidden">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                      <Icon size={16} className="text-gold" />
                    </div>
                    <span className="font-mono text-xs tracking-widest text-gold/70">
                      {step.num}
                    </span>
                  </div>

                  <div className="relative z-10 mb-1 hidden md:block">
                    <span className="font-mono text-xs tracking-widest text-gold/70">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="relative z-10 mt-2 font-serif text-2xl font-light tracking-[0.08em] text-white md:text-[1.65rem]">
                    {step.title}
                  </h3>
                  <p className="relative z-10 mt-1 text-[11px] uppercase tracking-[0.25em] text-gold/60">
                    {step.subtitle}
                  </p>

                  {/* Accent grow bar */}
                  <div className="relative z-10 mt-5 h-px w-16 origin-left overflow-hidden bg-white/10">
                    <div className="step-accent-bar h-full w-full origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
                  </div>

                  <p className="relative z-10 mt-5 text-sm leading-7 tracking-wide text-white/50 font-light">
                    {step.copy}
                  </p>

                  <p className="relative z-10 mt-6 text-[10px] uppercase tracking-[0.3em] text-gold/40">
                    {step.accent}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="process-cta relative border-t border-gold/10 bg-[#050505] px-6 py-28 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.07),transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="process-cta-el block text-[10px] uppercase tracking-[0.4em] text-gold/80">
            Ready when you are
          </span>
          <h2 className="process-cta-el mt-4 font-serif text-3xl font-light tracking-[0.1em] sm:text-4xl md:text-5xl">
            Let's begin your{" "}
            <span className="font-semibold italic text-gold">archive</span>
          </h2>
          <p className="process-cta-el mx-auto mt-6 max-w-md text-sm leading-7 text-white/50 font-light">
            Share your date and a few details. We'll reply with availability and a
            thoughtful next step.
          </p>

          <div className="process-cta-el mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
