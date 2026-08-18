import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiFolder, FiArrowRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { c2_pic1, c2_pic10, c2_pic7 } from "../../Assets/picture/client2";

gsap.registerPlugin(ScrollTrigger);

const indianWeddingAlbums = [
  {
    id: "royal-palace-union",
    title: "The Palace Shehnai & Sindoor",
    count: "120 Heritage Frames",
    celebration: "Royal Baraat & Pheras",
    coverImage: c2_pic1,
    link: "/gallery",
  },
  {
    id: "monochrome-tales",
    title: "Intimate Jharokha Portraits",
    count: "65 Cinematic Portraits",
    celebration: "Regal Bridal Dressing & Details",
    coverImage: c2_pic7,
    link: "/gallery",
  },
  {
    id: "sangeet-soiree",
    title: "The Champagne Sangeet Beats",
    count: "85 High-Motion Captures",
    celebration: "Midnight Shadi Festivities",
    coverImage: c2_pic10,
    link: "/gallery",
  },
];

export default function AlbumCollection() {
  const collectionRef = useRef(null);
  const headerRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    const section = collectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        });
      }

      rowsRef.current.filter(Boolean).forEach((row, i) => {
        const imgWrap = row.querySelector(".album-img-wrap");
        const meta = row.querySelector(".album-meta");

        gsap.fromTo(
          row,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
            },
          }
        );

        if (imgWrap) {
          gsap.fromTo(
            imgWrap,
            { scale: 1.12, clipPath: "inset(8% 8% 8% 8%)" },
            {
              scale: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.25,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
              },
            }
          );

          const img = imgWrap.querySelector("img");
          if (img) {
            gsap.to(img, {
              yPercent: -10,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4,
              },
            });
          }
        }

        if (meta) {
          gsap.from(meta.children, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (e) => {
    if (window.innerWidth < 768) return;
    const row = e.currentTarget;
    const image = row.querySelector(".album-cover-img");
    const titleText = row.querySelector(".album-title");
    const arrowCircle = row.querySelector(".album-arrow-circle");

    gsap.to(image, { scale: 1.06, duration: 0.7, ease: "power2.out" });
    gsap.to(titleText, { color: "#c5a880", duration: 0.3 });
    gsap.to(arrowCircle, {
      backgroundColor: "#c5a880",
      borderColor: "#c5a880",
      x: 6,
      color: "#ffffff",
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (e) => {
    if (window.innerWidth < 768) return;
    const row = e.currentTarget;
    const image = row.querySelector(".album-cover-img");
    const titleText = row.querySelector(".album-title");
    const arrowCircle = row.querySelector(".album-arrow-circle");

    gsap.to(image, { scale: 1, duration: 0.7, ease: "power2.out" });
    gsap.to(titleText, { color: "#ffffff", duration: 0.3 });
    gsap.to(arrowCircle, {
      backgroundColor: "transparent",
      borderColor: "rgba(197, 168, 128, 0.4)",
      x: 0,
      color: "#c5a880",
      duration: 0.35,
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={collectionRef}
      className="relative w-full overflow-hidden border-t border-white/10 bg-[#0a0a0a] px-6 py-24 md:px-12 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div ref={headerRef} className="mb-20">
          <span className="mb-3 block text-xs uppercase tracking-[0.3em] text-gold/70">
            Luxury Shaadi Heirlooms
          </span>
          <h2 className="font-serif text-3xl font-light uppercase tracking-[0.15em] text-white sm:text-4xl md:text-5xl">
            Heritage{" "}
            <span className="font-semibold italic text-gold">Archives</span>
          </h2>
        </div>

        <div className="flex flex-col gap-16">
          {indianWeddingAlbums.map(
            ({ id, title, count, celebration, coverImage, link }, index) => (
              <div
                key={id}
                ref={(el) => {
                  rowsRef.current[index] = el;
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="group flex flex-col gap-8 border-b border-white/10 pb-14 last:border-0 last:pb-0 md:flex-row md:items-center"
              >
                <Link
                  to={link}
                  className="album-img-wrap relative aspect-video w-full shrink-0 overflow-hidden border border-white/10 md:w-[420px] lg:w-[520px]"
                >
                  <img
                    src={coverImage}
                    alt={title}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="album-cover-img h-[120%] w-full object-cover"
                  />
                  <div className="absolute top-0 left-0 h-full w-4 bg-linear-to-r from-black/40 via-black/10 to-transparent" />
                </Link>

                <div className="album-meta flex flex-1 flex-col justify-between py-2">
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-widest text-white/40">
                      <span className="flex items-center gap-1.5 font-medium text-gold">
                        <FiFolder size={12} />
                        {count}
                      </span>
                      <span className="hidden text-gold/30 sm:inline">&bull;</span>
                      <span>{celebration}</span>
                    </div>

                    <h3 className="album-title font-serif text-2xl font-light tracking-wide text-white md:text-3xl lg:text-4xl">
                      {title}
                    </h3>
                  </div>

                  <div className="mt-8 md:mt-12">
                    <Link
                      to={link}
                      className="inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
                    >
                      <span className="transition-colors hover:text-gold">
                        View Love Story
                      </span>
                      <div className="album-arrow-circle flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold">
                        <FiArrowRight size={14} />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
