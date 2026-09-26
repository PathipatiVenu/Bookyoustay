import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { properties } from "../data/mockData";
import { useApp } from "../context/AppContext";
import RoomAvailabilityBar from "../components/RoomAvailabilityBar";
import { Star, MapPin } from "lucide-react";

const areaPills = ["All Coastal Areas", "Bapatla - Suryalanka", "Chirala - Vodarevu", "Ramapuram"];

export default function ResortsPage() {
  const { navigate } = useApp();
  const [area, setArea] = useState(areaPills[0]);

  const resorts = useMemo(
    () => properties.filter((p) => p.kind === "resort" && (area === areaPills[0] || p.area === area)),
    [area]
  );

  return (
    <div>
      <section className="relative h-64 overflow-hidden sm:h-80">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=85&auto=format&fit=crop"
          alt="Coastal resorts"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[--color-charcoal]/75 to-[--color-charcoal]/20" />
        <div className="absolute inset-0 flex flex-col items-start justify-end px-5 pb-10 sm:px-8">
          <h1 className="font-display max-w-lg text-3xl text-white sm:text-4xl">Luxury Resorts on the Coast</h1>
          <p className="mt-2 max-w-md text-white/85">Full-service resorts with live room availability, right down to the room.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="scroll-hide mb-8 flex gap-2 overflow-x-auto pb-1">
          {areaPills.map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
                area === a
                  ? "border-[--color-bronze] bg-[--color-bronze]/10 text-[--color-bronze]"
                  : "border-[--color-border-soft] text-[--color-slate-meta] hover:border-[--color-sand]"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {resorts.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="overflow-hidden rounded-2xl border border-[--color-border-soft]/70 bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
            >
              <div className="relative h-48">
                <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-medium text-[--color-charcoal] backdrop-blur-md">
                  {r.distanceToBeach}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg text-[--color-charcoal]">{r.name}</h3>
                <p className="mb-2 flex items-center gap-1 text-sm text-[--color-driftwood]">
                  <MapPin size={13} /> {r.area}
                </p>
                <div className="mb-4 flex items-center gap-1.5 text-sm">
                  <Star size={14} className="fill-[--color-sand] text-[--color-sand]" />
                  <span className="font-medium">{r.rating}</span>
                  <span className="text-[--color-driftwood]">({r.reviewCount})</span>
                  <span className="tabular ml-auto font-display text-lg text-[--color-charcoal]">
                    ₹{r.pricePerNight.toLocaleString("en-IN")}<span className="text-sm font-sans text-[--color-driftwood]">/night</span>
                  </span>
                </div>

                <div className="mb-4 rounded-xl border border-[--color-border-soft] bg-[--color-surface] p-3.5">
                  <RoomAvailabilityBar property={r} />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("property", { propertyId: r.id })}
                    className="flex-1 rounded-xl border border-[--color-border-soft] py-2.5 text-sm font-medium text-[--color-charcoal] hover:border-[--color-bronze]/50"
                  >
                    View Rooms
                  </button>
                  <button
                    onClick={() => navigate("booking", { propertyId: r.id })}
                    className="flex-1 rounded-xl bg-[--color-bronze] py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                  >
                    Book Resort
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
