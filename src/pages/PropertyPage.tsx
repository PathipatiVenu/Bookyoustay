import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, BedDouble, Layers, Eye, Ruler, Star, MapPin } from "lucide-react";
import { getPropertyById, getBeachById } from "../data/mockData";
import { useApp } from "../context/AppContext";

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}
function addDays(base: Date, n: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}
function nextWeekday(base: Date, weekday: number) {
  const d = new Date(base);
  const diff = (weekday - d.getDay() + 7) % 7 || 7;
  return addDays(d, diff);
}

export default function PropertyPage() {
  const { params, navigate, isRoomBooked } = useApp();
  const property = params.propertyId ? getPropertyById(params.propertyId) : undefined;
  const beach = property ? getBeachById(property.beachId) : undefined;

  const today = useMemo(() => new Date(), []);
  const [checkIn, setCheckIn] = useState(toISO(today));
  const [activeImg, setActiveImg] = useState(0);

  if (!property) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-[--color-driftwood]">This property could not be found.</p>
        <button onClick={() => navigate("home")} className="mt-4 rounded-xl bg-[--color-bronze] px-5 py-2.5 text-sm text-white">
          Back to Explore
        </button>
      </div>
    );
  }

  const checkOutForNight = toISO(addDays(new Date(checkIn), 1));

  const roomsStatus = property.rooms.map((r) => ({
    ...r,
    booked: isRoomBooked(r.id, checkIn, checkOutForNight),
  }));
  const totalRooms = roomsStatus.length;
  const bookedCount = roomsStatus.filter((r) => r.booked).length;
  const availableCount = totalRooms - bookedCount;
  const occupancyPct = totalRooms === 0 ? 0 : Math.round((bookedCount / totalRooms) * 100);

  const quickDates = [
    { label: "Today", date: toISO(today) },
    { label: "Tomorrow", date: toISO(addDays(today, 1)) },
    { label: "This Weekend", date: toISO(nextWeekday(today, 6)) },
    { label: "Next Weekend", date: toISO(nextWeekday(addDays(today, 7), 6)) },
  ];

  return (
    <div className="pb-24">
      {/* breadcrumb bar */}
      <div className="sticky top-[65px] z-30 border-b border-[--color-border-soft]/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <button onClick={() => navigate("home")} className="flex items-center gap-1.5 text-sm text-[--color-slate-meta] hover:text-[--color-charcoal]">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="hidden gap-2 sm:flex">
            <span className="rounded-full border border-[--color-border-soft] px-3 py-1 text-xs text-[--color-charcoal]">{property.category}</span>
            <span className="rounded-full border border-[--color-border-soft] px-3 py-1 text-xs text-[--color-charcoal]">{property.area}</span>
          </div>
          <button
            onClick={() => navigate("booking", { propertyId: property.id })}
            className="rounded-xl bg-[--color-bronze] px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            Book Stay
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pt-8 sm:px-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl text-[--color-charcoal] sm:text-4xl">{property.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[--color-driftwood]">
            <span className="flex items-center gap-1"><MapPin size={13} /> {property.area}{beach ? ` · near ${beach.name}` : ""}</span>
            <span className="flex items-center gap-1"><Star size={13} className="fill-[--color-sand] text-[--color-sand]" /> {property.rating} ({property.reviewCount} reviews)</span>
            <span>{property.distanceToBeach}</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-10">
          <div className="mb-2 aspect-video w-full overflow-hidden rounded-2xl">
            <img src={property.gallery[activeImg]} alt={property.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex gap-2">
            {property.gallery.map((g, i) => (
              <button
                key={g}
                onClick={() => setActiveImg(i)}
                className={`h-16 w-24 overflow-hidden rounded-lg border-2 ${i === activeImg ? "border-[--color-bronze]" : "border-transparent"}`}
              >
                <img src={g} className="h-full w-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            {/* Availability engine */}
            <section className="mb-10 rounded-2xl border border-[--color-border-soft]/70 bg-white/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h2 className="font-display mb-4 text-xl text-[--color-charcoal]">Live Room Availability</h2>

              <div className="mb-4 flex flex-wrap items-center gap-3">
                <input
                  type="date"
                  value={checkIn}
                  min={toISO(today)}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="rounded-xl border border-[--color-border-soft] px-3.5 py-2 text-sm text-[--color-charcoal] outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  {quickDates.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => setCheckIn(q.date)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                        checkIn === q.date
                          ? "border-[--color-bronze] bg-[--color-bronze]/10 text-[--color-bronze]"
                          : "border-[--color-border-soft] text-[--color-slate-meta] hover:border-[--color-sand]"
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-[--color-sea-border] bg-[--color-sea-bg] p-3.5">
                  <p className="tabular text-2xl font-semibold text-[--color-sea]">{availableCount}</p>
                  <p className="text-xs text-[--color-sea]">Available</p>
                </div>
                <div className="rounded-xl border border-[--color-crimson-border] bg-[--color-crimson-bg] p-3.5">
                  <p className="tabular text-2xl font-semibold text-[--color-crimson]">{bookedCount}</p>
                  <p className="text-xs text-[--color-crimson]">Booked</p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3.5">
                  <p className="tabular text-2xl font-semibold text-[--color-royal]">{availableCount}</p>
                  <p className="text-xs text-[--color-royal]">Unbooked Vacancies</p>
                </div>
                <div className="rounded-xl border border-[--color-border-soft] bg-[--color-surface] p-3.5">
                  <p className="tabular text-2xl font-semibold text-[--color-charcoal]">{totalRooms}</p>
                  <p className="text-xs text-[--color-driftwood]">Total Rooms</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-[--color-driftwood]">
                  <span>Occupancy</span>
                  <span className="tabular">{occupancyPct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[--color-sea-bg]">
                  <motion.div
                    className="h-full rounded-full bg-[--color-crimson]"
                    initial={{ width: 0 }}
                    animate={{ width: `${occupancyPct}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            </section>

            {/* Room matrix */}
            <section className="mb-10">
              <h2 className="font-display mb-4 text-xl text-[--color-charcoal]">Room Units</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {roomsStatus.map((r) => (
                  <div
                    key={r.id}
                    className="overflow-hidden rounded-2xl border border-[--color-border-soft]/70 bg-white/90"
                  >
                    <div className="flex gap-3 p-3">
                      <img src={r.photo} alt={`Room ${r.roomNumber}`} className="h-24 w-28 flex-shrink-0 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-mono text-sm font-medium text-[--color-charcoal]">Room {r.roomNumber}</span>
                          {r.booked ? (
                            <span className="flex items-center gap-1 rounded-full border border-[--color-crimson-border] bg-[--color-crimson-bg] px-2 py-0.5 text-[0.7rem] font-medium text-[--color-crimson]">
                              <XCircle size={11} /> Booked
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full border border-[--color-sea-border] bg-[--color-sea-bg] px-2 py-0.5 text-[0.7rem] font-medium text-[--color-sea]">
                              <CheckCircle2 size={11} /> Available
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-[--color-driftwood]">
                          <span className="flex items-center gap-1"><Layers size={11} /> {r.floor}</span>
                          <span className="flex items-center gap-1"><Eye size={11} /> {r.view}</span>
                          <span className="flex items-center gap-1"><BedDouble size={11} /> {r.bed}</span>
                          <span className="flex items-center gap-1"><Ruler size={11} /> {r.sqft} sq ft</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="tabular text-sm font-medium text-[--color-charcoal]">₹{r.price.toLocaleString("en-IN")}/night</span>
                          <button
                            disabled={r.booked}
                            onClick={() => navigate("booking", { propertyId: property.id, roomId: r.id })}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-transform ${
                              r.booked
                                ? "cursor-not-allowed bg-[--color-border-soft] text-[--color-driftwood]"
                                : "bg-[--color-bronze] text-white hover:-translate-y-0.5"
                            }`}
                          >
                            Book Room
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Highlights / amenities / rules */}
            <section className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-display mb-3 text-lg text-[--color-charcoal]">Highlights</h3>
                <ul className="space-y-2 text-sm text-[--color-charcoal]">
                  {property.highlights.map((h) => (
                    <li key={h} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[--color-sand]" />{h}</li>
                  ))}
                </ul>
                <h3 className="font-display mb-3 mt-6 text-lg text-[--color-charcoal]">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span key={a} className="rounded-full border border-[--color-border-soft] bg-white px-3 py-1.5 text-xs text-[--color-charcoal]">{a}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-display mb-3 text-lg text-[--color-charcoal]">House Rules</h3>
                <ul className="space-y-2 text-sm text-[--color-driftwood]">
                  <li>Check-in: {property.checkIn} · Check-out: {property.checkOut}</li>
                  {property.houseRules.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Sticky sidebar */}
          <aside className="h-fit lg:sticky lg:top-40">
            <div className="rounded-2xl border border-[--color-border-soft]/70 bg-white/95 p-5 shadow-[0_12px_32px_rgba(31,41,55,0.08)]">
              <div className="tabular mb-1 font-display text-2xl text-[--color-charcoal]">
                ₹{property.pricePerNight.toLocaleString("en-IN")}
                <span className="font-sans text-sm font-normal text-[--color-driftwood]"> / night</span>
              </div>
              <p className="mb-4 text-xs text-[--color-driftwood]">+ 12% GST · taxes calculated at checkout</p>
              <button
                onClick={() => navigate("booking", { propertyId: property.id })}
                className="w-full rounded-xl bg-[--color-bronze] py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
              >
                Reserve Now
              </button>
              <p className="mt-3 text-center text-xs text-[--color-driftwood]">Free cancellation within 24 hours of booking</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
