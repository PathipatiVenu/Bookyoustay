import { motion } from "framer-motion";
import { CheckCircle2, Printer, Home, Building2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getPropertyById } from "../data/mockData";
import { formatINR } from "../utils/pricing";

export default function ConfirmationPage() {
  const { lastBooking, navigate } = useApp();

  if (!lastBooking) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-[--color-driftwood]">No recent booking found in this session.</p>
        <button onClick={() => navigate("home")} className="mt-4 rounded-xl bg-[--color-bronze] px-5 py-2.5 text-sm text-white">
          Back to Home
        </button>
      </div>
    );
  }

  const property = getPropertyById(lastBooking.propertyId);
  const room = property?.rooms.find((r) => r.id === lastBooking.roomId);

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 flex flex-col items-center text-center"
      >
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[--color-sea-bg] text-[--color-sea]">
          <CheckCircle2 size={32} />
        </span>
        <h1 className="font-display text-2xl text-[--color-charcoal] sm:text-3xl">Reservation Confirmed</h1>
        <p className="mt-2 font-mono text-sm text-[--color-bronze-dark]">{lastBooking.reference}</p>
      </motion.div>

      <motion.div
        id="voucher"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="rounded-2xl border border-[--color-border-soft]/70 bg-white/95 p-6 shadow-[0_12px_32px_rgba(31,41,55,0.08)] sm:p-8"
      >
        <div className="mb-5 flex items-center gap-4 border-b border-[--color-border-soft] pb-5">
          {property && <img src={property.image} alt={property.name} className="h-16 w-20 rounded-xl object-cover" />}
          <div>
            <h2 className="font-display text-lg text-[--color-charcoal]">{property?.name}</h2>
            <p className="text-sm text-[--color-driftwood]">{property?.area}</p>
          </div>
        </div>

        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs text-[--color-driftwood]">Check-in</p>
            <p className="font-medium text-[--color-charcoal]">{lastBooking.checkIn}</p>
          </div>
          <div>
            <p className="text-xs text-[--color-driftwood]">Check-out</p>
            <p className="font-medium text-[--color-charcoal]">{lastBooking.checkOut}</p>
          </div>
          <div>
            <p className="text-xs text-[--color-driftwood]">Room</p>
            <p className="font-medium text-[--color-charcoal]">
              Room {room?.roomNumber} · {room?.bed}
            </p>
          </div>
          <div>
            <p className="text-xs text-[--color-driftwood]">Guests</p>
            <p className="font-medium text-[--color-charcoal]">{lastBooking.adults} Adults, {lastBooking.children} Children</p>
          </div>
          <div>
            <p className="text-xs text-[--color-driftwood]">Guest Name</p>
            <p className="font-medium text-[--color-charcoal]">{lastBooking.guestName}</p>
          </div>
          <div>
            <p className="text-xs text-[--color-driftwood]">Contact</p>
            <p className="font-medium text-[--color-charcoal]">+91 {lastBooking.mobile}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-[--color-surface] p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-[--color-driftwood]">Total Paid Amount</span>
            <span className="tabular font-display text-lg text-[--color-bronze-dark]">{formatINR(lastBooking.pricing.total)}</span>
          </div>
          <p className="mt-1 text-xs text-[--color-driftwood]">via {lastBooking.paymentMethod} · incl. 12% GST</p>
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[--color-border-soft] py-3 text-sm font-medium text-[--color-charcoal] hover:border-[--color-bronze]/50"
        >
          <Printer size={15} /> Print Voucher
        </button>
        <button
          onClick={() => navigate("resorts")}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[--color-border-soft] py-3 text-sm font-medium text-[--color-charcoal] hover:border-[--color-bronze]/50"
        >
          <Building2 size={15} /> Browse More Resorts
        </button>
        <button
          onClick={() => navigate("home")}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[--color-bronze] py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
        >
          <Home size={15} /> Back to Home
        </button>
      </div>
    </div>
  );
}
