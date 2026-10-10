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
      /* heading entrance */
      gsap.from(".ttl-head > *", {
        y: 60,
        opacity: 0,
        filter: "blur(14px)",
        duration: 1.3,
        stagger: 0.14,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".ttl-head",
          start: "top 85%",
        },
      });

      const mm = gsap.matchMedia();

      /* ── DESKTOP: pinned horizontal scroll ── */
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
            end: () => `+=${getTotal() * 1.45}`,
            scrub: 1.2,
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
          const img = panel.querySelector(".ttl-img");
          const meta = panel.querySelector(".ttl-meta");

          if (img) {
            gsap.fromTo(
              img,
              {
                scale: 1.35,
                filter: "blur(18px)",
                opacity: 0.35,
              },
              {
                scale: 1,
                filter: "blur(0px)",
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: pin,
                  start: () => `top+=${(i / FRAMES.length) * getTotal() * 1.2} top`,
                  end: () => `top+=${((i + 0.7) / FRAMES.length) * getTotal() * 1.2} top`,
                  scrub: 1.4,
                },
              }
            );
          }

          if (meta) {
            gsap.fromTo(
              meta,
              { y: 80, opacity: 0, filter: "blur(12px)" },
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                ease: "none",
                scrollTrigger: {
                  trigger: pin,
                  start: () => `top+=${(i / FRAMES.length) * getTotal() * 1.2} top`,
                  end: () => `top+=${((i + 0.55) / FRAMES.length) * getTotal() * 1.2} top`,
                  scrub: 1.2,
                },
              }
            );
          }
        });
      });

      /* ── MOBILE: stacked heavy reveals ── */
      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray(".ttl-m-card").forEach((card) => {
          gsap.fromTo(
            card,
            {
              y: 100,
              opacity: 0,
              scale: 0.9,
              filter: "blur(16px)",
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.25,
              ease: "power4.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }
          );
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
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.1)_0%,transparent_55%)]" />

      {/* section heading */}
      <div className="ttl-head relative z-10 mx-auto max-w-4xl px-6 pb-8 pt-28 text-center md:pt-36">
        <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">
          Signature Experience
        </p>
        <h2 className="mt-4 font-serif text-4xl font-light tracking-[0.1em] md:text-6xl">
          Through the <span className="font-semibold italic text-gold">lens</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/40 font-light">
          Scroll to travel through frames — every moment intentional.
        </p>
      </div>

      {/* progress (desktop) */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 hidden h-[2px] bg-white/5 md:block">
        <div
          ref={progressRef}
          className="h-full bg-gold"
          style={{ width: "0%" }}
        />
      </div>
      <div className="pointer-events-none fixed bottom-8 right-6 z-40 hidden md:block">
        <div className="rounded-full border border-gold/25 bg-black/70 px-5 py-2.5 backdrop-blur-xl">
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
              className="ttl-panel relative flex h-full w-screen flex-shrink-0 items-center justify-center px-10 lg:px-20"
            >
              <div className="relative h-[70vh] w-full max-w-5xl overflow-hidden rounded-sm">
                <img
                  src={frame.src}
                  alt={frame.title}
                  className="ttl-img absolute inset-0 h-full w-full object-cover"
                  loading={i < 2 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="ttl-meta absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                  <p className="font-mono text-[11px] tracking-[0.4em] text-gold/80">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-serif text-3xl font-light tracking-[0.08em] lg:text-5xl">
                    {frame.title}
                  </h3>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.3em] text-white/50">
                    {frame.sub}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════ MOBILE vertical cards ════════ */}
      <div className="relative space-y-8 px-5 pb-16 pt-4 md:hidden">
        {FRAMES.map((frame, i) => (
          <div
            key={frame.title}
            className="ttl-m-card relative aspect-[4/5] overflow-hidden rounded-sm"
          >
            <img
              src={frame.src}
              alt={frame.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
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

      {/* footer link */}
      <div className="relative z-10 flex justify-center pb-20 pt-6">
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
