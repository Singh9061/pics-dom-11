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

/* Native site videos — drop files in src/Assets/video/reels/ and list here */
const REEL_VIDEOS = [
  {
    id: "reel-1",
    title: "Sacred Moments",
    src: "/reels/reel-1.mp4",
    poster: "",
  },
  {
    id: "reel-2",
    title: "Royal Procession",
    src: "/reels/reel-2.mp4",
    poster: "",
  },
  {
    id: "reel-3",
    title: "Heritage Frames",
    src: "/reels/reel-3.mp4",
    poster: "",
  },
  {
    id: "reel-4",
    title: "Timeless Legacy",
    src: "/reels/reel-4.mp4",
    poster: "",
  },
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
    <div className="reel-video-card group relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-black">
      {!failed ? (
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster || undefined}
          playsInline
          loop
          muted
          preload="metadata"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
          onEnded={() => setPlaying(false)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0c0c0c] px-4 text-center">
          <FiPlay size={28} className="text-gold/50" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
            Video pending upload
          </p>
          <p className="text-[9px] text-white/25">{video.src}</p>
        </div>
      )}

      {!failed && (
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/30"
          aria-label={playing ? "Pause" : "Play"}
        >
          {!playing && (
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur-sm transition-transform group-hover:scale-105">
              <FiPlay size={22} className="ml-0.5" />
            </span>
          )}
        </button>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">
          {String(index + 1).padStart(2, "0")}
        </p>
        <p className="mt-1 font-serif text-sm tracking-wide text-white/90">
          {video.title}
        </p>
      </div>
    </div>
  );
}

export default function ThroughTheLens() {
  const rootRef = useRef(null);
  const lineFillRef = useRef(null);
  const stepsRef = useRef([]);
  const progressLabelRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
      gsap.from(".ttl-hero-el", {
        y: 50,
        opacity: 0,
        filter: "blur(8px)",
        duration: 1.15,
        stagger: 0.14,
        ease: "power3.out",
        delay: 0.1,
      });

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

      stepsRef.current.forEach((el, i) => {
        if (!el) return;
        const isLeft = i % 2 === 0;
        const card = el.querySelector(".step-card");
        const node = el.querySelector(".step-node");
        const numEl = el.querySelector(".step-num");
        const bar = el.querySelector(".step-accent-bar");

        if (card) {
          gsap.fromTo(
            card,
            {
              x: window.innerWidth >= 768 ? (isLeft ? -100 : 100) : 0,
              y: window.innerWidth >= 768 ? 0 : 60,
              opacity: 0,
              filter: "blur(12px)",
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
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

        if (numEl) {
          gsap.fromTo(
            numEl,
            { opacity: 0, y: 30 },
            {
              opacity: 0.07,
              y: 0,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 80%" },
            }
          );
        }

        if (bar) {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.9,
              ease: "power3.out",
              delay: 0.25,
              scrollTrigger: { trigger: el, start: "top 80%" },
            }
          );
        }
      });

      gsap.from(".reel-video-card", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".reels-video-grid",
          start: "top 85%",
        },
      });

      gsap.from(".ttl-cta-el", {
        y: 40,
        opacity: 0,
        filter: "blur(6px)",
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ttl-cta",
          start: "top 82%",
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative w-full overflow-x-hidden bg-[#050505] text-white">
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

      {/* Intro */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 pb-20 pt-32 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.09),transparent_65%)]" />

        <span className="ttl-hero-el relative z-10 mb-5 block text-[10px] uppercase tracking-[0.45em] text-gold/80">
          Through the Lens
        </span>
        <h1 className="ttl-hero-el relative z-10 max-w-4xl font-serif text-4xl font-light uppercase leading-tight tracking-[0.12em] sm:text-5xl md:text-6xl">
          From first conversation
          <br />
          to{" "}
          <span className="font-semibold italic text-gold">lasting legacy</span>
        </h1>
        <p className="ttl-hero-el relative z-10 mx-auto mt-8 max-w-xl text-sm leading-8 tracking-wide text-white/55 font-light">
          Our process, our films — every frame intentional, every step considered.
        </p>

        <div className="ttl-hero-el relative z-10 mt-14 flex items-center gap-3">
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

      {/* Workflow */}
      <section className="workflow-track relative mx-auto max-w-5xl px-6 pb-28 md:px-12">
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
                <div className="step-node absolute left-1/2 top-2 z-20 hidden -translate-x-1/2 md:flex">
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500 ${
                      isActive
                        ? "border-gold bg-gold/15 shadow-[0_0_40px_rgba(197,168,128,0.45)]"
                        : "border-gold/35 bg-[#0a0a0a]"
                    }`}
                  >
                    <Icon size={20} className="text-gold" />
                    {isActive && (
                      <span className="absolute inset-0 animate-ping rounded-full border border-gold/40 opacity-40" />
                    )}
                  </div>
                </div>

                <div
                  className={`step-card relative w-full max-w-md overflow-hidden rounded-2xl border p-8 backdrop-blur-sm transition-all duration-500 md:w-[44%] ${
                    isActive
                      ? "border-gold/35 bg-white/[0.06]"
                      : "border-white/8 bg-white/[0.03]"
                  } ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}
                >
                  <span className="step-num pointer-events-none absolute -right-2 -top-4 font-serif text-[7rem] font-light leading-none text-white select-none">
                    {step.num}
                  </span>

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

                  <h3 className="relative z-10 mt-2 font-serif text-2xl font-light tracking-[0.08em] text-white">
                    {step.title}
                  </h3>
                  <p className="relative z-10 mt-1 text-[11px] uppercase tracking-[0.25em] text-gold/60">
                    {step.subtitle}
                  </p>

                  <div className="relative z-10 mt-5 h-px w-16 origin-left overflow-hidden bg-white/10">
                    <div
                      className="step-accent-bar h-full w-full origin-left bg-gold"
                      style={{ transform: "scaleX(0)" }}
                    />
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

      {/* Native video reels — not Instagram embed */}
      <section className="relative border-t border-white/10 bg-[#08060c] px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="mb-3 block text-[10px] uppercase tracking-[0.4em] text-gold/70">
              Films
            </span>
            <h2 className="font-serif text-3xl font-light uppercase tracking-[0.12em] text-white sm:text-4xl">
              Through the{" "}
              <span className="font-semibold italic text-gold">Lens</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/45 font-light">
              Short films from recent celebrations — played on-site, not embedded.
            </p>
          </div>

          <div className="reels-video-grid mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {REEL_VIDEOS.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ttl-cta relative border-t border-gold/10 px-6 py-28 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.07),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="ttl-cta-el block text-[10px] uppercase tracking-[0.4em] text-gold/80">
            Ready when you are
          </span>
          <h2 className="ttl-cta-el mt-4 font-serif text-3xl font-light tracking-[0.1em] sm:text-4xl">
            Let's begin your{" "}
            <span className="font-semibold italic text-gold">archive</span>
          </h2>
          <div className="ttl-cta-el mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex h-12 w-52 items-center justify-center gap-3 bg-gold px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-hover"
            >
              <span>Start Inquiry</span>
              <FiArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/gallery"
              className="inline-flex h-12 w-52 items-center justify-center border border-white/25 bg-white/5 px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all hover:border-white hover:bg-white/10"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
