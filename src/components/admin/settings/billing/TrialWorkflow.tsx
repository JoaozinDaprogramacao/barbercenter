"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanSummaryActivity } from '../activities/PlanSummaryActivity';

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

export function TrialWorkflow({ forcedOpen = false, onClose, userData }: TrialWorkflowProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (forcedOpen) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [forcedOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] bg-[#050505] flex flex-col overflow-hidden"
                >
                    {/* Passamos o userData para a tela de resumo poder usar o email na Kiwify */}
                    <PlanSummaryActivity
                        onClose={handleClose}
                        userData={userData}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}