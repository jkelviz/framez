"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
    clientName: string;
    onComplete: () => void;
}

export function SplashScreen({ clientName, onComplete }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800); // Wait for fade out
        }, 2500); // 2.5 seconds
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-center"
                    >
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-fz-text-primary tracking-tight mb-4">
                            {clientName}
                        </h1>
                        <p className="text-fz-text-secondary text-lg md:text-xl tracking-widest uppercase">
                            Seu ensaio está pronto
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
