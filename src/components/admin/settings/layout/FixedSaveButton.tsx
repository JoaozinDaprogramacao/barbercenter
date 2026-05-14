import { Loader2 } from "lucide-react";

interface FixedSaveButtonProps {
  onSave: () => void;
  isSaving: boolean;
  label?: string;
}

export const FixedSaveButton = ({ onSave, isSaving, label = "Salvar Alterações" }: FixedSaveButtonProps) => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
      <div className="bg-[#050505]/90 backdrop-blur-md pt-4 pb-6 px-6 shadow-[0_-20px_40px_rgba(5,5,5,0.95)]">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="w-full bg-[#D49A62] text-[#050505] py-4 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] transition-all flex justify-center items-center active:scale-[0.98] active:bg-[#B87333] disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : label}
        </button>
      </div>
    </div>
  );
};