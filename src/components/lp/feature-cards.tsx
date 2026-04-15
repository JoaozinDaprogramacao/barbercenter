interface CardProps {
  title: string;
  imgBg: string;
}

function Card({ title, imgBg }: CardProps) {
  return (
    <div className="flex flex-col bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:scale-[1.02] transition-transform duration-500 h-full">
      {/* Título com espaçamento flexível */}
      <div className="p-8 pb-4 text-center flex flex-col items-center">
        <h3 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight max-w-[220px]">
          {title}
        </h3>
      </div>
      
      {/* Container da Imagem: 
        1. flex-1 faz com que ele preencha o espaço restante.
        2. aspect-[4/5] garante uma proporção vertical ideal para mockups de celular.
        3. min-h-[400px] assegura que mesmo em telas pequenas o card tenha presença.
      */}
      <div className={`mx-6 mt-4 flex-1 rounded-t-[2.5rem] ${imgBg} border-t border-x border-slate-100 p-6 pb-0 shadow-inner aspect-[4/5] min-h-[380px] md:min-h-[480px] flex items-start justify-center`}>
        {/* Mockup do Telefone */}
        <div className="w-full h-full bg-slate-200 rounded-t-[2rem] border-t border-x border-slate-300 relative shadow-2xl transition-transform group-hover:translate-y-[-4px] duration-500">
           <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-400/20 rounded-full" />
           {/* Insira sua <Image src="..." /> aqui com layout="fill" ou objectFit="cover" */}
        </div>
      </div>
    </div>
  );
}

export function FeatureCards() {
  return (
    <section className="bg-white py-12 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Retângulo Preto Responsivo */}
        <div className="bg-black rounded-[3rem] md:rounded-[5rem] px-6 pt-20 pb-48 md:pt-24 md:pb-72 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white max-w-2xl mx-auto leading-tight tracking-tighter">
            Todas as ferramentas para o seu negócio na palma da sua mão
          </h2>
        </div>

        {/* Grid de Cards: 
          Aumentamos a margem negativa (-mt) para compensar o aumento da altura dos cards 
          e mantê-los bem encaixados dentro do retângulo preto.
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2 md:px-10 -mt-36 md:-mt-60">
          <Card 
            title="Acompanhe seus agendamentos" 
            imgBg="bg-slate-50" 
          />
          <Card 
            title="Personalize seu link de agendamento" 
            imgBg="bg-[#121212]" 
          />
          <Card 
            title="Integre seu link com redes sociais" 
            imgBg="bg-orange-50" 
          />
        </div>

      </div>
    </section>
  );
}