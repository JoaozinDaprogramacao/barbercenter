"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type WheelColumnProps = {
    options: string[];
    selected: string;
    onSelect: (val: string) => void;
};

type TimePickerModalProps = {
    isOpen: boolean;
    onClose: () => void;
    currentValue: string;
    onSelect: (value: string) => void;
    label: string;
};

const ITEM_HEIGHT = 56;
const VISIBLE_ROWS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;

const WheelColumn = ({ options, selected, onSelect }: WheelColumnProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!scrollRef.current) return;
        const index = Math.max(0, options.indexOf(selected));
        scrollRef.current.scrollTop = index * ITEM_HEIGHT;
    }, [options, selected]);

    const snapToNearest = () => {
        if (!scrollRef.current) return;
        const index = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
        const safeIndex = Math.max(0, Math.min(index, options.length - 1));
        const nextValue = options[safeIndex];

        scrollRef.current.scrollTo({
            top: safeIndex * ITEM_HEIGHT,
            behavior: "smooth",
        });

        if (nextValue !== selected) {
            onSelect(nextValue);
        }
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const index = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT);
        const safeIndex = Math.max(0, Math.min(index, options.length - 1));
        const nextValue = options[safeIndex];

        if (nextValue && nextValue !== selected) {
            onSelect(nextValue);
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(snapToNearest, 100);
    };

    return (
        <div className="relative flex-1">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="no-scrollbar overflow-y-auto snap-y snap-mandatory will-change-transform"
                style={{
                    height: PICKER_HEIGHT,
                    paddingTop: ITEM_HEIGHT * 2,
                    paddingBottom: ITEM_HEIGHT * 2,
                    WebkitOverflowScrolling: "touch",
                }}
            >
                {options.map((option) => {
                    const isActive = option === selected;
                    return (
                        <div
                            key={option}
                            className="snap-center flex items-center justify-center select-none"
                            style={{ height: ITEM_HEIGHT }}
                        >
                            <span
                                className={`tabular-nums font-black transition-all duration-300 ${
                                    isActive
                                        ? "text-white text-3xl scale-110"
                                        : "text-zinc-700 text-xl scale-90 blur-[0.3px]"
                                }`}
                            >
                                {option}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const TimePickerModal = ({
    isOpen,
    onClose,
    currentValue,
    onSelect,
    label,
}: TimePickerModalProps) => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minutes = ["00", "15", "30", "45"];

    const [h, setH] = useState(currentValue?.split(":")[0] || "09");
    const [m, setM] = useState(currentValue?.split(":")[1] || "00");

    useEffect(() => {
        if (isOpen) {
            setH(currentValue?.split(":")[0] || "09");
            setM(currentValue?.split(":")[1] || "00");
        }
    }, [currentValue, isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-end justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    {/* Bottom Sheet Body */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-md bg-zinc-950 border-t border-zinc-900 rounded-t-[3rem] pt-2 pb-12 shadow-2xl will-change-transform"
                    >
                        {/* Drag Handle */}
                        <div className="w-14 h-1.5 bg-zinc-800 rounded-full mx-auto mb-10 mt-2" />

                        {/* Display Digital Gigante */}
                        <div className="relative mb-10 w-full">
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-orange-600/60 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                                    {label}
                                </p>

                                <div className="relative flex items-center justify-center tabular-nums">
                                    <div className="absolute inset-0 bg-orange-600/5 blur-[50px] rounded-full" />
                                    <div className="relative flex items-center font-black tracking-tighter">
                                        <span className="text-8xl text-white">{h}</span>
                                        <motion.span 
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="text-6xl text-orange-600 mx-2 mb-2"
                                        >
                                            :
                                        </motion.span>
                                        <span className="text-8xl text-white">{m}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wheel Selector */}
                        <div className="px-8 mb-10">
                            <div className="relative rounded-[2.5rem] border border-zinc-900 bg-zinc-900/30 overflow-hidden">
                                {/* Lente de Foco */}
                                <div
                                    className="absolute left-4 right-4 top-1/2 -translate-y-1/2 rounded-2xl bg-orange-600/10 border border-orange-600/20 pointer-events-none z-20"
                                    style={{ height: ITEM_HEIGHT }}
                                />

                                {/* Gradientes de Sombra do Wheel */}
                                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />
                                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-10" />

                                <div className="relative z-0 flex items-center px-6">
                                    <WheelColumn options={hours} selected={h} onSelect={setH} />
                                    <div className="w-px h-12 bg-zinc-800" />
                                    <WheelColumn options={minutes} selected={m} onSelect={setM} />
                                </div>
                            </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="grid grid-cols-2 gap-4 px-8">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="py-5 rounded-2xl bg-zinc-900 text-zinc-500 font-black uppercase tracking-widest text-[11px] hover:text-white transition-colors"
                            >
                                Cancelar
                            </motion.button>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    onSelect(`${h}:${m}`);
                                    onClose();
                                }}
                                className="py-5 rounded-2xl bg-orange-600 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-orange-600/20 active:bg-orange-700 transition-all"
                            >
                                Confirmar
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};