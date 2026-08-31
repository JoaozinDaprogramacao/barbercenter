import { Navbar } from '@/components/lp/navbar';
import { Hero } from '@/components/lp/hero';
import { FeatureCards } from '@/components/lp/feature-cards';
import { FAQ } from '@/components/lp/faq';
import { Testimonials } from '@/components/lp/testimonials';
import { IconFeatures } from '@/components/lp/icon-features';
import { FreeTrial } from '@/components/lp/free-trial';
import { Footer } from '@/components/lp/footer';
// Importe o novo componente aqui:
import { InstallPWABanner } from '@/components/lp/InstallPWABanner';
import { PageTracker } from '@/components/tracking/PageTracker';

export default function LandingPage() {
  return (
    <main className="min-h-screen selection:bg-orange-100 selection:text-orange-900">
      {/* Mede visualização e profundidade de leitura da landing. */}
      <PageTracker step="LP_VIEW" trackScroll />

      <Navbar />
      <Hero />
      <FeatureCards />
      <IconFeatures />
      <Testimonials />
      <FreeTrial />
      <FAQ />
      <Footer />
      
      {/* Adicione o Banner do PWA aqui no final */}
      <InstallPWABanner />
    </main>
  );
}