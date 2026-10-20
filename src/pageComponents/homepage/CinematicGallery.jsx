import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { c1_pic1, c1_pic10 } from "../../Assets/picture/client1";
import { c2_pic2 } from "../../Assets/picture/client2";

gsap.registerPlugin(ScrollTrigger);

const STORIES = [
  { src: c1_pic10, number: "01", title: "The Sacred Beginning", category: "Wedding Rituals", shape: "portrait" },
  { src: c2_pic2, number: "02", title: "A Royal Arrival", category: "The Celebration", shape: "landscape" },
  { src: c1_pic1, number: "03", title: "The Promise", category: "Quiet Moments", shape: "portrait" },
];

export default function CinematicGallery() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      // Cinematic title entrance with a staggered editorial reveal.
      const intro = gsap.timeline({
        scrollTrigger: { trigger: "[data-cinema-intro]", start: "top 78%", once: true },
      });
      intro
        .from("[data-cinema-kicker]", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from("[data-cinema-title-line]", {
          yPercent: 115, rotate: 2, opacity: 0, duration: 1.05, stagger: 0.16, ease: "power4.out",
        }, "-=0.35")
        .from("[data-cinema-copy]", { y: 24, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.55")
        .from("[data-cinema-rule]", { scaleX: 0, transformOrigin: "left center", duration: 1.1, ease: "power3.inOut" }, "-=0.45");

      gsap.utils.toArray("[data-story-card]").forEach((card, index) => {
        const image = card.querySelector("[data-story-image]");
        const mask = card.querySelector("[data-image-mask]");
        const meta = card.querySelector("[data-story-meta]");
        const frame = card.querySelector("[data-frame-number]");

        gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 78%", once: true },
          delay: index * 0.08,
        })
          .fromTo(mask, { scaleY: 1, transformOrigin: "bottom" }, { scaleY: 0, duration: 1.15, ease: "power4.inOut" })
          .fromTo(image, { scale: 1.32, yPercent: 8, rotate: index % 2 ? 2 : -2 }, {
            scale: 1, yPercent: 0, rotate: 0, duration: 1.7, ease: "power3.out",
          }, "-=0.95")
          .fromTo(meta, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, "-=0.8")
          .fromTo(frame, { opacity: 0, scale: 1.5, rotate: -12 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: "back.out(1.8)" }, "-=0.8");

        // Gentle scroll-linked camera drift: cinematic, not distracting.
        gsap.to(image, {
          yPercent: index === 1 ? 7 : -7,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });

        // Editorial image frame responds to pointer movement on desktop.
        const onMove = (event) => {
          if (window.matchMedia("(hover: none)").matches) return;
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          gsap.to(image, { x: x * 12, y: y * 12, duration: 0.55, ease: "power2.out", overwrite: "auto" });
        };
        const onLeave = () => gsap.to(image, { x: 0, duration: 0.7, ease: "power3.out", overwrite: "auto" });
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        ctx.add(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

      gsap.from("[data-cinema-outro]", {
        y: 45, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: "[data-cinema-outro]", start: "top 85%", once: true },
      });
      gsap.to("[data-cinema-orbit]", {
        rotate: 360, duration: 34, ease: "none", repeat: -1, transformOrigin: "50% 50%",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="cinematic-gallery-title"
      className="relative isolate overflow-hidden bg-[#080706] px-5 py-24 text-[#f5f0e8] sm:px-8 sm:py-32 lg:px-12 lg:py-40"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-36 top-20 h-[30rem] w-[30rem] rounded-full border border-[#c7a878]/10" data-cinema-orbit />
        <div className="absolute -right-20 top-36 h-[26rem] w-[26rem] rounded-full border border-[#c7a878]/10" />
        <div className="absolute left-1/2 top-0 h-[480px] w-[min(90vw,1000px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(191,158,111,0.16),transparent_68%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#bfa477]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#bfa477]/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <div data-cinema-intro className="mb-14 grid gap-8 md:mb-20 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-4xl">
            <p data-cinema-kicker className="mb-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-[#c7a878] sm:text-[10px]">
              <span className="h-px w-10 bg-[#c7a878]" />
              The art of remembering
              <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#c7a878]" />
            </p>
            <h2 id="cinematic-gallery-title" className="font-serif text-[clamp(3.5rem,10vw,9rem)] font-light leading-[0.82] tracking-[-0.065em]">
              <span className="block overflow-hidden pb-2"><span data-cinema-title-line className="block">Through the</span></span>
              <span className="block overflow-hidden pb-3 pl-[8vw] sm:pl-[12vw]"><span data-cinema-title-line className="block italic text-[#c7a878]">lens<span className="text-white">.</span></span></span>
            </h2>
          </div>
          <p data-cinema-copy className="max-w-sm text-sm leading-7 text-white/55 md:pb-2">
            Not just photographs. A living collection of glances, grand traditions and promises that deserve to be remembered for a lifetime.
          </p>
        </div>

        <div data-cinema-rule className="mb-10 flex items-center justify-between border-y border-white/10 py-4">
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/45 sm:text-[10px]">A collection of once-in-a-lifetime moments</p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#c7a878]">01 <span className="text-white/30">/</span> 03</p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-y-28">
          {STORIES.map((story, index) => (
            <article
              key={story.number}
              data-story-card
              className={`group min-w-0 ${index === 0 ? "lg:col-span-5 lg:mt-8" : index === 1 ? "sm:mt-24 lg:col-span-6 lg:col-start-7 lg:mt-0" : "sm:col-span-2 sm:mx-auto sm:w-[72%] lg:col-span-5 lg:col-start-3 lg:mx-0 lg:mt-[-2rem] lg:w-full"}`}
            >
              <div className={`relative isolate overflow-hidden bg-[#171310] ${index === 1 ? "aspect-[5/3]" : "aspect-[4/5]"}`}>
                <img
                  data-story-image
                  src={story.src}
                  alt={`${story.title} — wedding photography by Picsdom`}
                  className="absolute inset-0 h-full w-full object-cover will-change-transform transition-[filter] duration-700 group-hover:brightness-110"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
                <div data-image-mask className="absolute inset-0 z-10 bg-[#c7a878]" />
                <div className="pointer-events-none absolute inset-0 z-[11] bg-gradient-to-t from-black/70 via-black/5 to-black/15 opacity-75 transition-opacity duration-700 group-hover:opacity-100" />
                <span data-frame-number className="absolute left-4 top-4 z-20 border border-white/35 bg-black/20 px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-white backdrop-blur-sm">FRAME {story.number}</span>
                <span className="absolute bottom-4 right-4 z-20 text-[9px] uppercase tracking-[0.25em] text-white/80">Picsdom · Stories</span>
                <span aria-hidden="true" className="pointer-events-none absolute -bottom-7 -left-2 z-20 font-serif text-[7rem] leading-none text-white/15 sm:text-[9rem]">{story.number}</span>
              </div>
              <div data-story-meta className="flex items-start justify-between gap-4 border-b border-white/15 py-5">
                <div>
                  <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-[#c7a878]">{story.category}</p>
                  <h3 className="font-serif text-2xl font-light tracking-wide sm:text-3xl">{story.title}</h3>
                </div>
                <span aria-hidden="true" className="mt-2 text-xl text-[#c7a878] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </div>
            </article>
          ))}
        </div>

        <div data-cinema-outro className="relative mt-20 flex flex-col items-start justify-between gap-8 border-t border-white/10 pt-9 sm:mt-28 sm:flex-row sm:items-center">
          <div aria-hidden="true" className="absolute -top-px left-0 h-px w-24 bg-[#c7a878]" />
          <p className="max-w-lg font-serif text-2xl font-light leading-relaxed text-white/70 sm:text-3xl">
            The day may pass. The feeling stays.
            <span className="mt-1 block italic text-[#c7a878]">Let us keep it forever.</span>
          </p>
          <Link to="/gallery" className="group inline-flex min-h-12 items-center gap-6 border border-[#c7a878]/60 px-6 py-3 text-[9px] uppercase tracking-[0.25em] text-[#f5f0e8] transition-all duration-500 hover:bg-[#c7a878] hover:text-[#080706] sm:text-[10px]">
            Explore the full gallery
            <span aria-hidden="true" className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
