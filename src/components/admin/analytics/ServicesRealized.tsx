"use client";

import { motion } from "framer-motion";
// Importamos o componente e a tipagem que acabamos de criar! Ajuste o caminho se necessário.
import { RankingCard, ServiceItem } from "@/components/admin/analytics/RankingCard";

export const ServicesRealized = ({ services }: { services: ServiceItem[] }) => {
  // Filtramos as listas
  const servicesList = services.filter(s => s.type === 'SERVICE' || !s.type);
  const productsList = services.filter(s => s.type === 'PRODUCT');

  return (
    <div className="space-y-10 pb-6 w-full">
      
      {/* SEÇÃO 1: SERVIÇOS */}
      {servicesList.length > 0 && (
        <section className="space-y-6 w-full">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]"
          >
            Serviços Realizados
          </motion.p>

          <div className="grid grid-cols-2 gap-4 w-full">
            {servicesList.map((item, index) => (
              <RankingCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* SEÇÃO 2: PRODUTOS */}
      {productsList.length > 0 && (
        <section className="space-y-6 w-full">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]"
          >
            Produtos Vendidos
          </motion.p>

          <div className="grid grid-cols-2 gap-4 w-full">
            {productsList.map((item, index) => (
              <RankingCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};