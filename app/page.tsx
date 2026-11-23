import SmoothScroll from "@/components/ui/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import Preloader from "@/components/ui/Preloader";
import Nav from "@/components/ui/Nav";
import FrameStage from "@/components/stage/FrameStage";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Listings from "@/components/sections/Listings";
import Marquee from "@/components/sections/Marquee";
import Finale from "@/components/sections/Finale";

export default function Page() {
  return (
    <SmoothScroll>
      <Preloader />
      <Cursor />
      <Nav />

      {/* Fixed film layer behind everything */}
      <FrameStage />

      <main className="relative z-10">
        {/* Hero + flythrough share one scroll range that drives the camera */}
        <div id="journey" className="pointer-events-none">
          <Hero />
          <Story />
        </div>
        <Listings />
        <Marquee />
        <Finale />
      </main>
    </SmoothScroll>
  );
}
