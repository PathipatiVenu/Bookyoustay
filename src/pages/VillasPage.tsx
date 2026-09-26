import { useMemo, useState } from "react";
import { properties } from "../data/mockData";
import type { StayCategory } from "../types";
import PropertyCard from "../components/PropertyCard";

const villaCategories: ("All" | StayCategory)[] = [
  "All",
  "Beachfront Villa",
  "Private Pool Villa",
  "Heritage Cottage",
];

export default function VillasPage() {
  const [cat, setCat] = useState<"All" | StayCategory>("All");

  const villas = useMemo(
    () => properties.filter((p) => p.kind === "villa" && (cat === "All" || p.category === cat)),
    [cat]
  );

  return (
    <div>
      <section className="relative h-64 overflow-hidden sm:h-80">
        <img
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&q=85&auto=format&fit=crop"
          alt="Private villas"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[--color-charcoal]/75 to-[--color-charcoal]/20" />
        <div className="absolute inset-0 flex flex-col items-start justify-end px-5 pb-10 sm:px-8">
          <h1 className="font-display max-w-lg text-3xl text-white sm:text-4xl">Private Villas &amp; Cottages</h1>
          <p className="mt-2 max-w-md text-white/85">Beachfront estates, private pools, and restored heritage cottages.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="scroll-hide mb-8 flex gap-2 overflow-x-auto pb-1">
          {villaCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
                cat === c
                  ? "border-[--color-bronze] bg-[--color-bronze]/10 text-[--color-bronze]"
                  : "border-[--color-border-soft] text-[--color-slate-meta] hover:border-[--color-sand]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {villas.map((v) => (
            <div key={v.id}>
              <PropertyCard property={v} />
              <p className="mt-2 px-1 text-xs text-[--color-driftwood]">Sleeps up to {v.maxGuests} guests · {v.rooms.length} room units</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
