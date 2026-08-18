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

export default function CinematicGallery() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const stageRef = useRef(null);
  const progressRef = useRef(null);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const slidesRef = useRef([]);
  const indexRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    if (!section || !pin || !stage) return;

    const slides = slidesRef.current.filter(Boolean);
    if (slides.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(slides, { opacity: 0, scale: 1.04 });
      gsap.set(slides[0], { opacity: 1, scale: 1 });

      const total = FRAMES.length;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + window.innerHeight * (total * 0.7),
        pin: pin,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          const raw = self.progress * total;
          const i = Math.min(total - 1, Math.floor(raw));

          if (progressRef.current) {
            progressRef.current.style.transform =
              "scaleX(" + self.progress + ")";
          }

          if (i === indexRef.current) return;
          const prev = indexRef.current;
          indexRef.current = i;

          // Smooth crossfade — no hard cuts
          if (slides[prev]) {
            gsap.to(slides[prev], {
              opacity: 0,
              scale: 1.06,
              duration: 0.55,
              ease: "power2.inOut",
              overwrite: true,
            });
          }
          if (slides[i]) {
            gsap.fromTo(
              slides[i],
              { opacity: 0, scale: 1.06 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.55,
                ease: "power2.inOut",
                overwrite: true,
              }
            );
          }

          if (labelRef.current) {
            gsap.fromTo(
              labelRef.current,
              { opacity: 0, y: 16 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                onStart: () => {
                  labelRef.current.textContent = FRAMES[i].line;
                },
              }
            );
          }
          if (titleRef.current) {
            titleRef.current.textContent = FRAMES[i].title;
          }
        },
      });

      // Gentle float on the curved stage
      gsap.to(stage, {
        y: -12,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + window.innerHeight * (total * 0.7),
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#08060c]"
      style={{ height: FRAMES.length * 70 + "vh" }}
    >
      <div
        ref={pinRef}
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(70,35,80,0.22)_0%,#08060c_60%)]" />

        <div className="relative z-20 mb-5 text-center md:mb-8">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gold/70">
            Immersive Archive
          </p>
          <h2 className="mt-2 font-serif text-2xl font-light tracking-[0.2em] text-white md:text-4xl">
            Through the lens
          </h2>
        </div>

        {/* Single smooth curved panel — no strip seams */}
        <div
          ref={stageRef}
          className="relative z-10 w-[min(92vw,1080px)]"
          style={{ perspective: "1600px" }}
        >
          <div
            className="relative aspect-video overflow-hidden bg-black"
            style={{
              transform: "rotateX(6deg)",
              transformStyle: "preserve-3d",
              borderRadius: "4px",
              boxShadow:
                "0 40px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            {FRAMES.map((frame, i) => (
              <div
                key={frame.title}
                ref={(el) => {
                  slidesRef.current[i] = el;
                }}
                className="absolute inset-0 will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <img
                  src={frame.src}
                  alt={frame.title}
                  className="h-full w-full object-cover"
                  draggable={false}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}

            {/* Edge fade = soft curve feel without slice gaps */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-black/40" />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.45)]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent" />

            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-between px-6 py-10 md:py-14">
              <p
                ref={labelRef}
                className="text-center font-serif text-xl font-light uppercase tracking-[0.12em] text-white drop-shadow-md sm:text-3xl md:text-4xl"
              >
                {FRAMES[0].line}
              </p>
              <p
                ref={titleRef}
                className="text-[10px] uppercase tracking-[0.4em] text-white/65"
              >
                {FRAMES[0].title}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-8 flex w-[min(90vw,420px)] flex-col items-center gap-3">
          <div className="h-px w-full origin-left overflow-hidden bg-white/10">
            <div
              ref={progressRef}
              className="h-full w-full origin-left bg-gold/80"
              style={{ transform: "scaleX(0)" }}
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
