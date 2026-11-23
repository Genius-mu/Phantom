"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { AnimatePresence, motion } from "motion/react";
import Magnetic from "@/components/ui/Magnetic";
import FallingTags from "./FallingTags";
import { brand, type Listing } from "@/lib/content";
import { app } from "@/lib/store";

function Fact({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="detail-fact border-t border-white/15 pt-5">
      <dt className="text-sm text-white/60">{label}</dt>
      <dd className="display metal mt-2 text-2xl md:text-3xl">{value}</dd>
    </div>
  );
}

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [shown, setShown] = useState(images);
  const [open, setOpen] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (open === null) return;
    app.lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % shown.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + shown.length) % shown.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      app.lenis?.start();
    };
  }, [open, shown.length]);

  return (
    <>
      <div ref={wrap} className="overflow-hidden">
        <motion.div
          drag="x"
          onDragStart={() => (dragging.current = true)}
          onDragEnd={() => window.setTimeout(() => (dragging.current = false), 60)}
          dragConstraints={wrap}
          dragElastic={0.08}
          data-cursor="Drag"
          className="flex w-max gap-5 px-6 md:gap-8 md:px-10"
        >
          {shown.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => !dragging.current && setOpen(i)}
              className="group relative h-[60vh] w-[78vw] shrink-0 overflow-hidden rounded-[24px] bg-white/5 md:h-[70vh] md:w-[48vw]"
              aria-label={`Open photo ${i + 1} of ${name}`}
            >
              <img
                src={src}
                alt=""
                draggable={false}
                loading="lazy"
                onError={() => setShown((s) => s.filter((x) => x !== src))}
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
              />
            </button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate/95 p-4 backdrop-blur-md md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${name} photos`}
          >
            <motion.img
              key={shown[open]}
              src={shown[open]}
              alt=""
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-full max-w-full rounded-[20px] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 text-white">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open - 1 + shown.length) % shown.length);
                }}
                className="rounded-full bg-white/10 px-5 py-3 text-sm font-medium hover:bg-white hover:text-slate"
              >
                Previous
              </button>
              <span className="text-sm tabular-nums text-white/70">
                {open + 1} / {shown.length}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open + 1) % shown.length);
                }}
                className="rounded-full bg-white/10 px-5 py-3 text-sm font-medium hover:bg-white hover:text-slate"
              >
                Next
              </button>
            </div>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute right-6 top-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Booking({ l }: { l: Listing }) {
  const [sent, setSent] = useState(false);
  const phone = brand.phone.replace(/[^\d]/g, "");
  const wa = `https://wa.me/${phone}?text=${encodeURIComponent(`Hello, I'd like to view ${l.name} in ${l.area}.`)}`;
  const field =
    "w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-base text-white outline-none transition-colors placeholder:text-white/40 focus:border-white";

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-20">
      <div>
        <h2 className="display metal text-[12vw] md:text-[5vw]">Book a viewing</h2>
        <p className="mt-6 max-w-[34ch] text-base leading-relaxed text-white/70 md:text-lg">
          Choose a day and we&apos;ll confirm a time within one working day. Viewings are private, and usually take about an hour.
        </p>
        <div className="mt-10 flex flex-col gap-3 text-base font-medium">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="w-fit underline decoration-white/30 underline-offset-8 hover:decoration-white">
            Message us on WhatsApp
          </a>
          <a href={`tel:+${phone}`} className="w-fit underline decoration-white/30 underline-offset-8 hover:decoration-white">
            Call {brand.phone}
          </a>
        </div>
      </div>

      {sent ? (
        <div className="flex flex-col justify-center rounded-[28px] border border-white/15 p-10" aria-live="polite">
          <p className="display metal text-4xl md:text-5xl">Request sent.</p>
          <p className="mt-4 text-white/70">We&apos;ll call you within one working day to confirm your viewing of {l.name}.</p>
        </div>
      ) : (
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input type="hidden" name="listing" value={l.slug} />
          <label className="sr-only" htmlFor="b-name">Full name</label>
          <input id="b-name" name="name" required placeholder="Full name" className={field} />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="sr-only" htmlFor="b-phone">Phone number</label>
            <input id="b-phone" name="phone" type="tel" required placeholder="Phone number" className={field} />
            <label className="sr-only" htmlFor="b-date">Preferred date</label>
            <input id="b-date" name="date" type="date" required className={`${field} [color-scheme:dark]`} />
          </div>
          <label className="sr-only" htmlFor="b-msg">Anything we should know</label>
          <textarea id="b-msg" name="message" rows={4} placeholder="Anything we should know? (optional)" className={field} />
          <div className="mt-2">
            <Magnetic strength={0.25}>
              <button type="submit" className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate transition-colors hover:bg-pool hover:text-white">
                Request viewing
              </button>
            </Magnetic>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ListingDetail({ listing: l, next }: { listing: Listing; next: Listing }) {
  const root = useRef<HTMLDivElement>(null);
  const heroImg = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // hero: settle in, then drift slower than the page
      gsap.fromTo(heroImg.current, { scale: 1.25 }, { scale: 1.08, duration: 2.2, ease: "expo.out" });
      gsap.to(heroImg.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: ".detail-hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.from(".detail-fact", {
        y: 30,
        opacity: 0,
        stagger: 0.05,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".detail-facts", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, [l.slug]);

  const letters = l.name.split("");

  return (
    <div ref={root} className="bg-slate">
      {/* ── Hero ── */}
      <section className="detail-hero relative flex h-[100svh] flex-col justify-end overflow-hidden px-6 pb-10 md:px-10">
        <img ref={heroImg} src={l.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate via-slate/30 to-slate/40" />

        <Link
          href="/#homes"
          className="lift absolute left-6 top-24 z-10 text-sm font-medium text-white underline decoration-white/40 underline-offset-8 hover:decoration-white md:left-10"
        >
          All homes
        </Link>

        <div className="relative">
          <p className="lift text-base font-medium text-white md:text-lg">
            {l.type} in {l.district}
          </p>
          <h1 className="display lift mt-3 text-[15vw] md:text-[9vw]" aria-label={l.name}>
            <span className="block overflow-hidden pb-[0.08em]" aria-hidden>
              {letters.map((ch, i) => (
                <motion.span
                  key={i}
                  className="metal inline-block whitespace-pre"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.025 }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          </h1>
          <motion.div
            className="mt-6 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="rounded-full bg-white px-5 py-2.5 text-base font-semibold text-slate">{l.price}</span>
            <span className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md">{l.status}</span>
            <span className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md">
              {l.beds} bed, {l.baths} bath
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Key facts ── */}
      <section className="px-6 py-[14vh] md:px-10" aria-labelledby="facts-heading">
        <h2 id="facts-heading" className="display metal text-[11vw] md:text-[4.5vw]">
          Key facts
        </h2>
        <dl className="detail-facts mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-10">
          <Fact label="Asking price" value={l.price} />
          <Fact label="Bedrooms" value={l.beds} />
          <Fact label="Bathrooms" value={l.baths} />
          <Fact label="Built-up area" value={l.size} />
          <Fact label="Plot size" value={l.plot} />
          <Fact label="Title document" value={l.title} />
          <Fact label="Completion" value={l.completion} />
          <Fact label="Parking" value={l.parking} />
          <Fact label="Service charge" value={l.serviceCharge} />
          <Fact label="Power" value={l.power} />
          <Fact label="Property type" value={l.type} />
          <Fact label="Status" value={l.status} />
        </dl>
      </section>

      {/* ── About + falling features ── */}
      <section className="grid gap-14 px-6 pb-[14vh] md:grid-cols-2 md:gap-20 md:px-10" aria-labelledby="about-heading">
        <div>
          <h2 id="about-heading" className="display metal text-[11vw] md:text-[4.5vw]">
            About the home
          </h2>
          <p className="mt-8 text-2xl font-medium leading-snug text-white md:text-3xl">{l.summary}</p>
          {l.description.map((p) => (
            <p key={p.slice(0, 24)} className="mt-6 max-w-[56ch] text-base leading-relaxed text-white/70 md:text-lg">
              {p}
            </p>
          ))}
        </div>
        <div>
          <div className="mb-5 flex items-end justify-between">
            <h3 className="display metal text-3xl md:text-4xl">What&apos;s inside</h3>
            <span className="text-sm text-white/50">Drag them around</span>
          </div>
          <FallingTags tags={l.features} />
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="pb-[14vh]" aria-labelledby="gallery-heading">
        <div className="mb-10 flex items-end justify-between px-6 md:px-10">
          <h2 id="gallery-heading" className="display metal text-[11vw] md:text-[4.5vw]">
            Photos
          </h2>
          <span className="text-sm text-white/50">Drag, or click to enlarge</span>
        </div>
        <Gallery images={l.gallery} name={l.name} />
      </section>

      {/* ── Location ── */}
      <section className="grid gap-12 px-6 pb-[14vh] md:grid-cols-[1fr_1.4fr] md:gap-20 md:px-10" aria-labelledby="where-heading">
        <div>
          <h2 id="where-heading" className="display metal text-[11vw] md:text-[4.5vw]">
            Where it is
          </h2>
          <p className="mt-6 text-base text-white/70 md:text-lg">{l.district}</p>
          <ul className="mt-10 border-t border-white/15">
            {l.nearby.map(([place, time]) => (
              <li key={place} className="flex items-baseline justify-between gap-6 border-b border-white/15 py-4">
                <span className="text-base text-white md:text-lg">{place}</span>
                <span className="text-sm tabular-nums text-white/60">{time} by car</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-white/15">
          <iframe
            title={`Map of ${l.district}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(l.mapQuery)}&z=14&output=embed`}
            className="h-[420px] w-full grayscale md:h-full md:min-h-[480px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* ── Paperwork ── */}
      <section className="px-6 pb-[14vh] md:px-10" aria-labelledby="papers-heading">
        <div className="rounded-[28px] bg-white/[0.05] p-8 md:p-14">
          <h2 id="papers-heading" className="display metal text-[10vw] md:text-[4vw]">
            Payment and paperwork
          </h2>
          <dl className="mt-10 grid gap-8 md:grid-cols-3">
            <div>
              <dt className="text-sm text-white/60">Payment plan</dt>
              <dd className="mt-2 text-lg font-medium text-white">{l.paymentPlan}</dd>
            </div>
            <div>
              <dt className="text-sm text-white/60">Title document</dt>
              <dd className="mt-2 text-lg font-medium text-white">{l.title}</dd>
            </div>
            <div>
              <dt className="text-sm text-white/60">Service charge</dt>
              <dd className="mt-2 text-lg font-medium text-white">{l.serviceCharge}</dd>
            </div>
          </dl>
          <p className="mt-10 max-w-[60ch] text-sm leading-relaxed text-white/60">
            Copies of the title, survey plan and building approval go to your lawyer before any payment. Payments are made into escrow and released at handover.
          </p>
        </div>
      </section>

      {/* ── Booking ── */}
      <section className="px-6 pb-[16vh] md:px-10" aria-label="Book a viewing">
        <Booking l={l} />
      </section>

      {/* ── Next home ── */}
      <Link
        href={`/homes/${next.slug}`}
        data-cursor="Next"
        className="group relative block overflow-hidden border-t border-white/15 px-6 py-[12vh] md:px-10"
      >
        <img
          src={next.image}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-[1.2s] ease-out-expo group-hover:scale-100 group-hover:opacity-40"
        />
        <span className="relative text-sm font-medium text-white/70">Next home, {next.area}</span>
        <span className="display metal relative mt-4 block text-[14vw] md:text-[8vw]">{next.name}</span>
      </Link>

      <footer className="flex justify-between px-6 py-6 text-xs text-white/50 md:px-10">
        <span>
          © {new Date().getFullYear()} {brand.name}
        </span>
        <span>Details are provided by the seller and should be verified.</span>
      </footer>
    </div>
  );
}
