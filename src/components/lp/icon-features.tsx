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
      <div className="mb-4 inline-block p-4 bg-zinc-900 rounded-2xl border border-zinc-800 group-hover:border-orange-500/50 transition-colors duration-300">
        <div className="text-orange-500 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      <h4 className="text-lg font-bold mb-2 text-white">{title}</h4>
      <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export function IconFeatures() {
  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-y-16 gap-x-12">
        <FeatureItem 
          icon={<Calendar size={28} />} 
          title="Agendamento online" 
          desc="Sua barbearia aberta 24h por dia para agendamentos automáticos sem precisar atender telefone."
        />
        <FeatureItem 
          icon={<Package size={28} />} 
          title="Controle de estoque" 
          desc="Gerencie pomadas, óleos e produtos de revenda com alertas automáticos de baixo estoque."
        />
        <FeatureItem 
          icon={<Users size={28} />} 
          title="Gestão de equipe" 
          desc="Calcule comissões automaticamente e controle a agenda de cada profissional individualmente."
        />
        <FeatureItem 
          icon={<MessageSquare size={28} />} 
          title="Suporte humanizado" 
          desc="Esqueça robôs. Nossa equipe de suporte fala sua língua e resolve seus problemas via WhatsApp."
        />
        <FeatureItem 
          icon={<ShieldCheck size={28} />} 
          title="Fluxo de caixa" 
          desc="Tenha relatórios financeiros detalhados de entradas e saídas para não perder um centavo."
        />
        <FeatureItem 
          icon={<CheckCircle2 size={28} />} 
          title="Avisos automáticos" 
          desc="Reduza o 'no-show' enviando lembretes automáticos para os clientes no WhatsApp."
        />
      </div>
    </section>
  );
}