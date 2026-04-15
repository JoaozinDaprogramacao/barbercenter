import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Matheus Lopes",
    business: "Barbearia Elite",
    text: "O sistema é muito intuitivo. A parte de controle financeiro me ajuda demais a saber exatamente quanto estou faturando no mês.",
  },
  {
    name: "Anderson Silva",
    business: "Barber 013",
    text: "Não troco o BarberCenter por nada. A automação de lembretes reduziu minhas faltas em 70%. Cliente esqueceu? Nunca mais!",
  },
  {
    name: "Felipe Rezende",
    business: "Barbearia Central",
    text: "Tenho 3 profissionais na equipe e o app organiza cada um com seu horário e controle separado. Facilitou minha vida.",
  },
  {
    name: "Ricardo Gomes",
    business: "Dom Barba",
    text: "O melhor suporte que já tive. Estão sempre dispostos a ajudar e as atualizações são constantes.",
  },
];

const stats = [
  { value: "+21.72 mi", label: "Agendamentos" },
  { value: "+8.9 mil", label: "Barbearias" },
  { value: "+173.6 mil", label: "Horas poupadas" },
  { value: "+16.81 mi", label: "Lembretes" },
];

export function Testimonials() {
  return (
    <section className="bg-slate-50 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 md:mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tighter leading-[1.1]">
          Veja o que nossos parceiros <br className="hidden md:block" /> falam sobre nós "😎"
        </h2>
      </div>

      {/* Slider Responsivo */}
      <div className="relative flex overflow-hidden px-4 md:px-0">
        <div className="animate-step-scroll space-x-6">
          {[...testimonials, ...testimonials, ...testimonials].map((item, index) => (
            <div 
              key={index} 
              style={{ width: 'var(--card-width)' }}
              className="flex-shrink-0 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 relative whitespace-normal"
            >
              <div className="flex items-center space-x-1 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-xs font-bold text-slate-900 ml-1">5.0</span>
              </div>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 relative z-10">
                "{item.text}"
              </p>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs uppercase">
                  {item.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{item.business}</p>
                </div>
              </div>

              <Quote 
                className="absolute bottom-6 right-8 text-slate-100" 
                size={48} 
                strokeWidth={3} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Mobile First: 2 colunas no celular, 4 no desktop */}
      <div className="max-w-7xl mx-auto px-6 mt-16 md:mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 border-t border-slate-200 pt-12 md:pt-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center px-2">
              <p className="text-2xl md:text-4xl font-black text-slate-900 mb-1 tracking-tight">
                {stat.value}
              </p>
              <p className="text-[9px] md:text-xs text-slate-400 uppercase font-bold tracking-[0.2em] leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}