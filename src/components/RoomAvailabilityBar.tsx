import { motion } from "framer-motion";
import type { Property } from "../types";
import { useApp } from "../context/AppContext";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function RoomAvailabilityBar({
  property,
  compact = false,
}: {
  property: Property;
  compact?: boolean;
}) {
  const { isRoomBooked } = useApp();
  const checkIn = todayISO();
  const checkOut = tomorrowISO();

  const total = property.rooms.length;
  const booked = property.rooms.filter((r) => isRoomBooked(r.id, checkIn, checkOut)).length;
  const available = total - booked;
  const pct = total === 0 ? 0 : Math.round((available / total) * 100);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-[--color-sea]">{available} Available</span>
        <span className="text-[--color-driftwood]">{booked} Booked · {total} Rooms</span>
      </div>
      <div className={`w-full overflow-hidden rounded-full bg-[--color-crimson-bg] ${compact ? "h-1.5" : "h-2.5"}`}>
        <motion.div
          className="h-full rounded-full bg-[--color-sea]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
