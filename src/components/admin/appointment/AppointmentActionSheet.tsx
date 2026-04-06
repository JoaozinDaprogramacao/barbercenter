"use client";

interface AppointmentActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const AppointmentActionSheet = ({ isOpen, onClose, children }: AppointmentActionSheetProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#121212] rounded-t-[40px] p-8 border-t border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
        {children}
      </div>
    </div>
  );
};