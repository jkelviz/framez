"use client";

import { useEffect, useState } from "react";
import { Download, Heart, CheckCircle, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingBarProps {
    onReviver: () => void;
    favoritesCount: number;
    selectedCount: number;
    onDownloadSelected: () => void;
}

export function FloatingBar({ onReviver, favoritesCount, selectedCount, onDownloadSelected }: FloatingBarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // In a real app, logic would use height detection
            setIsVisible(true);
        };

        // Always visible for demo after standard mount if wanted, but follow scroll
        window.addEventListener("scroll", handleScroll);
        setIsVisible(true); // default visible to easily showcase feature
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[rgba(10,10,10,0.95)] backdrop-blur-md border border-fz-border rounded-full px-6 py-3 flex items-center gap-6 z-40 shadow-2xl"
                >
                    <div className="flex items-center gap-2 text-white/80 hover:text-fz-accent cursor-pointer transition-colors">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm font-medium">{favoritesCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 hover:text-green-500 cursor-pointer transition-colors border-l border-fz-border pl-6">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">{selectedCount}</span>
                    </div>
                    <div onClick={onDownloadSelected} className="flex items-center gap-2 text-white/80 hover:text-white cursor-pointer transition-colors border-l border-fz-border pl-6 pr-2">
                        <Download className="h-5 w-5" />
                    </div>
                    <button
                        onClick={onReviver}
                        className="flex items-center gap-2 bg-fz-accent hover:bg-fz-accent-hover text-white px-4 py-2 rounded-full font-medium transition-colors ml-2"
                    >
                        <Play className="h-4 w-4" fill="currentColor" />
                        <span className="hidden sm:inline">Reviver</span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
