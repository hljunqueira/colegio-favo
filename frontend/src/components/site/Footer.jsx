import { SCHOOL } from "@/lib/content";

export const Footer = () => {
  return (
    <footer className="bg-dark border-t border-cream/10 py-10" data-testid="site-footer">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo-favo.jpg" alt="Favo de Mel" className="w-8 h-8 rounded-md object-cover" />
          <span className="font-display font-extrabold tracking-tight text-cream">Favo de Mel</span>
        </div>
        <p className="font-body text-xs text-cream/50 text-center">
          © {new Date().getFullYear()} {SCHOOL.full}. Feito com carinho em Balneário Arroio do Silva — SC.
        </p>
        <div className="flex items-center gap-5">
          <a href="/portal" data-testid="footer-portal-link" className="font-body text-xs text-cream/60 hover:text-honey transition-colors">
            Acessar o sistema
          </a>
        </div>
      </div>
    </footer>
  );
};
