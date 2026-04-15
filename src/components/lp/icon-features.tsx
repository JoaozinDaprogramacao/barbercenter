import { 
  Calendar, 
  Package, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

interface IconFeatureProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function FeatureItem({ icon, title, desc }: IconFeatureProps) {
  return (
    <div className="text-center md:text-left group">
      <div className="mb-6 inline-block p-4 bg-zinc-900 rounded-2xl border border-zinc-800 group-hover:border-orange-500/50 transition-colors duration-300">
        <div className="text-orange-500 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <h4 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h4>
      <p className="text-zinc-400 text-base leading-relaxed max-w-sm mx-auto md:mx-0">{desc}</p>
    </div>
  );
}

export function IconFeatures() {
  return (
    <section className="w-full bg-black py-24 border-t border-zinc-900/50">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-16">
          <FeatureItem 
            icon={<Calendar size={32} />} 
            title="Agendamento online" 
            desc="Sua barbearia aberta 24h por dia para agendamentos automáticos sem precisar atender telefone."
          />
          <FeatureItem 
            icon={<Package size={32} />} 
            title="Controle de estoque" 
            desc="Gerencie pomadas, óleos e produtos de revenda com alertas automáticos de baixo estoque."
          />
          <FeatureItem 
            icon={<Users size={32} />} 
            title="Gestão de equipe" 
            desc="Calcule comissões automaticamente e controle a agenda de cada profissional individualmente."
          />
          <FeatureItem 
            icon={<MessageSquare size={32} />} 
            title="Suporte humanizado" 
            desc="Esqueça robôs. Nossa equipe de suporte fala sua língua e resolve seus problemas via WhatsApp."
          />
          <FeatureItem 
            icon={<ShieldCheck size={32} />} 
            title="Fluxo de caixa" 
            desc="Tenha relatórios financeiros detalhados de entradas e saídas para não perder um centavo."
          />
          <FeatureItem 
            icon={<CheckCircle2 size={32} />} 
            title="Avisos automáticos" 
            desc="Reduza o 'no-show' enviando lembretes automáticos para os clientes no WhatsApp."
          />
        </div>
      </div>
    </section>
  );
}