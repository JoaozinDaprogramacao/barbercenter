interface SettingsHeaderProps {
  onBack: () => void;
}

export const SettingsHeader = ({ onBack }: SettingsHeaderProps) => (
  <header className="px-6 pt-12 pb-6 flex items-center justify-between shrink-0">
    <button
      onClick={onBack}
      className="w-10 h-10 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-white active:scale-90 transition-all"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
    <button className="bg-white/5 text-white/50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 active:opacity-50 transition-all hover:text-white">
      Clear Cache
    </button>
  </header>
);