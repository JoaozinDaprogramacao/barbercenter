// components/ChatBubble.tsx
interface BubbleProps {
  text: string;
  isAi?: boolean;
}

export const ChatBubble = ({ text, isAi }: BubbleProps) => (
  <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
    <div 
      className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm
        ${isAi 
          ? 'bg-surface border border-border-main text-text-primary rounded-[12px_12px_12px_4px]' 
          : 'bg-zinc-custom text-text-primary rounded-[12px_12px_4px_12px]'
        }`}
    >
      {text}
    </div>
  </div>
);