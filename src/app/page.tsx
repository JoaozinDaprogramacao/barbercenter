import { Navbar } from '@/components/lp/navbar';
import { Hero } from '@/components/lp/hero';
import { FeatureCards } from '@/components/lp/feature-cards';
import { Pricing } from '@/components/lp/pricing';
import { FAQ } from '@/components/lp/faq';
import { Testimonials } from '@/components/lp/testimonials';
import { IconFeatures } from '@/components/lp/icon-features';
import { Footer } from '@/components/lp/footer';
// Importe o novo componente aqui:
import { InstallPWABanner } from '@/components/lp/InstallPWABanner';

export default function LandingPage() {
  return (
    <main className="min-h-screen selection:bg-orange-100 selection:text-orange-900">
      <Navbar />
      <Hero />
      <FeatureCards />
      <IconFeatures />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
      
      {/* Adicione o Banner do PWA aqui no final */}
      <InstallPWABanner />
    </main>
  );
}