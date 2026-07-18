import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ArrowLeft, GraduationCap, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMAGES, SCHOOL } from "@/lib/content";
import { saveSession, formatErr } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PortalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      saveSession(data.token, data.user);
      toast.success(`Bem-vindo(a), ${data.user?.name?.split(" ")[0] || ""}!`);
      const role = data.user?.role;
      navigate(role === "admin" ? "/gestao" : "/portal/app");
    } catch (err) {
      toast.error(formatErr(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2" data-testid="portal-login-page">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-dark overflow-hidden">
        <img src={IMAGES.play} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <img src="/logo-favo.jpg" alt="Colégio Favo de Mel" className="w-14 h-14 rounded-lg object-cover" />
            <span className="font-display font-extrabold tracking-tight text-cream text-lg">Colégio Favo de Mel</span>
          </div>
        </div>
        <div className="relative">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-honey mb-4">Portal de Acesso</p>
          <h1 className="font-display font-black tracking-tighter text-cream text-6xl leading-[0.9]">
            Tudo em<br />um só <span className="font-serif-ed italic font-normal text-honey">lugar</span>.
          </h1>
          <p className="font-body text-cream/70 mt-6 max-w-sm">
            Acesso único para Responsáveis, Administração, Professores e Funcionários.
            O sistema direciona você automaticamente conforme o seu perfil.
          </p>
        </div>
        <div className="relative flex items-center gap-6 text-cream/60 font-body text-xs">
          <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-honey" /> Acesso seguro</span>
          <span className="inline-flex items-center gap-2"><GraduationCap size={14} className="text-honey" /> {SCHOOL.tagline}</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-cream">
        <div className="w-full max-w-md">
          <a href="/" className="inline-flex items-center gap-2 font-body text-sm mb-10 hover:text-amber transition-colors" style={{ color: "var(--ink-2)" }}>
            <ArrowLeft size={16} /> Voltar ao site
          </a>
          <h2 className="font-display font-extrabold tracking-tight text-3xl text-ink">Acessar o sistema</h2>
          <p className="font-body mt-2 mb-8" style={{ color: "var(--ink-2)" }}>Entre com seu e-mail e senha.</p>

          <form onSubmit={submit} className="space-y-5" data-testid="portal-login-form">
            <div className="space-y-2">
              <Label className="font-body">E-mail</Label>
              <Input data-testid="portal-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="responsavel@favodemel.com.br" className="font-body h-12" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Senha</Label>
              <Input data-testid="portal-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="font-body h-12" />
            </div>
            <button
              type="submit"
              disabled={loading}
              data-testid="portal-submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-dark text-cream py-3.5 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors disabled:opacity-60"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Entrando...</> : "Acessar portal"}
            </button>
          </form>

          <div className="mt-8 rounded-xl bg-cream-2 border border-ink/10 p-4 font-body text-xs space-y-2" style={{ color: "var(--ink-2)" }}>
            <p className="font-semibold text-ink">Acessos de demonstração</p>
            <p><span className="text-amber font-semibold">Responsável:</span> responsavel@favodemel.com.br · Favo@2025</p>
            <p><span className="text-amber font-semibold">Administração:</span> admin@favodemel.com.br · Favo@2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
