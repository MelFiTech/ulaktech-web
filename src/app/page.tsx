import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  HeroSection,
  WhyUlaktechSection,
  OurServicesSection,
  HowItWorksSection,
  ForResellersSection,
  TestimonialsSection,
  DownloadAppSection,
  FaqSection,
} from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EEEDEE] text-[#171717]">
      <Header />
      <main>
        <HeroSection />
        <WhyUlaktechSection />
        <OurServicesSection />
        <HowItWorksSection />
        <ForResellersSection />
        <TestimonialsSection />
        <DownloadAppSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
