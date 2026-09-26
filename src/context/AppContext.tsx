import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ConfirmedBooking, PageId } from "../types";

const BOOKINGS_KEY = "bys_confirmed_bookings";

interface NavParams {
  propertyId?: string;
  roomId?: string;
}

interface AppContextValue {
  page: PageId;
  params: NavParams;
  navigate: (page: PageId, params?: NavParams) => void;
  bookings: ConfirmedBooking[];
  addBooking: (b: ConfirmedBooking) => void;
  isRoomBooked: (roomId: string, checkIn: string, checkOut: string) => boolean;
  lastBooking: ConfirmedBooking | null;
}

const AppContext = createContext<AppContextValue | null>(null);

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && bStart < aEnd;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<PageId>("home");
  const [params, setParams] = useState<NavParams>({});
  const [bookings, setBookings] = useState<ConfirmedBooking[]>(() => {
    try {
      const raw = localStorage.getItem(BOOKINGS_KEY);
      return raw ? (JSON.parse(raw) as ConfirmedBooking[]) : [];
    } catch {
      return [];
    }
  });
  const [lastBooking, setLastBooking] = useState<ConfirmedBooking | null>(null);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const navigate = (nextPage: PageId, nextParams: NavParams = {}) => {
    setParams(nextParams);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const addBooking = (b: ConfirmedBooking) => {
    setBookings((prev) => [...prev, b]);
    setLastBooking(b);
  };

  const isRoomBooked = (roomId: string, checkIn: string, checkOut: string) => {
    return bookings.some(
      (b) => b.roomId === roomId && rangesOverlap(checkIn, checkOut, b.checkIn, b.checkOut)
    );
  };

  const value = useMemo(
    () => ({ page, params, navigate, bookings, addBooking, isRoomBooked, lastBooking }),
    [page, params, bookings, lastBooking]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
