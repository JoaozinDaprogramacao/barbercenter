interface BubbleProps {
  text: string;
  isAi?: boolean;
  isBig?: boolean; // Nova propriedade para destacar a pergunta
}

export const ChatBubble = ({ text, isAi, isBig }: BubbleProps) => (
  <div className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}>
    <div className={`max-w-[90%] px-5 py-4 shadow-sm leading-snug
      ${isBig ? 'text-[26px] font-black rounded-3xl' : 'text-[16px] font-medium rounded-2xl'}
      ${isAi 
        ? 'bg-[#1A1B1E] border border-white/5 text-white rounded-bl-sm' 
        : 'bg-white text-black rounded-br-sm'}`}
    >
      {text}
    </div>
  </div>
);