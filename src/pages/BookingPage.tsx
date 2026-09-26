import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Copy,
  Mail,
  Send,
  MessageCircle,
  Utensils,
  Car,
  CalendarDays,
  BedDouble,
} from "lucide-react";
import { getPropertyById } from "../data/mockData";
import { vehicleOptions } from "../data/mockData";
import type { DiningPlan, PaymentMethod, ConfirmedBooking } from "../types";
import { useApp } from "../context/AppContext";
import { calculatePricing, nightsBetween, formatINR, DINING_RATES } from "../utils/pricing";

const DRAFT_KEY = "bys_booking_draft";
const EASE = [0.16, 1, 0.3, 1] as const;

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

interface Draft {
  propertyId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  diningPlan: DiningPlan;
  vehicleId: string | null;
  guestName: string;
  mobile: string;
  email: string;
  specialRequests: string;
  paymentMethod: PaymentMethod;
}

const steps = ["Stay & Room", "Dining", "Travel", "Guest & Confirm"];

export default function BookingPage() {
  const { params, navigate, isRoomBooked, addBooking } = useApp();
  const property = getPropertyById(params.propertyId ?? "");

  const today = useMemo(() => toISO(new Date()), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toISO(d);
  }, []);

  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [draft, setDraft] = useState<Draft>(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Draft;
        if (parsed.propertyId === params.propertyId) {
          return { ...parsed, roomId: params.roomId ?? parsed.roomId };
        }
      }
    } catch {
      /* ignore */
    }
    return {
      propertyId: params.propertyId ?? "",
      roomId: params.roomId ?? property?.rooms[0]?.id ?? "",
      checkIn: today,
      checkOut: tomorrow,
      adults: 2,
      children: 0,
      diningPlan: "none",
      vehicleId: null,
      guestName: "",
      mobile: "",
      email: "",
      specialRequests: "",
      paymentMethod: "Pay at Hotel",
    };
  });

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  if (!property) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-[--color-driftwood]">Pick a property first to start a reservation.</p>
        <button onClick={() => navigate("home")} className="mt-4 rounded-xl bg-[--color-bronze] px-5 py-2.5 text-sm text-white">
          Explore Stays in chirala and spend your vacation with you family 
        </button>
      </div>
    );
  }

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const nights = nightsBetween(draft.checkIn, draft.checkOut);
  const selectedRoom = property.rooms.find((r) => r.id === draft.roomId) ?? property.rooms[0];
  const availableRooms = property.rooms.filter((r) => !isRoomBooked(r.id, draft.checkIn, draft.checkOut));
  const selectedVehicle = vehicleOptions.find((v) => v.id === draft.vehicleId) ?? null;

  const pricing = calculatePricing({
    roomPrice: selectedRoom?.price ?? property.pricePerNight,
    nights: nights || 0,
    adults: draft.adults,
    children: draft.children,
    diningPlan: draft.diningPlan,
    vehicle: selectedVehicle,
  });

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!draft.checkIn) e.checkIn = "Select a check-in date";
    if (!draft.checkOut) e.checkOut = "Select a check-out date";
    if (draft.checkIn && draft.checkOut && draft.checkOut <= draft.checkIn) e.checkOut = "Check-out must be after check-in";
    if (draft.checkIn && draft.checkIn < today) e.checkIn = "Check-in cannot be in the past";
    if (!draft.roomId) e.roomId = "Select a room";
    else if (isRoomBooked(draft.roomId, draft.checkIn, draft.checkOut)) e.roomId = "This room is booked for those dates — pick another";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep4() {
    const e: Record<string, string> = {};
    if (!draft.guestName.trim()) e.guestName = "Enter the guest's full name";
    if (!/^[6-9]\d{9}$/.test(draft.mobile.trim())) e.mobile = "Enter a valid 10-digit mobile number";
    if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goNext() {
    if (step === 0 && !validateStep1()) return;
    setErrors({});
    setStep((s) => Math.min(3, s + 1));
  }
  function goBack() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  function buildSlipText(ref: string) {
    const lines = [
      `BookYourStay Reservation Slip`,
      `Reference: ${ref}`,
      `Property: ${property!.name}`,
      `Room: ${selectedRoom?.roomNumber} (${selectedRoom?.bed}, ${selectedRoom?.view})`,
      `Check-in: ${draft.checkIn}  Check-out: ${draft.checkOut}  (${nights} nights)`,
      `Guests: ${draft.adults} Adults, ${draft.children} Children`,
      draft.diningPlan !== "none" ? `Dining: ${DINING_RATES[draft.diningPlan].label}` : null,
      selectedVehicle ? `Vehicle: ${selectedVehicle.name}` : null,
      `Guest Name: ${draft.guestName}`,
      `Mobile: +91 ${draft.mobile}`,
      `Email: ${draft.email}`,
      draft.specialRequests ? `Special Requests: ${draft.specialRequests}` : null,
      `Payment Method: ${draft.paymentMethod}`,
      `Total Amount: ${formatINR(pricing.total)} (incl. 12% GST)`,
    ].filter(Boolean);
    return lines.join("\n");
  }

  function finalizeBooking(): ConfirmedBooking {
    const ref = `BYS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const confirmed: ConfirmedBooking = {
      ...draft,
      id: ref,
      reference: ref,
      createdAt: new Date().toISOString(),
      pricing,
    };
    addBooking(confirmed);
    localStorage.removeItem(DRAFT_KEY);
    return confirmed;
  }

  function handleDispatch(channel: "whatsapp" | "telegram" | "email") {
    if (!validateStep4()) return;
    const confirmed = finalizeBooking();
    const text = buildSlipText(confirmed.reference);

    if (channel === "whatsapp") {
      window.open(`https://wa.me/919494328912?text=${encodeURIComponent(text)}`, "_blank");
    } else if (channel === "telegram") {
      window.open(`https://t.me/BookYourStayConcierge?text=${encodeURIComponent(text)}`, "_blank");
    } else {
      window.location.href = `mailto:reservations@bookyourstay.in?subject=${encodeURIComponent(
        `Reservation ${confirmed.reference} — ${property!.name}`
      )}&body=${encodeURIComponent(text)}`;
    }
    navigate("confirmation");
  }

  async function handleCopy() {
    const text = buildSlipText(draft.guestName ? "DRAFT" : "DRAFT");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="font-display mb-1 text-2xl text-[--color-charcoal] sm:text-3xl">Reserve your stay</h1>
      <p className="mb-8 text-sm text-[--color-driftwood]">{property.name} · {property.area}</p>

      {/* Stepper */}
      <div className="mb-10 flex items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{
                  backgroundColor: i <= step ? "#B45309" : "#FFFFFF",
                  borderColor: i <= step ? "#B45309" : "#E6DFD5",
                  color: i <= step ? "#FFFFFF" : "#78716C",
                }}
                transition={{ duration: 0.3 }}
                className="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium"
              >
                {i < step ? <Check size={14} /> : i + 1}
              </motion.div>
              <span className={`hidden text-[0.7rem] sm:block ${i === step ? "text-[--color-charcoal]" : "text-[--color-driftwood]"}`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 h-[2px] flex-1 overflow-hidden rounded-full bg-[--color-border-soft]">
                <motion.div
                  className="h-full bg-[--color-bronze]"
                  initial={false}
                  animate={{ width: i < step ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-h-[420px] rounded-2xl border border-[--color-border-soft]/70 bg-white/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <h2 className="font-display mb-5 flex items-center gap-2 text-xl text-[--color-charcoal]">
                  <CalendarDays size={19} className="text-[--color-bronze]" /> Stay Dates &amp; Room
                </h2>

                <div className="mb-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[--color-driftwood]">Check-in</label>
                    <input
                      type="date"
                      min={today}
                      value={draft.checkIn}
                      onChange={(e) => update("checkIn", e.target.value)}
                      className="w-full rounded-xl border border-[--color-border-soft] px-3.5 py-2.5 text-sm outline-none"
                    />
                    {errors.checkIn && <p className="mt-1 text-xs text-[--color-crimson]">{errors.checkIn}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[--color-driftwood]">Check-out</label>
                    <input
                      type="date"
                      min={draft.checkIn || today}
                      value={draft.checkOut}
                      onChange={(e) => update("checkOut", e.target.value)}
                      className="w-full rounded-xl border border-[--color-border-soft] px-3.5 py-2.5 text-sm outline-none"
                    />
                    {errors.checkOut && <p className="mt-1 text-xs text-[--color-crimson]">{errors.checkOut}</p>}
                  </div>
                </div>

                {nights > 0 && (
                  <span className="mb-5 inline-block rounded-full bg-[--color-sand]/20 px-3 py-1 text-xs font-medium text-[--color-bronze-dark]">
                    {nights} {nights === 1 ? "Night" : "Nights"} / {nights + 1} Days
                  </span>
                )}

                <div className="mb-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[--color-driftwood]">Adults</label>
                    <div className="flex items-center gap-3 rounded-xl border border-[--color-border-soft] px-3.5 py-2">
                      <button onClick={() => update("adults", Math.max(1, draft.adults - 1))} className="h-6 w-6 rounded-full border border-[--color-border-soft]">−</button>
                      <span className="tabular flex-1 text-center text-sm">{draft.adults}</span>
                      <button onClick={() => update("adults", Math.min(property.maxGuests, draft.adults + 1))} className="h-6 w-6 rounded-full border border-[--color-border-soft]">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[--color-driftwood]">Children</label>
                    <div className="flex items-center gap-3 rounded-xl border border-[--color-border-soft] px-3.5 py-2">
                      <button onClick={() => update("children", Math.max(0, draft.children - 1))} className="h-6 w-6 rounded-full border border-[--color-border-soft]">−</button>
                      <span className="tabular flex-1 text-center text-sm">{draft.children}</span>
                      <button onClick={() => update("children", draft.children + 1)} className="h-6 w-6 rounded-full border border-[--color-border-soft]">+</button>
                    </div>
                  </div>
                </div>

                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-sm font-medium text-[--color-charcoal]"><BedDouble size={15} /> Choose a room</h3>
                  <span className="text-xs text-[--color-sea]">{availableRooms.length} of {property.rooms.length} Rooms Available on selected dates</span>
                </div>
                {errors.roomId && <p className="mb-2 text-xs text-[--color-crimson]">{errors.roomId}</p>}

                <div className="grid max-h-80 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
                  {property.rooms.map((r) => {
                    const booked = isRoomBooked(r.id, draft.checkIn, draft.checkOut);
                    const selected = draft.roomId === r.id;
                    return (
                      <label
                        key={r.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                          booked
                            ? "cursor-not-allowed border-[--color-border-soft] opacity-50"
                            : selected
                            ? "border-[--color-bronze] bg-[--color-bronze]/5"
                            : "border-[--color-border-soft] hover:border-[--color-sand]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="room"
                          disabled={booked}
                          checked={selected}
                          onChange={() => update("roomId", r.id)}
                          className="accent-[--color-bronze]"
                        />
                        <img src={r.photo} className="h-12 w-14 rounded-lg object-cover" alt="" />
                        <div className="flex-1 text-xs">
                          <p className="font-mono text-sm font-medium text-[--color-charcoal]">Room {r.roomNumber}</p>
                          <p className="text-[--color-driftwood]">{r.bed} · {r.sqft} sqft · {r.view}</p>
                        </div>
                        <span className="tabular text-sm font-medium text-[--color-charcoal]">{formatINR(r.price)}</span>
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <h2 className="font-display mb-5 flex items-center gap-2 text-xl text-[--color-charcoal]">
                  <Utensils size={19} className="text-[--color-bronze]" /> Coastal Dining &amp; Meal Packages
                </h2>

                <label className="mb-5 flex items-center justify-between rounded-xl border border-[--color-border-soft] p-4">
                  <div>
                    <p className="text-sm font-medium text-[--color-charcoal]">Add Authentic Andhra Coastal Dining</p>
                    <p className="text-xs text-[--color-driftwood]">Optional — priced per guest, per day</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.diningPlan !== "none"}
                    onChange={(e) => update("diningPlan", e.target.checked ? "veg-thali" : "none")}
                    className="h-5 w-5 accent-[--color-bronze]"
                  />
                </label>

                {draft.diningPlan !== "none" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(Object.keys(DINING_RATES) as (keyof typeof DINING_RATES)[]).map((key) => {
                      const d = DINING_RATES[key];
                      const selected = draft.diningPlan === key;
                      return (
                        <button
                          key={key}
                          onClick={() => update("diningPlan", key)}
                          className={`rounded-xl border p-4 text-left transition-colors ${
                            selected ? "border-[--color-bronze] bg-[--color-bronze]/5" : "border-[--color-border-soft] hover:border-[--color-sand]"
                          }`}
                        >
                          <p className="text-sm font-medium text-[--color-charcoal]">{d.label}</p>
                          <p className="mt-1 text-xs text-[--color-driftwood]">{d.desc}</p>
                          <p className="tabular mt-2 text-sm font-medium text-[--color-bronze-dark]">₹{d.rate} / person / day</p>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 rounded-xl bg-[--color-surface] p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[--color-driftwood]">Dining subtotal</span>
                    <span className="tabular font-medium text-[--color-charcoal]">{formatINR(pricing.diningSubtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-[--color-driftwood]">
                    Rate × {draft.adults + draft.children} guests × {nights || 0} nights
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <h2 className="font-display mb-5 flex items-center gap-2 text-xl text-[--color-charcoal]">
                  <Car size={19} className="text-[--color-bronze]" /> Local Travel &amp; Vehicle Rentals
                </h2>

                <label className="mb-5 flex items-center justify-between rounded-xl border border-[--color-border-soft] p-4">
                  <div>
                    <p className="text-sm font-medium text-[--color-charcoal]">Add Scooter or Car Rental</p>
                    <p className="text-xs text-[--color-driftwood]">For getting around Chirala &amp; Bapatla</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!draft.vehicleId}
                    onChange={(e) => update("vehicleId", e.target.checked ? vehicleOptions[0].id : null)}
                    className="h-5 w-5 accent-[--color-bronze]"
                  />
                </label>

                {draft.vehicleId && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {vehicleOptions.map((v) => {
                      const selected = draft.vehicleId === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => update("vehicleId", v.id)}
                          className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                            selected ? "border-[--color-bronze] bg-[--color-bronze]/5" : "border-[--color-border-soft] hover:border-[--color-sand]"
                          }`}
                        >
                          <img src={v.image} className="h-14 w-16 rounded-lg object-cover" alt="" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[--color-charcoal]">{v.name}</p>
                            <p className="text-xs text-[--color-driftwood]">{v.category}</p>
                            <p className="tabular mt-0.5 text-sm font-medium text-[--color-bronze-dark]">₹{v.ratePerDay.toLocaleString("en-IN")} / day</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 rounded-xl bg-[--color-surface] p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[--color-driftwood]">Vehicle subtotal</span>
                    <span className="tabular font-medium text-[--color-charcoal]">{formatINR(pricing.vehicleSubtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-[--color-driftwood]">Vehicle rate × {nights || 0} days</p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <h2 className="font-display mb-5 text-xl text-[--color-charcoal]">Guest Information</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[--color-driftwood]">Full Name</label>
                    <input
                      value={draft.guestName}
                      onChange={(e) => update("guestName", e.target.value)}
                      placeholder="As per government ID"
                      className="w-full rounded-xl border border-[--color-border-soft] px-3.5 py-2.5 text-sm outline-none"
                    />
                    {errors.guestName && <p className="mt-1 text-xs text-[--color-crimson]">{errors.guestName}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[--color-driftwood]">WhatsApp Mobile (+91)</label>
                    <div className="flex items-center rounded-xl border border-[--color-border-soft] px-3.5">
                      <span className="text-sm text-[--color-driftwood]">+91</span>
                      <input
                        value={draft.mobile}
                        onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="10-digit number"
                        className="w-full bg-transparent px-2 py-2.5 text-sm outline-none"
                      />
                    </div>
                    {errors.mobile && <p className="mt-1 text-xs text-[--color-crimson]">{errors.mobile}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-[--color-driftwood]">Email Address</label>
                    <input
                      value={draft.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-[--color-border-soft] px-3.5 py-2.5 text-sm outline-none"
                    />
                    {errors.email && <p className="mt-1 text-xs text-[--color-crimson]">{errors.email}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-[--color-driftwood]">Special Requests</label>
                    <textarea
                      value={draft.specialRequests}
                      onChange={(e) => update("specialRequests", e.target.value)}
                      rows={3}
                      placeholder="Late check-in, dietary notes, celebration setup…"
                      className="w-full rounded-xl border border-[--color-border-soft] px-3.5 py-2.5 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-xs font-medium text-[--color-driftwood]">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Pay at Hotel", "UPI / QR", "Credit/Debit Card"] as PaymentMethod[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => update("paymentMethod", m)}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors ${
                          draft.paymentMethod === m
                            ? "border-[--color-bronze] bg-[--color-bronze]/10 text-[--color-bronze]"
                            : "border-[--color-border-soft] text-[--color-slate-meta]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <button
                    onClick={() => handleDispatch("whatsapp")}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-3 text-xs font-medium text-white transition-transform hover:-translate-y-0.5 sm:text-sm"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </button>
                  <button
                    onClick={() => handleDispatch("telegram")}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#229ED9] py-3 text-xs font-medium text-white transition-transform hover:-translate-y-0.5 sm:text-sm"
                  >
                    <Send size={15} /> Telegram
                  </button>
                  <button
                    onClick={() => handleDispatch("email")}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[--color-charcoal] py-3 text-xs font-medium text-white transition-transform hover:-translate-y-0.5 sm:text-sm"
                  >
                    <Mail size={15} /> Email
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[--color-border-soft] py-3 text-xs font-medium text-[--color-charcoal] transition-colors hover:border-[--color-bronze]/50 sm:text-sm"
                  >
                    {copied ? <Check size={15} className="text-[--color-sea]" /> : <Copy size={15} />}
                    {copied ? "Copied!" : "Copy Slip"}
                  </button>
                </div>
                <p className="mt-3 text-center text-xs text-[--color-driftwood]">
                  WhatsApp, Telegram, or Email confirms and sends your reservation slip instantly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 3 && (
            <div className="mt-8 flex justify-between border-t border-[--color-border-soft] pt-5">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm text-[--color-slate-meta] disabled:opacity-0"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={goNext}
                className="flex items-center gap-1 rounded-xl bg-[--color-bronze] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="mt-6 border-t border-[--color-border-soft] pt-5">
              <button onClick={goBack} className="flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm text-[--color-slate-meta]">
                <ChevronLeft size={16} /> Back
              </button>
            </div>
          )}
        </div>

        {/* Sticky price breakdown */}
        <aside className="h-fit lg:sticky lg:top-28">
          <div className="rounded-2xl border border-[--color-border-soft]/70 bg-white/95 p-5 shadow-[0_12px_32px_rgba(31,41,55,0.08)]">
            <h3 className="font-display mb-4 text-lg text-[--color-charcoal]">Price Breakdown</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[--color-driftwood]">Room × {nights || 0} nights</span>
                <span className="tabular text-[--color-charcoal]">{formatINR(pricing.roomSubtotal)}</span>
              </div>
              {pricing.diningSubtotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-[--color-driftwood]">Dining plan</span>
                  <span className="tabular text-[--color-charcoal]">{formatINR(pricing.diningSubtotal)}</span>
                </div>
              )}
              {pricing.vehicleSubtotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-[--color-driftwood]">Vehicle rental</span>
                  <span className="tabular text-[--color-charcoal]">{formatINR(pricing.vehicleSubtotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[--color-driftwood]">Luxury Hospitality GST (12%)</span>
                <span className="tabular text-[--color-charcoal]">{formatINR(pricing.gst)}</span>
              </div>
              <div className="rounded-lg bg-[--color-sea-bg] px-2.5 py-2 text-xs text-[--color-sea]">
                Complimentary welcome amenity included
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-[--color-border-soft] pt-4">
              <span className="text-sm font-medium text-[--color-charcoal]">Total</span>
              <motion.span
                key={pricing.total}
                initial={{ scale: 1.06 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="tabular font-display text-2xl text-[--color-bronze-dark]"
              >
                {formatINR(pricing.total)}
              </motion.span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
