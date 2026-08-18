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
import { c2_pic2, c2_pic11 } from "../../Assets/picture/client2";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scheme Engine style:
 * - Scattered overlapping cards, different sizes
 * - On scroll: lower cards move UP, upper cards move DOWN (crossing parallax)
 * - Big section title on the left
 */
const CARDS = [
  {
    src: c1_pic10,
    title: "Sacred Phere",
    sub: "Heritage Ritual",
    // layout % of field
    left: "6%",
    top: "55%",
    w: "min(38vw, 340px)",
    // scroll: positive = moves up when scrolling down (bottom cards)
    speed: 1.35,
    z: 4,
  },
  {
    src: c2_pic2,
    title: "Royal Baraat",
    sub: "Procession",
    left: "28%",
    top: "28%",
    w: "min(44vw, 400px)",
    speed: 0.55,
    z: 5,
  },
  {
    src: c1_pic5,
    title: "Palace Union",
    sub: "Destination",
    left: "48%",
    top: "8%",
    w: "min(40vw, 380px)",
    // top cards: negative = move down while page scrolls down
    speed: -0.85,
    z: 3,
  },
  {
    src: c1_pic1,
    title: "Crimson Sindoor",
    sub: "Intimate",
    left: "72%",
    top: "2%",
    w: "min(28vw, 260px)",
    speed: -1.2,
    z: 2,
  },
  {
    src: c1_pic7,
    title: "Firelight",
    sub: "Sangeet",
    left: "58%",
    top: "48%",
    w: "min(32vw, 300px)",
    speed: 0.9,
    z: 6,
  },
  {
    src: c2_pic11,
    title: "Legacy",
    sub: "Family Archive",
    left: "8%",
    top: "12%",
    w: "min(26vw, 220px)",
    speed: -0.5,
    z: 1,
  },
  {
    src: c1_pic8,
    title: "Golden Hour",
    sub: "Portrait",
    left: "75%",
    top: "58%",
    w: "min(24vw, 210px)",
    speed: 1.1,
    z: 3,
  },
  {
    src: c1_pic3,
    title: "Quiet Glance",
    sub: "Candid",
    left: "40%",
    top: "68%",
    w: "min(30vw, 280px)",
    speed: 1.5,
    z: 7,
  },
];

export default function CinematicGallery() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Pin the stage while user scrolls through the motion
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=220%",
        pin: pin,
        scrub: true,
        anticipatePin: 1,
      });

      cards.forEach((el, i) => {
        const cfg = CARDS[i];
        // travel distance based on speed sign & magnitude
        const travel = cfg.speed * 280;

        gsap.fromTo(
          el,
          { y: 0 },
          {
            y: travel,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=220%",
              scrub: true,
            },
          }
        );

        // Soft entrance once
        gsap.from(el, {
          opacity: 0,
          scale: 0.92,
          duration: 0.9,
          delay: i * 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0612]"
      style={{ height: "320vh" }}
    >
      <div
        ref={pinRef}
        className="relative flex h-screen w-full overflow-hidden"
      >
        {/* Ambient — Scheme purple dark */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(90,35,110,0.35)_0%,transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_20%,rgba(50,20,70,0.4)_0%,transparent_45%)]" />

        {/* Left title like COMMERCIAL & BRANDED */}
        <div className="relative z-20 flex w-[min(36%,320px)] shrink-0 flex-col justify-center px-6 md:px-12">
          <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-gold/60">
            Immersive Archive
          </p>
          <h2 className="font-serif text-3xl font-light uppercase leading-[1.15] tracking-[0.06em] text-white md:text-5xl">
            Through
            <br />
            the Lens
          </h2>
          <p className="mt-5 hidden max-w-[200px] text-xs leading-relaxed text-white/40 md:block">
            Scroll — frames cross paths in depth.
          </p>
          <Link
            to="/gallery"
            className="mt-8 inline-block w-fit border border-white/25 px-6 py-2.5 text-[10px] uppercase tracking-[0.28em] text-white/70 transition-colors hover:border-gold hover:text-gold"
          >
            Full Gallery
          </Link>
        </div>

        {/* Card field */}
        <div className="relative h-full flex-1">
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="absolute will-change-transform"
              style={{
                left: card.left,
                top: card.top,
                width: card.w,
                zIndex: card.z,
              }}
            >
              <Link to="/gallery" className="group block">
                <div className="overflow-hidden bg-black shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <img
                      src={card.src}
                      alt={card.title}
                      loading={i < 3 ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                </div>
                <div className="mt-2.5 px-0.5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                    {card.title}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-white/45">
                    {card.sub}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
