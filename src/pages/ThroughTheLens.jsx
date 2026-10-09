import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMessageCircle,
  FiCompass,
  FiCamera,
  FiEdit3,
  FiGift,
  FiArrowRight,
  FiPlay,
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

const REEL_VIDEOS = [
  { id: "reel-1", title: "Sacred Moments", src: "/reels/reel-1.mp4" },
  { id: "reel-2", title: "Royal Procession", src: "/reels/reel-2.mp4" },
  { id: "reel-3", title: "Heritage Frames", src: "/reels/reel-3.mp4" },
  { id: "reel-4", title: "Timeless Legacy", src: "/reels/reel-4.mp4" },
];

function VideoCard({ video, index }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const toggle = () => {
    const el = videoRef.current;
    if (!el || failed) return;
    if (el.paused) {
      el.play().catch(() => setFailed(true));
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="reel-card group relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-black">
      {!failed ? (
        <video
          ref={videoRef}
          src={video.src}
          playsInline
          loop
          muted
          preload="metadata"
          className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-125"
          onError={() => setFailed(true)}
          onEnded={() => setPlaying(false)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0c0c0c] px-4 text-center">
          <FiPlay size={28} className="text-gold/50" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Video pending</p>
        </div>
      )}
      {!failed && (
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/25 transition-all duration-500 group-hover:bg-black/40"
          aria-label={playing ? "Pause" : "Play"}
        >
          {!playing && (
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-black/60 text-white backdrop-blur-md transition-all duration-500 group-hover:scale-125 group-hover:border-gold/60 group-hover:shadow-[0_0_40px_rgba(197,168,128,0.4)]">
              <FiPlay size={24} className="ml-1" />
            </span>
          )}
        </button>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/60 to-transparent px-4 pb-5 pt-16">
        <p className="text-[10px] uppercase tracking-[0.35em] text-gold/80">
          {String(index + 1).padStart(2, "0")}
        </p>
        <p className="mt-1.5 font-serif text-base tracking-wide text-white">{video.title}</p>
      </div>
    </div>
  );
}

export default function ThroughTheLens() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const progressLabelRef = useRef(null);
  const apertureRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      /* ── APERTURE OPEN (correct: start full black, open to reveal, then hide) ── */
      if (apertureRef.current) {
        gsap
          .timeline()
          .fromTo(
            apertureRef.current,
            { clipPath: "circle(150% at 50% 50%)" },
            {
              clipPath: "circle(0% at 50% 50%)",
              duration: 1.6,
              ease: "power3.inOut",
            }
          )
          .set(apertureRef.current, { display: "none" });
      }

      /* ── HERO ENTRANCE ── */
      const heroTl = gsap.timeline({ delay: 0.4 });
      heroTl
        .from(".hero-label", {
          y: 40,
          opacity: 0,
          filter: "blur(12px)",
          duration: 1.2,
          ease: "power4.out",
        })
        .from(
          ".hero-title-line",
          {
            y: 100,
            opacity: 0,
            filter: "blur(16px)",
            duration: 1.4,
            stagger: 0.18,
            ease: "power4.out",
          },
          "-=0.7"
        )
        .from(
          ".hero-sub",
          {
            y: 30,
            opacity: 0,
            filter: "blur(8px)",
            duration: 1.1,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .from(
          ".hero-dots span",
          {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: "back.out(3)",
          },
          "-=0.5"
        );

      /* ── HERO SCRUB OUT ── */
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          scale: 0.82,
          opacity: 0.25,
          filter: "blur(10px)",
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.4,
          },
        });
      }

      /* ── PINNED HORIZONTAL SCROLL (desktop) ── */
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const pin = pinRef.current;
        if (!track || !pin) return;

        const getTotal = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -getTotal(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${getTotal() * 1.35}`,
            scrub: 1.15,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                steps.length - 1,
                Math.floor(self.progress * steps.length)
              );
              setActiveStep(idx);
              if (progressRef.current) {
                progressRef.current.style.width = `${self.progress * 100}%`;
              }
              if (progressLabelRef.current) {
                progressLabelRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / 0${steps.length}`;
              }
            },
          },
        });

        gsap.utils.toArray(".h-panel").forEach((panel) => {
          const card = panel.querySelector(".h-card");
          if (card) {
            gsap.fromTo(
              card,
              { y: 60, opacity: 0.4, scale: 0.92 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: undefined,
                  start: "left 80%",
                  end: "left 40%",
                  scrub: 1,
                  horizontal: true,
                },
              }
            );
          }
        });
      });

      /* ── MOBILE vertical ── */
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray(".m-step").forEach((el) => {
          const card = el.querySelector(".m-card");
          if (!card) return;
          gsap.fromTo(
            card,
            { y: 100, opacity: 0, scale: 0.9, filter: "blur(14px)" },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.2,
              ease: "power4.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      });

      /* ── REELS ── */
      gsap.from(".reel-card", {
        y: 100,
        opacity: 0,
        scale: 0.85,
        filter: "blur(12px)",
        duration: 1.25,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".reels-section",
          start: "top 82%",
        },
      });

      gsap.from(".reels-heading > *", {
        y: 40,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".reels-section",
          start: "top 85%",
        },
      });

      /* ── CTA ── */
      gsap.from(".cta-el", {
        y: 60,
        opacity: 0,
        scale: 0.94,
        filter: "blur(12px)",
        duration: 1.25,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative w-full overflow-x-hidden bg-[#030303] text-white">
      {/* Aperture veil — starts covering, opens, then removed */}
      <div
        ref={apertureRef}
        className="pointer-events-none fixed inset-0 z-[100] bg-black"
        style={{ clipPath: "circle(150% at 50% 50%)" }}
      />

      {/* Progress bar */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 hidden h-[2px] bg-white/5 md:block">
        <div
          ref={progressRef}
          className="h-full bg-gold"
          style={{ width: "0%" }}
        />
      </div>

      {/* Floating counter */}
      <div className="pointer-events-none fixed bottom-8 right-6 z-50 hidden md:block">
        <div className="rounded-full border border-gold/25 bg-black/70 px-5 py-2.5 backdrop-blur-xl">
          <span
            ref={progressLabelRef}
            className="font-mono text-[11px] tracking-[0.3em] text-gold"
          >
            01 / 05
          </span>
        </div>
      </div>

      {/* ════════ HERO ════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center will-change-transform"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.14)_0%,transparent_55%)]" />

        <p className="hero-label relative z-10 mb-6 text-[11px] uppercase tracking-[0.55em] text-gold/80">
          Process · Through the Lens
        </p>

        <div className="relative z-10 overflow-hidden">
          <h1 className="hero-title-line font-serif text-4xl font-light uppercase leading-[1.15] tracking-[0.12em] sm:text-5xl md:text-6xl lg:text-7xl">
            From first conversation
          </h1>
        </div>
        <div className="relative z-10 overflow-hidden">
          <h1 className="hero-title-line mt-2 font-serif text-4xl font-light uppercase leading-[1.15] tracking-[0.12em] sm:text-5xl md:text-6xl lg:text-7xl">
            to{" "}
            <span className="font-semibold italic text-gold">lasting legacy</span>
          </h1>
        </div>

        <p className="hero-sub relative z-10 mx-auto mt-10 max-w-lg text-sm leading-8 tracking-wide text-white/50 font-light">
          Five stages. Every frame intentional. Scroll to enter the process.
        </p>

        <div className="hero-dots relative z-10 mt-16 flex items-center gap-2.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`block h-1.5 rounded-full transition-all duration-700 ${
                i === activeStep
                  ? "w-10 bg-gold shadow-[0_0_16px_rgba(197,168,128,0.6)]"
                  : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <span className="text-[9px] uppercase tracking-[0.4em]">Scroll</span>
            <div className="h-8 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
          </div>
        </div>
      </section>

      {/* ════════ PINNED HORIZONTAL (desktop) ════════ */}
      <section ref={pinRef} className="relative hidden md:block">
        <div
          ref={trackRef}
          className="flex h-screen will-change-transform"
          style={{ width: `${steps.length * 100}vw` }}
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="h-panel relative flex h-full w-screen flex-shrink-0 items-center justify-center px-12 lg:px-20"
              >
                <span className="pointer-events-none absolute font-serif text-[22vw] font-light leading-none text-white/[0.06] select-none">
                  {step.num}
                </span>

                <div className="h-card relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.045] p-10 lg:p-12 backdrop-blur-xl">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                    <Icon size={26} className="text-gold" />
                  </div>

                  <p className="font-mono text-xs tracking-[0.35em] text-gold/70">
                    {step.num}
                  </p>
                  <h2 className="mt-3 font-serif text-3xl font-light tracking-[0.08em] text-white lg:text-4xl">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.3em] text-gold/50">
                    {step.subtitle}
                  </p>

                  <div className="mt-6 h-px w-20 bg-gradient-to-r from-gold to-transparent" />

                  <p className="mt-6 text-[15px] leading-8 tracking-wide text-white/55 font-light">
                    {step.copy}
                  </p>
                  <p className="mt-8 text-[11px] uppercase tracking-[0.35em] text-gold/40">
                    {step.accent}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════ MOBILE vertical ════════ */}
      <section className="relative px-5 pb-24 pt-8 md:hidden">
        <div className="space-y-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="m-step">
                <div className="m-card rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <span className="font-mono text-xs tracking-widest text-gold/70">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-light tracking-wide text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-gold/50">
                    {step.subtitle}
                  </p>
                  <div className="mt-4 h-px w-12 bg-gold/40" />
                  <p className="mt-4 text-sm leading-7 text-white/50 font-light">
                    {step.copy}
                  </p>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-gold/35">
                    {step.accent}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════════ REELS ════════ */}
      <section className="reels-section relative border-t border-white/8 bg-[#06040a] px-6 py-32 md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(90,40,110,0.2)_0%,transparent_50%)]" />

        <div className="reels-heading relative z-10 mx-auto mb-20 max-w-3xl text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.5em] text-gold/70">Films</p>
          <h2 className="font-serif text-4xl font-light uppercase tracking-[0.12em] text-white md:text-5xl">
            Through the <span className="font-semibold italic text-gold">Lens</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm text-white/40 font-light">
            Short films from recent celebrations — played on-site.
          </p>
        </div>

        <div className="relative z-10 mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REEL_VIDEOS.map((v, i) => (
            <VideoCard key={v.id} video={v} index={i} />
          ))}
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="cta-section relative border-t border-gold/10 px-6 py-36 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.12),transparent_50%)]" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="cta-el text-[11px] uppercase tracking-[0.5em] text-gold/80">
            Ready when you are
          </p>
          <h2 className="cta-el mt-6 font-serif text-4xl font-light tracking-[0.1em] md:text-5xl">
            Let's begin your{" "}
            <span className="font-semibold italic text-gold">archive</span>
          </h2>

          <div className="cta-el mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex h-14 w-60 items-center justify-center gap-3 bg-gold text-[12px] font-semibold uppercase tracking-[0.25em] text-black transition-all duration-500 hover:bg-gold-hover hover:shadow-[0_0_50px_rgba(197,168,128,0.45)]"
            >
              <span>Start Inquiry</span>
              <FiArrowRight
                size={16}
                className="transition-transform duration-500 group-hover:translate-x-1.5"
              />
            </Link>
            <Link
              to="/gallery"
              className="inline-flex h-14 w-60 items-center justify-center border border-white/20 bg-white/5 text-[12px] font-semibold uppercase tracking-[0.25em] text-white transition-all duration-500 hover:border-white/50 hover:bg-white/10"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
