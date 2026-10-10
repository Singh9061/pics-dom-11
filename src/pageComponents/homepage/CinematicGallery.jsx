import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  c1_pic1,
  c1_pic2,
  c1_pic3,
  c1_pic4,
  c1_pic5,
  c1_pic6,
  c1_pic7,
  c1_pic8,
  c1_pic9,
  c1_pic10,
} from "../../Assets/picture/client1";
import {
  c2_pic1,
  c2_pic2,
  c2_pic3,
  c2_pic11,
  c2_pic12,
} from "../../Assets/picture/client2";

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
  { src: c1_pic2, title: "Veil & Gold", sub: "Bridal" },
  { src: c1_pic4, title: "Sacred Steps", sub: "Ritual" },
  { src: c1_pic6, title: "Together", sub: "Couple" },
  { src: c1_pic9, title: "Celebration", sub: "Joy" },
  { src: c2_pic1, title: "Arrival", sub: "Entrance" },
  { src: c2_pic12, title: "Forever", sub: "Portrait" },
];

const TOTAL = FRAMES.length;

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

function MultiRings({ prefix = "ring" }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className={`${prefix}-a absolute inset-[-6%] text-gold/45 sm:inset-[-8%]`}>
        <ApertureRing className="h-full w-full" blades={6} opacity={0.16} />
      </div>
      <div className={`${prefix}-b absolute inset-[-14%] text-gold/28 sm:inset-[-18%]`}>
        <ApertureRing className="h-full w-full" blades={8} opacity={0.1} />
      </div>
      <div className={`${prefix}-c absolute inset-[-22%] text-gold/15 sm:inset-[-28%]`}>
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
        y: 60,
        opacity: 0,
        filter: "blur(14px)",
        duration: 1.35,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: { trigger: ".ttl-head", start: "top 88%" },
      });

      gsap.fromTo(
        ".ttl-head-stack .hs",
        { scale: 0.25, opacity: 0, rotate: -160 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ttl-head", start: "top 88%" },
        }
      );

      gsap.to(".hs-a", { rotate: 360, duration: 22, ease: "none", repeat: -1 });
      gsap.to(".hs-b", { rotate: -360, duration: 32, ease: "none", repeat: -1 });
      gsap.to(".hs-c", { rotate: 360, duration: 48, ease: "none", repeat: -1 });

      const mm = gsap.matchMedia();

      /* Desktop / tablet landscape: pinned horizontal */
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
            end: () => `+=${getTotal() * 1.55}`,
            scrub: 1.1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(TOTAL - 1, Math.floor(self.progress * TOTAL));
              if (progressRef.current) {
                progressRef.current.style.width = `${self.progress * 100}%`;
              }
              if (labelRef.current) {
                labelRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}`;
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

          const span = (getTotal() * 1.35) / TOTAL;
          const base = i * span;
          const start = () => `top+=${base} top`;
          const mid = () => `top+=${base + span * 0.4} top`;
          const end = () => `top+=${base + span * 0.9} top`;

          if (mainIris) {
            gsap.fromTo(
              mainIris,
              { clipPath: "circle(0% at 50% 50%)" },
              {
                clipPath: "circle(72% at 50% 50%)",
                ease: "none",
                scrollTrigger: { trigger: pin, start: start(), end: mid(), scrub: 1.3 },
              }
            );
          }

          if (mainImg) {
            gsap.fromTo(
              mainImg,
              { scale: 1.5, filter: "blur(20px)", rotate: -3 },
              {
                scale: 1,
                filter: "blur(0px)",
                rotate: 0,
                ease: "none",
                scrollTrigger: { trigger: pin, start: start(), end: end(), scrub: 1.4 },
              }
            );
          }

          if (ringA) {
            gsap.fromTo(
              ringA,
              { scale: 0.3, opacity: 0, rotate: -180 },
              {
                scale: 1,
                opacity: 1,
                rotate: 15,
                ease: "none",
                scrollTrigger: { trigger: pin, start: start(), end: mid(), scrub: 1.2 },
              }
            );
            gsap.to(ringA, {
              rotate: 70,
              ease: "none",
              scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1 },
            });
          }
          if (ringB) {
            gsap.fromTo(
              ringB,
              { scale: 0.2, opacity: 0, rotate: 140 },
              {
                scale: 1,
                opacity: 1,
                rotate: -25,
                ease: "none",
                scrollTrigger: { trigger: pin, start: start(), end: mid(), scrub: 1.35 },
              }
            );
            gsap.to(ringB, {
              rotate: -90,
              ease: "none",
              scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1 },
            });
          }
          if (ringC) {
            gsap.fromTo(
              ringC,
              { scale: 0.15, opacity: 0, rotate: -80 },
              {
                scale: 1,
                opacity: 1,
                rotate: 10,
                ease: "none",
                scrollTrigger: { trigger: pin, start: start(), end: mid(), scrub: 1.5 },
              }
            );
            gsap.to(ringC, {
              rotate: 50,
              ease: "none",
              scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1 },
            });
          }

          sats.forEach((sat, si) => {
            const satIris = sat.querySelector(".ttl-sat-iris");
            const satImg = sat.querySelector(".ttl-sat-img");
            const dir = si === 0 ? -1 : 1;
            gsap.fromTo(
              sat,
              { x: dir * 80, y: 30, opacity: 0, scale: 0.55, rotate: dir * 18 },
              {
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
                ease: "none",
                scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1.25 },
              }
            );
            if (satIris) {
              gsap.fromTo(
                satIris,
                { clipPath: "circle(0% at 50% 50%)" },
                {
                  clipPath: "circle(70% at 50% 50%)",
                  ease: "none",
                  scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1.15 },
                }
              );
            }
            if (satImg) {
              gsap.fromTo(
                satImg,
                { scale: 1.35, filter: "blur(10px)" },
                {
                  scale: 1,
                  filter: "blur(0px)",
                  ease: "none",
                  scrollTrigger: { trigger: pin, start: mid(), end: end(), scrub: 1.15 },
                }
              );
            }
          });

          if (meta) {
            gsap.fromTo(
              meta,
              { y: 70, opacity: 0, filter: "blur(12px)" },
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

        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      });

      /* Mobile vertical */
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray(".ttl-m-card").forEach((card) => {
          const iris = card.querySelector(".ttl-m-iris");
          const rings = card.querySelectorAll(".ttl-m-ring-layer");

          gsap.fromTo(
            card,
            { y: 70, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: "power4.out",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                toggleActions: "play none none none",
              },
            }
          );

          if (iris) {
            gsap.fromTo(
              iris,
              { clipPath: "circle(0% at 50% 50%)" },
              {
                clipPath: "circle(80% at 50% 50%)",
                duration: 1.3,
                ease: "power3.inOut",
                scrollTrigger: {
                  trigger: card,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
              }
            );
          }

          rings.forEach((r, ri) => {
            gsap.fromTo(
              r,
              { scale: 0.3, opacity: 0, rotate: ri % 2 === 0 ? -100 : 100 },
              {
                scale: 1,
                opacity: 1,
                rotate: 0,
                duration: 1.45,
                delay: ri * 0.08,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.12)_0%,transparent_55%)]" />

      <div className="ttl-head relative z-10 mx-auto max-w-4xl px-4 pb-8 pt-24 text-center sm:px-6 sm:pt-28 md:pb-12 md:pt-36">
        <div className="ttl-head-stack relative mx-auto mb-8 h-20 w-20 sm:mb-10 sm:h-28 sm:w-28 md:h-36 md:w-36">
          <div className="hs hs-a absolute inset-0 text-gold/50">
            <ApertureRing className="h-full w-full" blades={6} />
          </div>
          <div className="hs hs-b absolute inset-[-14%] text-gold/28 sm:inset-[-18%]">
            <ApertureRing className="h-full w-full" blades={8} opacity={0.1} />
          </div>
          <div className="hs hs-c absolute inset-[-28%] text-gold/14 sm:inset-[-36%]">
            <ApertureRing className="h-full w-full" blades={6} opacity={0.06} />
          </div>
        </div>
        <p className="text-[9px] uppercase tracking-[0.45em] text-gold/70 sm:text-[10px] sm:tracking-[0.5em]">
          Signature Experience
        </p>
        <h2 className="mt-3 font-serif text-3xl font-light tracking-[0.08em] sm:mt-4 sm:text-4xl sm:tracking-[0.1em] md:text-6xl">
          Through the <span className="font-semibold italic text-gold">lens</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md px-2 text-xs leading-6 text-white/40 font-light sm:mt-5 sm:text-sm sm:leading-7">
          {TOTAL} frames · multiple apertures · scroll to open
        </p>
      </div>

      {/* progress — desktop only */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 hidden h-[2px] bg-white/5 md:block">
        <div ref={progressRef} className="h-full bg-gold" style={{ width: "0%" }} />
      </div>
      <div className="pointer-events-none fixed bottom-6 right-4 z-40 hidden md:bottom-8 md:right-6 md:block">
        <div className="flex items-center gap-2 rounded-full border border-gold/25 bg-black/70 px-3 py-1.5 backdrop-blur-xl sm:gap-3 sm:px-4 sm:py-2">
          <ApertureRing className="h-4 w-4 text-gold/70 sm:h-5 sm:w-5" />
          <span ref={labelRef} className="font-mono text-[10px] tracking-[0.25em] text-gold sm:text-[11px] sm:tracking-[0.3em]">
            01 / {String(TOTAL).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* DESKTOP / TABLET horizontal */}
      <div ref={pinRef} className="relative hidden md:block">
        <div
          ref={trackRef}
          className="flex h-[100dvh] will-change-transform"
          style={{ width: `${TOTAL * 100}vw` }}
        >
          {FRAMES.map((frame, i) => {
            const prev = FRAMES[(i - 1 + TOTAL) % TOTAL];
            const next = FRAMES[(i + 1) % TOTAL];
            return (
              <div
                key={`${frame.title}-${i}`}
                className="ttl-panel relative flex h-full w-screen flex-shrink-0 items-center justify-center"
              >
                <div className="relative flex h-full w-full max-w-[1400px] items-center justify-center gap-3 px-4 lg:gap-8 lg:px-10 xl:gap-10 xl:px-12">
                  {/* left sat — from lg */}
                  <div className="ttl-sat relative hidden h-[22vh] w-[22vh] flex-shrink-0 lg:block xl:h-[26vh] xl:w-[26vh]">
                    <div className="pointer-events-none absolute inset-[-10%] z-20 text-gold/35">
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

                  {/* MAIN */}
                  <div className="relative flex aspect-square w-[min(68vw,62vh)] max-w-[720px] flex-shrink-0 items-center justify-center lg:w-[min(52vw,68vh)]">
                    <MultiRings prefix="ring" />
                    <div
                      className="ttl-main-iris relative z-10 h-[84%] w-[84%] overflow-hidden rounded-full shadow-[0_0_60px_rgba(197,168,128,0.1)] sm:h-[82%] sm:w-[82%]"
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
                    <div className="ttl-meta pointer-events-none absolute left-0 right-0 top-full z-30 pt-6 text-center sm:pt-8 lg:pt-10">
                      <p className="font-mono text-[10px] tracking-[0.35em] text-gold/80 sm:text-[11px] sm:tracking-[0.4em]">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1.5 font-serif text-2xl font-light tracking-[0.06em] sm:mt-2 sm:text-3xl lg:text-4xl">
                        {frame.title}
                      </h3>
                      <p className="mt-1.5 text-[10px] uppercase tracking-[0.25em] text-white/45 sm:mt-2 sm:text-[11px] sm:tracking-[0.3em]">
                        {frame.sub}
                      </p>
                    </div>
                  </div>

                  {/* right sat — from lg */}
                  <div className="ttl-sat relative hidden h-[22vh] w-[22vh] flex-shrink-0 lg:block xl:h-[26vh] xl:w-[26vh]">
                    <div className="pointer-events-none absolute inset-[-10%] z-20 text-gold/35">
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
      <div className="relative grid grid-cols-1 gap-12 px-4 pb-14 pt-2 sm:grid-cols-2 sm:gap-8 sm:px-6 md:hidden">
        {FRAMES.map((frame, i) => (
          <div key={`m-${frame.title}-${i}`} className="ttl-m-card relative mx-auto w-full max-w-sm">
            <div className="relative mx-auto aspect-square w-full max-w-[min(100%,340px)]">
              <div className="ttl-m-ring-layer pointer-events-none absolute inset-[-5%] z-20 text-gold/45">
                <ApertureRing className="h-full w-full" blades={6} />
              </div>
              <div className="ttl-m-ring-layer pointer-events-none absolute inset-[-14%] z-20 text-gold/25">
                <ApertureRing className="h-full w-full" blades={8} opacity={0.1} />
              </div>
              <div className="ttl-m-ring-layer pointer-events-none absolute inset-[-22%] z-20 text-gold/12">
                <ApertureRing className="h-full w-full" blades={6} opacity={0.06} />
              </div>
              <div
                className="ttl-m-iris relative z-10 h-full w-full overflow-hidden rounded-full"
                style={{ clipPath: "circle(0% at 50% 50%)" }}
              >
                <img
                  src={frame.src}
                  alt={frame.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
              </div>
            </div>
            <div className="mt-6 text-center sm:mt-7">
              <p className="font-mono text-[10px] tracking-[0.3em] text-gold/70">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-serif text-xl font-light tracking-wide sm:text-2xl">
                {frame.title}
              </h3>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-[11px]">
                {frame.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex justify-center pb-16 pt-6 sm:pb-20 sm:pt-8">
        <Link
          to="/gallery"
          className="text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-gold sm:text-[11px] sm:tracking-[0.35em]"
        >
          Full gallery →
        </Link>
      </div>
    </section>
  );
}
