import { lazy, Suspense, useEffect } from "react";
import LensHero from "../pageComponents/homepage/LensHero";

const CinematicGallery = lazy(() =>
  import("../pageComponents/homepage/CinematicGallery")
);
const AlbumCollection = lazy(() =>
  import("../pageComponents/homepage/AlbumCollection")
);
const MoreAboutSection = lazy(() =>
  import("../pageComponents/homepage/MoreAboutSection")
);

const SectionSkeleton = () => (
  <div className="w-full bg-[#050505] px-6 py-24 animate-pulse">
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="h-4 w-1/5 rounded bg-white/10" />
      <div className="h-8 w-1/3 rounded bg-white/10" />
      <div className="mt-10 h-72 w-full rounded bg-white/5" />
    </div>
  </div>
);

export default function Homepage() {
  useEffect(() => {
    // Cinematic sections are dark — keep page root coherent while on home
    document.documentElement.style.background = "#050505";
    return () => {
      document.documentElement.style.background = "";
    };
  }, []);

  return (
    <div className="bg-[#050505]">
      <LensHero />

      <Suspense fallback={<SectionSkeleton />}>
        <CinematicGallery />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <div className="border-t border-white/5 bg-[#0a0a0a]">
          <AlbumCollection />
        </div>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <MoreAboutSection />
      </Suspense>
    </div>
  );
}
