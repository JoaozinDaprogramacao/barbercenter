import Image from 'next/image';

interface CardProps {
  title: string;
  imgBg: string;
  imgSrc?: string;
}

function Card({ title, imgBg, imgSrc }: CardProps) {
  return (
    <div className="flex flex-col bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:scale-[1.02] transition-transform duration-500 h-full">
      <div className="p-8 pb-4 text-center flex flex-col items-center">
        <h3 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight max-w-[220px]">
          {title}
        </h3>
      </div>
      
      <div className={`mx-6 mt-4 flex-1 rounded-t-[2.5rem] ${imgBg} border-t border-x border-slate-100 p-6 pb-0 shadow-inner aspect-[4/5] min-h-[380px] md:min-h-[480px] flex items-start justify-center`}>
        <div className="w-full h-full bg-slate-200 rounded-t-[2rem] border-t border-x border-slate-300 relative shadow-2xl transition-transform group-hover:translate-y-[-4px] duration-500 overflow-hidden">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-400/20 rounded-full z-10" />
          {imgSrc && (
            <Image 
              src={imgSrc} 
              alt={title} 
              fill 
              className="object-cover object-top pt-8"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function FeatureCards() {
  return (
    <section className="w-full bg-white overflow-hidden pb-10">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
        
        {/* Retângulo Preto Responsivo */}
        <div className="bg-black rounded-[3rem] px-6 pt-20 pb-56 md:pt-24 md:pb-64 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight tracking-tighter">
            Todas as ferramentas para o seu negócio na palma da sua mão
          </h2>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2 md:px-10 -mt-48 md:-mt-56">
          <Card 
            title="Acompanhe seus agendamentos" 
            imgBg="bg-slate-50" 
            imgSrc="/mockup-1.png"
          />
          <Card 
            title="Personalize seu link de agendamento" 
            imgBg="bg-zinc-900" 
            imgSrc="/mockup-2.png"
          />
          <Card 
            title="Integre seu link com redes sociais" 
            imgBg="bg-orange-50" 
            imgSrc="/mockup-3.png"
          />
        </div>

      </div>
    </section>
  );
}