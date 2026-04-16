"use client";

import { motion, AnimatePresence } from "framer-motion";

interface AppointmentActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AppointmentActionSheet = ({ 
  isOpen, 
  onClose, 
  children, 
  footer 
}: AppointmentActionSheetProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-hidden">
          {/* Backdrop Otimizado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md will-change-opacity"
          />

          {/* Bottom Sheet Body */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-zinc-950 border-t border-zinc-900 rounded-t-[3rem] shadow-2xl max-h-[92vh] flex flex-col z-10 will-change-transform"
          >
            {/* Header / Arraste */}
            <div className="pt-6 px-8 shrink-0 relative">
              <div className="w-14 h-1.5 bg-zinc-800 rounded-full mx-auto mb-4" />
            </div>

            {/* Conteúdo com Scroll Suave */}
            <div className="flex-1 overflow-y-auto px-8 pb-6 no-scrollbar">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {children}
              </motion.div>
            </div>

            {/* Footer Fixo */}
            {footer && (
              <div className="p-8 pt-4 shrink-0 bg-zinc-950 border-t border-zinc-900 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};