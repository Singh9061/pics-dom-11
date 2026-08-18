import { useEffect, useRef } from "react";
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

const SLICES = 18;

const GRAIN =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E";

const FRAMES = [
  { src: c1_pic10, title: "Sacred Phere", line: "THROUGH THE LENS" },
  { src: c2_pic2, title: "Royal Baraat", line: "HERITAGE IN MOTION" },
  { src: c1_pic1, title: "Crimson Sindoor", line: "RAW EMOTION" },
  { src: c1_pic5, title: "Palace Union", line: "TIMELESS UNIONS" },
  { src: c1_pic7, title: "Firelight", line: "GOLDEN HOUR" },
  { src: c1_pic8, title: "Legacy", line: "FAMILY ARCHIVES" },
  { src: c2_pic11, title: "Intimate", line: "QUIET MOMENTS" },
  { src: c1_pic3, title: "Quiet Glance", line: "EVERY FRAME A STORY" },
];

function CurvedScreen({ src }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ perspective: "1400px" }}
    >
      <div
        className="relative h-[58vh] w-[min(92vw,1100px)] md:h-[68vh]"
        style={{ transformStyle: "preserve-3d", transform: "rotateX(4deg)" }}
      >
        {Array.from({ length: SLICES }).map((_, i) => {
          const pct = 100 / SLICES;
          const center = SLICES / 2 - 0.5;
          const dist = (i - center) / center;
          const rotY = dist * -28;
          const z = Math.cos((dist * Math.PI) / 2) * 40 - 40;
          return (
            <div
              key={i}
              className="absolute top-0 h-full overflow-hidden"
              style={{
                width: pct + 0.2 + "%",
                left: i * pct + "%",
                transform: "rotateY(" + rotY + "deg) translateZ(" + z + "px)",
                transformOrigin: dist < 0 ? "right center" : "left center",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: "url(" + src + ")",
                  backgroundSize: SLICES * 100 + "% 100%",
                  backgroundPosition: i * pct * -1 + "% center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          );
        })}
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-black/55 via-transparent to-black/55" />
        <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_90px_rgba(0,0,0,0.6)]" />
      </div>
    </div>
  );
}

export default function CinematicGallery() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const progressRef = useRef(null);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const indexRef = useRef(0);
  const framesRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      const total = FRAMES.length;

      framesRef.current.forEach((el, idx) => {
        if (!el) return;
        el.style.opacity = idx === 0 ? "1" : "0";
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + window.innerHeight * total * 0.85,
        pin: pin,
        scrub: 0.65,
        anticipatePin: 1,
        onUpdate: (self) => {
          const i = Math.min(total - 1, Math.floor(self.progress * total));
          if (i !== indexRef.current) {
            indexRef.current = i;
            framesRef.current.forEach((el, idx) => {
              if (!el) return;
              el.style.opacity = idx === i ? "1" : "0";
            });
            if (labelRef.current) labelRef.current.textContent = FRAMES[i].line;
            if (titleRef.current) titleRef.current.textContent = FRAMES[i].title;
          }
          if (progressRef.current) {
            progressRef.current.style.width = self.progress * 100 + "%";
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#08060c]"
      style={{ height: FRAMES.length * 85 + "vh" }}
    >
      <div
        ref={pinRef}
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(80,40,90,0.28)_0%,#08060c_65%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "url(" + GRAIN + ")",
            backgroundSize: "180px",
          }}
        />

        <div className="relative z-20 mb-4 text-center md:mb-6">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">
            Immersive Archive
          </p>
          <h2 className="mt-2 font-serif text-2xl font-light tracking-[0.2em] text-white md:text-4xl">
            Through the lens
          </h2>
        </div>

        <div className="relative z-10 h-[58vh] w-full md:h-[68vh]">
          {FRAMES.map((frame, i) => (
            <div
              key={frame.title}
              ref={(el) => {
                framesRef.current[i] = el;
              }}
              className="absolute inset-0 transition-opacity duration-500 ease-out"
            >
              <CurvedScreen src={frame.src} />
            </div>
          ))}

          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between py-[12vh] md:py-[14vh]">
            <p
              ref={labelRef}
              className="px-4 text-center font-serif text-2xl font-light uppercase tracking-[0.15em] text-white drop-shadow-lg sm:text-3xl md:text-5xl"
            >
              {FRAMES[0].line}
            </p>
            <p
              ref={titleRef}
              className="text-[11px] uppercase tracking-[0.4em] text-white/70"
            >
              {FRAMES[0].title}
            </p>
          </div>
        </div>

        <div className="relative z-20 mt-6 flex w-[min(92vw,480px)] flex-col items-center gap-4">
          <div className="h-px w-full bg-white/10">
            <div
              ref={progressRef}
              className="h-full bg-gold/80"
              style={{ width: "0%" }}
            />
          </div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/35">
            Scroll to explore
          </p>
          <Link
            to="/gallery"
            className="mt-1 border border-white/20 px-8 py-2.5 text-[10px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:border-gold hover:text-gold"
          >
            Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
