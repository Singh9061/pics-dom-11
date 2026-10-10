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

/* 6-blade camera aperture SVG ring */
function ApertureRing({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      {/* outer ring */}
      <circle
        cx="100"
        cy="100"
        r="96"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.55"
      />
      <circle
        cx="100"
        cy="100"
        r="88"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.25"
      />
      {/* iris blades */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <path
          key={deg}
          d="M100 12 L132 78 L100 100 Z"
          fill="currentColor"
          opacity="0.18"
          transform={`rotate(${deg} 100 100)`}
        />
      ))}
      {/* center hole guide */}
      <circle
        cx="100"
        cy="100"
        r="28"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export default function CinematicGallery() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const labelRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      /* heading + aperture icon entrance */
      gsap.from(".ttl-head > *", {
        y: 70,
        opacity: 0,
        filter: "blur(16px)",
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".ttl-head",
          start: "top 85%",
        },
      });

      gsap.fromTo(
        ".ttl-head-ring",
        { scale: 0.4, opacity: 0, rotation: -90 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ttl-head",
            start: "top 85%",
          },
        }
      );

      /* continuous slow spin on header ring */
      gsap.to(".ttl-head-ring", {
        rotate: 360,
        duration: 28,
        ease: "none",
        repeat: -1,
      });

      const mm = gsap.matchMedia();

      /* ── DESKTOP: pinned horizontal + aperture open ── */
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
            end: () => `+=${getTotal() * 1.5}`,
            scrub: 1.15,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                FRAMES.length - 1,
                Math.floor(self.progress * FRAMES.length)
              );
              setActive(idx);
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
          const iris = panel.querySelector(".ttl-iris");
          const img = panel.querySelector(".ttl-img");
          const ring = panel.querySelector(".ttl-ring");
          const meta = panel.querySelector(".ttl-meta");
          const vignette = panel.querySelector(".ttl-vignette");

          const start = () =>
            `top+=${(i / FRAMES.length) * getTotal() * 1.25} top`;
          const mid = () =>
            `top+=${((i + 0.45) / FRAMES.length) * getTotal() * 1.25} top`;
          const end = () =>
            `top+=${((i + 0.85) / FRAMES.length) * getTotal() * 1.25} top`;

          /* aperture iris: closed circle → full open */
          if (iris) {
            gsap.fromTo(
              iris,
              { clipPath: "circle(0% at 50% 50%)" },
              {
                clipPath: "circle(78% at 50% 50%)",
                ease: "none",
                scrollTrigger: {
                  trigger: pin,
                  start: start(),
                  end: mid(),
                  scrub: 1.3,
                },
              }
            );
          }

          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.45, filter: "blur(20px)" },
              {
                scale: 1,
                filter: "blur(0px)",
                ease: "none",
                scrollTrigger: {
                  trigger: pin,
                  start: start(),
                  end: end(),
                  scrub: 1.4,
                },
              }
            );
          }

          /* rotating aperture ring around frame */
          if (ring) {
            gsap.fromTo(
              ring,
              { scale: 0.55, opacity: 0, rotate: -120 },
              {
                scale: 1,
                opacity: 1,
                rotate: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: pin,
                  start: start(),
                  end: mid(),
                  scrub: 1.2,
                },
              }
            );
            gsap.to(ring, {
              rotate: 45,
              ease: "none",
              scrollTrigger: {
                trigger: pin,
                start: mid(),
                end: end(),
                scrub: 1,
              },
            });
          }

          if (vignette) {
            gsap.fromTo(
              vignette,
              { opacity: 0.9 },
              {
                opacity: 0.35,
                ease: "none",
                scrollTrigger: {
                  trigger: pin,
                  start: start(),
                  end: mid(),
                  scrub: 1,
                },
              }
            );
          }

          if (meta) {
            gsap.fromTo(
              meta,
              { y: 90, opacity: 0, filter: "blur(14px)" },
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                ease: "none",
                scrollTrigger: {
                  trigger: pin,
                  start: mid(),
                  end: end(),
                  scrub: 1.15,
                },
              }
            );
          }
        });
      });

      /* ── MOBILE: aperture open on each card ── */
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray(".ttl-m-card").forEach((card) => {
          const iris = card.querySelector(".ttl-m-iris");
          const ring = card.querySelector(".ttl-m-ring");

          gsap.fromTo(
            card,
            { y: 80, opacity: 0 },
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
                clipPath: "circle(85% at 50% 50%)",
                duration: 1.35,
                ease: "power3.inOut",
                scrollTrigger: {
                  trigger: card,
                  start: "top 88%",
                  toggleActions: "play none none none",
                },
              }
            );
          }

          if (ring) {
            gsap.fromTo(
              ring,
              { scale: 0.5, opacity: 0, rotate: -90 },
              {
                scale: 1,
                opacity: 1,
                rotate: 0,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 88%",
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
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-[#050308] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.12)_0%,transparent_55%)]" />

      {/* section heading + aperture */}
      <div className="ttl-head relative z-10 mx-auto max-w-4xl px-6 pb-10 pt-28 text-center md:pt-36">
        <div className="ttl-head-ring mx-auto mb-8 flex h-20 w-20 items-center justify-center text-gold md:h-24 md:w-24">
          <ApertureRing className="h-full w-full" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">
          Signature Experience
        </p>
        <h2 className="mt-4 font-serif text-4xl font-light tracking-[0.1em] md:text-6xl">
          Through the <span className="font-semibold italic text-gold">lens</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/40 font-light">
          Aperture opens. Scroll through the frames.
        </p>
      </div>

      {/* progress */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 hidden h-[2px] bg-white/5 md:block">
        <div
          ref={progressRef}
          className="h-full bg-gold"
          style={{ width: "0%" }}
        />
      </div>
      <div className="pointer-events-none fixed bottom-8 right-6 z-40 hidden md:block">
        <div className="flex items-center gap-3 rounded-full border border-gold/25 bg-black/70 px-4 py-2 backdrop-blur-xl">
          <ApertureRing className="h-5 w-5 text-gold/70" />
          <span
            ref={labelRef}
            className="font-mono text-[11px] tracking-[0.3em] text-gold"
          >
            01 / 08
          </span>
        </div>
      </div>

      {/* ════════ DESKTOP pinned horizontal ════════ */}
      <div ref={pinRef} className="relative hidden md:block">
        <div
          ref={trackRef}
          className="flex h-screen will-change-transform"
          style={{ width: `${FRAMES.length * 100}vw` }}
        >
          {FRAMES.map((frame, i) => (
            <div
              key={frame.title}
              className="ttl-panel relative flex h-full w-screen flex-shrink-0 items-center justify-center px-8 lg:px-16"
            >
              <div className="relative flex aspect-square w-full max-w-[min(78vh,880px)] items-center justify-center">
                {/* rotating aperture ring */}
                <div className="ttl-ring pointer-events-none absolute inset-[-6%] z-20 text-gold/50">
                  <ApertureRing className="h-full w-full" />
                </div>

                {/* circular iris reveal of photo */}
                <div
                  className="ttl-iris relative z-10 h-[88%] w-[88%] overflow-hidden rounded-full"
                  style={{ clipPath: "circle(0% at 50% 50%)" }}
                >
                  <img
                    src={frame.src}
                    alt={frame.title}
                    className="ttl-img absolute inset-0 h-full w-full object-cover"
                    loading={i < 2 ? "eager" : "lazy"}
                  />
                  <div className="ttl-vignette absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.75)_100%)]" />
                </div>

                {/* title under lens */}
                <div className="ttl-meta pointer-events-none absolute -bottom-2 left-0 right-0 z-30 translate-y-full pt-8 text-center">
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
            </div>
          ))}
        </div>
      </div>

      {/* ════════ MOBILE ════════ */}
      <div className="relative space-y-14 px-5 pb-16 pt-4 md:hidden">
        {FRAMES.map((frame, i) => (
          <div key={frame.title} className="ttl-m-card relative mx-auto max-w-sm">
            <div className="relative mx-auto aspect-square w-full">
              <div className="ttl-m-ring pointer-events-none absolute inset-[-5%] z-20 text-gold/45">
                <ApertureRing className="h-full w-full" />
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
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_35%,rgba(0,0,0,0.7)_100%)]" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="font-mono text-[10px] tracking-[0.35em] text-gold/70">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-serif text-2xl font-light tracking-wide">
                {frame.title}
              </h3>
              <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-white/45">
                {frame.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex justify-center pb-20 pt-8">
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
