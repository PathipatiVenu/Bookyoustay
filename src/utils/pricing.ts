import type { DiningPlan, PriceBreakdown, VehicleOption } from "../types";

export const DINING_RATES: Record<Exclude<DiningPlan, "none">, { label: string; rate: number; desc: string }> = {
  "veg-thali": {
    label: "Vegetarian Thali / Tiffins / High-Tea",
    rate: 400,
    desc: "Traditional Andhra vegetarian thalis, tiffins, and evening high-tea",
  },
  "seafood-feast": {
    label: "Coastal Seafood Feast",
    rate: 750,
    desc: "Crab curry, Royyala Vepudu, fish fry, and biryani",
  },
};

export function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diff = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function calculatePricing(params: {
  roomPrice: number;
  nights: number;
  adults: number;
  children: number;
  diningPlan: DiningPlan;
  vehicle: VehicleOption | null;
}): PriceBreakdown {
  const { roomPrice, nights, adults, children, diningPlan, vehicle } = params;
  const guests = adults + children;

  const roomSubtotal = roomPrice * nights;

  const diningSubtotal =
    diningPlan === "none" ? 0 : DINING_RATES[diningPlan].rate * guests * nights;

  const vehicleSubtotal = vehicle ? vehicle.ratePerDay * nights : 0;

  const preGst = roomSubtotal + diningSubtotal + vehicleSubtotal;
  const gst = Math.round(preGst * 0.12);
  const total = preGst + gst;

  return { nights, roomSubtotal, diningSubtotal, vehicleSubtotal, gst, total };
}

export function formatINR(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}
