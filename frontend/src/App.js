import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import AdminLogin from "@/pages/AdminLogin";
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
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/gestao" element={<Gestao />} />
          <Route path="/portal" element={<PortalLogin />} />
          <Route path="/portal/app" element={<PortalDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
