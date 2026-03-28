"use client"

import { useState } from "react"
import { Rocket, X, Check, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function UpgradeModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleUpgrade = async () => {
        setLoading(true)
        try {
            // Simulate upgrade process
            await new Promise(resolve => setTimeout(resolve, 2000))
            window.location.href = "/planos"
        } catch (e) {
            console.error(e)
            setLoading(false)
        }
    }

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
                            className="absolute inset-0 bg-black/85 backdrop-blur-sm -z-10"
                            onClick={() => setOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md p-8 bg-[#111111] border border-[rgba(232,93,36,0.3)] rounded-2xl shadow-2xl mx-4"
                        >
                            {/* Confetti/Sparkle Animation */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="relative"
                                >
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-1 h-1 bg-[#E85D24] rounded-full"
                                            style={{
                                                top: "50%",
                                                left: "50%",
                                                transform: `rotate(${i * 60}deg) translateY(-20px)`,
                                            }}
                                            animate={{
                                                scale: [1, 1.5, 1],
                                                opacity: [0.5, 1, 0.5],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            </div>

                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-4 right-4 text-[#888880] hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Rocket Icon */}
                            <div className="flex justify-center mb-6">
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-16 h-16 bg-gradient-to-br from-[#E85D24] to-[#F5A623] rounded-full flex items-center justify-center"
                                >
                                    <Rocket className="w-8 h-8 text-white" />
                                </motion.div>
                            </div>

                            <h2 className="text-[24px] font-semibold text-[#F5F5F0] mb-2 text-center tracking-[-0.05em]">
                                Desbloqueie todo o potencial
                            </h2>
                            <p className="text-[14px] text-[#888880] mb-6 text-center">
                                Você está tentando usar um recurso do plano Pro
                            </p>

                            {/* Plan Highlight */}
                            <div className="bg-[#161616] border border-[#E85D24] rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="text-[18px] font-semibold text-[#F5F5F0]">Plano Pro</h3>
                                        <p className="text-[20px] font-bold text-[#E85D24]">R$97/mês</p>
                                    </div>
                                    <div className="px-2 py-1 bg-[#E85D24] rounded-full">
                                        <span className="text-[10px] font-medium text-white">Mais popular</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#22C55E]" />
                                        <span className="text-[13px] text-[#F5F5F0]">Ensaios ilimitados</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#22C55E]" />
                                        <span className="text-[13px] text-[#F5F5F0]">100GB armazenamento</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#22C55E]" />
                                        <span className="text-[13px] text-[#F5F5F0]">Sem marca FrameZ</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#22C55E]" />
                                        <span className="text-[13px] text-[#F5F5F0]">Analytics completo</span>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleUpgrade}
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-[#E85D24] to-[#F5A623] text-[14px] font-medium text-white rounded-lg transition-all hover:shadow-[0_0_20px_rgba(232,93,36,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            Assinar Pro — R$97/mês
                                            <Star className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                                
                                <button
                                    onClick={() => { setOpen(false); window.location.href = "/planos" }}
                                    className="w-full py-2 text-[13px] text-[#888880] hover:text-[#F5F5F0] transition-colors"
                                >
                                    Ver todos os planos →
                                </button>
                                
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-full py-2 text-[11px] text-[#555] hover:text-[#888880] transition-colors"
                                >
                                    Agora não
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
