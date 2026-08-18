import { useEffect, useRef, useState } from "react";
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
  c1_pic10,
} from "../../Assets/picture/client1";
import { c2_pic2, c2_pic11 } from "../../Assets/picture/client2";

gsap.registerPlugin(ScrollTrigger);

const GRAIN_SVG =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E";

const SHOTS = [
  { src: c1_pic10, title: "Sacred Phere", depth: 1.35, accent: "#8b3a3a", w: "38%", x: "8%", y: 12 },
  { src: c1_pic1, title: "Crimson Sindoor", depth: 0.55, accent: "#c45c26", w: "28%", x: "62%", y: 8 },
  { src: c2_pic2, title: "Royal Baraat", depth: 1.1, accent: "#d4a574", w: "42%", x: "28%", y: 55 },
  { src: c1_pic3, title: "Quiet Glance", depth: 0.4, accent: "#4a5568", w: "24%", x: "70%", y: 48 },
  { src: c1_pic5, title: "Palace Union", depth: 1.2, accent: "#b8860b", w: "36%", x: "5%", y: 100 },
  { src: c1_pic2, title: "Heritage Veil", depth: 0.7, accent: "#6b4c3b", w: "30%", x: "55%", y: 95 },
  { src: c1_pic7, title: "Firelight", depth: 1.0, accent: "#c05621", w: "34%", x: "15%", y: 160 },
  { src: c1_pic4, title: "Elopement", depth: 0.5, accent: "#2d4a3e", w: "26%", x: "65%", y: 155 },
  { src: c1_pic8, title: "Golden Hour", depth: 0.9, accent: "#c5a880", w: "40%", x: "20%", y: 210 },
  { src: c2_pic11, title: "Legacy", depth: 0.65, accent: "#5c4033", w: "32%", x: "58%", y: 205 },
  { src: c1_pic6, title: "Intimate", depth: 1.15, accent: "#7a3b2e", w: "36%", x: "10%", y: 265 },
];

function FilmGrain({ active }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-50 mix-blend-overlay transition-opacity duration-500"
      style={{
        opacity: active ? 0.35 : 0,
        backgroundImage: "url(" + GRAIN_SVG + ")",
        backgroundSize: "180px 180px",
      }}
    />
  );
}

export default function CinematicGallery() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const itemsRef = useRef([]);
  const [hoverAccent, setHoverAccent] = useState(null);
  const [grain, setGrain] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const items = itemsRef.current.filter(Boolean);
    if (!section || !track || items.length === 0) return;

    const isMobile = window.innerWidth < 768;

    const triggers = items.map((el, i) => {
      const depth = SHOTS[i].depth;
      const speed = isMobile ? depth * 40 : depth * 120;
      return gsap.to(el, {
        y: -speed,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    const batch = ScrollTrigger.batch(items, {
      start: "top 90%",
      onEnter: (batchEls) =>
        gsap.to(batchEls, {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power2.out",
          overwrite: "auto",
        }),
      once: true,
    });

    gsap.set(items, { opacity: 0, scale: 0.92 });

    return () => {
      triggers.forEach((t) => t.scrollTrigger && t.scrollTrigger.kill());
      batch.forEach((t) => t.kill());
    };
  }, []);

  const onEnter = (accent) => {
    setHoverAccent(accent);
    setGrain(true);
  };
  const onLeave = () => {
    setHoverAccent(null);
    setGrain(false);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-colors duration-700"
        style={{
          background: hoverAccent
            ? "radial-gradient(ellipse at 50% 40%, " + hoverAccent + "55 0%, #050505 55%)"
            : "#050505",
        }}
      />

      <FilmGrain active={grain} />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mb-16 text-center md:mb-24">
          <p className="text-[10px] uppercase tracking-[0.45em] text-gold/80">
            Immersive Archive
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light tracking-[0.12em] text-white md:text-5xl">
            Through the lens
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/40">
            Scroll — images float at different depths. Hover to feel the color of the moment.
          </p>
        </div>

        <div
          ref={trackRef}
          className="relative mx-auto"
          style={{ height: "min(3200px, 380vw)", maxWidth: "1200px" }}
        >
          {SHOTS.map((shot, i) => (
            <div
              key={shot.title + i}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
              className="absolute overflow-hidden rounded-sm will-change-transform"
              style={{
                width: shot.w,
                left: shot.x,
                top: shot.y * 3.2 + "px",
                zIndex: Math.round(shot.depth * 10),
                filter: "blur(" + Math.max(0, (1.4 - shot.depth) * 1.8) + "px)",
                boxShadow:
                  shot.depth > 1
                    ? "0 25px 60px rgba(0,0,0,0.55)"
                    : "0 10px 30px rgba(0,0,0,0.35)",
              }}
              onMouseEnter={() => onEnter(shot.accent)}
              onMouseLeave={onLeave}
            >
              <Link to="/gallery" className="group block">
                <div className="relative aspect-3/4 overflow-hidden bg-black">
                  <img
                    src={shot.src}
                    alt={shot.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
                      {shot.title}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center pb-8">
          <Link
            to="/gallery"
            className="border border-white/20 px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:border-gold hover:text-gold"
          >
            Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
