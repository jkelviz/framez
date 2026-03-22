"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, CheckCircle, Download } from "lucide-react";

interface Photo {
    id: string;
    src: string;
}

interface FullscreenViewerProps {
    photos: Photo[];
    initialIndex: number;
    onClose: () => void;
}

export function FullscreenViewer({ photos, initialIndex, onClose }: FullscreenViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const next = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div className="text-white/70 text-sm">{currentIndex + 1} / {photos.length}</div>
                <button onClick={onClose} className="text-white/70 hover:text-white p-2">
                    <X className="h-6 w-6" />
                </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={photos[currentIndex].src}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                </AnimatePresence>

                <button onClick={prev} className="absolute left-4 p-4 text-white/50 hover:text-white transition-colors hidden md:block z-10">
                    <ChevronLeft className="h-10 w-10" />
                </button>
                <button onClick={next} className="absolute right-4 p-4 text-white/50 hover:text-white transition-colors hidden md:block z-10">
                    <ChevronRight className="h-10 w-10" />
                </button>
            </div>

            <div className="absolute bottom-0 w-full p-6 flex justify-center gap-8 z-10 bg-gradient-to-t from-black/80 to-transparent">
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex flex-col items-center gap-1 transition-colors ${isFavorite ? "text-fz-accent" : "text-white/70 hover:text-white"}`}
                >
                    <Heart className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} />
                    <span className="text-xs">Favoritar</span>
                </button>
                <button
                    onClick={() => setIsSelected(!isSelected)}
                    className={`flex flex-col items-center gap-1 transition-colors ${isSelected ? "text-green-500" : "text-white/70 hover:text-white"}`}
                >
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-xs">Selecionar</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors">
                    <Download className="h-6 w-6" />
                    <span className="text-xs">Baixar</span>
                </button>
            </div>
        </div>
    );
}
