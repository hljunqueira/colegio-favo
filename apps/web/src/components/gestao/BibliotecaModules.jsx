import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Library, BookCopy, CalendarCheck, Search, Plus, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authHeader } from "@/lib/auth";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// --- MAIN UNIFIED BIBLIOTECA COMPONENT ---
export const Biblioteca = () => {
  const [tab, setTab] = useState("hub");

  const cards = [
    { key: "livros", label: "Acervo de Livros", desc: "Listagem de livros físicos e digitais", icon: Library, color: "bg-amber/10 text-amber" },
    { key: "emprestimos", label: "Empréstimos", desc: "Controle de empréstimos e devoluções", icon: BookCopy, color: "bg-moss/10 text-moss" },
    { key: "reservas", label: "Reservas", desc: "Fila de espera de livros reservados", icon: CalendarCheck, color: "bg-indigo-500/10 text-indigo-500" }
  ];

  const renderContent = () => {
    switch (tab) {
      case "livros":
        return <Livros onBack={() => setTab("hub")} />;
      case "emprestimos":
        return <Emprestimos onBack={() => setTab("hub")} />;
      case "reservas":
        return <Reservas onBack={() => setTab("hub")} />;
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
      title="Voltar para a Biblioteca"
    >
      <ArrowLeft size={20} />
    </button>
    {Icon && <Icon className="text-amber" size={20} />}
    <h2 className="font-display font-extrabold text-xl text-ink">{title}</h2>
  </div>
);

// --- 1. LIVROS ---
const Livros = ({ onBack }) => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("online"); // online ou manual
  const [editingBookId, setEditingBookId] = useState(null);
  const [deleteConfirmBookId, setDeleteConfirmBookId] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  
  // States para cadastro manual
  const [manualBook, setManualBook] = useState({ titulo: "", autor: "", isbn: "", localizacao: "", quantidade: 1, isDigital: false, urlLeitura: "" });
  
  // States para busca online
  const [onlineQuery, setOnlineQuery] = useState("");
  const [apiType, setApiType] = useState("gutendex"); // gutendex (digital) ou openlibrary (fisico)
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const load = async () => {
    try {
      const res = await axios.get(`${API}/library/livros`, authHeader());
      setRows(res.data);
    } catch {
      toast.error("Erro ao carregar livros.");
    }
  };

  useEffect(() => { load(); }, []);

  const handleSearchOnline = async (e) => {
    e.preventDefault();
    if (!onlineQuery) return;
    setLoadingSearch(true);
    try {
      if (apiType === "openlibrary") {
        const res = await axios.get(`${API}/library/external/openlibrary?isbn=${onlineQuery}`, authHeader());
        if (res.data) {
          // Normaliza resultado OpenLibrary
          setSearchResults([{
            titulo: res.data.title || "Sem título",
            autor: res.data.authors?.map(a => a.name).join(", ") || "Autor desconhecido",
            isbn: onlineQuery,
            capaUrl: res.data.cover?.medium || null,
            isDigital: false,
            urlLeitura: null
          }]);
        } else {
          setSearchResults([]);
        }
      } else {
        const res = await axios.get(`${API}/library/external/gutendex?q=${onlineQuery}`, authHeader());
        const list = res.data.results || [];
        setSearchResults(list.map(b => ({
          titulo: b.title,
          autor: b.authors?.map(a => a.name).join(", ") || "Domínio Público",
          isbn: null,
          capaUrl: b.formats["image/jpeg"] || null,
          isDigital: true,
          urlLeitura: b.formats["text/html"] || b.formats["text/plain"] || b.formats["application/epub+zip"]
        })));
      }
    } catch {
      toast.error("Erro ao buscar livros na API.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleImport = async (book) => {
    try {
      await axios.post(`${API}/library/livros`, book, authHeader());
      toast.success(`Livro "${book.titulo}" cadastrado no acervo!`);
      setModalOpen(false);
      setOnlineQuery("");
      setSearchResults([]);
      load();
    } catch {
      toast.error("Erro ao importar livro.");
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualBook.titulo || !manualBook.autor) {
      toast.error("Preencha título e autor.");
      return;
    }
    try {
      if (editingBookId) {
        await axios.patch(`${API}/library/livros/${editingBookId}`, manualBook, authHeader());
        toast.success("Livro atualizado com sucesso!");
      } else {
        await axios.post(`${API}/library/livros`, manualBook, authHeader());
        toast.success("Livro cadastrado com sucesso!");
      }
      setModalOpen(false);
      setEditingBookId(null);
      setManualBook({ titulo: "", autor: "", isbn: "", localizacao: "", quantidade: 1, isDigital: false, urlLeitura: "" });
      load();
    } catch {
      toast.error("Erro ao salvar livro.");
    }
  };

  const handleEditClick = (book) => {
    setEditingBookId(book.id);
    setManualBook({
      titulo: book.titulo,
      autor: book.autor,
      isbn: book.isbn || "",
      localizacao: book.localizacao || "",
      quantidade: book.quantidade || 1,
      isDigital: book.isDigital || false,
      urlLeitura: book.urlLeitura || ""
    });
    setActiveSubTab("manual");
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmBookId) return;
    try {
      await axios.delete(`${API}/library/livros/${deleteConfirmBookId}`, authHeader());
      toast.success("Livro removido do acervo.");
      setDeleteConfirmBookId(null);
      load();
    } catch {
      toast.error("Erro ao excluir livro.");
    }
  };

  const openNewBookModal = () => {
    setEditingBookId(null);
    setManualBook({ titulo: "", autor: "", isbn: "", localizacao: "", quantidade: 1, isDigital: false, urlLeitura: "" });
    setActiveSubTab("online");
    setModalOpen(true);
  };

  const filtered = rows.filter(r => 
    r.titulo.toLowerCase().includes(search.toLowerCase()) || 
    r.autor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ModuleHeader title="Acervo de Livros" icon={Library} onBack={onBack} />
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="relative w-60">
            <Input 
              placeholder="Buscar por título ou autor..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9 bg-cream"
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" />
          </div>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <button 
              onClick={openNewBookModal}
              className="inline-flex items-center gap-2 bg-dark text-cream px-5 py-2 rounded-full font-body text-sm font-semibold hover:bg-amber hover:text-dark transition-colors"
            >
              <Plus size={16} /> Novo Livro
            </button>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingBookId ? "Editar Livro do Acervo" : "Cadastrar Livro no Acervo"}
                </DialogTitle>
              </DialogHeader>

              {/* Sub-abas de cadastro */}
              <div className="flex gap-2 border-b border-ink/5 pb-2">
                <button 
                  onClick={() => setActiveSubTab("online")}
                  className={`px-4 py-2 font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeSubTab === "online" ? "bg-dark text-cream" : "text-ink-2 hover:bg-cream-2"}`}
                >
                  🔍 Buscar Online (API)
                </button>
                <button 
                  onClick={() => setActiveSubTab("manual")}
                  className={`px-4 py-2 font-display text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeSubTab === "manual" ? "bg-dark text-cream" : "text-ink-2 hover:bg-cream-2"}`}
                >
                  ✍️ Cadastro Manual
                </button>
              </div>

              {activeSubTab === "online" ? (
                <div className="space-y-4 pt-2">
                  <form onSubmit={handleSearchOnline} className="flex gap-2">
                    <select 
                      value={apiType} 
                      onChange={(e) => setApiType(e.target.value)}
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none"
                    >
                      <option value="gutendex">Livros Digitais (Gutenberg)</option>
                      <option value="openlibrary">Livro Físico por ISBN (OpenLibrary)</option>
                    </select>
                    <Input 
                      placeholder={apiType === "openlibrary" ? "Digite o ISBN (ex: 9788535914849)" : "Digite o título ou autor..."} 
                      value={onlineQuery} 
                      onChange={(e) => setOnlineQuery(e.target.value)}
                      className="flex-grow bg-cream"
                      required
                    />
                    <button type="submit" className="bg-dark text-cream px-5 rounded-lg hover:bg-amber hover:text-dark transition-colors font-body text-sm font-semibold">
                      Buscar
                    </button>
                  </form>

                  {loadingSearch && <p className="text-center font-body text-sm text-ink-2">Pesquisando na biblioteca online...</p>}

                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                    {searchResults.map((b, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-cream-2/45 rounded-xl border border-ink/5 items-center justify-between">
                        <div className="flex gap-3 items-center">
                          {b.capaUrl ? (
                            <img src={b.capaUrl} alt={b.titulo} className="w-10 h-14 object-cover rounded shadow-sm" />
                          ) : (
                            <div className="w-10 h-14 bg-cream-2 rounded flex items-center justify-center text-ink-3"><Library size={16} /></div>
                          )}
                          <div>
                            <h4 className="font-display font-bold text-sm text-ink leading-tight">{b.titulo}</h4>
                            <p className="font-body text-xs text-ink-2 mt-0.5">{b.autor}</p>
                            <Badge className={`mt-1 font-body text-[9px] uppercase ${b.isDigital ? "bg-moss/10 text-moss" : "bg-honey text-dark"}`}>
                              {b.isDigital ? "Digital" : "Físico"}
                            </Badge>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleImport(b)}
                          className="bg-dark text-cream hover:bg-amber hover:text-dark text-xs px-4 py-2 rounded-full transition-colors font-body font-semibold shrink-0"
                        >
                          Importar
                        </button>
                      </div>
                    ))}
                    {!loadingSearch && searchResults.length === 0 && onlineQuery && (
                      <p className="text-center font-body text-sm text-ink-3">Nenhum livro localizado na busca online.</p>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleManualSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input placeholder="Título do Livro *" value={manualBook.titulo} onChange={(e) => setManualBook({ ...manualBook, titulo: e.target.value })} required />
                    <Input placeholder="Autor *" value={manualBook.autor} onChange={(e) => setManualBook({ ...manualBook, autor: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input placeholder="ISBN (Opcional)" value={manualBook.isbn} onChange={(e) => setManualBook({ ...manualBook, isbn: e.target.value })} />
                    <Input placeholder="Localização na Estante" value={manualBook.localizacao} onChange={(e) => setManualBook({ ...manualBook, localizacao: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input placeholder="Quantidade de Exemplares" type="number" min={1} value={manualBook.quantidade} onChange={(e) => setManualBook({ ...manualBook, quantidade: parseInt(e.target.value) || 1 })} />
                    <label className="flex items-center gap-2 p-2 bg-cream-2/40 rounded-lg cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={manualBook.isDigital} 
                        onChange={(e) => setManualBook({ ...manualBook, isDigital: e.target.checked, quantidade: e.target.checked ? 1 : manualBook.quantidade })}
                        className="rounded text-amber focus:ring-amber"
                      />
                      <span className="font-body text-xs font-semibold text-ink">É Livro Digital?</span>
                    </label>
                    {manualBook.isDigital && (
                      <Input placeholder="Link de Leitura Online" value={manualBook.urlLeitura} onChange={(e) => setManualBook({ ...manualBook, urlLeitura: e.target.value })} required />
                    )}
                  </div>
                  <button type="submit" className="w-full bg-dark text-cream py-3 rounded-full font-body font-semibold hover:bg-amber hover:text-dark transition-colors">
                    Salvar Livro
                  </button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map(l => (
          <div key={l.id} className="bg-cream border border-ink/10 rounded-2xl p-5 flex gap-4 shadow-sm relative overflow-hidden group">
            {/* Ações de Edição e Exclusão no Hover */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-cream/80 backdrop-blur-sm p-1 rounded-xl border border-ink/5">
              <button 
                onClick={() => handleEditClick(l)}
                className="p-1.5 text-ink hover:text-amber rounded-lg transition-colors hover:bg-cream-2"
                title="Editar Livro"
              >
                <Edit size={14} />
              </button>
              <button 
                onClick={() => setDeleteConfirmBookId(l.id)}
                className="p-1.5 text-red-500 hover:text-red-700 rounded-lg transition-colors hover:bg-red-50"
                title="Excluir Livro"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {l.capaUrl && !failedImages[l.id] ? (
              <img 
                src={l.capaUrl} 
                alt={l.titulo} 
                className="w-16 h-24 object-cover rounded-md shadow-sm border border-ink/5 shrink-0" 
                onError={() => setFailedImages(prev => ({ ...prev, [l.id]: true }))}
              />
            ) : (
              <div className="w-16 h-24 bg-cream-2 rounded-md flex items-center justify-center text-ink-2 border border-ink/5 shrink-0">
                <Library size={24} />
              </div>
            )}
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h4 className="font-display font-bold text-sm text-ink leading-tight mb-1">{l.titulo}</h4>
                <p className="font-body text-xs text-ink-2">{l.autor}</p>
                {l.isbn && <p className="font-body text-[10px] text-ink-3 mt-1">ISBN: {l.isbn}</p>}
                <Badge className={`mt-2 text-[9px] uppercase font-body ${l.isDigital ? "bg-moss/10 text-moss" : "bg-amber/10 text-amber"}`}>
                  {l.isDigital ? "Digital" : "Físico"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs font-body pt-2 border-t border-ink/5 mt-2">
                {l.isDigital ? (
                  <a 
                    href={l.urlLeitura} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 font-bold text-moss hover:text-amber transition-colors"
                  >
                    Ler Online 📖
                  </a>
                ) : (
                  <>
                    <span className="text-ink-2">Qtd: {l.quantidade}</span>
                    <Badge className={l.quantidade > 0 ? "bg-moss/10 text-moss" : "bg-red-500/10 text-red-500"}>
                      {l.quantidade > 0 ? "Disponível" : "Indisponível"}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-cream border border-ink/10 rounded-2xl p-12 text-center">
            <p className="font-body text-sm text-ink-2">Nenhum livro localizado no acervo.</p>
          </div>
        )}
      </div>

      <ConfirmModal 
        open={!!deleteConfirmBookId}
        onOpenChange={(open) => !open && setDeleteConfirmBookId(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja remover este livro permanentemente do acervo?"
      />
    </div>
  );
};

// --- 2. EMPRÉSTIMOS ---
const Emprestimos = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <ModuleHeader title="Empréstimos de Livros" icon={BookCopy} onBack={onBack} />
      <div className="bg-cream border border-ink/10 rounded-2xl p-6 text-center py-12">
        <p className="font-body text-sm text-ink-2">Painel de gerenciamento de empréstimos, prazos e controle de devoluções.</p>
      </div>
    </div>
  );
};

// --- 3. RESERVAS ---
const Reservas = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <ModuleHeader title="Reservas de Livros" icon={CalendarCheck} onBack={onBack} />
      <div className="bg-cream border border-ink/10 rounded-2xl p-6 text-center py-12">
        <p className="font-body text-sm text-ink-2">Fila e solicitações de reservas por alunos e responsáveis.</p>
      </div>
    </div>
  );
};
