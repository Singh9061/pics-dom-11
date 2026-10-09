import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REELS = [
  {
    id: "DaklKDiBn1B",
    url: "https://www.instagram.com/reel/DaklKDiBn1B/",
  },
  {
    id: "DYeuMiph95r",
    url: "https://www.instagram.com/reel/DYeuMiph95r/",
  },
  {
    id: "DWDbLnBgZc1",
    url: "https://www.instagram.com/reel/DWDbLnBgZc1/",
  },
];

function loadInstagramEmbed() {
  return new Promise((resolve) => {
    if (window.instgrm?.Embeds) {
      window.instgrm.Embeds.process();
      resolve();
      return;
    }
    const existing = document.querySelector('script[src*="instagram.com/embed.js"]');
    if (existing) {
      existing.addEventListener("load", () => {
        window.instgrm?.Embeds?.process();
        resolve();
      });
      // already loading
      setTimeout(() => {
        window.instgrm?.Embeds?.process();
        resolve();
      }, 1200);
      return;
    }
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    s.onload = () => {
      window.instgrm?.Embeds?.process();
      resolve();
    };
    document.body.appendChild(s);
  });
}

export default function InstagramReels() {
  const sectionRef = useRef(null);

  useEffect(() => {
    loadInstagramEmbed();

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(".reels-header-el", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });

      gsap.from(".reel-card", {
        y: 50,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".reels-grid",
          start: "top 85%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden border-t border-white/10 bg-[#08060c] px-6 py-24 md:px-12 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,168,128,0.06),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-14 text-center md:mb-16">
          <span className="reels-header-el mb-3 block text-[10px] uppercase tracking-[0.4em] text-gold/70">
            On Instagram
          </span>
          <h2 className="reels-header-el font-serif text-3xl font-light uppercase tracking-[0.12em] text-white sm:text-4xl md:text-5xl">
            Latest{" "}
            <span className="font-semibold italic text-gold">Reels</span>
          </h2>
          <p className="reels-header-el mx-auto mt-4 max-w-md text-sm leading-7 text-white/45 font-light">
            Moments from recent celebrations — follow the full story on Instagram.
          </p>
        </div>

        <div className="reels-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {REELS.map((reel) => (
            <div
              key={reel.id}
              className="reel-card flex justify-center overflow-hidden rounded-xl border border-white/8 bg-black/40"
            >
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={reel.url}
                data-instgrm-version="14"
                style={{
                  background: "#000",
                  border: 0,
                  borderRadius: 12,
                  margin: 0,
                  maxWidth: "100%",
                  minWidth: 280,
                  width: "100%",
                  padding: 0,
                }}
              >
                <a
                  href={reel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-8 text-center text-xs uppercase tracking-widest text-white/40 hover:text-gold"
                >
                  View on Instagram →
                </a>
              </blockquote>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/picsdom.rbl/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-gold"
          >
            @picsdom.rbl on Instagram →
          </a>
        </div>
      </div>
    </section>
  );
}
