import { useState } from "react";
import { motion } from "framer-motion";
import { Palmtree, Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { PageId } from "../types";

const links: { label: string; page: PageId }[] = [
  { label: "Explore Stays", page: "home" },
  { label: "Resorts", page: "resorts" },
  { label: "Villas", page: "villas" },
  { label: "Beach Guide", page: "guide" },
];

export default function Navbar() {
  const { page, navigate } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-[--color-border-soft]/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[--color-sand]/20 text-[--color-bronze]">
              <Palmtree size={19} strokeWidth={1.75} />
            </span>
            <span className="font-display text-[1.2rem] tracking-tight text-[--color-charcoal]">
              BookYourStay
            </span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <button
                key={l.page}
                onClick={() => navigate(l.page)}
                className={`relative rounded-lg px-3.5 py-2 text-[0.925rem] transition-colors ${
                  page === l.page
                    ? "text-[--color-bronze]"
                    : "text-[--color-slate-meta] hover:text-[--color-charcoal]"
                }`}
              >
                {l.label}
                {page === l.page && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[--color-bronze]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            ))}
            <button
              onClick={() => navigate("guide")}
              className="rounded-lg px-3.5 py-2 text-[0.925rem] text-[--color-slate-meta] hover:text-[--color-charcoal]"
            >
              Contact
            </button>
          </nav>

          <div className="hidden md:block">
            <button
              onClick={() => navigate("resorts")}
              className="rounded-xl bg-[--color-charcoal] px-4 py-2.5 text-sm font-medium text-[--color-canvas] transition-transform hover:-translate-y-0.5"
            >
              View Luxury Resorts
            </button>
          </div>

          <button
            className="rounded-lg p-2 text-[--color-charcoal] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-b border-[--color-border-soft]/70 bg-white/95 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <button
                key={l.page}
                onClick={() => {
                  navigate(l.page);
                  setOpen(false);
                }}
                className={`rounded-lg px-3 py-2.5 text-left text-sm ${
                  page === l.page ? "bg-[--color-surface] text-[--color-bronze]" : "text-[--color-charcoal]"
                }`}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate("resorts");
                setOpen(false);
              }}
              className="mt-1 rounded-xl bg-[--color-charcoal] px-4 py-2.5 text-center text-sm font-medium text-[--color-canvas]"
            >
              View Luxury Resorts
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
