"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { brand } from "@/lib/content";
import { app, scrollToId } from "@/lib/store";

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const home = pathname === "/";

  useEffect(() => {
    // Off the home page (or after the intro), the nav is simply there.
    if (!home || app.introPlayed) {
      gsap.set(ref.current, { yPercent: 0 });
      return;
    }
    gsap.set(ref.current, { yPercent: -120 });
    const show = () => gsap.to(ref.current, { yPercent: 0, duration: 1.2, delay: 0.6, ease: "expo.out" });
    window.addEventListener("intro:start", show);
    return () => window.removeEventListener("intro:start", show);
  }, [home]);

  const go = (id: string) => (home ? scrollToId(id) : router.push(`/#${id}`));

  const link =
    "relative py-1 after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-white after:transition-transform after:duration-500 after:ease-out-expo hover:after:origin-left hover:after:scale-x-100";

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 text-white md:px-10">
      {/* soft top shade so the nav reads over bright footage */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-slate/55 to-transparent" />
      <button
        onClick={() => (home ? scrollToId("journey") : router.push("/"))}
        className="display metal lift text-2xl"
        aria-label={`${brand.name}, home`}
      >
        {brand.name}
      </button>
      <nav className="flex gap-6 text-sm font-medium md:gap-9">
        <button className={link} onClick={() => go("homes")}>
          Homes
        </button>
        <button className={link} onClick={() => go("faq")}>
          Questions
        </button>
        <button className={link} onClick={() => go("finale")}>
          Book a viewing
        </button>
      </nav>
    </header>
  );
}
