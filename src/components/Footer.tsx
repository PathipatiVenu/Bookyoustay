import { Palmtree } from "lucide-react";
import { useApp } from "../context/AppContext";
import { beaches } from "../data/mockData";

export default function Footer() {
  const { navigate } = useApp();
  return (
    <footer className="border-t border-[--color-border-soft] bg-[--color-surface]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[--color-sand]/25 text-[--color-bronze]">
                <Palmtree size={16} strokeWidth={1.75} />
              </span>
              <span className="font-display text-lg text-[--color-charcoal]">BookYourStay</span>
            </div>
            <p className="max-w-[26ch] text-sm leading-relaxed text-[--color-driftwood]">
              Curated coastal stays along the Bapatla and Chirala shoreline.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[--color-charcoal]">Explore</h4>
            <ul className="space-y-2 text-sm text-[--color-driftwood]">
              <li><button onClick={() => navigate("home")} className="hover:text-[--color-bronze]">Explore Stays</button></li>
              <li><button onClick={() => navigate("resorts")} className="hover:text-[--color-bronze]">Resorts</button></li>
              <li><button onClick={() => navigate("villas")} className="hover:text-[--color-bronze]">Villas</button></li>
              <li><button onClick={() => navigate("guide")} className="hover:text-[--color-bronze]">Beach Guide</button></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[--color-charcoal]">Destinations</h4>
            <ul className="space-y-2 text-sm text-[--color-driftwood]">
              {beaches.map((b) => (
                <li key={b.id}>
                  <button onClick={() => navigate("guide")} className="hover:text-[--color-bronze]">
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-[--color-charcoal]">Coastal Office</h4>
            <p className="text-sm leading-relaxed text-[--color-driftwood]">
              Beach Road, Suryalanka<br />
              Bapatla District, Andhra Pradesh 523157<br /><br />
              venupathipati1@gmail.com
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[--color-border-soft] pt-6 text-xs text-[--color-driftwood] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} BookYourStay.</p>
          <div className="flex gap-5">
            <span>Cancellation Policy</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
