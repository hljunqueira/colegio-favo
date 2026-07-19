import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { 
  Globe, Info, FileText, Image as ImageIcon, Sparkles, Save, Upload, Plus, Trash2, Loader2 
} from "lucide-react";
import { authHeader } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const SiteManagement = () => {
  const [activeTab, setActiveTab] = useState("geral");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null); // id ou index do item fazendo upload

  // Estado do CMS
  const [configs, setConfigs] = useState({
    school_name: "",
    school_full: "",
    school_tagline: "",
    school_slogan: "",
    school_phone: "",
    school_phone_raw: "",
    school_address: "",
    school_rating: "",
    school_reviews: "",
    school_instagram: "",
  });

  const [manifesto, setManifesto] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [marquee, setMarquee] = useState([]);
  const [newMarqueeWord, setNewMarqueeWord] = useState("");

  // Controlar exclusões para enviar ao backend
  const [itemsToDelete, setItemsToDelete] = useState([]);

  useEffect(() => {
    fetchCMSData();
  }, []);

  const fetchCMSData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/site-config`);
      if (res.data) {
        if (res.data.configs) setConfigs(prev => ({ ...prev, ...res.data.configs }));
        if (res.data.manifesto) setManifesto(res.data.manifesto);
        if (res.data.programs) setPrograms(res.data.programs);
        if (res.data.gallery) setGallery(res.data.gallery);
        if (res.data.marquee) setMarquee(res.data.marquee);
      }
    } catch (err) {
      toast.error("Erro ao carregar dados do site.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key, val) => {
    setConfigs(prev => ({ ...prev, [key]: val }));
  };

  const handleItemChange = (section, index, field, value) => {
    if (section === "manifesto") {
      const copy = [...manifesto];
      copy[index][field] = value;
      setManifesto(copy);
    } else if (section === "programs") {
      const copy = [...programs];
      copy[index][field] = value;
      setPrograms(copy);
    } else if (section === "gallery") {
      const copy = [...gallery];
      copy[index][field] = value;
      setGallery(copy);
    }
  };

  // Upload de arquivos
  const handleImageUpload = async (e, section, index, itemId) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const key = itemId || `${section}-${index}`;
    setUploading(key);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API}/site-config/upload`, formData, {
        headers: {
          ...authHeader().headers,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.url) {
        handleItemChange(section, index, "imageUrl", res.data.url);
        toast.success("Imagem carregada!");
      }
    } catch (err) {
      toast.error("Erro ao enviar imagem.");
    } finally {
      setUploading(null);
    }
  };

  // Manifesto - Adicionar / Remover
  const addManifesto = () => {
    setManifesto([...manifesto, { title: "", description: "", extra: `0${manifesto.length + 1}`, order: manifesto.length + 1, section: "manifesto" }]);
  };

  // Programas - Adicionar / Remover
  const addProgram = () => {
    setPrograms([...programs, { title: "", description: "", extra: "", imageUrl: "", order: programs.length + 1, section: "programs" }]);
  };

  // Galeria - Adicionar / Remover
  const addGalleryItem = () => {
    setGallery([...gallery, { title: "", extra: "", imageUrl: "", order: gallery.length + 1, section: "gallery" }]);
  };

  const removeItem = (section, index, itemId) => {
    if (itemId) {
      setItemsToDelete([...itemsToDelete, { id: itemId, delete: true }]);
    }
    if (section === "manifesto") {
      setManifesto(manifesto.filter((_, i) => i !== index));
    } else if (section === "programs") {
      setPrograms(programs.filter((_, i) => i !== index));
    } else if (section === "gallery") {
      setGallery(gallery.filter((_, i) => i !== index));
    }
  };

  // Marquee Words - Adicionar / Remover
  const addMarqueeWord = () => {
    if (!newMarqueeWord.trim()) return;
    if (marquee.includes(newMarqueeWord.trim())) return;
    setMarquee([...marquee, newMarqueeWord.trim()]);
    setNewMarqueeWord("");
  };

  const removeMarqueeWord = (word) => {
    setMarquee(marquee.filter(w => w !== word));
  };

  // Salvar tudo
  const handleSave = async () => {
    setSaving(true);
    try {
      // Unifica todos os itens em uma lista única
      const itemsList = [
        ...manifesto.map((item, idx) => ({ ...item, section: "manifesto", order: idx + 1 })),
        ...programs.map((item, idx) => ({ ...item, section: "programs", order: idx + 1 })),
        ...gallery.map((item, idx) => ({ ...item, section: "gallery", order: idx + 1 })),
        // Palavras do Marquee são transformadas em SiteItem individuais
        ...marquee.map((word, idx) => ({ section: "marquee", title: word, order: idx + 1 })),
        ...itemsToDelete,
      ];

      // Se marquee antigo foi limpo ou alterado, excluímos primeiro os itens que não existem mais
      // Para manter simples, o backend lidará com recriações
      await axios.put(
        `${API}/site-config`,
        { configs, items: itemsList },
        authHeader()
      );

      toast.success("Configurações do site salvas com sucesso!");
      setItemsToDelete([]);
      fetchCMSData(); // Recarrega
    } catch (err) {
      toast.error("Erro ao salvar configurações do site.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "geral", label: "Geral", icon: Info },
    { id: "manifesto", label: "Essência", icon: FileText },
    { id: "segmentos", label: "Etapas", icon: Sparkles },
    { id: "galeria", label: "Ambiente", icon: ImageIcon },
    { id: "marquee", label: "Palavras", icon: Sparkles },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-amber" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="gestao-site">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="text-amber" />
          <h1 className="font-display font-extrabold tracking-tight text-2xl text-ink">CMS do Site</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-dark text-cream hover:bg-amber hover:text-dark px-5 py-2.5 rounded-full font-body text-sm font-semibold transition-colors shadow-lg disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={16} /> Salvando...
            </>
          ) : (
            <>
              <Save size={16} /> Salvar Alterações
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ink/10 gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-body text-sm font-bold transition-all whitespace-nowrap ${
                isActive ? "border-amber text-ink" : "border-transparent text-ink-2 hover:text-ink"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-cream rounded-3xl border border-ink/10 p-6 shadow-sm">
        
        {/* Tab 1: Geral */}
        {activeTab === "geral" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="font-body text-xs font-bold uppercase text-ink-2">Nome Completo (Nav/Footer)</label>
              <Input
                value={configs.school_full}
                onChange={(e) => handleConfigChange("school_full", e.target.value)}
                placeholder="Ex: Centro Educacional Favo de Mel"
              />
            </div>
            <div className="space-y-2">
              <label className="font-body text-xs font-bold uppercase text-ink-2">Slogan Geral</label>
              <Input
                value={configs.school_slogan}
                onChange={(e) => handleConfigChange("school_slogan", e.target.value)}
                placeholder="Ex: A educação em que nós acreditamos"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="font-body text-xs font-bold uppercase text-ink-2">Slogan / Tagline do Hero</label>
              <Input
                value={configs.school_tagline}
                onChange={(e) => handleConfigChange("school_tagline", e.target.value)}
                placeholder="Ex: Educação Infantil e Ensino Fundamental · Berçário ao 9º ano"
              />
            </div>
            <div className="space-y-2">
              <label className="font-body text-xs font-bold uppercase text-ink-2">Telefone (Exibição)</label>
              <Input
                value={configs.school_phone}
                onChange={(e) => handleConfigChange("school_phone", e.target.value)}
                placeholder="Ex: (48) 99627-5127"
              />
            </div>
            <div className="space-y-2">
              <label className="font-body text-xs font-bold uppercase text-ink-2">Telefone (Link Raw WhatsApp)</label>
              <Input
                value={configs.school_phone_raw}
                onChange={(e) => handleConfigChange("school_phone_raw", e.target.value)}
                placeholder="Ex: 5548996275127"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="font-body text-xs font-bold uppercase text-ink-2">Endereço Físico</label>
              <Input
                value={configs.school_address}
                onChange={(e) => handleConfigChange("school_address", e.target.value)}
                placeholder="Av. Florianópolis - Centro, Balneário Arroio do Silva - SC"
              />
            </div>
            <div className="space-y-2">
              <label className="font-body text-xs font-bold uppercase text-ink-2">Link Instagram</label>
              <Input
                value={configs.school_instagram}
                onChange={(e) => handleConfigChange("school_instagram", e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-body text-xs font-bold uppercase text-ink-2">Nota Google</label>
                <Input
                  value={configs.school_rating}
                  onChange={(e) => handleConfigChange("school_rating", e.target.value)}
                  placeholder="Ex: 4.8"
                />
              </div>
              <div className="space-y-2">
                <label className="font-body text-xs font-bold uppercase text-ink-2">Nº Avaliações</label>
                <Input
                  value={configs.school_reviews}
                  onChange={(e) => handleConfigChange("school_reviews", e.target.value)}
                  placeholder="Ex: 52"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manifesto / Essência */}
        {activeTab === "manifesto" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-ink/5 pb-2">
              <p className="font-body text-xs font-bold uppercase text-ink-2">Pontos do Manifesto</p>
              <button
                type="button"
                onClick={addManifesto}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:text-dark transition-colors"
              >
                <Plus size={14} /> Adicionar Ponto
              </button>
            </div>
            <div className="space-y-4">
              {manifesto.map((item, idx) => (
                <div key={item.id || idx} className="p-4 bg-cream-2 border border-ink/10 rounded-2xl space-y-3 relative group">
                  <button
                    type="button"
                    onClick={() => removeItem("manifesto", idx, item.id)}
                    className="absolute top-4 right-4 text-ink-2 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="font-body text-[10px] font-bold uppercase text-ink-2">Número / Ícone</label>
                      <Input
                        value={item.extra || ""}
                        onChange={(e) => handleItemChange("manifesto", idx, "extra", e.target.value)}
                        placeholder="Ex: 01"
                      />
                    </div>
                    <div className="md:col-span-3 space-y-1">
                      <label className="font-body text-[10px] font-bold uppercase text-ink-2">Título do Ponto</label>
                      <Input
                        value={item.title || ""}
                        onChange={(e) => handleItemChange("manifesto", idx, "title", e.target.value)}
                        placeholder="Ex: Acolher"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-body text-[10px] font-bold uppercase text-ink-2">Descrição / Detalhamento</label>
                    <Textarea
                      value={item.description || ""}
                      onChange={(e) => handleItemChange("manifesto", idx, "description", e.target.value)}
                      placeholder="Descreva este ponto da filosofia pedagógica..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Segmentos / Etapas */}
        {activeTab === "segmentos" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-ink/5 pb-2">
              <p className="font-body text-xs font-bold uppercase text-ink-2">Segmentos Escolares</p>
              <button
                type="button"
                onClick={addProgram}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:text-dark transition-colors"
              >
                <Plus size={14} /> Adicionar Segmento
              </button>
            </div>
            <div className="space-y-6">
              {programs.map((item, idx) => {
                const key = item.id || `programs-${idx}`;
                const isUploading = uploading === key;
                return (
                  <div key={key} className="p-5 bg-cream-2 border border-ink/10 rounded-2xl relative group grid grid-cols-1 lg:grid-cols-12 gap-5">
                    <button
                      type="button"
                      onClick={() => removeItem("programs", idx, item.id)}
                      className="absolute top-4 right-4 text-ink-2 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10"
                    >
                      <Trash2 size={16} />
                    </button>
                    {/* Imagem */}
                    <div className="lg:col-span-3 flex flex-col items-center justify-center">
                      <div className="w-full h-32 rounded-xl bg-dark/5 border border-ink/10 overflow-hidden flex items-center justify-center relative">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-ink-2">Sem Imagem</span>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm flex items-center justify-center text-cream">
                            <Loader2 className="animate-spin text-honey" size={18} />
                          </div>
                        )}
                      </div>
                      <label className="mt-3 inline-flex items-center gap-1.5 bg-dark text-cream hover:bg-amber hover:text-dark px-3 py-1.5 rounded-full font-body text-[10px] font-bold cursor-pointer transition-colors shadow">
                        <Upload size={10} /> Enviar foto
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "programs", idx, item.id)}
                        />
                      </label>
                    </div>

                    {/* Dados */}
                    <div className="lg:col-span-9 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-body text-[10px] font-bold uppercase text-ink-2">Título do Segmento</label>
                          <Input
                            value={item.title || ""}
                            onChange={(e) => handleItemChange("programs", idx, "title", e.target.value)}
                            placeholder="Ex: Educação Infantil"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-body text-[10px] font-bold uppercase text-ink-2">Faixa Etária / Anos</label>
                          <Input
                            value={item.extra || ""}
                            onChange={(e) => handleItemChange("programs", idx, "extra", e.target.value)}
                            placeholder="Ex: 4 — 5 anos"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[10px] font-bold uppercase text-ink-2">Descrição Curta</label>
                        <Textarea
                          value={item.description || ""}
                          onChange={(e) => handleItemChange("programs", idx, "description", e.target.value)}
                          placeholder="Foco e pedagogia desse segmento..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Galeria / Ambiente */}
        {activeTab === "galeria" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-ink/5 pb-2">
              <p className="font-body text-xs font-bold uppercase text-ink-2">Fotos do Ambiente</p>
              <button
                type="button"
                onClick={addGalleryItem}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber hover:text-dark transition-colors"
              >
                <Plus size={14} /> Adicionar Foto
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gallery.map((item, idx) => {
                const key = item.id || `gallery-${idx}`;
                const isUploading = uploading === key;
                return (
                  <div key={key} className="p-4 bg-cream-2 border border-ink/10 rounded-2xl relative group space-y-3">
                    <button
                      type="button"
                      onClick={() => removeItem("gallery", idx, item.id)}
                      className="absolute top-4 right-4 text-ink-2 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10 bg-cream/90 p-1 rounded-full shadow"
                    >
                      <Trash2 size={14} />
                    </button>
                    {/* Imagem */}
                    <div className="w-full h-40 rounded-xl bg-dark/5 border border-ink/10 overflow-hidden flex items-center justify-center relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-ink-2">Sem Imagem</span>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm flex items-center justify-center text-cream">
                          <Loader2 className="animate-spin text-honey" size={18} />
                        </div>
                      )}
                    </div>
                    <label className="w-full inline-flex items-center justify-center gap-1.5 bg-dark text-cream hover:bg-amber hover:text-dark px-3 py-1.5 rounded-full font-body text-[10px] font-bold cursor-pointer transition-colors shadow">
                      <Upload size={10} /> Enviar foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "gallery", idx, item.id)}
                      />
                    </label>
                    <div className="space-y-1">
                      <label className="font-body text-[9px] font-bold uppercase text-ink-2">Legenda / Nome do Ambiente</label>
                      <Input
                        value={item.title || ""}
                        onChange={(e) => handleItemChange("gallery", idx, "title", e.target.value)}
                        placeholder="Ex: Pátio Externo"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-body text-[9px] font-bold uppercase text-ink-2">Tamanho do Bloco (Grade)</label>
                      <select
                        value={item.extra || ""}
                        onChange={(e) => handleItemChange("gallery", idx, "extra", e.target.value)}
                        className="w-full bg-cream border border-ink/10 rounded-lg px-3 py-1.5 font-body text-xs text-ink"
                      >
                        <option value="">Padrão (1x1)</option>
                        <option value="row-span-2">Duplo (1x2 Vertical)</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Palavras do Marquee */}
        {activeTab === "marquee" && (
          <div className="space-y-6">
            <p className="font-body text-xs font-bold uppercase text-ink-2 border-b border-ink/5 pb-2">Palavras do Letreiro Rotativo</p>
            <div className="flex gap-2">
              <Input
                value={newMarqueeWord}
                onChange={(e) => setNewMarqueeWord(e.target.value)}
                placeholder="Ex: Respeito"
                className="max-w-xs"
              />
              <button
                type="button"
                onClick={addMarqueeWord}
                className="inline-flex items-center gap-1.5 bg-dark text-cream hover:bg-amber hover:text-dark px-5 py-2.5 rounded-xl font-body text-xs font-bold transition-all shadow"
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {marquee.map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center gap-1.5 bg-cream-2 border border-ink/10 text-ink font-body text-sm font-semibold px-4 py-2 rounded-full"
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => removeMarqueeWord(word)}
                    className="text-ink-2 hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {marquee.length === 0 && (
                <p className="text-sm font-body text-ink-2 italic">Nenhuma palavra cadastrada.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
