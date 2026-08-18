import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  c1_pic1,
  c1_pic2,
  c1_pic3,
  c1_pic5,
  c1_pic7,
  c1_pic8,
  c1_pic10,
} from "../../Assets/picture/client1";
import { c2_pic2, c2_pic7, c2_pic11 } from "../../Assets/picture/client2";

gsap.registerPlugin(ScrollTrigger);

/* Positions on an oval — left title space + floating frames */
const CARDS = [
  {
    src: c1_pic10,
    title: "Sacred Phere",
    sub: "Heritage Wedding",
    w: "min(42vw, 380px)",
    x: "12%",
    y: "18%",
    z: 3,
    rot: -4,
  },
  {
    src: c2_pic2,
    title: "Royal Baraat",
    sub: "Procession",
    w: "min(36vw, 320px)",
    x: "52%",
    y: "8%",
    z: 2,
    rot: 3,
  },
  {
    src: c1_pic1,
    title: "Crimson Sindoor",
    sub: "Intimate Ritual",
    w: "min(28vw, 240px)",
    x: "68%",
    y: "42%",
    z: 4,
    rot: -2,
  },
  {
    src: c1_pic5,
    title: "Palace Union",
    sub: "Destination",
    w: "min(34vw, 300px)",
    x: "28%",
    y: "48%",
    z: 1,
    rot: 5,
  },
  {
    src: c1_pic7,
    title: "Firelight",
    sub: "Sangeet Night",
    w: "min(30vw, 260px)",
    x: "58%",
    y: "58%",
    z: 3,
    rot: -6,
  },
  {
    src: c2_pic11,
    title: "Legacy",
    sub: "Family Archive",
    w: "min(24vw, 200px)",
    x: "8%",
    y: "62%",
    z: 2,
    rot: 2,
  },
  {
    src: c1_pic8,
    title: "Golden Hour",
    sub: "Portrait",
    w: "min(26vw, 220px)",
    x: "78%",
    y: "18%",
    z: 1,
    rot: -3,
  },
  {
    src: c1_pic3,
    title: "Quiet Glance",
    sub: "Candid",
    w: "min(22vw, 180px)",
    x: "42%",
    y: "72%",
    z: 5,
    rot: 4,
  },
];

export default function CinematicGallery() {
  const sectionRef = useRef(null);
  const fieldRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const field = fieldRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!section || !field || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Entrance from oval paths
      cards.forEach((card, i) => {
        const angle = (i / cards.length) * Math.PI * 2;
        gsap.fromTo(
          card,
          {
            opacity: 0,
            scale: 0.7,
            x: Math.cos(angle) * 120,
            y: Math.sin(angle) * 80,
            rotate: CARDS[i].rot * 2,
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotate: CARDS[i].rot,
            duration: 1.1,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );

        // Parallax depth by z layer
        const depth = CARDS[i].z;
        gsap.to(card, {
          y: depth * -28,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        // Continuous slow oval drift
        gsap.to(card, {
          x: "+=" + (12 + depth * 4),
          y: "+=" + (8 + depth * 3),
          duration: 4 + depth * 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        });
      });

      // Soft rotate of whole field on scroll
      gsap.to(field, {
        rotate: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const onMove = (e, el, max = 10) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform =
      el.style.transform.replace(/rotateX\([^)]*\)/g, "").replace(/rotateY\([^)]*\)/g, "") +
      " rotateX(" +
      -y * max +
      "deg) rotateY(" +
      x * max +
      "deg)";
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a0612] py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(90,40,100,0.35)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(40,20,60,0.4)_0%,transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-gold/70">
              Immersive Archive
            </p>
            <h2 className="mt-3 font-serif text-3xl font-light uppercase leading-tight tracking-[0.08em] text-white md:text-5xl">
              Through
              <br />
              the lens
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/40 md:text-right">
            Frames in orbit — scroll and hover to feel the depth of every moment.
          </p>
        </div>

        {/* Floating oval field */}
        <div
          ref={fieldRef}
          className="relative mx-auto w-full"
          style={{
            height: "min(920px, 120vw)",
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="absolute overflow-hidden bg-black shadow-[0_25px_60px_rgba(0,0,0,0.55)] will-change-transform"
              style={{
                width: card.w,
                left: card.x,
                top: card.y,
                zIndex: card.z,
                transform: "rotate(" + card.rot + "deg)",
                transformStyle: "preserve-3d",
              }}
              onMouseMove={(e) => onMove(e, e.currentTarget, 8)}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "rotate(" + card.rot + "deg)";
              }}
            >
              <Link to="/gallery" className="group block">
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={card.src}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white">
                      {card.title}
                    </p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-white/50">
                      {card.sub}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:mt-14">
          <Link
            to="/gallery"
            className="border border-white/20 px-10 py-3 text-[11px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:border-gold hover:text-gold"
          >
            Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
