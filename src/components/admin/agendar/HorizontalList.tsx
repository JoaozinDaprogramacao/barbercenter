import { Check } from "lucide-react";

interface ListProps {
    items: any[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    type: "service" | "product";
}

export function HorizontalList({ items, selectedIds, onToggle, type }: ListProps) {
    return (
        <div className="w-full overflow-hidden">
            <div className="flex w-full overflow-x-auto gap-3 pb-2 snap-x [&::-webkit-scrollbar]:hidden">
                {items.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                        <div
                            key={item.id}
                            onClick={() => onToggle(item.id)}
                            className={`min-w-[155px] max-w-[180px] snap-start flex flex-col justify-between p-4 rounded-[1.4rem] border cursor-pointer transition-all ${
                                isSelected
                                    ? type === "service"
                                        ? "bg-[#B87333]/15 border-[#B87333]/40 shadow-[inset_0_1px_0_rgba(184,115,51,0.2)]"
                                        : "bg-[#B87333]/15 border-[#B87333]/40 shadow-[inset_0_1px_0_rgba(184,115,51,0.2)]"
                                    : "bg-[#100D0B] border-white/5 hover:bg-white/[0.02]"
                            }`}
                        >
                            <div className="flex justify-end w-full mb-3">
                                <div
                                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                                        isSelected
                                            ? "bg-[#D49A62] border-[#D49A62]"
                                            : "border-zinc-700 bg-zinc-900"
                                    }`}
                                >
                                    {isSelected && (
                                        <Check
                                            size={14}
                                            className="text-[#050505]"
                                            strokeWidth={3}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <span
                                    className={`font-bold text-[15px] leading-tight line-clamp-2 ${
                                        isSelected ? "text-[#D49A62]" : "text-zinc-300"
                                    }`}
                                >
                                    {item.name}
                                </span>

                                <span className="text-[13px] text-zinc-500 font-medium mt-1">
                                    R$ {Number(item.price).toFixed(2).replace(".", ",")}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}