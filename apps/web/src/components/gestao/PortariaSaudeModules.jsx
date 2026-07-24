import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DoorOpen, Fingerprint, HeartPulse, Pill, ArrowLeft, Plus, CheckCircle2, UserCheck, ShieldAlert, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// --- MAIN UNIFIED PORTARIA & SAÚDE COMPONENT ---
export const PortariaSaude = () => {
  const [tab, setTab] = useState("hub");

  const cards = [
    { key: "portaria", label: "Portaria / Visitantes", desc: "Controle de visitas e triagem de portaria", icon: DoorOpen, color: "bg-amber/10 text-amber" },
    { key: "acesso", label: "Controle de Acesso", desc: "Registros de catracas eletrônicas e QR Code", icon: Fingerprint, color: "bg-moss/10 text-moss" },
    { key: "saude", label: "Saúde & Enfermaria", desc: "Acompanhamento clínico e anamnese", icon: HeartPulse, color: "bg-indigo-500/10 text-indigo-500" },
    { key: "medicamentos", label: "Medicamentos", desc: "Medicamentos autorizados e alergias", icon: Pill, color: "bg-rose-500/10 text-rose-500" }
  ];

  const renderContent = () => {
    switch (tab) {
      case "portaria":
        return <Portaria onBack={() => setTab("hub")} />;
      case "acesso":
        return <Acesso onBack={() => setTab("hub")} />;
      case "saude":
        return <Saude onBack={() => setTab("hub")} />;
      case "medicamentos":
        return <Medicamentos onBack={() => setTab("hub")} />;
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {cards.map((c) => (
              <button
                key={c.key}
                onClick={() => setTab(c.key)}
                className="bg-cream border border-ink/10 rounded-2xl p-6 text-left hover:border-amber hover:shadow-md transition-all duration-300 group flex flex-col justify-between min-h-[160px]"
              >
                <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                  <c.icon size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-ink group-hover:text-amber transition-colors">{c.label}</h3>
                  <p className="font-body text-xs mt-1 leading-tight" style={{ color: "var(--ink-2)" }}>{c.desc}</p>
                </div>
              </button>
            ))}
          </div>
        );
    }
  };

  return renderContent();
};

const ModuleHeader = ({ title, icon: Icon, onBack }) => (
  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink/5">
    <button 
      onClick={onBack}
      className="p-2 hover:bg-cream-2 rounded-full text-ink-2 hover:text-ink transition-colors flex items-center justify-center"
      title="Voltar para Portaria & Saúde"
    >
      <ArrowLeft size={20} />
    </button>
    {Icon && <Icon className="text-amber" size={20} />}
    <h2 className="font-display font-extrabold text-xl text-ink">{title}</h2>
  </div>
);

// --- 1. PORTARIA & CHECK-IN DE VISITANTES ---
const Portaria = ({ onBack }) => {
  const [visitantes, setVisitantes] = useState([
    { id: "1", nome: "Carlos Eduardo Souza", doc: "32.145.890-X", motivo: "Reunião de Pais - 3º Ano", contato: "Prof. Ana Paula", entrada: "10:15", status: "Em Visita" },
    { id: "2", nome: "Mariana Alencar (Manutenção)", doc: "45.123.987-1", motivo: "Entrega de Material de Limpeza", contato: "Almoxarifado", entrada: "08:30", status: "Saída Concluída" }
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", doc: "", motivo: "", contato: "" });

  const handleCheckin = (e) => {
    e.preventDefault();
    if (!form.nome || !form.doc) return;
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setVisitantes(prev => [{ id: Date.now().toString(), ...form, entrada: hora, status: "Em Visita" }, ...prev]);
    toast.success(`Check-in de ${form.nome} realizado na Portaria!`);
    setOpen(false);
    setForm({ nome: "", doc: "", motivo: "", contato: "" });
  };

  const handleCheckout = (id) => {
    setVisitantes(prev => prev.map(v => v.id === id ? { ...v, status: "Saída Concluída" } : v));
    toast.success("Saída registrada na portaria!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ModuleHeader title="Portaria & Triagem de Visitantes" icon={DoorOpen} onBack={onBack} />
        <button onClick={() => setOpen(true)} className="bg-dark text-cream font-body font-semibold px-4 py-2 rounded-full text-xs hover:bg-amber hover:text-dark transition-colors flex items-center gap-1.5">
          <Plus size={16} /> Novo Check-in
        </button>
      </div>

      {open && (
        <form onSubmit={handleCheckin} className="bg-cream rounded-2xl border border-ink/10 p-5 space-y-3 max-w-md">
          <h4 className="font-display font-bold text-sm text-ink">Registrar Entrada de Visitante</h4>
          <Input placeholder="Nome Completo do Visitante *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <Input placeholder="Documento (RG ou CPF) *" value={form.doc} onChange={(e) => setForm({ ...form, doc: e.target.value })} required />
          <Input placeholder="Motivo da Visita / Empresa" value={form.motivo} onChange={(e) => setForm({ ...form, motivo: e.target.value })} />
          <Input placeholder="Pessoa a Contatar no Colégio" value={form.contato} onChange={(e) => setForm({ ...form, contato: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs text-ink-2">Cancelar</button>
            <button type="submit" className="bg-dark text-cream px-4 py-1.5 rounded-full text-xs font-bold">Confirmar Check-in</button>
          </div>
        </form>
      )}

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left text-ink-2">
              <th className="p-4 font-semibold">Visitante</th>
              <th className="p-4 font-semibold">Documento</th>
              <th className="p-4 font-semibold">Motivo / Destino</th>
              <th className="p-4 font-semibold">Entrada</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {visitantes.map((v) => (
              <tr key={v.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-semibold text-ink">{v.nome}</td>
                <td className="p-4 text-ink-2 font-mono text-xs">{v.doc}</td>
                <td className="p-4 text-ink-2">
                  <span>{v.motivo}</span>
                  {v.contato && <span className="block text-[11px] text-ink-3">Contato: {v.contato}</span>}
                </td>
                <td className="p-4 text-ink-2 font-bold">{v.entrada}</td>
                <td className="p-4">
                  <Badge className={v.status === "Em Visita" ? "bg-amber/15 text-amber" : "bg-moss/10 text-moss"}>
                    {v.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  {v.status === "Em Visita" && (
                    <button 
                      onClick={() => handleCheckout(v.id)}
                      className="bg-cream-3 hover:bg-cream-2 text-ink px-3 py-1 rounded-full text-xs font-semibold border border-ink/10 transition-colors"
                    >
                      Registrar Saída
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 2. CONTROLE DE ACESSO ---
const Acesso = ({ onBack }) => {
  const logs = [
    { id: "1", pessoa: "Lucas Santos", perfil: "Aluno", tipo: "Entrada (Catraca 01)", horario: "07:14:02", status: "Autorizado" },
    { id: "2", pessoa: "Prof. Henrique Junqueira", perfil: "Professor", tipo: "Entrada (Catraca 02)", horario: "07:22:15", status: "Autorizado" },
    { id: "3", pessoa: "Beatriz Oliveira", perfil: "Aluno", tipo: "Entrada (Catraca 01)", horario: "07:29:40", status: "Autorizado" },
    { id: "4", pessoa: "Visitante Desconhecido", perfil: "Externo", tipo: "Tentativa de Acesso", horario: "08:02:11", status: "Bloqueado" }
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader title="Log de Controle de Acesso (Catracas Biométricas)" icon={Fingerprint} onBack={onBack} />
      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left text-ink-2">
              <th className="p-4 font-semibold">Horário</th>
              <th className="p-4 font-semibold">Usuário / Pessoa</th>
              <th className="p-4 font-semibold">Perfil</th>
              <th className="p-4 font-semibold">Dispositivo / Evento</th>
              <th className="p-4 font-semibold">Status de Liberação</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-mono text-xs font-bold text-ink-2">{l.horario}</td>
                <td className="p-4 font-semibold text-ink">{l.pessoa}</td>
                <td className="p-4 text-ink-2">{l.perfil}</td>
                <td className="p-4 text-ink-2">{l.tipo}</td>
                <td className="p-4">
                  <Badge className={l.status === "Autorizado" ? "bg-moss/10 text-moss" : "bg-rose-500/10 text-rose-500"}>
                    {l.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 3. SAÚDE & ENFERMARIA ---
const Saude = ({ onBack }) => {
  const [atendimentos, setAtendimentos] = useState([
    { id: "1", aluno: "Gabriel Ferraz (3º Ano)", queixa: "Febre baixa (37.8ºC) e cefaleia", conduta: "Medido temperatura, repouso na enfermaria e aviso à mãe.", horario: "09:40", avisado: "Sim" },
    { id: "2", aluno: "Sophia Lima (1º Ano)", queixa: "Pequena escoriação no joelho na educação física", conduta: "Higienização e curativo simples.", horario: "10:30", avisado: "Não" }
  ]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ aluno: "", queixa: "", conduta: "", avisado: "Sim" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.aluno || !form.queixa) return;
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setAtendimentos(prev => [{ id: Date.now().toString(), ...form, horario: hora }, ...prev]);
    toast.success("Atendimento ambulatorial registrado com sucesso!");
    setOpen(false);
    setForm({ aluno: "", queixa: "", conduta: "", avisado: "Sim" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ModuleHeader title="Saúde & Atendimentos Ambulatoriais" icon={HeartPulse} onBack={onBack} />
        <button onClick={() => setOpen(true)} className="bg-dark text-cream font-body font-semibold px-4 py-2 rounded-full text-xs hover:bg-amber hover:text-dark transition-colors flex items-center gap-1.5">
          <Plus size={16} /> Novo Atendimento
        </button>
      </div>

      {open && (
        <form onSubmit={handleAdd} className="bg-cream rounded-2xl border border-ink/10 p-5 space-y-3 max-w-md">
          <h4 className="font-display font-bold text-sm text-ink">Registrar Ocorrência Médica / Enfermaria</h4>
          <Input placeholder="Nome do Aluno e Turma *" value={form.aluno} onChange={(e) => setForm({ ...form, aluno: e.target.value })} required />
          <Input placeholder="Queixa / Sintoma Apresentado *" value={form.queixa} onChange={(e) => setForm({ ...form, queixa: e.target.value })} required />
          <Input placeholder="Procedimento / Conduta Adotada" value={form.conduta} onChange={(e) => setForm({ ...form, conduta: e.target.value })} />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs text-ink-2">Cancelar</button>
            <button type="submit" className="bg-dark text-cream px-4 py-1.5 rounded-full text-xs font-bold">Salvar Ficha</button>
          </div>
        </form>
      )}

      <div className="bg-cream rounded-2xl border border-ink/10 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="bg-cream-2 text-left text-ink-2">
              <th className="p-4 font-semibold">Horário</th>
              <th className="p-4 font-semibold">Aluno</th>
              <th className="p-4 font-semibold">Queixa / Sintoma</th>
              <th className="p-4 font-semibold">Conduta Aplicada</th>
              <th className="p-4 font-semibold">Resp. Notificado</th>
            </tr>
          </thead>
          <tbody>
            {atendimentos.map((a) => (
              <tr key={a.id} className="border-t border-ink/5 hover:bg-cream-2/50 transition-colors">
                <td className="p-4 font-mono text-xs font-bold text-ink-2">{a.horario}</td>
                <td className="p-4 font-semibold text-ink">{a.aluno}</td>
                <td className="p-4 text-ink-2">{a.queixa}</td>
                <td className="p-4 text-ink-2">{a.conduta}</td>
                <td className="p-4">
                  <Badge className={a.avisado === "Sim" ? "bg-moss/10 text-moss" : "bg-cream-3 text-ink-2"}>
                    {a.avisado}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 4. MEDICAMENTOS & ALERGIAS ---
const Medicamentos = ({ onBack }) => {
  const alertas = [
    { id: "1", aluno: "Laura Ramos (2º Ano)", tipo: "Alergia Severa", detalhe: "Alergia grave a Amendoim e Frutos do Mar. Possui caneta Epipen na bolsa.", prescricao: "Autorização assinada pela mãe (Maria Ramos)." },
    { id: "2", aluno: "Matheus Mendes (5º Ano)", tipo: "Medicamento Contínuo", detalhe: "Dipirona 500mg em caso de febre acima de 38ºC (15 gotas).", prescricao: "Receita médica válida anexada no prontuário." }
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader title="Medicamentos Autorizados & Restrições Alérgicas" icon={Pill} onBack={onBack} />
      <div className="space-y-4">
        {alertas.map((item) => (
          <div key={item.id} className="bg-cream border border-ink/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-base text-ink">{item.aluno}</h4>
              <Badge className={item.tipo.includes("Alergia") ? "bg-red-500/10 text-red-500 font-bold" : "bg-amber/15 text-amber font-bold"}>
                {item.tipo}
              </Badge>
            </div>
            <p className="font-body text-xs text-ink-2"><strong>Descrição:</strong> {item.detalhe}</p>
            <p className="font-body text-[11px] text-ink-3"><strong>Prescrição / Autorização:</strong> {item.prescricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

