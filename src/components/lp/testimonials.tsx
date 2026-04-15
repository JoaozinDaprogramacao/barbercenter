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
  { value: "+21.7mi", label: "Agendamentos" },
  { value: "+8.9mil", label: "Barbearias" },
  { value: "+173k", label: "Horas poupadas" },
  { value: "+16.8mi", label: "Lembretes" },
];

export function Testimonials() {
  return (
    <section className="w-full bg-slate-50 py-16 md:py-24 overflow-hidden border-y border-slate-100">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
            Veja o que nossos parceiros <br className="hidden md:block" /> falam sobre nós 😎
          </h2>
        </div>

        {/* Slider Responsivo com Máscara de Degradê lateral */}
        <div className="relative -mx-6 md:-mx-12 lg:-mx-16">
          {/* Efeito de fade nas laterais */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none hidden md:block" />
          
          <div className="flex overflow-x-auto no-scrollbar md:overflow-hidden">
            <div className="flex animate-step-scroll space-x-6 md:space-x-8 py-4 px-6 md:px-12 lg:px-16">
              {[...testimonials, ...testimonials].map((item, index) => (
                <div 
                  key={index} 
                  className="w-[280px] sm:w-[350px] md:w-[420px] flex-shrink-0 bg-white p-7 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative group transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <span className="text-sm font-black text-slate-900">5.0</span>
                  </div>

                  <p className="text-slate-600 text-sm md:text-lg leading-relaxed mb-8 md:mb-10 font-medium italic relative z-10">
                    "{item.text}"
                  </p>

                  <div className="flex items-center space-x-4 relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-xs md:text-sm shadow-lg shadow-orange-200 uppercase">
                      {item.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-black text-slate-900">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{item.business}</p>
                    </div>
                  </div>

                  <Quote 
                    className="absolute top-8 right-8 text-slate-50 group-hover:text-orange-50/50 transition-colors duration-500 z-0" 
                    size={48} 
                    strokeWidth={3} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid - Ajustado para não quebrar em telas pequenas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 md:gap-x-8 mt-16 md:mt-24 pt-12 md:pt-20 border-t border-slate-200">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center lg:items-start group">
              <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-1 md:mb-2 tracking-tighter group-hover:text-orange-600 transition-colors duration-300">
                {stat.value}
              </p>
              <div className="h-1 w-6 md:w-8 bg-orange-500 mb-3 rounded-full group-hover:w-12 md:group-hover:w-16 transition-all duration-300"></div>
              <p className="text-[9px] md:text-xs text-slate-500 uppercase font-black tracking-widest md:tracking-[0.25em] text-center lg:text-left">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}