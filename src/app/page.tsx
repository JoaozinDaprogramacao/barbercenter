import { Navbar } from '@/components/lp/navbar';
import { Hero } from '@/components/lp/hero';
import { FeatureCards } from '@/components/lp/feature-cards';
import { Pricing } from '@/components/lp/pricing';
import { FAQ } from '@/components/lp/faq'; // Crie seguindo a mesma lógica
import { Testimonials } from '@/components/lp/testimonials';
import { IconFeatures } from '@/components/lp/icon-features'; // O grid de 6 itens
import { Footer } from '@/components/lp/footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-orange-100 selection:text-orange-900">
      <Navbar />
      <Hero />
      <FeatureCards />
      <IconFeatures />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}