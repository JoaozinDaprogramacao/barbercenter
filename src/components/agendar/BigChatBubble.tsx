import { motion } from "framer-motion";

export const BigChatBubble = ({ text, isAi, isUser, delay = 0 }: { text: string, isAi?: boolean, isUser?: boolean, delay?: number }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.6, delay }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-6 py-5 max-w-[90%] md:max-w-[85%] leading-snug backdrop-blur-md ${isUser
          ? "bg-gradient-to-br from-[#D49A62] to-[#B87333] text-[#050505] rounded-[2rem] rounded-tr-lg text-xl font-bold shadow-[0_5px_15px_rgba(184,115,51,0.25)]"
          : "bg-white/[0.04] border border-white/10 text-[#F7EFE2] rounded-[2rem] rounded-tl-lg text-2xl font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          }`}
      >
        {text}
      </div>
    </motion.div>
  );
};