import { SCHOOL } from "@/lib/content";

export const Footer = () => {
  return (
    <footer className="bg-dark border-t border-cream/10 py-10" data-testid="site-footer">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 hex-clip bg-honey flex items-center justify-center">
            <span className="font-display font-black text-dark text-sm">F</span>
          </span>
          <span className="font-display font-extrabold tracking-tight text-cream">Favo de Mel</span>
        </div>
        <p className="font-body text-xs text-cream/50 text-center">
          © {new Date().getFullYear()} {SCHOOL.full}. Feito com carinho em Balneário Arroio do Silva — SC.
        </p>
        <a href="/admin" data-testid="admin-link" className="font-body text-xs text-cream/40 hover:text-honey transition-colors">
          Área administrativa
        </a>
      </div>
    </footer>
  );
};
