import { SCHOOL } from "@/lib/content";

export const Footer = ({ configs }) => {
  return (
    <footer className="bg-dark border-t border-cream/10 py-10" data-testid="site-footer">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo-favo.jpg" alt="Favo de Mel" className="w-8 h-8 rounded-md object-cover" />
          <span className="font-display font-extrabold tracking-tight text-cream">Favo de Mel</span>
        </div>
        <p className="font-body text-xs text-cream/50 text-center flex flex-col items-center gap-1.5">
          <span>© {new Date().getFullYear()} {configs?.school_full || "Centro Educacional Favo de Mel"}. Todos os direitos reservados.</span>
          <span className="text-cream/30 text-[10px]">
            Desenvolvido por{" "}
            <a href="https://www.hljdev.com.br" target="_blank" rel="noreferrer" className="text-honey hover:underline font-semibold">
              HLJDEV
            </a>
          </span>
        </p>
        <div className="flex items-center gap-4">
          <a href={configs?.school_instagram || "#"} target="_blank" rel="noreferrer" className="font-body text-xs text-cream/60 hover:text-honey transition-colors">
            Instagram
          </a>
          <span className="text-cream/20">|</span>
          <a href="/portal" data-testid="footer-portal-link" className="font-body text-xs text-cream/60 hover:text-honey transition-colors">
            Acessar o sistema
          </a>
        </div>
      </div>
    </footer>
  );
};
