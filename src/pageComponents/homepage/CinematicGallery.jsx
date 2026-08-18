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
  { src: c1_pic10, title: "Sacred Phere", accent: "#8b3a3a", span: "md:col-span-2 md:row-span-2" },
  { src: c1_pic1, title: "Crimson Sindoor", accent: "#c45c26", span: "" },
  { src: c2_pic2, title: "Royal Baraat", accent: "#d4a574", span: "" },
  { src: c1_pic3, title: "Quiet Glance", accent: "#4a5568", span: "md:col-span-2" },
  { src: c1_pic5, title: "Palace Union", accent: "#b8860b", span: "" },
  { src: c1_pic2, title: "Heritage Veil", accent: "#6b4c3b", span: "" },
  { src: c1_pic7, title: "Firelight", accent: "#c05621", span: "md:row-span-2" },
  { src: c1_pic4, title: "Elopement", accent: "#2d4a3e", span: "" },
  { src: c1_pic8, title: "Golden Hour", accent: "#c5a880", span: "md:col-span-2" },
  { src: c2_pic11, title: "Legacy", accent: "#5c4033", span: "" },
  { src: c1_pic6, title: "Intimate", accent: "#7a3b2e", span: "" },
];

function applyTilt(el, e, max) {
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  const rotY = (x - 0.5) * max * 2;
  const rotX = (0.5 - y) * max * 2;
  el.style.transform =
    "perspective(1000px) rotateX(" +
    rotX +
    "deg) rotateY(" +
    rotY +
    "deg) translateZ(16px) scale3d(1.03,1.03,1.03)";
}

function resetTilt(el) {
  el.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1,1,1)";
}

export default function CinematicGallery() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);
  const [hoverAccent, setHoverAccent] = useState(null);
  const [grain, setGrain] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!section || cards.length === 0) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          y: 60,
          opacity: 0,
          rotateX: 30,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
          },
        });
      }

      cards.forEach((card, i) => {
        const direction = i % 3 === 0 ? -50 : i % 3 === 1 ? 50 : 0;
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 110,
            x: direction,
            scale: 0.85,
            rotateY: direction ? direction * 0.25 : -8,
            rotateX: 12,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotateY: 0,
            rotateX: 0,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
            },
          }
        );

        const img = card.querySelector("img");
        if (img) {
          gsap.to(img, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-colors duration-700"
        style={{
          background: hoverAccent
            ? "radial-gradient(ellipse at 50% 30%, " + hoverAccent + "40 0%, #050505 50%)"
            : "#050505",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-50 mix-blend-overlay transition-opacity duration-500"
        style={{
          opacity: grain ? 0.28 : 0,
          backgroundImage: "url(" + GRAIN_SVG + ")",
          backgroundSize: "160px 160px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div ref={titleRef} className="mb-16 text-center md:mb-20" style={{ perspective: "800px" }}>
          <p className="text-[10px] uppercase tracking-[0.45em] text-gold/80">
            Immersive Archive
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light tracking-[0.12em] text-white md:text-5xl">
            Through the lens
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/40">
            3D depth on every frame. Hover and tilt — feel the space.
          </p>
        </div>

        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5"
          style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
        >
          {SHOTS.map((shot, i) => (
            <div
              key={shot.title + i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={
                "group relative overflow-hidden bg-black shadow-[0_25px_60px_rgba(0,0,0,0.5)] will-change-transform transition-transform duration-200 ease-out " +
                (shot.span || "") +
                (shot.span && shot.span.includes("row-span-2")
                  ? " min-h-[420px] md:min-h-[560px]"
                  : " aspect-3/4")
              }
              style={{ transformStyle: "preserve-3d" }}
              onMouseMove={(e) => applyTilt(e.currentTarget, e, 14)}
              onMouseEnter={() => {
                setHoverAccent(shot.accent);
                setGrain(true);
              }}
              onMouseLeave={(e) => {
                resetTilt(e.currentTarget);
                setHoverAccent(null);
                setGrain(false);
              }}
            >
              <Link to="/gallery" className="absolute inset-0 block overflow-hidden">
                <img
                  src={shot.src}
                  alt={shot.title}
                  loading="lazy"
                  decoding="async"
                  className="h-[115%] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold">
                    {shot.title}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            to="/gallery"
            className="border border-white/25 px-10 py-3.5 text-[11px] uppercase tracking-[0.3em] text-white/80 transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
          >
            Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
