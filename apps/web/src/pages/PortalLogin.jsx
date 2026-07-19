import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Loader2, ArrowLeft, GraduationCap, Users, BookOpen, Key, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSession } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PortalLogin() {
  const navigate = useNavigate();
  const [loadingCard, setLoadingCard] = useState(null); // 'aluno' | 'pais' | 'equipe'

  // Form states
  const [alunoMatricula, setAlunoMatricula] = useState("");
  const [alunoSenha, setAlunoSenha] = useState("");

  const [paisTelefone, setPaisTelefone] = useState("");
  const [paisSenha, setPaisSenha] = useState("");

  const [equipeEmail, setEquipeEmail] = useState("");
  const [equipeSenha, setEquipeSenha] = useState("");

  // Phone mask helper
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setPaisTelefone(value);
  };

  const handleLogin = async (role, identifier, password, cardName) => {
    setLoadingCard(cardName);
    
    if (!identifier || !password) {
      toast.error("Por favor, preencha todos os campos.");
      setLoadingCard(null);
      return;
    }

    try {
      // Constrói o corpo baseado no tipo do login
      const payload = { password };
      if (role === "aluno") {
        payload.matricula = identifier;
      } else if (role === "pais") {
        payload.phone = identifier;
      } else {
        payload.email = identifier;
      }

      const { data } = await axios.post(`${API}/auth/login`, payload);
      saveSession(data.token, data.user);

      toast.success(`Bem-vindo(a) de volta, ${data.user.name.split(" ")[0]}!`);
      
      const userRole = data.user.role.toLowerCase();
      if (userRole === "admin" || userRole === "diretoria") {
        navigate("/gestao");
      } else {
        navigate(`/portal/${userRole}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro na autenticação. Verifique os dados.");
    } finally {
      setLoadingCard(null);
    }
  };

  return (
    <div className="min-h-screen bg-cream-2 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8" data-testid="portal-login-page">
      {/* Header */}
      <header className="max-w-[1400px] mx-auto w-full flex items-center justify-between mb-8">
        <a href="/" className="inline-flex items-center gap-2 font-body text-sm text-ink-2 hover:text-amber transition-colors">
          <ArrowLeft size={16} /> Voltar ao site
        </a>
        <div className="flex items-center gap-3">
          <img src="/logo-favo.jpg" alt="Centro Educacional Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
          <span className="font-display font-extrabold tracking-tight text-ink text-sm sm:text-base hidden sm:inline">
            Acesso Unificado
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1200px] mx-auto w-full flex-grow flex flex-col justify-center items-center">
        <div className="text-center mb-10">
          <h1 className="font-display font-black tracking-tighter text-ink text-4xl sm:text-5xl lg:text-6xl mb-4 leading-none">
            ÁREA DO <span className="text-amber italic font-serif-ed font-normal lowercase">portal</span>
          </h1>
          <p className="font-body text-ink-2 text-sm sm:text-base max-w-lg mx-auto">
            Acesse notas, frequências, boletins e rotinas do Centro Educacional Favo de Mel. Escolha o seu perfil de acesso abaixo.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
          
          {/* Card 1: Aluno */}
          <div className="bg-[#eef4ff] border border-blue-200/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-blue-950 mb-2">Portal do Aluno</h3>
              <p className="font-body text-xs text-blue-800/80 mb-6">
                Acesse suas notas, tarefas diárias, calendário e cardápio escolar.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs text-blue-900 font-semibold">Nº de Matrícula</Label>
                  <Input 
                    type="text" 
                    value={alunoMatricula}
                    onChange={(e) => setAlunoMatricula(e.target.value)}
                    placeholder="Ex: 202601"
                    className="font-body bg-white/80 border-blue-200/60 focus:border-blue-500 text-blue-950 h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs text-blue-900 font-semibold">Senha</Label>
                  <Input 
                    type="password" 
                    value={alunoSenha}
                    onChange={(e) => setAlunoSenha(e.target.value)}
                    placeholder="••••••••"
                    className="font-body bg-white/80 border-blue-200/60 focus:border-blue-500 text-blue-950 h-11"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-200/40">
              <button
                onClick={() => handleLogin("aluno", alunoMatricula, alunoSenha, "aluno")}
                disabled={loadingCard !== null}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-body font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loadingCard === "aluno" ? <Loader2 size={16} className="animate-spin" /> : "Acessar"}
              </button>
              <div className="text-center mt-3">
                <span className="font-body text-[11px] text-blue-700/60">Senha demo: Favo@2025</span>
              </div>
            </div>
          </div>

          {/* Card 2: Responsável */}
          <div className="bg-white border border-ink/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber mb-6">
                <Users size={24} />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-ink mb-2">Responsável</h3>
              <p className="font-body text-xs text-ink-2 mb-6">
                Monitore o boletim, frequência escolar e as faturas financeiras de seus filhos.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs text-ink font-semibold">Telefone de Acesso</Label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-2" />
                    <Input 
                      type="text" 
                      value={paisTelefone}
                      onChange={handlePhoneChange}
                      placeholder="(48) 99627-5127"
                      className="font-body bg-white border-ink/10 pl-10 text-ink h-11"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs text-ink font-semibold">Senha</Label>
                  <Input 
                    type="password" 
                    value={paisSenha}
                    onChange={(e) => setPaisSenha(e.target.value)}
                    placeholder="••••••••"
                    className="font-body bg-white border-ink/10 text-ink h-11"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-ink/5">
              <button
                onClick={() => handleLogin("pais", paisTelefone, paisSenha, "pais")}
                disabled={loadingCard !== null}
                className="w-full bg-[#1b2b22] hover:bg-amber hover:text-dark text-cream py-3 rounded-full font-body font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loadingCard === "pais" ? <Loader2 size={16} className="animate-spin" /> : "Acessar"}
              </button>
              <div className="text-center mt-3">
                <span className="font-body text-[11px] text-ink-2">Senha demo: Favo@2025</span>
              </div>
            </div>
          </div>

          {/* Card 3: Equipe */}
          <div className="bg-dark text-cream border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-honey mb-6">
                <GraduationCap size={24} />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-cream mb-2">Equipe Favo</h3>
              <p className="font-body text-xs text-cream/60 mb-6">
                Acesso dedicado a Professores, Coordenadores, Funcionários e Administradores.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs text-cream/80 font-semibold">E-mail Corporativo</Label>
                  <Input 
                    type="email" 
                    value={equipeEmail}
                    onChange={(e) => setEquipeEmail(e.target.value)}
                    placeholder="Ex: professor@escolafavodemel.com.br"
                    className="font-body bg-white/5 border-white/10 text-cream focus:border-honey h-11 placeholder:text-cream/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-xs text-cream/80 font-semibold">Senha</Label>
                  <Input 
                    type="password" 
                    value={equipeSenha}
                    onChange={(e) => setEquipeSenha(e.target.value)}
                    placeholder="••••••••"
                    className="font-body bg-white/5 border-white/10 text-cream focus:border-honey h-11 placeholder:text-cream/30"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5">
              <button
                onClick={() => handleLogin("equipe", equipeEmail, equipeSenha, "equipe")}
                disabled={loadingCard !== null}
                className="w-full bg-honey hover:bg-honey-dark text-dark py-3 rounded-full font-body font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loadingCard === "equipe" ? <Loader2 size={16} className="animate-spin" /> : "Acessar"}
              </button>
              <div className="text-center mt-3">
                <span className="font-body text-[11px] text-cream/40">Senha demo: Favo@2025</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Info Area */}
      <footer className="max-w-[1200px] mx-auto w-full mt-12 pt-6 border-t border-ink/5 text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 bg-cream border border-ink/5 px-6 py-3 rounded-2xl shadow-sm max-w-4xl">
          <span className="font-body text-xs text-ink font-semibold flex items-center gap-1">
            <Key size={13} className="text-amber" /> Contas de Teste (Senha: Favo@2025):
          </span>
          <span className="font-body text-xs text-ink-2">
            <strong>Professor:</strong> professor@escolafavodemel.com.br
          </span>
          <span className="font-body text-xs text-cream/20">|</span>
          <span className="font-body text-xs text-ink-2">
            <strong>Coordenador:</strong> coordenador@escolafavodemel.com.br
          </span>
          <span className="font-body text-xs text-cream/20">|</span>
          <span className="font-body text-xs text-ink-2">
            <strong>Funcionário:</strong> funcionario@escolafavodemel.com.br
          </span>
          <span className="font-body text-xs text-cream/20">|</span>
          <span className="font-body text-xs text-ink-2">
            <strong>Admin:</strong> admin@escolafavodemel.com.br
          </span>
        </div>
        <p className="font-body text-[11px] text-ink-2 mt-4">
          © {new Date().getFullYear()} Centro Educacional Favo de Mel. Desenvolvido por HLJDEV.
        </p>
      </footer>
    </div>
  );
}
