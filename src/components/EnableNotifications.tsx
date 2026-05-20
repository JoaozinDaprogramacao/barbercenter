'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react'; // Usando os ícones que você já tem no projeto

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function EnableNotifications({ barberId }: { barberId: string }) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Checa suporte e se já existe uma inscrição ativa
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      navigator.serviceWorker.register('/sw.js').then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          if (subscription) {
            setIsSubscribed(true); // Já ativou, não precisa mostrar o botão
          }
        });
      });
    }
  }, []);

  const subscribeButton = async () => {
    // Double Opt-in: Explica antes do navegador jogar o popup nativo
    const wantsToSubscribe = window.confirm(
      "Para receber avisos na hora, permita as notificações a seguir.\n\n📱 iOS (iPhone): Você obrigatoriamente precisa adicionar este sistema à sua Tela de Início (Compartilhar -> Adicionar à Tela de Início) antes de clicar aqui."
    );

    if (!wantsToSubscribe) return;

    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      });

      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barberId,
          subscription
        })
      });

      setIsSubscribed(true);
      alert('Tudo certo! Você receberá um aviso a cada novo agendamento. ✂️');
    } catch (error) {
      console.error('Erro ao assinar notificações:', error);
      alert('Não foi possível ativar. Verifique se você bloqueou no navegador ou, se usa iPhone, lembre de adicionar à Tela de Início primeiro.');
    } finally {
      setIsLoading(false);
    }
  };

  // Se não suporta (aba anônima restrita, etc) ou já ativou, esconde o componente
  if (!isSupported || isSubscribed) return null; 

  return (
    <button 
      onClick={subscribeButton} 
      disabled={isLoading}
      className="w-full mt-2 py-4 bg-[#D49A62]/10 hover:bg-[#D49A62]/20 border border-[#D49A62]/30 text-[#D49A62] rounded-[1.2rem] font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all active:scale-95"
    >
      <Bell size={16} strokeWidth={2.5} />
      {isLoading ? 'Ativando...' : 'Ativar Alerta de Agendamentos'}
    </button>
  );
}