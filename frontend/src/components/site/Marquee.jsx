import { MARQUEE_WORDS } from "@/lib/content";

export const Marquee = () => {
  const items = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <section className="py-10 bg-dark overflow-hidden" data-testid="marquee-section" aria-hidden="true">
      <div className="marquee-track">
        {items.map((w, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="font-display font-black uppercase text-stroke-cream text-6xl sm:text-8xl px-8 tracking-tighter">
              {w}
            </span>
            <span className="w-4 h-4 hex-clip bg-honey mx-4" />
          </span>
        ))}
      </div>
    </section>
  );
};
