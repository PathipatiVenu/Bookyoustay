import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import type { Property } from "../types";
import { useApp } from "../context/AppContext";
import RoomAvailabilityBar from "./RoomAvailabilityBar";

export default function PropertyCard({ property, showAvailability = false }: { property: Property; showAvailability?: boolean }) {
  const { navigate } = useApp();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group overflow-hidden rounded-2xl border border-[--color-border-soft]/70 bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_12px_32px_rgba(31,41,55,0.08)]"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-white/85 px-2.5 py-1 text-xs font-medium text-[--color-charcoal] backdrop-blur-md">
          {property.distanceToBeach}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-[--color-charcoal]/85 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          {property.category}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-snug text-[--color-charcoal]">{property.name}</h3>
        </div>
        <p className="mb-2 flex items-center gap-1 text-sm text-[--color-driftwood]">
          <MapPin size={13} /> {property.area}
        </p>
        <div className="mb-3 flex items-center gap-1.5 text-sm">
          <Star size={14} className="fill-[--color-sand] text-[--color-sand]" />
          <span className="font-medium text-[--color-charcoal]">{property.rating}</span>
          <span className="text-[--color-driftwood]">({property.reviewCount} reviews)</span>
        </div>

        {showAvailability && (
          <div className="mb-4">
            <RoomAvailabilityBar property={property} compact />
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[--color-border-soft] pt-4">
          <div className="tabular">
            <span className="font-display text-xl text-[--color-charcoal]">₹{property.pricePerNight.toLocaleString("en-IN")}</span>
            <span className="text-sm text-[--color-driftwood]"> / night</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("property", { propertyId: property.id })}
              className="rounded-xl border border-[--color-border-soft] px-3.5 py-2 text-sm font-medium text-[--color-charcoal] transition-colors hover:border-[--color-bronze]/50"
            >
              View Details
            </button>
            <button
              onClick={() => navigate("booking", { propertyId: property.id })}
              className="rounded-xl bg-[--color-bronze] px-3.5 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              Book Stay
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
