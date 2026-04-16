"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft } from 'lucide-react';
import { PlanSummaryActivity } from './activities/PlanSummaryActivity';
import { PixPaymentActivity } from './activities/PixPaymentActivity';
import { CardPaymentActivity } from './activities/CardPaymentActivity';

interface TrialWorkflowProps {
  forcedOpen?: boolean;
  onClose?: () => void;
}

type ActivityStack = 'IDLE' | 'PLAN_SUMMARY' | 'PIX_PAYMENT' | 'CARD_PAYMENT';

export function TrialWorkflow({ forcedOpen = false, onClose }: TrialWorkflowProps) {
  const [currentActivity, setCurrentActivity] = useState<ActivityStack>('IDLE');

  useEffect(() => {
    if (forcedOpen) setCurrentActivity('PLAN_SUMMARY');
  }, [forcedOpen]);

  useEffect(() => {
    document.body.style.overflow = currentActivity !== 'IDLE' ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [currentActivity]);

  const handleClose = () => {
    setCurrentActivity('IDLE');
    if (onClose) onClose();
  };

  return (
    <>
      {!forcedOpen && currentActivity === 'IDLE' && (
        <button
          onClick={() => setCurrentActivity('PLAN_SUMMARY')}
          className="w-full mb-6 p-4 rounded-[2rem] bg-orange-600/10 border border-orange-600/20 flex items-center justify-between group active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-orange-600 p-2.5 rounded-xl text-white shadow-lg shadow-orange-600/20">
              <Clock size={20} />
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-black uppercase tracking-tight">Período de Teste Ativo</p>
              <p className="text-orange-500/80 text-xs font-bold">42 dias restantes • Assinar</p>
            </div>
          </div>
          <ChevronLeft size={20} className="text-orange-500 rotate-180" />
        </button>
      )}

      <AnimatePresence>
        {currentActivity !== 'IDLE' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-zinc-950 flex flex-col"
          >
            <AnimatePresence mode="popLayout">
              {currentActivity === 'PLAN_SUMMARY' && (
                <PlanSummaryActivity 
                  key="plan"
                  onClose={handleClose} 
                  onNext={(type) => setCurrentActivity(type === 'PIX' ? 'PIX_PAYMENT' : 'CARD_PAYMENT')} 
                />
              )}

              {currentActivity === 'PIX_PAYMENT' && (
                <PixPaymentActivity 
                  key="pix"
                  onBack={() => setCurrentActivity('PLAN_SUMMARY')} 
                  onClose={handleClose}
                />
              )}

              {currentActivity === 'CARD_PAYMENT' && (
                <CardPaymentActivity 
                  key="card"
                  onBack={() => setCurrentActivity('PLAN_SUMMARY')} 
                  onClose={handleClose}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}