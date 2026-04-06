interface DashboardHeaderProps {
  showValues: boolean;
  onToggleValues: () => void;
  userName: string;
  onOpenMenu: () => void;      // Nova função para o Hambúrguer
  onOpenSchedule: () => void;  // Nova função para a Agenda
}

export const DashboardHeader = ({ 
  showValues, 
  onToggleValues, 
  userName, 
  onOpenMenu, 
  onOpenSchedule 
}: DashboardHeaderProps) => {
  return (
    <header className="px-6 pt-12 pb-4 flex items-start justify-between shrink-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Olá, {userName}</h1>
        
        {/* BOTÃO DA AGENDA: Agora interativo */}
        <button 
          onClick={onOpenSchedule}
          className="flex items-center gap-2 text-sm text-text-secondary mt-1 hover:text-white transition-colors active:scale-95"
        >
          Você está em sua agenda
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>
      
      <div className="flex gap-3">
        <button 
          onClick={onToggleValues}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 border
            ${showValues 
              ? 'bg-surface border-white/5 text-text-secondary hover:text-white' 
              : 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-105'
            }`}
        >
          {showValues ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
              <line x1="2" x2="22" y1="2" y2="22"/>
            </svg>
          )}
        </button>

        {/* BOTÃO DE MENU/CONFIG: Agora interativo */}
        <button 
          onClick={onOpenMenu}
          className="w-10 h-10 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-text-secondary hover:text-white transition-all active:scale-90"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </header>
  );
};