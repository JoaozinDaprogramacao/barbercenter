"use client";

interface AppointmentHeaderProps {
  onBack: () => void;
  onSendReminder: () => void;
  reminderSent: boolean;
}

export const AppointmentHeader = ({ onBack, onSendReminder, reminderSent }: AppointmentHeaderProps) => (
  <header className="px-6 pt-12 pb-6 flex items-center justify-between shrink-0">
    <button 
      onClick={onBack} 
      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white active:scale-95 transition-all"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>
    
    <button 
      onClick={onSendReminder}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
        reminderSent ? 'bg-green-500 text-white' : 'bg-white/5 text-accent'
      }`}
    >
      <span>{reminderSent ? 'ENVIADO!' : 'ENVIAR LEMBRETE'}</span>
      {reminderSent ? '✅' : '🔔'}
    </button>
  </header>
);