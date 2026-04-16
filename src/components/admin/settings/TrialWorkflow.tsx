"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    // Abre o sumário do plano automaticamente quando o pai (Dashboard) disparar o forcedOpen
    useEffect(() => {
        if (forcedOpen) {
            setCurrentActivity('PLAN_SUMMARY');
        } else {
            setCurrentActivity('IDLE');
        }
    }, [forcedOpen]);

    // Bloqueia o scroll do fundo quando o checkout está aberto
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
            {/* REMOVIDO: O botão que renderizava o banner laranja foi retirado daqui */}

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