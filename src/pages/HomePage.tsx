import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, Users, ShieldCheck, Fish, Clock, Waves } from "lucide-react";
import { properties, beaches } from "../data/mockData";
import type { StayCategory } from "../types";
import PropertyCard from "../components/PropertyCard";

const heroSlides = [
  {
    title: "Suryalanka Sunrise",
    subtitle: "Wake up to the first light over Bapatla's golden shore",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=85&auto=format&fit=crop",
  },
  {
    title: "Vodarevu Palm Groves",
    subtitle: "Casuarina-shaded villas steps from a quiet coastline",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1600&q=85&auto=format&fit=crop",
  },
  {
    title: "Chirala Beachfronts",
    subtitle: "Private stays with direct, uninterrupted sea access",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=85&auto=format&fit=crop",
  },
];

const destinations = ["All", "Bapatla - Suryalanka", "Chirala - Vodarevu", "Ramapuram"];
const stayTypes: ("All" | StayCategory)[] = [
  "All",
  "Beachfront Villa",
  "Luxury Resort Suite",
  "Private Pool Villa",
  "Heritage Cottage",
];
const sortOptions = ["Curated", "Price Low-High", "Price High-Low", "Highest Rated"];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [destination, setDestination] = useState("All");
  const [stayType, setStayType] = useState<"All" | StayCategory>("All");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [priceOpen, setPriceOpen] = useState(false);
  const [sort, setSort] = useState(sortOptions[0]);
  const [activePill, setActivePill] = useState<"All" | StayCategory>("All");

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5500);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(() => {
    let list = properties.filter((p) => {
      const destOk = destination === "All" || p.area === destination;
      const typeOk = stayType === "All" || p.category === stayType;
      const pillOk = activePill === "All" || p.category === activePill;
      const priceOk = p.pricePerNight <= maxPrice;
      return destOk && typeOk && pillOk && priceOk;
    });
    if (sort === "Price Low-High") list = [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sort === "Price High-Low") list = [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (sort === "Highest Rated") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [destination, stayType, activePill, maxPrice, sort]);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[560px] overflow-hidden sm:h-[620px]">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img src={heroSlides[slide].image} alt={heroSlides[slide].title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[--color-charcoal]/70 via-[--color-charcoal]/20 to-[--color-charcoal]/10" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-center px-5 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-3 text-sm font-medium text-white/80">Bapatla &amp; Chirala Coastline, Andhra Pradesh</p>
              <h1 className="font-display max-w-xl text-4xl leading-tight text-white sm:text-5xl">
                {heroSlides[slide].title}
              </h1>
              <p className="mt-3 max-w-md text-white/85">{heroSlides[slide].subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/30"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setSlide((s) => (s + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/30"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-28 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-32">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="h-1.5 overflow-hidden rounded-full bg-white/30"
              style={{ width: i === slide ? 28 : 14 }}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === slide && (
                <motion.div
                  key={slide}
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5.5, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Floating search bar */}
      <div className="relative z-20 mx-auto -mt-16 max-w-5xl px-5 sm:-mt-20 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_12px_32px_rgba(31,41,55,0.1)] backdrop-blur-xl sm:p-4"
        >
          <div className="grid gap-3 sm:grid-cols-[1.2fr_1.2fr_1fr_auto]">
            <div className="rounded-xl border border-[--color-border-soft] px-3.5 py-2.5">
              <label className="block text-[0.7rem] font-medium text-[--color-driftwood]">Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent text-sm text-[--color-charcoal] outline-none"
              >
                {destinations.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-[--color-border-soft] px-3.5 py-2.5">
              <label className="block text-[0.7rem] font-medium text-[--color-driftwood]">Stay Type</label>
              <select
                value={stayType}
                onChange={(e) => setStayType(e.target.value as "All" | StayCategory)}
                className="w-full bg-transparent text-sm text-[--color-charcoal] outline-none"
              >
                {stayTypes.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="relative rounded-xl border border-[--color-border-soft] px-3.5 py-2.5">
              <button className="w-full text-left" onClick={() => setGuestsOpen((v) => !v)}>
                <span className="block text-[0.7rem] font-medium text-[--color-driftwood]">Guests</span>
                <span className="flex items-center gap-1.5 text-sm text-[--color-charcoal]">
                  <Users size={14} /> {adults} Adults{children > 0 ? `, ${children} Children` : ""}
                </span>
              </button>
              <AnimatePresence>
                {guestsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 top-[calc(100%+8px)] z-30 w-64 rounded-xl border border-[--color-border-soft] bg-white p-4 shadow-[0_12px_32px_rgba(31,41,55,0.12)]"
                  >
                    {[
                      { label: "Adults", value: adults, set: setAdults, min: 1 },
                      { label: "Children", value: children, set: setChildren, min: 0 },
                    ].map((row) => (
                      <div key={row.label} className="mb-3 flex items-center justify-between last:mb-0">
                        <span className="text-sm text-[--color-charcoal]">{row.label}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => row.set(Math.max(row.min, row.value - 1))}
                            className="h-7 w-7 rounded-full border border-[--color-border-soft] text-[--color-charcoal]"
                          >
                            −
                          </button>
                          <span className="w-4 text-center tabular text-sm">{row.value}</span>
                          <button
                            onClick={() => row.set(row.value + 1)}
                            className="h-7 w-7 rounded-full border border-[--color-border-soft] text-[--color-charcoal]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setGuestsOpen(false)}
                      className="mt-2 w-full rounded-lg bg-[--color-charcoal] py-2 text-sm text-white"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center justify-center gap-2 rounded-xl bg-[--color-bronze] px-6 py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              <Search size={16} /> Search
            </button>
          </div>
        </motion.div>
      </div>

      {/* Listings */}
      <section id="listings" className="mx-auto max-w-6xl px-5 pb-4 pt-16 sm:px-8">
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <h2 className="font-display text-2xl text-[--color-charcoal] sm:text-3xl">Stays along the coastline</h2>
            <p className="mt-1 text-sm text-[--color-driftwood]">{filtered.length} verified properties available</p>
          </div>

          <div className="scroll-hide flex gap-2 overflow-x-auto pb-1">
            {stayTypes.map((t) => (
              <button
                key={t}
                onClick={() => setActivePill(t)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
                  activePill === t
                    ? "border-[--color-bronze] bg-[--color-bronze]/10 text-[--color-bronze]"
                    : "border-[--color-border-soft] text-[--color-slate-meta] hover:border-[--color-sand]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setPriceOpen((v) => !v)}
              className="rounded-xl border border-[--color-border-soft] px-4 py-2 text-sm text-[--color-charcoal]"
            >
              Price up to ₹{maxPrice.toLocaleString("en-IN")}
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-[--color-border-soft] bg-white px-4 py-2 text-sm text-[--color-charcoal] outline-none"
            >
              {sortOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <AnimatePresence>
            {priceOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden rounded-xl border border-[--color-border-soft] bg-white p-4"
              >
                <input
                  type="range"
                  min={3000}
                  max={30000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[--color-bronze]"
                />
                <div className="mt-1 flex justify-between text-xs text-[--color-driftwood]">
                  <span>₹3,000</span>
                  <span>₹30,000 / night</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-[--color-border-soft] py-16 text-center text-sm text-[--color-driftwood]">
            No stays match these filters yet — try widening your price range or destination.
          </p>
        )}
      </section>

      {/* Beach guide bento */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="font-display mb-6 text-2xl text-[--color-charcoal] sm:text-3xl">Know the beaches first</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {beaches.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-72 overflow-hidden rounded-2xl"
            >
              <img src={b.image} alt={b.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[--color-charcoal]/85 via-[--color-charcoal]/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="mb-2 inline-block rounded-full bg-white/20 px-2.5 py-1 text-xs text-white backdrop-blur-md">
                  {b.distanceLabel}
                </span>
                <h3 className="font-display text-xl text-white">{b.name}</h3>
                <p className="mt-1 text-sm text-white/80">{b.tagline}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experiences */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="font-display mb-6 text-2xl text-[--color-charcoal] sm:text-3xl">Why book with us</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Waves, title: "Direct beach access", desc: "Every listed stay sits within a short, walkable distance of the shore." },
            { icon: ShieldCheck, title: "100% verified inventory", desc: "Each property and room is inspected before it's listed." },
            { icon: Clock, title: "24-hr flexible cancellation", desc: "Change your plans up to a day before check-in, at no cost." },
            { icon: Fish, title: "Local seafood concierge", desc: "Ask your host to arrange a coastal meal from the day's catch." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-2xl border border-[--color-border-soft]/70 bg-white/80 p-5"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[--color-sand]/20 text-[--color-bronze]">
                <f.icon size={18} strokeWidth={1.75} />
              </span>
              <h3 className="mb-1 font-medium text-[--color-charcoal]">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[--color-driftwood]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
