/**
 * Home — Khalid Videography Portfolio
 * Sections: Hero → About → Frames → Videography → Services → Testimonials → Contact → Footer
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import CertificatesSection from "@/components/sections/CertificatesSection";
import FramesSection from "@/components/sections/FramesSection";
import VideographySection from "@/components/sections/VideographySection";
import ServicesSection from "@/components/sections/ServicesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[oklch(0.14_0.018_55)] text-[oklch(0.92_0.02_75)]">
      <Navbar />
      <HeroSection />
      <div className="gold-rule" />
      <AboutSection />
      <div className="gold-rule" />
      <CertificatesSection />
      <div className="gold-rule" />
      <FramesSection />
      <div className="gold-rule" />
      <VideographySection />
      <div className="gold-rule" />
      <ServicesSection />
      <div className="gold-rule" />
      <TestimonialsSection />
      <div className="gold-rule" />
      <ContactSection />
      <Footer />
    </div>
  );
}
