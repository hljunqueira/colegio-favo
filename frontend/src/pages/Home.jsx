import useLenis from "@/hooks/useLenis";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Manifesto } from "@/components/site/Manifesto";
import { Programs } from "@/components/site/Programs";
import { Gallery } from "@/components/site/Gallery";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  useLenis();
  return (
    <div className="bg-cream" data-testid="home-page">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <Programs />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
