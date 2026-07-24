import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { 
  FileText, UploadCloud, CheckCircle2, AlertCircle, Loader2, Sparkles, User, FileDigit, CalendarDays
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function MatriculaPublica() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [preMatricula, setPreMatricula] = useState(null);

  // Form states
  const [nomeAluno, setNomeAluno] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [seriePretendida, setSeriePretendida] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [emailResponsavel, setEmailResponsavel] = useState("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");
  const [cpfResponsavel, setCpfResponsavel] = useState("");

  // Upload states
  const [uploads, setUploads] = useState({
    certidao_nascimento: "",
    carteira_vacina: "",
    comprovante_residencia: "",
    documento_responsavel: ""
  });
  const [uploadingField, setUploadingField] = useState("");

  const fileInputRefs = {
    certidao_nascimento: useRef(null),
    carteira_vacina: useRef(null),
    comprovante_residencia: useRef(null),
    documento_responsavel: useRef(null)
  };

  useEffect(() => {
    if (!token) {
      setErrorMsg("Link de matrícula inválido.");
      setLoading(false);
      return;
    }
    axios.get(`${API}/matriculas/validar-token/${token}`)
      .then(res => {
        const data = res.data;
        setPreMatricula(data);
        setNomeAluno(data.nomeAluno || "");
        setDataNascimento(data.dataNascimento || "");
        setSeriePretendida(data.seriePretendida || "");
        setNomeResponsavel(data.nomeResponsavel || "");
        setEmailResponsavel(data.emailResponsavel || "");
        setTelefoneResponsavel(data.telefoneResponsavel || "");
        setCpfResponsavel(data.cpfResponsavel || "");
        
        // Carregar documentos se já enviados
        const loadedUploads = { ...uploads };
        data.documentos?.forEach(doc => {
          if (loadedUploads[doc.tipo] !== undefined) {
            loadedUploads[doc.tipo] = doc.fileUrl;
          }
        });
        setUploads(loadedUploads);
      })
      .catch(err => {
        setErrorMsg(err.response?.data?.message || "Este link de matrícula expirou ou é inválido.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 5MB.");
      return;
    }

    setUploadingField(field);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API}/site-config/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUploads(prev => ({ ...prev, [field]: res.data.url }));
      toast.success("Documento anexado com sucesso!");
    } catch {
      toast.error("Erro ao enviar documento. Tente novamente.");
    } finally {
      setUploadingField("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar se todos os 4 documentos foram anexados
    const missingDocs = Object.keys(uploads).filter(k => !uploads[k]);
    if (missingDocs.length > 0) {
      toast.error("Por favor, anexe todos os 4 documentos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const docPayload = Object.keys(uploads).map(k => ({
        tipo: k,
        fileUrl: uploads[k]
      }));

      await axios.post(`${API}/matriculas/enviar-dados/${token}`, {
        documentos: docPayload
      });
      
      setSuccess(true);
      toast.success("Documentos enviados com sucesso!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao enviar dados da matrícula.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !uploadingField) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center font-body">
        <Loader2 className="animate-spin text-amber mb-3" size={36} />
        <span className="text-sm font-semibold text-ink-2">Carregando portal de matrícula...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center font-body p-6">
        <div className="bg-white border border-red-200 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="font-display font-extrabold text-xl text-ink mb-2">Erro de Acesso</h3>
          <p className="text-sm text-ink-2 mb-6 leading-relaxed">{errorMsg}</p>
          <span className="text-xs text-ink-3">Centro Educacional Favo de Mel 🐝</span>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center font-body p-6">
        <div className="bg-white border border-ink/5 rounded-3xl p-8 max-w-md w-full text-center shadow-xl space-y-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-ink mb-2 uppercase tracking-wide">Documentos Enviados!</h3>
            <p className="text-sm text-ink-2 leading-relaxed">
              Recebemos os dados cadastrais e documentos do(a) aluno(a) <strong>{nomeAluno}</strong> com sucesso! <br />
              Nossa equipe da Secretaria revisará tudo e entrará em contato em breve para a conclusão da matrícula.
            </p>
          </div>
          <div className="border-t border-ink/5 pt-4">
            <span className="text-xs text-ink-3 font-semibold">Obrigado pela confiança, seja bem-vindo à Favo! 🐝</span>
          </div>
        </div>
      </div>
    );
  }

  const docLabels = {
    certidao_nascimento: "Certidão de Nascimento do Aluno",
    carteira_vacina: "Carteira de Vacinação Atualizada",
    comprovante_residencia: "Comprovante de Residência",
    documento_responsavel: "Documento com Foto do Responsável (RG/CPF)"
  };

  return (
    <div className="min-h-screen bg-cream p-4 sm:p-8 font-body text-ink">
      <div className="max-w-3xl mx-auto bg-white border border-ink/5 rounded-3xl shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-honey/30 to-amber-500/10 p-6 sm:p-8 border-b border-ink/5 flex items-center gap-4">
          <div className="p-3 bg-white rounded-2xl border border-honey/20 shrink-0 shadow-sm">
            <Sparkles size={24} className="text-amber-600" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-wide">Matrícula Digital</h2>
            <p className="text-xs sm:text-sm text-ink-2 mt-0.5">Envio obrigatório de documentos cadastrais para o Colégio Favo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {/* Ficha do Aluno */}
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-sm text-ink uppercase tracking-wide flex items-center gap-1.5 border-b border-ink/5 pb-2">
              <User size={16} className="text-honey" /> Dados do Aluno
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nome Completo</Label>
                <Input value={nomeAluno} disabled className="bg-cream/40" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Nascimento</Label>
                  <Input value={dataNascimento} disabled className="bg-cream/40" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Série Pretendida</Label>
                  <Input value={seriePretendida} disabled className="bg-cream/40" />
                </div>
              </div>
            </div>
          </div>

          {/* Ficha do Responsável */}
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-sm text-ink uppercase tracking-wide flex items-center gap-1.5 border-b border-ink/5 pb-2">
              <FileDigit size={16} className="text-honey" /> Dados do Responsável
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nome do Responsável</Label>
                <Input value={nomeResponsavel} disabled className="bg-cream/40" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs font-semibold">E-mail</Label>
                  <Input value={emailResponsavel} disabled className="bg-cream/40" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">CPF</Label>
                  <Input value={cpfResponsavel} disabled className="bg-cream/40" />
                </div>
              </div>
            </div>
          </div>

          {/* Upload de Documentos */}
          <div className="space-y-4">
            <h4 className="font-display font-extrabold text-sm text-ink uppercase tracking-wide flex items-center gap-1.5 border-b border-ink/5 pb-2">
              <UploadCloud size={16} className="text-honey" /> Documentação Obrigatória (Upload)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(docLabels).map(field => {
                const uploadedUrl = uploads[field];
                const isUploading = uploadingField === field;

                return (
                  <div key={field} className="border border-ink/10 rounded-2xl p-4 bg-cream/20 flex flex-col justify-between h-36">
                    <div>
                      <h5 className="text-xs font-semibold text-ink leading-tight">{docLabels[field]}</h5>
                      <p className="text-[10px] text-ink-3 mt-1">Formatos aceitos: PDF ou Imagem de até 5MB</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {uploadedUrl ? (
                        <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold">
                          <CheckCircle2 size={16} /> Anexado com Sucesso!
                        </div>
                      ) : isUploading ? (
                        <div className="flex items-center gap-2 text-amber text-xs font-semibold">
                          <Loader2 size={14} className="animate-spin" /> Fazendo upload...
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRefs[field].current?.click()}
                          className="bg-dark hover:bg-amber hover:text-dark text-cream text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                        >
                          Selecionar Arquivo
                        </button>
                      )}
                      
                      {uploadedUrl && (
                        <a 
                          href={`${process.env.REACT_APP_BACKEND_URL}${uploadedUrl.replace('/favo-api', '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] font-bold text-blue-500 hover:underline"
                        >
                          Visualizar
                        </a>
                      )}

                      <input 
                        type="file"
                        ref={fileInputRefs[field]}
                        onChange={(e) => handleFileUpload(e, field)}
                        accept="image/*,application/pdf"
                        className="hidden"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-ink/5 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-honey hover:bg-honey-dark text-dark font-display font-black text-sm uppercase tracking-wide px-8 py-3 rounded-full shadow-md hover:scale-[1.01] transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Enviando...
                </>
              ) : (
                "Finalizar e Enviar Matrícula"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
