import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Loader2, ArrowLeft, GraduationCap, Users, BookOpen, Key, Phone, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSession } from "@/lib/auth";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PortalLogin() {
  const navigate = useNavigate();
  const [loadingCard, setLoadingCard] = useState(null); // 'aluno' | 'pais' | 'equipe'
  
  // WhatsApp OTP login states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  // Form states
  const [alunoMatricula, setAlunoMatricula] = useState("");
  const [alunoSenha, setAlunoSenha] = useState("");

  const [paisTelefone, setPaisTelefone] = useState("");
  const [paisSenha, setPaisSenha] = useState("");
  const [useOtp, setUseOtp] = useState(false); // Toggle to use WhatsApp OTP login

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

  // Google SSO Simulation (extremely aesthetic, shows toast & logs in dynamically)
  const handleGoogleSSO = async (role) => {
    toast.loading("Conectando com o Google...");
    setTimeout(async () => {
      toast.dismiss();
      try {
        // Envia login demo usando e-mail cadastrado dependendo da role
        let email = "admin@escolafavodemel.com.br";
        if (role === "aluno") email = "lucas.aluno@escolafavodemel.com.br";
        if (role === "pais") email = "pais@escolafavodemel.com.br";

        const { data } = await axios.post(`${API}/auth/login`, {
          email,
          password: "Favo@2025" // senha default do seed
        });
        
        saveSession(data.token, data.user);
        toast.success(`Autenticado via Google como ${data.user.name}!`);
        
        const userRole = data.user.role.toLowerCase();
        if (userRole === "admin" || userRole === "diretoria") {
          navigate("/gestao");
        } else {
          navigate(`/portal/${userRole}`);
        }
      } catch {
        toast.error("Erro na integração com Google SSO.");
      }
    }, 1200);
  };

  // Envia OTP via WhatsApp (Simulação)
  const requestOtp = () => {
    if (!paisTelefone || paisTelefone.length < 14) {
      toast.error("Informe um telefone de acesso válido.");
      return;
    }
    setSendingOtp(true);
    toast.loading("Enviando código de verificação via WhatsApp...");
    
    setTimeout(() => {
      toast.dismiss();
      setSendingOtp(false);
      setOtpSent(true);
      toast.success("Código enviado! Verifique seu WhatsApp.");
    }, 1500);
  };

  // Confirma OTP (Simulação de Autenticação Rápida)
  const verifyOtp = async () => {
    if (!otpCode || otpCode.length < 4) {
      toast.error("Informe o código de segurança recebido.");
      return;
    }
    setLoadingCard("pais");
    toast.loading("Confirmando código de segurança...");
    
    setTimeout(async () => {
      toast.dismiss();
      try {
        // Login automático usando credencial demo do responsável do seed
        const { data } = await axios.post(`${API}/auth/login`, {
          phone: "(48) 99627-5127",
          password: "Favo@2025"
        });
        saveSession(data.token, data.user);
        toast.success(`Confirmado! Bem-vindo(a) ${data.user.name}`);
        navigate("/portal/pais");
      } catch {
        toast.error("Código inválido ou expirado.");
      } finally {
        setLoadingCard(null);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-cream-2 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8" data-testid="portal-login-page">
      {/* Header */}
      <header className="max-w-[1400px] mx-auto w-full flex items-center justify-between mb-8">
        <a href="/" className="inline-flex items-center gap-2 font-body text-sm text-ink-2 hover:text-amber transition-colors">
          <ArrowLeft size={16} /> Voltar ao site
        </a>
        <div className="flex items-center gap-3">
          <img src="/logo-favo-oficial.png" alt="Centro Educacional Favo de Mel" className="w-10 h-10 rounded-lg object-cover" />
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

            <div className="mt-8 pt-4 border-t border-blue-200/40 space-y-3">
              <button
                onClick={() => handleLogin("aluno", alunoMatricula, alunoSenha, "aluno")}
                disabled={loadingCard !== null}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-body font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loadingCard === "aluno" ? <Loader2 size={16} className="animate-spin" /> : "Acessar"}
              </button>

              <button
                onClick={() => handleGoogleSSO("aluno")}
                className="w-full bg-white border border-blue-200 hover:bg-blue-50/50 text-blue-950 py-2.5 rounded-full font-body text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Entrar com o Google
              </button>
            </div>
          </div>

          {/* Card 2: Responsável */}
          <div className="bg-white border border-ink/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber">
                  <Users size={24} />
                </div>
                <button 
                  onClick={() => { setUseOtp(!useOtp); setOtpSent(false); }}
                  className="text-xs font-semibold text-amber hover:underline"
                >
                  {useOtp ? "Entrar com Senha" : "Acesso sem Senha (OTP)"}
                </button>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-ink mb-2">Responsável</h3>
              <p className="font-body text-xs text-ink-2 mb-6">
                Monitore o boletim, frequência escolar e as faturas financeiras de seus filhos.
              </p>

              {useOtp ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-xs text-ink font-semibold">Telefone cadastrado</Label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-2" />
                      <Input 
                        type="text" 
                        value={paisTelefone}
                        onChange={handlePhoneChange}
                        disabled={otpSent}
                        placeholder="(48) 99627-5127"
                        className="font-body bg-white border-ink/10 pl-10 text-ink h-11"
                      />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-1.5">
                      <Label className="font-body text-xs text-ink font-semibold">Código de 6 dígitos recebido no WhatsApp</Label>
                      <Input 
                        type="text" 
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="Ex: 123456"
                        className="font-body bg-white border-ink/10 text-center tracking-widest text-lg font-bold h-11"
                      />
                    </div>
                  )}
                </div>
              ) : (
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
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-ink/5 space-y-3">
              {useOtp ? (
                otpSent ? (
                  <button
                    onClick={verifyOtp}
                    disabled={loadingCard !== null}
                    className="w-full bg-[#1b2b22] hover:bg-amber hover:text-dark text-cream py-3 rounded-full font-body font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    Confirmar Código
                  </button>
                ) : (
                  <button
                    onClick={requestOtp}
                    disabled={sendingOtp}
                    className="w-full bg-[#1b2b22] hover:bg-amber hover:text-dark text-cream py-3 rounded-full font-body font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {sendingOtp ? <Loader2 size={16} className="animate-spin" /> : "Receber código de acesso"}
                  </button>
                )
              ) : (
                <button
                  onClick={() => handleLogin("pais", paisTelefone, paisSenha, "pais")}
                  disabled={loadingCard !== null}
                  className="w-full bg-[#1b2b22] hover:bg-amber hover:text-dark text-cream py-3 rounded-full font-body font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loadingCard === "pais" ? <Loader2 size={16} className="animate-spin" /> : "Acessar"}
                </button>
              )}

              <button
                onClick={() => handleGoogleSSO("pais")}
                className="w-full bg-white border border-ink/10 hover:bg-cream-2 text-ink py-2.5 rounded-full font-body text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Entrar com o Google
              </button>
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

            <div className="mt-8 pt-4 border-t border-white/5 space-y-3">
              <button
                onClick={() => handleLogin("equipe", equipeEmail, equipeSenha, "equipe")}
                disabled={loadingCard !== null}
                className="w-full bg-honey hover:bg-honey-dark text-dark py-3 rounded-full font-body font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loadingCard === "equipe" ? <Loader2 size={16} className="animate-spin" /> : "Acessar"}
              </button>

              <button
                onClick={() => handleGoogleSSO("equipe")}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-cream py-2.5 rounded-full font-body text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Entrar com o Google
              </button>
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
