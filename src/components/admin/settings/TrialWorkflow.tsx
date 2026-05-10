"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanSummaryActivity } from './activities/PlanSummaryActivity';
import { PixPaymentActivity } from './activities/PixPaymentActivity';
import { CardPaymentActivity } from './activities/CardPaymentActivity';

interface UserData {
    id: string;
    name: string;
    email: string;
    barbershopId: string;
}

interface TrialWorkflowProps {
    forcedOpen?: boolean;
    onClose?: () => void;
    userData: UserData;
}

type ActivityStack = 'IDLE' | 'PLAN_SUMMARY' | 'PIX_PAYMENT' | 'CARD_PAYMENT' | 'SUCCESS';

export function TrialWorkflow({ forcedOpen = false, onClose, userData }: TrialWorkflowProps) {
    const [currentActivity, setCurrentActivity] = useState<ActivityStack>('IDLE');

    useEffect(() => {
        if (forcedOpen) {
            setCurrentActivity('PLAN_SUMMARY');
        } else {
            setCurrentActivity('IDLE');
        }
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
            <AnimatePresence>
                {currentActivity !== 'IDLE' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] bg-[#050505] flex flex-col overflow-hidden"
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
                                    userData={userData}
                                />
                            )}

                            {currentActivity === 'CARD_PAYMENT' && (
                                <CardPaymentActivity
                                    key="card"
                                    onBack={() => setCurrentActivity('PLAN_SUMMARY')}
                                    onClose={handleClose}
                                    onSuccess={() => setCurrentActivity('SUCCESS')}
                                    userData={userData} 
                                />
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}