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
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: ".ttl-head", start: "top 90%" },
      });

      gsap.fromTo(
        ".ttl-head-stack .hs",
        { scale: 0.4, opacity: 0, rotate: -90 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ttl-head", start: "top 90%" },
        }
      );

      gsap.to(".hs-a", { rotate: 360, duration: 24, ease: "none", repeat: -1 });
      gsap.to(".hs-b", { rotate: -360, duration: 36, ease: "none", repeat: -1 });
      gsap.to(".hs-c", { rotate: 360, duration: 50, ease: "none", repeat: -1 });

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
              { y: 70, opacity: 0 },
              {
                y: 0,
                opacity: 1,
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

      /* Mobile: reliable visible cards */
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray(".ttl-m-card").forEach((card) => {
          const imgWrap = card.querySelector(".ttl-m-photo");
          const rings = card.querySelectorAll(".ttl-m-ring-layer");
          const text = card.querySelector(".ttl-m-text");

          gsap.fromTo(
            card,
            { y: 48, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                toggleActions: "play none none none",
              },
            }
          );

          if (imgWrap) {
            gsap.fromTo(
              imgWrap,
              { scale: 0.88 },
              {
                scale: 1,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 92%",
                  toggleActions: "play none none none",
                },
              }
            );
          }

          rings.forEach((r, ri) => {
            gsap.fromTo(
              r,
              { scale: 0.6, opacity: 0, rotate: ri % 2 === 0 ? -60 : 60 },
              {
                scale: 1,
                opacity: 1,
                rotate: 0,
                duration: 1.15,
                delay: 0.05 + ri * 0.08,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 92%",
                  toggleActions: "play none none none",
                },
              }
            );
          });

          if (text) {
            gsap.fromTo(
              text,
              { y: 16, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 92%",
                  toggleActions: "play none none none",
                },
              }
            );
          }
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-x-hidden bg-[#050308] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.12)_0%,transparent_55%)]" />

      <div className="ttl-head relative z-10 mx-auto max-w-4xl px-5 pb-6 pt-20 text-center sm:px-6 sm:pb-8 sm:pt-24 md:pb-12 md:pt-36">
        <div className="ttl-head-stack relative mx-auto mb-6 h-16 w-16 sm:mb-8 sm:h-24 sm:w-24 md:h-36 md:w-36">
          <div className="hs hs-a absolute inset-0 text-gold/50">
            <ApertureRing className="h-full w-full" blades={6} />
          </div>
          <div className="hs hs-b absolute inset-[-12%] text-gold/28 sm:inset-[-16%]">
            <ApertureRing className="h-full w-full" blades={8} opacity={0.1} />
          </div>
          <div className="hs hs-c absolute inset-[-24%] text-gold/14 sm:inset-[-30%]">
            <ApertureRing className="h-full w-full" blades={6} opacity={0.06} />
          </div>
        </div>
        <p className="text-[9px] uppercase tracking-[0.4em] text-gold/70 sm:text-[10px]">
          Signature Experience
        </p>
        <h2 className="mt-2 font-serif text-[1.75rem] font-light leading-tight tracking-[0.06em] sm:mt-3 sm:text-4xl md:text-6xl">
          Through the <span className="font-semibold italic text-gold">lens</span>
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-[11px] leading-5 text-white/40 font-light sm:mt-4 sm:text-sm sm:leading-7">
          {TOTAL} frames · multiple apertures · scroll to open
        </p>
      </div>

      <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 hidden h-[2px] bg-white/5 md:block">
        <div ref={progressRef} className="h-full bg-gold" style={{ width: "0%" }} />
      </div>
      <div className="pointer-events-none fixed bottom-6 right-4 z-40 hidden md:block">
        <div className="flex items-center gap-2 rounded-full border border-gold/25 bg-black/70 px-3 py-1.5 backdrop-blur-xl">
          <ApertureRing className="h-4 w-4 text-gold/70" />
          <span ref={labelRef} className="font-mono text-[10px] tracking-[0.25em] text-gold">
            01 / {String(TOTAL).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* DESKTOP */}
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
                <div className="relative flex h-full w-full max-w-[1400px] items-center justify-center gap-3 px-4 lg:gap-8 lg:px-10 xl:gap-10">
                  <div className="ttl-sat relative hidden h-[22vh] w-[22vh] flex-shrink-0 lg:block xl:h-[26vh] xl:w-[26vh]">
                    <div className="pointer-events-none absolute inset-[-10%] z-20 text-gold/35">
                      <ApertureRing className="h-full w-full" blades={6} opacity={0.12} />
                    </div>
                    <div
                      className="ttl-sat-iris relative z-10 h-full w-full overflow-hidden rounded-full"
                      style={{ clipPath: "circle(0% at 50% 50%)" }}
                    >
                      <img src={prev.src} alt="" className="ttl-sat-img h-full w-full object-cover opacity-70" loading="lazy" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
                    </div>
                  </div>

                  <div className="relative flex aspect-square w-[min(68vw,62vh)] max-w-[720px] flex-shrink-0 items-center justify-center lg:w-[min(52vw,68vh)]">
                    <MultiRings prefix="ring" />
                    <div
                      className="ttl-main-iris relative z-10 h-[84%] w-[84%] overflow-hidden rounded-full shadow-[0_0_60px_rgba(197,168,128,0.1)]"
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
                    <div className="ttl-meta pointer-events-none absolute left-0 right-0 top-full z-30 pt-8 text-center lg:pt-10">
                      <p className="font-mono text-[11px] tracking-[0.4em] text-gold/80">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-serif text-3xl font-light tracking-[0.06em] lg:text-4xl">
                        {frame.title}
                      </h3>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-white/45">
                        {frame.sub}
                      </p>
                    </div>
                  </div>

                  <div className="ttl-sat relative hidden h-[22vh] w-[22vh] flex-shrink-0 lg:block xl:h-[26vh] xl:w-[26vh]">
                    <div className="pointer-events-none absolute inset-[-10%] z-20 text-gold/35">
                      <ApertureRing className="h-full w-full" blades={8} opacity={0.12} />
                    </div>
                    <div
                      className="ttl-sat-iris relative z-10 h-full w-full overflow-hidden rounded-full"
                      style={{ clipPath: "circle(0% at 50% 50%)" }}
                    >
                      <img src={next.src} alt="" className="ttl-sat-img h-full w-full object-cover opacity-70" loading="lazy" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE — single column, always-visible circular photos */}
      <div className="relative flex flex-col items-center gap-10 px-5 pb-12 pt-2 md:hidden">
        {FRAMES.map((frame, i) => (
          <div
            key={`m-${frame.title}-${i}`}
            className="ttl-m-card w-full max-w-[300px]"
          >
            {/* padding so outer rings stay inside card box */}
            <div className="relative mx-auto aspect-square w-[78%] max-w-[240px]">
              <div className="ttl-m-ring-layer pointer-events-none absolute inset-[-8%] z-20 text-gold/40">
                <ApertureRing className="h-full w-full" blades={6} opacity={0.14} />
              </div>
              <div className="ttl-m-ring-layer pointer-events-none absolute inset-[-16%] z-20 text-gold/22">
                <ApertureRing className="h-full w-full" blades={8} opacity={0.08} />
              </div>

              <div className="ttl-m-photo relative z-10 h-full w-full overflow-hidden rounded-full ring-1 ring-gold/20">
                <img
                  src={frame.src}
                  alt={frame.title}
                  className="h-full w-full object-cover"
                  loading={i < 3 ? "eager" : "lazy"}
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
              </div>
            </div>

            <div className="ttl-m-text mt-5 text-center">
              <p className="font-mono text-[10px] tracking-[0.3em] text-gold/70">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-serif text-xl font-light tracking-wide">
                {frame.title}
              </h3>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/45">
                {frame.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex justify-center pb-14 pt-4 md:pb-20 md:pt-8">
        <Link
          to="/gallery"
          className="text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-gold sm:text-[11px]"
        >
          Full gallery →
        </Link>
      </div>
    </section>
  );
}
