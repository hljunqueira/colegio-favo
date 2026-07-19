import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, User } from "lucide-react";
import { SCHOOL } from "@/lib/content";

const LINKS = [
  { label: "A ESCOLA", href: "#inicio" },
  { label: "NOSSA ESSÊNCIA", href: "#filosofia" },
  { label: "NOSSAS ETAPAS", href: "#turmas" },
  { label: "NOSSO AMBIENTE", href: "#galeria" },
  { label: "FALE CONOSCO", href: "#contato" },
];

export const Navbar = ({ configs }) => {
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
      <nav className="max-w-[1400px] mx-auto px-5 sm:px-8 h-24 flex items-center justify-between">
        <a href="#inicio" data-testid="logo-link" className="flex items-center group">
          <img src="/logo-favo-oficial.png" alt="Centro Educacional Favo de Mel" className="w-20 h-20 rounded-xl object-cover" />
        </a>

        <div className="hidden lg:flex items-center gap-7 bg-cream/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-dark/10 shadow-sm">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-${l.label}`}
              className="font-body text-sm font-extrabold text-ink hover:text-amber transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber hover:after:w-full after:transition-all after:duration-300"
            >
              {l.label}
            </a>
          ))}
          <div className="h-4 w-[1px] bg-dark/10 mx-1" />
          <a
            href="/portal"
            data-testid="nav-portal-link"
            className="inline-flex items-center gap-1.5 text-ink font-body text-sm font-extrabold hover:text-amber transition-colors"
          >
            <User size={14} /> PORTAL
          </a>
        </div>
        <a
          href="#contato"
          data-testid="cta-matricula-nav"
          className="hidden lg:inline-flex items-center gap-2 bg-dark text-cream px-6 py-3 rounded-full font-body text-sm font-semibold hover:bg-amber hover:text-dark transition-colors duration-300"
        >
          <Phone size={15} /> MATRÍCULAS ABERTAS
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
                href={`tel:${configs?.school_phone_raw || "5548996275127"}`}
                className="mt-2 inline-flex items-center gap-2 bg-dark text-cream px-6 py-3 rounded-full font-body text-sm w-fit"
              >
                <Phone size={15} /> {configs?.school_phone || "(48) 99627-5127"}
              </a>
              <a
                href="/portal"
                data-testid="nav-portal-mobile"
                className="inline-flex items-center gap-2 border border-ink/20 text-ink px-6 py-3 rounded-full font-body text-sm w-fit"
              >
                <User size={15} /> Portal do Responsável
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
