// components/admin/agendar/HorizontalList.tsx
import { Check } from "lucide-react";

export const HorizontalList = ({ items, selectedIds, onToggle, type }: any) => (
  <div className="flex overflow-x-auto gap-3 -mx-6 px-6 pb-2 snap-x [&::-webkit-scrollbar]:hidden ml-0">
    {items.map((item: any) => {
      const isSelected = selectedIds.includes(item.id);
      return (
        <div
          key={item.id}
          onClick={() => onToggle(item.id)}
          className={`min-w-[140px] snap-start p-4 rounded-[1.4rem] border transition-all ${
            isSelected ? "bg-[#B87333]/20 border-[#D49A62]" : "bg-[#100D0B] border-white/5"
          }`}
        >
          <div className={`w-5 h-5 rounded-full border mb-3 flex items-center justify-center ${isSelected ? "bg-[#D49A62]" : "bg-zinc-900 border-zinc-700"}`}>
            {isSelected && <Check size={12} className="text-black" strokeWidth={4} />}
          </div>
          <span className="block font-bold text-sm text-white line-clamp-1">{item.name}</span>
          <span className="text-xs text-zinc-500">R$ {Number(item.price).toFixed(2)}</span>
        </div>
      );
    })}
  </div>
);