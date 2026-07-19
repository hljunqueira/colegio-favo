export const Marquee = ({ words }) => {
  if (!words || words.length === 0) return null;
  const items = [...words, ...words, ...words, ...words]; // Duplicated to ensure infinite loop overflow
  
  return (
    <section className="py-10 bg-dark overflow-hidden" data-testid="marquee-section" aria-hidden="true">
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-track-custom {
          display: inline-flex;
          white-space: nowrap;
          will-change: transform;
          animation: marquee-scroll 55s linear infinite;
        }
      `}</style>
      <div className="marquee-track-custom flex items-center">
        {items.map((w, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="font-display font-black uppercase text-stroke-cream text-6xl sm:text-8xl px-8 tracking-tighter">
              {w}
            </span>
            <img 
              src="/logo-favo.jpg" 
              alt="" 
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover mx-6 sm:mx-10 select-none pointer-events-none" 
            />
          </span>
        ))}
      </div>
    </section>
  );
};
