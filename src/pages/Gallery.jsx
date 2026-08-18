import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense, useRef } from "react";
import GalleryCard from "../pageComponents/gallery/GalleryCard";
import { MASTER_GALLERY_ARCHIVE, TABS } from "../data/galleryData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GalleryModal = lazy(() => import("../pageComponents/gallery/GalleryModal"));

export default function GridGallery() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedTag, setSelectedTag] = useState("all");
  const gridRef = useRef(null);
  const headerRef = useRef(null);

  const filteredGallery = useMemo(() => {
    if (selectedTag === "all") return MASTER_GALLERY_ARCHIVE;
    return MASTER_GALLERY_ARCHIVE.filter((item) => item.tag === selectedTag);
  }, [selectedTag]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 50,
          opacity: 0,
          rotateX: 25,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        });
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("article");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 80, rotateX: 20, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "transform",
      }
    );
  }, [selectedTag]);

  const handleSelectImage = useCallback((index) => setActiveIndex(index), []);
  const handleNext = useCallback(() => {
    setActiveIndex((prev) =>
      prev !== null ? (prev + 1) % filteredGallery.length : null
    );
  }, [filteredGallery.length]);
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredGallery.length) % filteredGallery.length
        : null
    );
  }, [filteredGallery.length]);
  const handleClose = useCallback(() => setActiveIndex(null), []);
  const handleTabChange = useCallback((id) => {
    setSelectedTag(id);
    setActiveIndex(null);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, handleClose, handleNext, handlePrev]);

  useEffect(() => {
    if (activeIndex === null) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = scrollbarWidth + "px";
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [activeIndex]);

  const activeModalImage = useMemo(() => {
    if (activeIndex === null) return null;
    const currentItem = filteredGallery[activeIndex];
    if (!currentItem) return null;
    return {
      ...currentItem,
      img: currentItem.fullAvif || currentItem.thumbAvif || currentItem.img,
    };
  }, [activeIndex, filteredGallery]);

  return (
    <div className="relative w-full overflow-hidden bg-[#050505] px-4 py-24 text-white sm:px-8 md:px-12 lg:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,168,128,0.08),transparent_50%)]" />

      <div
        ref={headerRef}
        className="relative z-10 mx-auto mb-20 max-w-7xl space-y-4 text-center"
        style={{ perspective: "800px" }}
      >
        <span className="block font-serif text-xs uppercase tracking-[0.3em] text-gold">
          Visual Love Stories
        </span>
        <h2 className="font-serif text-3xl font-light tracking-wide sm:text-4xl md:text-5xl">
          The Curated Wedding Archives
        </h2>
        <div className="mx-auto mt-4 h-px w-24 bg-linear-to-r from-transparent via-gold/40 to-transparent" />

        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          {TABS.map((tab) => {
            const isActive = selectedTag === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={
                  "cursor-pointer rounded-full border px-6 py-2 font-serif text-[11px] uppercase tracking-widest transition-all duration-300 " +
                  (isActive
                    ? "border-gold bg-gold/15 text-gold shadow-[0_0_24px_rgba(197,168,128,0.25)]"
                    : "border-white/15 bg-transparent text-white/50 hover:border-gold/40 hover:text-white")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl" style={{ perspective: "1200px" }}>
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{ transformStyle: "preserve-3d" }}
        >
          {filteredGallery.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              isWideFeature={index % 6 === 0}
              onSelect={handleSelectImage}
            />
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md" />}>
          <GalleryModal
            activeImage={activeModalImage}
            onClose={handleClose}
            onNext={handleNext}
            onPrev={handlePrev}
            hasMultiple={filteredGallery.length > 1}
          />
        </Suspense>
      )}
    </div>
  );
}
