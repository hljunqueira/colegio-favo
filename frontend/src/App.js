import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/AdminDashboard";
import PortalLogin from "@/pages/PortalLogin";
import PortalDashboard from "@/pages/PortalDashboard";
import Gestao from "@/pages/Gestao";

function App() {
  return (
    <>
      <div className="noise-overlay" />
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Unified login for all roles */}
          <Route path="/portal" element={<PortalLogin />} />
          <Route path="/login" element={<Navigate to="/portal" replace />} />
          <Route path="/admin" element={<Navigate to="/portal" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/portal/app" element={<PortalDashboard />} />
          <Route path="/gestao" element={<Gestao />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
