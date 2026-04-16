"use client";

import { motion } from "framer-motion";

interface BubbleProps {
  text: string;
  isAi?: boolean;
  isUser?: boolean;
  isBig?: boolean;
}

export const ChatBubble = ({ text, isAi, isUser, isBig }: BubbleProps) => (
  <motion.div
    initial={{ opacity: 0, y: 15, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className={`flex w-full ${isAi ? "justify-start" : "justify-end"} will-change-transform`}
  >
    <div
      className={`
        max-w-[85%] px-6 py-4 shadow-2xl leading-tight
        ${isBig 
          ? "text-2xl md:text-3xl font-black tracking-tighter rounded-[2.5rem]" 
          : "text-sm md:text-base font-bold rounded-[2rem]"
        }
        ${isAi
          ? "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-bl-none"
          : "bg-orange-600 text-white rounded-br-none shadow-orange-600/20"
        }
      `}
    >
      {text}
    </div>
  </motion.div>
);