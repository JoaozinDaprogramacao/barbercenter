"use client";

interface AppointmentActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode; // Nova prop para o botão fixo
}

export const AppointmentActionSheet = ({ isOpen, onClose, children, footer }: AppointmentActionSheetProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#121212] rounded-t-[40px] border-t border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER FIXO */}
        <div className="pt-6 px-8 shrink-0 bg-[#121212] rounded-t-[40px] z-10">
          <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-4" />
        </div>

        {/* CONTEÚDO COM SCROLL */}
        <div className="flex-1 overflow-y-auto px-8 pb-4 no-scrollbar">
          {children}
        </div>

        {/* FOOTER FIXO (AQUI FICA O BOTÃO) */}
        {footer && (
          <div className="p-8 pt-4 shrink-0 bg-[#121212] border-t border-white/5 z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};