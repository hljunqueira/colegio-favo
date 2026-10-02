import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Loader2, ArrowLeft, GraduationCap, Users, BookOpen, Key, Phone, Check, X, MessageCircle, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSession } from "@/lib/auth";

import { API } from "@/lib/api";

export default function PortalLogin() {
  const navigate = useNavigate();
  const [loadingCard, setLoadingCard] = useState(null); // 'aluno' | 'pais' | 'equipe'
  const [alunoMatricula, setAlunoMatricula] = useState("");
  const [alunoSenha, setAlunoSenha] = useState("");
  const [showAlunoPass, setShowAlunoPass] = useState(false);

  const [paisTelefone, setPaisTelefone] = useState("");
  const [paisSenha, setPaisSenha] = useState("");
  const [showPaisPass, setShowPaisPass] = useState(false);

  const [equipeEmail, setEquipeEmail] = useState("");
  const [equipeSenha, setEquipeSenha] = useState("");
  const [showEquipePass, setShowEquipePass] = useState(false);

  const [showSecretariaModal, setShowSecretariaModal] = useState(false);

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


  return (
    <div className="min-h-screen bg-cream-2 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8" data-testid="portal-login-page">
      {/* Header */}
      <header className="max-w-[1400px] mx-auto w-full flex items-center justify-between mb-8">
        <a href="/" className="inline-flex items-center gap-2 font-body text-sm text-ink-2 hover:text-amber transition-colors">
          <ArrowLeft size={16} /> Voltar ao site
        </a>
        <div className="flex items-center gap-3">
          <img src="/logo-favo-oficial.png" alt="Colégio Favo" className="w-10 h-10 rounded-lg object-cover" />
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
            Acesse notas, frequências, boletins e rotinas do Colégio Favo. Escolha o seu perfil de acesso abaixo.
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
              <h3 className="font-display font-extrabold text-2xl text-blue-950 mb-2 h-8 flex items-center">Portal do Aluno</h3>
              <p className="font-body text-xs text-blue-800/80 mb-6 h-10 flex items-start leading-relaxed">
                Acesse suas notas, tarefas diárias, calendário e cardápio escolar.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs text-blue-900 font-semibold block h-4">Nº de Matrícula</Label>
                  <Input
                    type="text"
                    value={alunoMatricula}
                    onChange={(e) => setAlunoMatricula(e.target.value)}
                    placeholder="Ex: 202601"
                    className="font-body bg-white/80 border-blue-200/60 focus:border-blue-500 text-blue-950 h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between h-4">
                    <Label className="font-body text-xs text-blue-900 font-semibold">Senha</Label>
                    <button
                      type="button"
                      onClick={() => setShowSecretariaModal(true)}
                      className="text-[11px] font-medium text-blue-700 hover:text-blue-950 hover:underline transition-colors cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showAlunoPass ? "text" : "password"}
                      value={alunoSenha}
                      onChange={(e) => setAlunoSenha(e.target.value)}
                      placeholder="••••••••"
                      className="font-body bg-white/80 border-blue-200/60 focus:border-blue-500 text-blue-950 h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAlunoPass(!showAlunoPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-900/40 hover:text-blue-900 transition-colors p-1"
                      tabIndex={-1}
                      aria-label={showAlunoPass ? "Ocultar senha" : "Ver senha"}
                    >
                      {showAlunoPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-200/40 space-y-3">
              <button
                onClick={() => handleLogin("aluno", alunoMatricula, alunoSenha, "aluno")}
                disabled={loadingCard !== null}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-body font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loadingCard === "aluno" ? <Loader2 size={16} className="animate-spin" /> : "Acessar"}
              </button>

              <button
                onClick={() => setShowSecretariaModal(true)}
                className="w-full bg-white border border-blue-200 hover:bg-blue-50/50 text-blue-800 py-2.5 rounded-full font-body text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Primeiro Acesso? Solicitar à Secretaria
              </button>
            </div>
          </div>

          {/* Card 2: Responsável */}
          <div className="bg-white border border-ink/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber mb-6">
                <Users size={24} />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-ink mb-2 h-8 flex items-center">Responsável</h3>
              <p className="font-body text-xs text-ink-2 mb-6 h-10 flex items-start leading-relaxed">
                Monitore o boletim, frequência escolar e as faturas financeiras de seus filhos.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs text-ink font-semibold block h-4">Telefone de Acesso</Label>
                  <Input
                    type="text"
                    value={paisTelefone}
                    onChange={handlePhoneChange}
                    placeholder="(48) 99627-5127"
                    className="font-body bg-white border-ink/10 text-ink h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between h-4">
                    <Label className="font-body text-xs text-ink font-semibold">Senha</Label>
                    <button
                      type="button"
                      onClick={() => setShowSecretariaModal(true)}
                      className="text-[11px] font-medium text-amber hover:text-amber-dark hover:underline transition-colors cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPaisPass ? "text" : "password"}
                      value={paisSenha}
                      onChange={(e) => setPaisSenha(e.target.value)}
                      placeholder="••••••••"
                      className="font-body bg-white border-ink/10 text-ink h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPaisPass(!showPaisPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-2/60 hover:text-ink transition-colors p-1"
                      tabIndex={-1}
                      aria-label={showPaisPass ? "Ocultar senha" : "Ver senha"}
                    >
                      {showPaisPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-ink/5 space-y-3">
              <button
                onClick={() => handleLogin("pais", paisTelefone, paisSenha, "pais")}
                disabled={loadingCard !== null}
                className="w-full bg-[#1b2b22] hover:bg-amber hover:text-dark text-cream py-3 rounded-full font-body font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loadingCard === "pais" ? <Loader2 size={16} className="animate-spin" /> : "Acessar"}
              </button>

              <button
                onClick={() => setShowSecretariaModal(true)}
                className="w-full bg-white border border-ink/10 hover:bg-cream-2 text-ink py-2.5 rounded-full font-body text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Primeiro Acesso? Solicitar à Secretaria
              </button>
            </div>
          </div>

          {/* Card 3: Equipe */}
          <div className="bg-dark text-cream border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-honey mb-6">
                <GraduationCap size={24} />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-cream mb-2 h-8 flex items-center">Equipe Favo</h3>
              <p className="font-body text-xs text-cream/60 mb-6 h-10 flex items-start leading-relaxed">
                Acesso dedicado a Secretários(as), Professores, Coordenadores, Funcionários e Administradores.
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-xs text-cream/80 font-semibold block h-4">E-mail Corporativo</Label>
                  <Input
                    type="email"
                    value={equipeEmail}
                    onChange={(e) => setEquipeEmail(e.target.value)}
                    placeholder="Ex: professor@escolafavodemel.com.br"
                    className="font-body bg-white/5 border-white/10 text-cream focus:border-honey h-11 placeholder:text-cream/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between h-4">
                    <Label className="font-body text-xs text-cream/80 font-semibold">Senha</Label>
                    <button
                      type="button"
                      onClick={() => setShowSecretariaModal(true)}
                      className="text-[11px] font-medium text-honey hover:text-honey-dark hover:underline transition-colors cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showEquipePass ? "text" : "password"}
                      value={equipeSenha}
                      onChange={(e) => setEquipeSenha(e.target.value)}
                      placeholder="••••••••"
                      className="font-body bg-white/5 border-white/10 text-cream focus:border-honey h-11 pr-10 placeholder:text-cream/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEquipePass(!showEquipePass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors p-1"
                      tabIndex={-1}
                      aria-label={showEquipePass ? "Ocultar senha" : "Ver senha"}
                    >
                      {showEquipePass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 space-y-3">
              <button
                onClick={() => handleLogin("equipe", equipeEmail, equipeSenha, "equipe")}
                disabled={loadingCard !== null}
                className="w-full bg-honey hover:bg-honey-dark text-dark py-3 rounded-full font-body font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loadingCard === "equipe" ? <Loader2 size={16} className="animate-spin" /> : "Acessar"}
              </button>

              <button
                onClick={() => setShowSecretariaModal(true)}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-cream py-2.5 rounded-full font-body text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Primeiro Acesso? Solicitar à Secretaria
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Info Area */}
      <footer className="max-w-[1200px] mx-auto w-full mt-12 pt-6 border-t border-ink/5 text-center">
        <p className="font-body text-[11px] text-ink-2 mt-4">
          © {new Date().getFullYear()} Colégio Favo. Desenvolvido por HLJDEV.
        </p>
      </footer>
      {/* Modal Primeiro Acesso / Esqueceu a Senha */}
      {showSecretariaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white border border-ink/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowSecretariaModal(false)}
              className="absolute top-4 right-4 text-ink-2 hover:text-ink transition-colors p-1.5 rounded-full hover:bg-ink/5"
            >
              <X size={18} />
            </button>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber flex items-center justify-center mx-auto mb-5">
                <Key size={28} />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-ink mb-3">Primeiro Acesso ou Esqueceu a Senha?</h3>
              <p className="font-body text-sm text-ink-2 mb-6">
                Para a segurança dos dados dos alunos, responsáveis e equipe, tanto o primeiro acesso quanto a redefinição de senhas esquecidas são realizados e validados diretamente com a Secretaria do colégio.
              </p>
            </div>

            <div className="space-y-3 font-body">
              <a
                href="https://wa.me/5548996275127"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-colors shadow-sm"
              >
                <MessageCircle size={18} /> Falar com a Secretaria no WhatsApp
              </a>
              <button
                onClick={() => setShowSecretariaModal(false)}
                className="w-full bg-cream border border-ink/10 hover:bg-cream-2 text-ink py-2.5 rounded-xl font-semibold transition-colors text-sm"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

