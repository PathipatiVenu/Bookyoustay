export type PageId =
  | "home"
  | "resorts"
  | "villas"
  | "guide"
  | "property"
  | "booking"
  | "confirmation";

export type StayCategory =
  | "Beachfront Villa"
  | "Luxury Resort Suite"
  | "Private Pool Villa"
  | "Heritage Cottage";

export type PropertyKind = "resort" | "villa";

export interface Beach {
  id: string;
  name: string;
  area: string;
  tagline: string;
  distanceLabel: string;
  activities: string[];
  image: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: string;
  view: string;
  bed: string;
  sqft: number;
  price: number;
  photo: string;
}

export interface Property {
  id: string;
  name: string;
  kind: PropertyKind;
  category: StayCategory;
  area: string;
  beachId: string;
  distanceToBeach: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  maxGuests: number;
  image: string;
  gallery: string[];
  amenities: string[];
  highlights: string[];
  checkIn: string;
  checkOut: string;
  houseRules: string[];
  rooms: Room[];
}

export type PaymentMethod = "Pay at Hotel" | "UPI / QR" | "Credit/Debit Card";

export type DiningPlan = "none" | "veg-thali" | "seafood-feast";

export interface VehicleOption {
  id: string;
  name: string;
  category: string;
  ratePerDay: number;
  image: string;
}

export interface BookingDraft {
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

export interface PriceBreakdown {
  nights: number;
  roomSubtotal: number;
  diningSubtotal: number;
  vehicleSubtotal: number;
  gst: number;
  total: number;
}

export interface ConfirmedBooking extends BookingDraft {
  id: string;
  reference: string;
  createdAt: string;
  pricing: PriceBreakdown;
}
