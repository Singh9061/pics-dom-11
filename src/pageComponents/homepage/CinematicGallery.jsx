import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  c1_pic1,
  c1_pic3,
  c1_pic5,
  c1_pic7,
  c1_pic8,
  c1_pic10,
} from "../../Assets/picture/client1";
import { c2_pic2, c2_pic11 } from "../../Assets/picture/client2";

gsap.registerPlugin(ScrollTrigger);

const FRAMES = [
  { src: c1_pic10, title: "Sacred Phere", sub: "Heritage Ritual" },
  { src: c2_pic2, title: "Royal Baraat", sub: "Procession" },
  { src: c1_pic1, title: "Crimson Sindoor", sub: "Intimate" },
  { src: c1_pic5, title: "Palace Union", sub: "Destination" },
  { src: c1_pic7, title: "Firelight", sub: "Sangeet" },
  { src: c1_pic8, title: "Golden Hour", sub: "Portrait" },
  { src: c2_pic11, title: "Legacy", sub: "Family Archive" },
  { src: c1_pic3, title: "Quiet Glance", sub: "Candid" },
];

function ApertureRing({ className = "", blades = 6, opacity = 0.2 }) {
  const step = 360 / blades;
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="97" stroke="currentColor" strokeWidth="1.25" opacity="0.55" />
      <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.6" opacity="0.22" />
      <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="0.5" opacity="0.12" strokeDasharray="4 6" />
      {Array.from({ length: blades }).map((_, i) => (
        <path
          key={i}
          d="M100 8 L138 72 L100 100 Z"
          fill="currentColor"
          opacity={opacity}
          transform={`rotate(${i * step} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="26" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="100" cy="100" r="2.5" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

function MultiRings({ className = "", prefix = "ring" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-20 ${className}`}>
      <div className={`${prefix}-a absolute inset-[-8%] text-gold/45`}>
        <ApertureRing className="h-full w-full" blades={6} opacity={0.16} />
      </div>
      <div className={`${prefix}-b absolute inset-[-18%] text-gold/30`}>
        <ApertureRing className="h-full w-full" blades={8} opacity={0.1} />
      </div>
      <div className={`${prefix}-c absolute inset-[-28%] text-gold/18`}>
        <ApertureRing className="h-full w-full" blades={6} opacity={0.07} />
      </div>
    </div>
  );
}

export default function CinematicGallery() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from(".ttl-head > *", {
        y: 80,
        opacity: 0,
        filter: "blur(18px)",
        duration: 1.5,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: { trigger: ".ttl-head", start: "top 85%" },
      });

      gsap.fromTo(
        ".ttl-head-stack .hs",
        { scale: 0.2, opacity: 0, rotate: -180 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 2,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ttl-head", start: "top 85%" },
        }
      );

      gsap.to(".hs-a", { rotate: 360, duration: 22, ease: "none", repeat: -1 });
      gsap.to(".hs-b", { rotate: -360, duration: 32, ease: "none", repeat: -1 });
      gsap.to(".hs-c", { rotate: 360, duration: 48, ease: "none", repeat: -1 });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const pin = pinRef.current;
        if (!track || !pin) return;

        const getTotal = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -getTotal(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${getTotal() * 1.65}`,
            scrub: 1.1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                FRAMES.length - 1,
                Math.floor(self.progress * FRAMES.length)
              );
              if (progressRef.current) {
                progressRef.current.style.width = `${self.progress * 100}%`;
              }
              if (labelRef.current) {
                labelRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(FRAMES.length).padStart(2, "0")}`;
              }
            },
          },
        });

        gsap.utils.toArray(".ttl-panel").forEach((panel, i) => {
          const mainIris = panel.querySelector(".ttl-main-iris");
          const mainImg = panel.querySelector(".ttl-main-img");
          const meta = panel.querySelector(".ttl-meta");
          const sats = panel.querySelectorAll(".ttl-sat");
          const ringA = panel.querySelector(".ring-a");
          const ringB = panel.querySelector(".ring-b");
          const ringC = panel.querySelector(".ring-c");

          const base = (i / FRAMES.length) * getTotal() * 1.35;
          const start = () => `top+=${base} top`;
          const mid = () => `top+=${base + (0.4 / FRAMES.length) * getTotal() * 1.35} top`;
          const end = () => `top+=${base + (0.9 / FRAMES.length) * getTotal() * 1.35} top`;

          if (mainIris) {
            gsap.fromTo(
              mainIris,
              { clipPath: "circle(0% at 50% 50%)" },
              {
                clipPath: "circle(72% at 50% 50%)",
                ease: "none",
                scrollTrigger: { trigger: pin, start: start(), end: mid(), scrub: 1.35 },
              }
            );
          }

          if (mainImg) {
            gsap.fromTo(
              mainImg,
              { scale: 1.55, filter: "blur(24px)", rotate: -4 },
              {
                scale: 1,
                filter: "blur(0px)",
                rotate: 0,
                ease: "none",
                scrollTrigger: { trigger: pin, start: start(), end: end(), scrub: 1.45 },
              }
            );
          }

          /* 3 rings — opposite spins, staggered scale */
          if (ringA) {
            gsap.fromTo(
              ringA,
              { scale: 0.3, opacity: 0, rotate: -200 },
              {
                scale: 1,
                opacity: 1,
                rotate: 20,
                ease: "none",
                scrollTrigger: { trigger: pin, start: start(), end: mid(), scrub: 1.25 },
              }
            );
            gsap.to(ringA, {
              rotate: 80,
              ease: "none",
              scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1 },
            });
          }
          if (ringB) {
            gsap.fromTo(
              ringB,
              { scale: 0.2, opacity: 0, rotate: 160 },
              {
                scale: 1,
                opacity: 1,
                rotate: -30,
                ease: "none",
                scrollTrigger: { trigger: pin, start: start(), end: mid(), scrub: 1.4 },
              }
            );
            gsap.to(ringB, {
              rotate: -100,
              ease: "none",
              scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1 },
            });
          }
          if (ringC) {
            gsap.fromTo(
              ringC,
              { scale: 0.15, opacity: 0, rotate: -90 },
              {
                scale: 1,
                opacity: 1,
                rotate: 15,
                ease: "none",
                scrollTrigger: { trigger: pin, start: start(), end: mid(), scrub: 1.55 },
              }
            );
            gsap.to(ringC, {
              rotate: 55,
              ease: "none",
              scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1 },
            });
          }

          /* satellite apertures */
          sats.forEach((sat, si) => {
            const satIris = sat.querySelector(".ttl-sat-iris");
            const satImg = sat.querySelector(".ttl-sat-img");
            const dir = si === 0 ? -1 : 1;
            gsap.fromTo(
              sat,
              {
                x: dir * 120,
                y: 40,
                opacity: 0,
                scale: 0.5,
                rotate: dir * 25,
              },
              {
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
                ease: "none",
                scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1.3 },
              }
            );
            if (satIris) {
              gsap.fromTo(
                satIris,
                { clipPath: "circle(0% at 50% 50%)" },
                {
                  clipPath: "circle(70% at 50% 50%)",
                  ease: "none",
                  scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1.2 },
                }
              );
            }
            if (satImg) {
              gsap.fromTo(
                satImg,
                { scale: 1.4, filter: "blur(12px)" },
                {
                  scale: 1,
                  filter: "blur(0px)",
                  ease: "none",
                  scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1.2 },
                }
              );
            }
          });

          if (meta) {
            gsap.fromTo(
              meta,
              { y: 100, opacity: 0, filter: "blur(16px)" },
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                ease: "none",
                scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1.1 },
              }
            );
          }
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray(".ttl-m-card").forEach((card) => {
          const iris = card.querySelector(".ttl-m-iris");
          const rings = card.querySelectorAll(".ttl-m-ring-layer");

          gsap.fromTo(
            card,
            { y: 90, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.15,
              ease: "power4.out",
              scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none none" },
            }
          );

          if (iris) {
            gsap.fromTo(
              iris,
              { clipPath: "circle(0% at 50% 50%)" },
              {
                clipPath: "circle(80% at 50% 50%)",
                duration: 1.4,
                ease: "power3.inOut",
                scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
              }
            );
          }

          rings.forEach((r, ri) => {
            gsap.fromTo(
              r,
              { scale: 0.25, opacity: 0, rotate: ri % 2 === 0 ? -120 : 120 },
              {
                scale: 1,
                opacity: 1,
                rotate: 0,
                duration: 1.6,
                delay: ri * 0.1,
                ease: "power3.out",
                scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
              }
            );
          });
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-[#050308] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.14)_0%,transparent_55%)]" />

      <div className="ttl-head relative z-10 mx-auto max-w-4xl px-6 pb-12 pt-28 text-center md:pt-36">
        <div className="ttl-head-stack relative mx-auto mb-10 h-28 w-28 md:h-36 md:w-36">
          <div className="hs hs-a absolute inset-0 text-gold/50">
            <ApertureRing className="h-full w-full" blades={6} />
          </div>
          <div className="hs hs-b absolute inset-[-18%] text-gold/30">
            <ApertureRing className="h-full w-full" blades={8} opacity={0.1} />
          </div>
          <div className="hs hs-c absolute inset-[-36%] text-gold/15">
            <ApertureRing className="h-full w-full" blades={6} opacity={0.06} />
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">Signature Experience</p>
        <h2 className="mt-4 font-serif text-4xl font-light tracking-[0.1em] md:text-6xl">
          Through the <span className="font-semibold italic text-gold">lens</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/40 font-light">
          Multiple apertures. Multiple frames. Scroll to open the iris.
        </p>
      </div>

      <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 hidden h-[2px] bg-white/5 md:block">
        <div ref={progressRef} className="h-full bg-gold" style={{ width: "0%" }} />
      </div>
      <div className="pointer-events-none fixed bottom-8 right-6 z-40 hidden md:block">
        <div className="flex items-center gap-3 rounded-full border border-gold/25 bg-black/70 px-4 py-2 backdrop-blur-xl">
          <ApertureRing className="h-5 w-5 text-gold/70" />
          <span ref={labelRef} className="font-mono text-[11px] tracking-[0.3em] text-gold">
            01 / 08
          </span>
        </div>
      </div>

      {/* DESKTOP */}
      <div ref={pinRef} className="relative hidden md:block">
        <div
          ref={trackRef}
          className="flex h-screen will-change-transform"
          style={{ width: `${FRAMES.length * 100}vw` }}
        >
          {FRAMES.map((frame, i) => {
            const prev = FRAMES[(i - 1 + FRAMES.length) % FRAMES.length];
            const next = FRAMES[(i + 1) % FRAMES.length];
            return (
              <div
                key={frame.title}
                className="ttl-panel relative flex h-full w-screen flex-shrink-0 items-center justify-center"
              >
                <div className="relative flex h-full w-full max-w-[1400px] items-center justify-center gap-6 px-6 lg:gap-10 lg:px-12">
                  {/* left satellite */}
                  <div className="ttl-sat relative hidden h-[28vh] w-[28vh] flex-shrink-0 xl:block">
                    <div className="pointer-events-none absolute inset-[-12%] z-20 text-gold/35">
                      <ApertureRing className="h-full w-full" blades={6} opacity={0.12} />
                    </div>
                    <div
                      className="ttl-sat-iris relative z-10 h-full w-full overflow-hidden rounded-full"
                      style={{ clipPath: "circle(0% at 50% 50%)" }}
                    >
                      <img
                        src={prev.src}
                        alt=""
                        className="ttl-sat-img h-full w-full object-cover opacity-70"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
                    </div>
                  </div>

                  {/* MAIN multi-aperture */}
                  <div className="relative flex aspect-square w-full max-w-[min(72vh,760px)] flex-shrink-0 items-center justify-center">
                    <MultiRings prefix="ring" />
                    <div
                      className="ttl-main-iris relative z-10 h-[82%] w-[82%] overflow-hidden rounded-full shadow-[0_0_80px_rgba(197,168,128,0.12)]"
                      style={{ clipPath: "circle(0% at 50% 50%)" }}
                    >
                      <img
                        src={frame.src}
                        alt={frame.title}
                        className="ttl-main-img absolute inset-0 h-full w-full object-cover"
                        loading={i < 2 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_38%,rgba(0,0,0,0.8)_100%)]" />
                    </div>
                    <div className="ttl-meta pointer-events-none absolute -bottom-4 left-0 right-0 z-30 translate-y-full pt-10 text-center">
                      <p className="font-mono text-[11px] tracking-[0.4em] text-gold/80">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-serif text-3xl font-light tracking-[0.08em] lg:text-4xl">
                        {frame.title}
                      </h3>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-white/45">
                        {frame.sub}
                      </p>
                    </div>
                  </div>

                  {/* right satellite */}
                  <div className="ttl-sat relative hidden h-[28vh] w-[28vh] flex-shrink-0 xl:block">
                    <div className="pointer-events-none absolute inset-[-12%] z-20 text-gold/35">
                      <ApertureRing className="h-full w-full" blades={8} opacity={0.12} />
                    </div>
                    <div
                      className="ttl-sat-iris relative z-10 h-full w-full overflow-hidden rounded-full"
                      style={{ clipPath: "circle(0% at 50% 50%)" }}
                    >
                      <img
                        src={next.src}
                        alt=""
                        className="ttl-sat-img h-full w-full object-cover opacity-70"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE */}
      <div className="relative space-y-16 px-5 pb-16 pt-4 md:hidden">
        {FRAMES.map((frame, i) => (
          <div key={frame.title} className="ttl-m-card relative mx-auto max-w-sm">
            <div className="relative mx-auto aspect-square w-full">
              <div className="ttl-m-ring-layer pointer-events-none absolute inset-[-6%] z-20 text-gold/45">
                <ApertureRing className="h-full w-full" blades={6} />
              </div>
              <div className="ttl-m-ring-layer pointer-events-none absolute inset-[-16%] z-20 text-gold/25">
                <ApertureRing className="h-full w-full" blades={8} opacity={0.1} />
              </div>
              <div className="ttl-m-ring-layer pointer-events-none absolute inset-[-26%] z-20 text-gold/12">
                <ApertureRing className="h-full w-full" blades={6} opacity={0.06} />
              </div>
              <div
                className="ttl-m-iris relative z-10 h-full w-full overflow-hidden rounded-full"
                style={{ clipPath: "circle(0% at 50% 50%)" }}
              >
                <img src={frame.src} alt={frame.title} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="font-mono text-[10px] tracking-[0.35em] text-gold/70">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-serif text-2xl font-light tracking-wide">{frame.title}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-white/45">{frame.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex justify-center pb-20 pt-10">
        <Link
          to="/gallery"
          className="text-[11px] uppercase tracking-[0.35em] text-white/40 transition-colors hover:text-gold"
        >
          Full gallery →
        </Link>
      </div>
    </section>
  );
}
