import type { Beach, Property, VehicleOption } from "../types";

export const beaches: Beach[] = [
  {
    id: "suryalanka",
    name: "Suryalanka Beach",
    area: "Bapatla",
    tagline: "Wide golden sands where the sunrise arrives first",
    distanceLabel: "2.1 km from town centre",
    activities: ["Sunrise walks", "Beach volleyball", "Shack breakfasts"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "vodarevu",
    name: "Vodarevu Beach",
    area: "Chirala",
    tagline: "Casuarina groves lining a quiet, unhurried shoreline",
    distanceLabel: "3.4 km from Chirala junction",
    activities: ["Grove picnics", "Fishing boat tours", "Cycling trails"],
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "ramapuram",
    name: "Ramapuram Beach",
    area: "Chirala",
    tagline: "A secluded cove favoured by early risers and anglers",
    distanceLabel: "6 km south of Vodarevu",
    activities: ["Tide pooling", "Local seafood shacks", "Quiet camping"],
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80&auto=format&fit=crop",
  },
];

function makeRooms(
  prefix: string,
  base: { floor: string; view: string }[],
  price: number,
  photos: string[]
) {
  const beds = ["1 King Bed", "2 Queen Beds", "1 King + 1 Sofa Bed", "2 Twin Beds"];
  return base.map((b, i) => ({
    id: `${prefix}-${100 * (i % 3 === 0 ? 1 : 2) + i}`,
    roomNumber: `${100 * (i < base.length / 2 ? 1 : 2) + (i % (base.length / 2 || 1)) + 1}`,
    floor: b.floor,
    view: b.view,
    bed: beds[i % beds.length],
    sqft: 320 + ((i * 45) % 260),
    price: price + (i % 3) * 800,
    photo: photos[i % photos.length],
  }));
}

const roomPhotos = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop",
];

const floorViews = [
  { floor: "Ground Floor", view: "Garden View" },
  { floor: "1st Floor", view: "Ocean View" },
  { floor: "1st Floor", view: "Pool View" },
  { floor: "2nd Floor", view: "Ocean View" },
  { floor: "2nd Floor", view: "Palm Grove View" },
  { floor: "Ground Floor", view: "Ocean View" },
  { floor: "2nd Floor", view: "Panoramic Ocean View" },
  { floor: "1st Floor", view: "Garden View" },
];

export const properties: Property[] = [
  {
    id: "azure-sands-suryalanka",
    name: "Suryalanka Azure Sands Resort",
    kind: "resort",
    category: "Luxury Resort Suite",
    area: "Bapatla - Suryalanka",
    beachId: "suryalanka",
    distanceToBeach: "180 m to beach",
    rating: 4.7,
    reviewCount: 214,
    pricePerNight: 8500,
    maxGuests: 4,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Infinity pool", "Spa & wellness", "Multi-cuisine restaurant", "Beach cabanas", "Free Wi-Fi", "Airport transfer"],
    highlights: ["180 m private path to Suryalanka Beach", "Sunrise-facing suites", "In-house seafood grill"],
    checkIn: "1:00 PM",
    checkOut: "11:00 AM",
    houseRules: [
      "Check-in from 1:00 PM, check-out by 11:00 AM",
      "Beach footwear provided at the lobby — please return after use",
      "No outside catering in banquet areas",
    ],
    rooms: makeRooms("AZS", floorViews, 8500, roomPhotos),
  },
  {
    id: "palm-grove-vodarevu",
    name: "The Palm Grove Oceanfront Villa",
    kind: "villa",
    category: "Beachfront Villa",
    area: "Chirala - Vodarevu",
    beachId: "vodarevu",
    distanceToBeach: "90 m to beach",
    rating: 4.9,
    reviewCount: 132,
    pricePerNight: 14500,
    maxGuests: 8,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Private pool", "Casuarina garden", "Full kitchen", "BBQ deck", "Free Wi-Fi", "Caretaker on call"],
    highlights: ["Entire villa, no shared walls", "Direct grove path to Vodarevu Beach", "Dedicated bonfire deck"],
    checkIn: "2:00 PM",
    checkOut: "11:00 AM",
    houseRules: [
      "Check-in from 2:00 PM, check-out by 11:00 AM",
      "Beach footwear recommended — sandy path to shore",
      "Quiet hours after 11:00 PM",
    ],
    rooms: makeRooms("PGV", floorViews.slice(0, 6), 14500 / 3, roomPhotos.slice(2)),
  },
  {
    id: "casuarina-beach-house-chirala",
    name: "Chirala Casuarina Beach House",
    kind: "villa",
    category: "Heritage Cottage",
    area: "Chirala - Vodarevu",
    beachId: "vodarevu",
    distanceToBeach: "250 m to beach",
    rating: 4.5,
    reviewCount: 98,
    pricePerNight: 6200,
    maxGuests: 5,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Courtyard dining", "Fisherman-style architecture", "Free Wi-Fi", "Bicycle rentals", "Home-cooked meals on request"],
    highlights: ["Restored 1960s fisherman's cottage", "Courtyard shaded by casuarina trees", "Walk to local fish market"],
    checkIn: "12:00 PM",
    checkOut: "10:00 AM",
    houseRules: [
      "Check-in from 12:00 PM, check-out by 10:00 AM",
      "Traditional home — please remove footwear indoors",
      "Pets allowed on prior request only",
    ],
    rooms: makeRooms("CBH", floorViews.slice(0, 5), 6200 / 2, roomPhotos.slice(4)),
  },
  {
    id: "sea-breeze-pool-villa-suryalanka",
    name: "Suryalanka Sea Breeze Private Pool Villa",
    kind: "villa",
    category: "Private Pool Villa",
    area: "Bapatla - Suryalanka",
    beachId: "suryalanka",
    distanceToBeach: "120 m to beach",
    rating: 4.8,
    reviewCount: 176,
    pricePerNight: 16800,
    maxGuests: 6,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Private infinity-edge pool", "Sundeck", "Personal chef on request", "Free Wi-Fi", "EV charging"],
    highlights: ["Pool facing the open sea", "Glass-walled upper suite", "Dedicated concierge line"],
    checkIn: "1:00 PM",
    checkOut: "11:00 AM",
    houseRules: [
      "Check-in from 1:00 PM, check-out by 11:00 AM",
      "Pool towels provided — please rinse beach sand before pool use",
      "Max occupancy strictly enforced for villa insurance",
    ],
    rooms: makeRooms("SBV", floorViews.slice(1, 6), 16800 / 3, roomPhotos.slice(6)),
  },
  {
    id: "heritage-fisherman-cottage-vodarevu",
    name: "Vodarevu Heritage Fisherman Cottage",
    kind: "villa",
    category: "Heritage Cottage",
    area: "Chirala - Vodarevu",
    beachId: "vodarevu",
    distanceToBeach: "300 m to beach",
    rating: 4.4,
    reviewCount: 61,
    pricePerNight: 5400,
    maxGuests: 4,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Verandah seating", "Home-style Andhra meals", "Free Wi-Fi", "Bicycle rentals"],
    highlights: ["Original teak-wood interiors", "Run by a local fishing family", "5-minute walk to the harbour"],
    checkIn: "12:00 PM",
    checkOut: "10:00 AM",
    houseRules: [
      "Check-in from 12:00 PM, check-out by 10:00 AM",
      "Shared verandah — quiet hours after 10:00 PM",
      "No smoking indoors",
    ],
    rooms: makeRooms("HFC", floorViews.slice(0, 4), 5400 / 2, roomPhotos.slice(3)),
  },
  {
    id: "coral-bay-ramapuram",
    name: "Ramapuram Coral Bay Luxury Resort",
    kind: "resort",
    category: "Luxury Resort Suite",
    area: "Ramapuram",
    beachId: "ramapuram",
    distanceToBeach: "60 m to beach",
    rating: 4.6,
    reviewCount: 143,
    pricePerNight: 11200,
    maxGuests: 4,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
    ],
    amenities: ["Cove-facing pool", "Ayurvedic spa", "Rooftop dining", "Free Wi-Fi", "Kayak rentals"],
    highlights: ["Closest resort to Ramapuram cove", "Rooftop sunset dining", "In-house Ayurvedic therapist"],
    checkIn: "1:00 PM",
    checkOut: "11:00 AM",
    houseRules: [
      "Check-in from 1:00 PM, check-out by 11:00 AM",
      "Kayaks available 6 AM – 6 PM, tide permitting",
      "Spa bookings recommended a day in advance",
    ],
    rooms: makeRooms("RCB", floorViews, 11200 / 1.4, roomPhotos.slice(1)),
  },
];

export const vehicleOptions: VehicleOption[] = [
  {
    id: "activa",
    name: "Honda Activa",
    category: "Scooter",
    ratePerDay: 500,
    image:
      "https://images.unsplash.com/photo-1621777535138-4a3fce69c8b9?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "re-classic-350",
    name: "Royal Enfield Classic 350",
    category: "Motorcycle",
    ratePerDay: 1000,
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "swift-dzire",
    name: "Swift Dzire Sedan",
    category: "Sedan",
    ratePerDay: 2200,
    image:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "innova-crysta",
    name: "Innova Crysta 7-Seater",
    category: "SUV",
    ratePerDay: 3500,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80&auto=format&fit=crop",
  },
];

export function getPropertyById(id: string) {
  return properties.find((p) => p.id === id);
}

export function getBeachById(id: string) {
  return beaches.find((b) => b.id === id);
}
