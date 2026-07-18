import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { SCHOOL } from "@/lib/content";

const LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Nossa filosofia", href: "#filosofia" },
  { label: "Segmentos", href: "#turmas" },
  { label: "Galeria", href: "#galeria" },
  { label: "Contato", href: "#contato" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      data-testid="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-cream/70 border-b border-ink/10" : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <a href="#inicio" data-testid="logo-link" className="flex items-center gap-2 group">
          <span className="w-9 h-9 hex-clip bg-honey flex items-center justify-center">
            <span className="font-display font-black text-dark text-lg">F</span>
          </span>
          <span className="font-display font-extrabold tracking-tighter text-lg text-ink">
            Favo de Mel
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-9">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-${l.label}`}
              className="font-body text-sm text-ink-2 hover:text-amber transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber hover:after:w-full after:transition-all after:duration-300"
              style={{ color: "var(--ink-2)" }}
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#contato"
          data-testid="cta-matricula-nav"
          className="hidden lg:inline-flex items-center gap-2 bg-dark text-cream px-6 py-3 rounded-full font-body text-sm font-semibold hover:bg-amber hover:text-dark transition-colors duration-300"
        >
          <Phone size={15} /> Matrículas abertas
        </a>

        <button
          data-testid="mobile-menu-toggle"
          className="lg:hidden text-ink"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-cream border-t border-ink/10"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl font-bold tracking-tight text-ink"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={`tel:${SCHOOL.phoneRaw}`}
                className="mt-2 inline-flex items-center gap-2 bg-dark text-cream px-6 py-3 rounded-full font-body text-sm w-fit"
              >
                <Phone size={15} /> {SCHOOL.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
