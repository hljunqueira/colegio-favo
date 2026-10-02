import { useEffect, useState } from "react";
import axios from "axios";
import useLenis from "@/hooks/useLenis";
import { Preloader } from "@/components/site/Preloader";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Manifesto } from "@/components/site/Manifesto";
import { Differentials } from "@/components/site/Differentials";
import { Programs } from "@/components/site/Programs";
import { Facilities } from "@/components/site/Facilities";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { EnrollmentJourney } from "@/components/site/EnrollmentJourney";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { Loader2 } from "lucide-react";

import { API } from "@/lib/api";

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
    <div className="bg-cream selection:bg-amber selection:text-dark" data-testid="home-page">
      {/* Cinematic Brand Reveal Preloader */}
      <Preloader />

      {/* Floating Dynamic Navbar */}
      <Navbar configs={configs} />

      {/* Main Content Flow */}
      <main>
        <Hero configs={configs} />
        <Marquee words={data?.marquee} />
        <Manifesto manifesto={data?.manifesto} />
        <Differentials items={data?.differentials} />
        <Programs programs={data?.programs} />
        <Facilities items={data?.facilities} />
        <Gallery gallery={data?.gallery} />
        <Testimonials items={data?.testimonials} configs={configs} />
        <EnrollmentJourney items={data?.enrollmentSteps} />
        <Faq items={data?.faq} configs={configs} />
        <Contact configs={configs} />
      </main>

      <Footer configs={configs} />
      <WhatsAppFloat configs={configs} />
    </div>
  );
}
