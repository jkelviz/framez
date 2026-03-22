"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function UpgradeModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId: "price_mock_123", photographerId: "mock-user-id" })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    return (
        <>
            <div onClick={() => setOpen(true)} className="inline-block">
                {children}
            </div>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center isolate">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm -z-10"
                            onClick={() => setOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg p-8 bg-fz-bg-card border border-fz-border rounded-2xl shadow-2xl mx-4"
                        >
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-4 right-4 text-fz-text-secondary hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h2 className="font-serif text-3xl text-white mb-2">Faça upgrade para o Pro</h2>
                            <p className="text-fz-text-secondary mb-6">
                                Desbloqueie ensaios ilimitados e armazenamento na nuvem para seus clientes.
                            </p>

                            <div className="py-6 mb-6 border-y border-fz-border">
                                <div className="flex items-baseline mb-6">
                                    <span className="text-5xl font-bold tracking-tight text-white">R$ 59</span>
                                    <span className="text-fz-text-secondary ml-1 font-semibold">/mês</span>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <Check className="h-5 w-5 text-fz-accent shrink-0" />
                                        <span className="text-white">Ensaios e galerias ilimitadas</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Check className="h-5 w-5 text-fz-accent shrink-0" />
                                        <span className="text-white">200GB de armazenamento em alta resolução</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Check className="h-5 w-5 text-fz-accent shrink-0" />
                                        <span className="text-white">Domínio customizado (em breve)</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Check className="h-5 w-5 text-fz-accent shrink-0" />
                                        <span className="text-white">Suporte prioritário via WhatsApp</span>
                                    </li>
                                </ul>
                            </div>

                            <Button
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="w-full bg-fz-accent hover:bg-fz-accent-hover text-white h-12 text-lg"
                            >
                                {loading ? "Redirecionando..." : "Assinar FrameZ Pro"}
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
