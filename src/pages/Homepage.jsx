import { lazy, Suspense } from "react";
import HeroSection from "../pageComponents/homepage/Herosection";

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
  return (
    <>
      {/* Hero: video only — untouched */}
      <HeroSection />

      <Suspense fallback={<SectionSkeleton />}>
        <CinematicGallery />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <AlbumCollection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <MoreAboutSection />
      </Suspense>
    </>
  );
}
