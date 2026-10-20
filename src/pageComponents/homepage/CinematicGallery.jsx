import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { c1_pic1, c1_pic10 } from "../../Assets/picture/client1";
import { c2_pic2 } from "../../Assets/picture/client2";

gsap.registerPlugin(ScrollTrigger);

const STORIES = [
  {
    src: c1_pic10,
    number: "01",
    title: "The Sacred Beginning",
    category: "Wedding Rituals",
    shape: "portrait",
  },
  {
    src: c2_pic2,
    number: "02",
    title: "A Royal Arrival",
    category: "The Celebration",
    shape: "landscape",
  },
  {
    src: c1_pic1,
    number: "03",
    title: "The Promise",
    category: "Quiet Moments",
    shape: "portrait",
  },
];

export default function CinematicGallery() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-story-intro]", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-story-intro]", start: "top 88%" },
      });

      gsap.utils.toArray("[data-story-card]").forEach((card, index) => {
        const image = card.querySelector("[data-story-image]");
        gsap.fromTo(
          card,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
          }
        );
        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.08 },
            {
              scale: 1,
              duration: 1.25,
              ease: "power2.out",
              scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
            }
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="cinematic-gallery-title"
      className="relative overflow-hidden bg-[#080706] px-5 py-20 text-[#f5f0e8] sm:px-8 sm:py-28 lg:px-12 lg:py-36"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[min(90vw,900px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(191,158,111,0.12),transparent_68%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#bfa477]/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <div className="mb-12 grid gap-8 md:mb-16 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-3xl">
            <p data-story-intro className="mb-5 flex items-center gap-3 text-[9px] uppercase tracking-[0.35em] text-[#c7a878] sm:text-[10px]">
              <span className="h-px w-8 bg-[#c7a878]" />
              The art of remembering
            </p>
            <h2 data-story-intro id="cinematic-gallery-title" className="font-serif text-5xl font-light leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[6.5rem]">
              Through the
              <span className="mt-1 block italic text-[#c7a878]">lens.</span>
            </h2>
          </div>
          <p data-story-intro className="max-w-sm text-sm leading-7 text-white/55 md:pb-2">
            More than photographs, these are the little glances, grand traditions and unspoken promises that make your story entirely yours.
          </p>
        </div>

        <div className="mb-8 flex items-center justify-between border-y border-white/10 py-4">
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/45 sm:text-[10px]">Selected wedding stories</p>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#c7a878]">01 — 03</p>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          {STORIES.map((story, index) => (
            <article
              key={story.number}
              data-story-card
              className={`group min-w-0 ${index === 0 ? "lg:col-span-5 lg:mt-8" : index === 1 ? "sm:mt-20 lg:col-span-6 lg:col-start-7 lg:mt-0" : "sm:col-span-2 sm:mx-auto sm:w-[72%] lg:col-span-5 lg:col-start-3 lg:mx-0 lg:mt-[-1rem] lg:w-full"}`}
            >
              <div className={`relative overflow-hidden bg-[#171310] ${index === 1 ? "aspect-[5/3]" : "aspect-[4/5]"}`}>
                <img
                  data-story-image
                  src={story.src}
                  alt={`${story.title} — wedding photography by Picsdom`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5 opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute left-4 top-4 border border-white/30 bg-black/20 px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-white backdrop-blur-sm">
                  FRAME {story.number}
                </span>
                <span className="absolute bottom-4 right-4 text-[9px] uppercase tracking-[0.25em] text-white/80">
                  Picsdom stories
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-white/15 py-5">
                <div>
                  <p className="mb-2 text-[9px] uppercase tracking-[0.25em] text-[#c7a878]">{story.category}</p>
                  <h3 className="font-serif text-2xl font-light tracking-wide sm:text-3xl">{story.title}</h3>
                </div>
                <span aria-hidden="true" className="mt-2 text-xl text-[#c7a878] transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:mt-24 sm:flex-row sm:items-center">
          <p className="max-w-md font-serif text-xl font-light leading-relaxed text-white/65 sm:text-2xl">
            Every celebration has a feeling. <span className="italic text-[#c7a878]">We keep it forever.</span>
          </p>
          <Link
            to="/gallery"
            className="group inline-flex min-h-12 items-center gap-6 border border-[#c7a878]/60 px-6 py-3 text-[9px] uppercase tracking-[0.25em] text-[#f5f0e8] transition-colors duration-300 hover:bg-[#c7a878] hover:text-[#080706] sm:text-[10px]"
          >
            Explore the full gallery
            <span aria-hidden="true" className="text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
