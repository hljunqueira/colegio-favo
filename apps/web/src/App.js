import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import PortalLogin from "@/pages/PortalLogin";
import PortalDashboard from "@/pages/PortalDashboard";
import Gestao from "@/pages/Gestao";
import PortalAluno from "@/pages/PortalAluno";
import PortalPais from "@/pages/PortalPais";
import PortalProfessor from "@/pages/PortalProfessor";
import PortalCoordenador from "@/pages/PortalCoordenador";
import PortalFuncionario from "@/pages/PortalFuncionario";
import { getUser, getToken } from "@/lib/auth";

import { useLocation, useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

// Role-based redirect component to maintain backward compatibility for /portal/app
const PortalRedirect = () => {
  const token = getToken();
  const user = getUser();
  if (!token || !user) return <Navigate to="/portal" replace />;
  
  switch (user.role) {
    case "aluno": return <Navigate to="/portal/aluno" replace />;
    case "pais": return <Navigate to="/portal/pais" replace />;
    case "professor": return <Navigate to="/portal/professor" replace />;
    case "coordenador": return <Navigate to="/portal/coordenador" replace />;
    case "funcionario": return <Navigate to="/portal/funcionario" replace />;
    case "admin": return <Navigate to="/gestao" replace />;
    case "diretoria": return <Navigate to="/gestao" replace />;
    default: return <Navigate to="/portal/pais" replace />;
  }
};

const DevSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const token = getToken();

  if (location.pathname === "/") return null;
  if (!token || !user || user.email !== "henrique@hljdev.com.br") return null;

  const portals = [
    { name: "Gestão (Admin)", path: "/gestao" },
    { name: "Portal Aluno", path: "/portal/aluno" },
    { name: "Portal Responsável", path: "/portal/pais" },
    { name: "Portal Professor", path: "/portal/professor" },
    { name: "Portal Coordenador", path: "/portal/coordenador" },
    { name: "Portal Funcionário", path: "/portal/funcionario" },
  ];

  const currentPath = portals.find(p => location.pathname.startsWith(p.path))?.path || "";

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-dark/95 text-cream px-4 py-2.5 rounded-2xl border border-honey/20 shadow-2xl flex items-center gap-3 backdrop-blur-md select-none font-body">
      <div className="flex items-center gap-1.5 text-honey font-display text-[10px] font-bold tracking-widest uppercase">
        <ShieldAlert size={14} /> Dev Switcher
      </div>
      <select
        value={currentPath}
        onChange={(e) => {
          if (e.target.value) navigate(e.target.value);
        }}
        className="bg-dark/50 border border-white/10 outline-none text-xs font-body text-cream rounded-md p-1.5 focus:ring-1 focus:ring-honey cursor-pointer"
      >
        <option value="" disabled>Selecione um Portal...</option>
        {portals.map((p) => (
          <option key={p.path} value={p.path}>{p.name}</option>
        ))}
      </select>
    </div>
  );
};

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portal" element={<PortalLogin />} />
        <Route path="/login" element={<Navigate to="/portal" replace />} />
        <Route path="/admin" element={<Navigate to="/portal" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/portal/app" element={<PortalRedirect />} />
        <Route path="/portal/aluno" element={<PortalAluno />} />
        <Route path="/portal/student" element={<PortalAluno />} />
        <Route path="/portal/pais" element={<PortalPais />} />
        <Route path="/portal/parent" element={<PortalPais />} />
        <Route path="/portal/professor" element={<PortalProfessor />} />
        <Route path="/portal/teacher" element={<PortalProfessor />} />
        <Route path="/portal/coordenador" element={<PortalCoordenador />} />
        <Route path="/portal/coordinator" element={<PortalCoordenador />} />
        <Route path="/portal/funcionario" element={<PortalFuncionario />} />
        <Route path="/portal/staff" element={<PortalFuncionario />} />
        <Route path="/gestao" element={<Gestao />} />
      </Routes>
      <DevSwitcher />
    </>
  );
}

function App() {
  return (
    <>
      <div className="noise-overlay" />
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </>
  );
}

export default App;
