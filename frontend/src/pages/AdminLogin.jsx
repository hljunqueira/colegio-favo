import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSession } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function formatErr(detail) {
  if (!detail) return "Erro ao entrar.";
  if (typeof detail === "string") return detail;
  return "Erro ao entrar.";
}

export default function AdminLogin() {
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
      toast.success("Bem-vindo(a)!");
      navigate("/gestao");
    } catch (err) {
      toast.error(formatErr(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-2 flex items-center justify-center px-5" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <a href="/" className="inline-flex items-center gap-2 font-body text-sm mb-8 text-ink-2 hover:text-amber transition-colors" style={{ color: "var(--ink-2)" }}>
          <ArrowLeft size={16} /> Voltar ao site
        </a>
        <div className="bg-cream rounded-[1.75rem] p-8 sm:p-10 border border-ink/10 shadow-xl">
          <div className="flex items-center gap-2 mb-8">
            <img src="/logo-favo.jpg" alt="Favo de Mel" className="w-12 h-12 rounded-lg object-cover" />
            <span className="font-display font-extrabold tracking-tight text-xl text-ink">Área administrativa</span>
          </div>
          <form onSubmit={submit} className="space-y-5" data-testid="admin-login-form">
            <div className="space-y-2">
              <Label className="font-body">E-mail</Label>
              <Input data-testid="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@favodemel.com.br" className="font-body" />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Senha</Label>
              <Input data-testid="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="font-body" />
            </div>
            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-dark text-cream py-3.5 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors disabled:opacity-60"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Entrando...</> : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
