import React, { memo, useRef } from "react";
import { FiMaximize2 } from "react-icons/fi";

const GalleryCard = memo(function GalleryCard({ item, index, isWideFeature, onSelect }) {
  const isPriority = index < 2;
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rotY = (x - 0.5) * 18;
    const rotX = (0.5 - y) * 14;
    el.style.transform =
      "perspective(1000px) rotateX(" +
      rotX +
      "deg) rotateY(" +
      rotY +
      "deg) translateZ(20px) scale3d(1.04,1.04,1.04)";
    if (glareRef.current) {
      glareRef.current.style.opacity = "1";
      glareRef.current.style.background =
        "radial-gradient(circle at " +
        x * 100 +
        "% " +
        y * 100 +
        "%, rgba(197,168,128,0.35), transparent 50%)";
    }
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (el) {
      el.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1,1,1)";
    }
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <article
      ref={cardRef}
      onClick={() => onSelect(index)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={
        "group relative w-full cursor-zoom-in overflow-hidden border border-white/10 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-transform duration-200 ease-out will-change-transform transform-gpu " +
        (isWideFeature ? "sm:col-span-2 aspect-video" : "col-span-1 aspect-4/5")
      }
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300"
      />

      <img
        src={item.img}
        alt={item.alt}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : "low"}
        decoding="async"
        draggable={false}
        className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ transform: "translateZ(30px)" }}
      />

      <div className="absolute inset-0 z-20 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex items-end justify-between p-6 text-white">
          <div className="max-w-[85%] space-y-1">
            <span className="block font-serif text-[10px] uppercase tracking-[0.25em] text-gold">
              Chapter {index + 1}
            </span>
            <p className="truncate font-serif text-xs font-light tracking-wide text-neutral-100 sm:text-sm">
              {item.alt}
            </p>
          </div>
          <div className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm">
            <FiMaximize2 size={14} />
          </div>
        </div>
      </div>
    </article>
  );
});

GalleryCard.displayName = "GalleryCard";
export default GalleryCard;
