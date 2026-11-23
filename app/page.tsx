import Preloader from "@/components/ui/Preloader";
import FrameStage from "@/components/stage/FrameStage";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Intro from "@/components/sections/Intro";
import Listings from "@/components/sections/Listings";
import Process from "@/components/sections/Process";
import Marquee from "@/components/sections/Marquee";
import Faq from "@/components/sections/Faq";
import Finale from "@/components/sections/Finale";

export default function Page() {
  return (
    <>
      <Preloader />

      {/* Fixed film layer behind everything */}
      <FrameStage />

      <main className="relative z-10">
        {/* Hero + flythrough share one scroll range that drives the camera */}
        <div id="journey" className="pointer-events-none">
          <Hero />
          <Story />
        </div>
        <Intro />
        <Listings />
        <Process />
        <Marquee />
        <Faq />
        <Finale />
      </main>
    </>
  );
}
