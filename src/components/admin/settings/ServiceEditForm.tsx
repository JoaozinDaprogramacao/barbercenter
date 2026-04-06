export const ServiceEditForm = ({ service, onUpdate, onRemove, onDone }: any) => (
  <div className="mt-10 p-6 bg-surface border border-white/10 rounded-[32px] animate-in slide-in-from-bottom-6 duration-300">
    <div className="flex justify-between items-center mb-6">
      <h4 className="text-white font-bold">Editar Serviço</h4>
      <button onClick={() => onRemove(service.id)} className="text-[10px] font-black text-red-500 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">
        Remover
      </button>
    </div>
    <div className="space-y-4">
      {['name', 'price'].map((f) => (
        <div key={f} className="space-y-1">
          <label className="text-[10px] font-bold text-accent uppercase px-1">{f === 'name' ? 'Nome' : 'Preço (R$)'}</label>
          <input
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-accent"
            value={service[f]}
            onChange={(e) => onUpdate(service.id, f, e.target.value)}
          />
        </div>
      ))}
      <button onClick={onDone} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest mt-2">
        Concluir
      </button>
    </div>
  </div>
);