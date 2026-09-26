import { motion } from "framer-motion";
import { beaches, properties } from "../data/mockData";
import { useApp } from "../context/AppContext";

export default function GuidePage() {
  const { navigate } = useApp();

  return (
    <div>
      <section className="mx-auto max-w-4xl px-5 pb-4 pt-14 text-center sm:px-8">
        <h1 className="font-display text-3xl text-[--color-charcoal] sm:text-4xl">The Beach Guide</h1>
        <p className="mx-auto mt-3 max-w-xl text-[--color-driftwood]">
          Three shorelines, three different moods — a closer look before you choose where to stay.
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        {beaches.map((b, i) => {
          const nearby = properties.filter((p) => p.beachId === b.id);
          return (
            <motion.section
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`mb-16 grid items-center gap-8 last:mb-0 sm:grid-cols-2 ${
                i % 2 === 1 ? "sm:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden rounded-2xl">
                <img src={b.image} alt={b.name} className="h-80 w-full object-cover" />
              </div>
              <div>
                <span className="text-sm font-medium text-[--color-bronze]">{b.area} · {b.distanceLabel}</span>
                <h2 className="font-display mt-2 text-2xl text-[--color-charcoal] sm:text-3xl">{b.name}</h2>
                <p className="mt-3 text-[--color-driftwood]">{b.tagline}</p>

                <ul className="mt-4 space-y-1.5">
                  {b.activities.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-[--color-charcoal]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[--color-sand]" />
                      {a}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-sm text-[--color-driftwood]">
                  {nearby.length} verified {nearby.length === 1 ? "stay" : "stays"} nearby
                </p>

                <button
                  onClick={() => navigate("home")}
                  className="mt-4 rounded-xl bg-[--color-charcoal] px-5 py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                >
                  Explore Stays Near {b.name}
                </button>
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
