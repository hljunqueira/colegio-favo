import { useEffect, useState } from "react";
import axios from "axios";
import useLenis from "@/hooks/useLenis";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Manifesto } from "@/components/site/Manifesto";
import { Programs } from "@/components/site/Programs";
import { Gallery } from "@/components/site/Gallery";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Home() {
  useLenis();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/site-config`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Erro ao carregar dados dinâmicos do CMS:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-amber" size={32} />
      </div>
    );
  }

  const configs = data?.configs || {};

  return (
    <div className="bg-cream" data-testid="home-page">
      <Navbar configs={configs} />
      <main>
        <Hero configs={configs} />
        <Marquee words={data?.marquee} />
        <Manifesto manifesto={data?.manifesto} />
        <Programs programs={data?.programs} />
        <Gallery gallery={data?.gallery} />
        <Contact configs={configs} />
      </main>
      <Footer configs={configs} />
      <WhatsAppFloat configs={configs} />
    </div>
  );
}
