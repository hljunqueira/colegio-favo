import { motion } from "framer-motion";

export const Gallery = ({ gallery }) => {
  const validGallery = (gallery || []).filter(g => g.imageUrl);
  if (validGallery.length === 0) return null;

  return (
    <section id="galeria" className="py-28 sm:py-40 bg-cream" data-testid="gallery-section">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="mb-14 max-w-2xl">
          <span className="font-body text-sm tracking-[0.3em] uppercase text-amber font-black">
            NOSSO AMBIENTE
          </span>
          <h2 className="mt-5 font-display font-black tracking-tighter text-ink text-6xl sm:text-7xl lg:text-8xl leading-[0.9]">
            Momentos <br className="hidden sm:inline" />
            que <span className="font-serif-ed italic font-normal text-amber">encantam</span>.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-4">
          {validGallery.map((g, i) => (
            <motion.figure
              key={g.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
              className={`relative overflow-hidden rounded-2xl group ${g.extra || ""}`}
              data-testid={`gallery-item-${i}`}
            >
              <img
                src={g.imageUrl}
                alt={g.title || ""}
                className="w-full h-full object-cover grayscale-[35%] saturate-[0.9] transition-all duration-700 group-hover:grayscale-0 group-hover:saturate-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/20 transition-colors duration-500" />
              <figcaption className="absolute bottom-3 left-3 font-body text-xs tracking-widest uppercase text-cream opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 bg-dark/60 backdrop-blur px-3 py-1.5 rounded-full">
                {g.title}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};
