"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, CheckCircle, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Photo {
    id: string;
    src: string;
    is_favorite?: boolean;
    is_selected?: boolean;
}

interface FullscreenViewerProps {
    photos: Photo[];
    initialIndex: number;
    onClose: () => void;
}

export function FullscreenViewer({ photos, initialIndex, onClose }: FullscreenViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isFavorite, setIsFavorite] = useState(photos[initialIndex]?.is_favorite || false);
    const [isSelected, setIsSelected] = useState(photos[initialIndex]?.is_selected || false);
    const supabase = createClient();
    const touchStart = useRef<number>(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        // Update favorite/selected state when photo changes
        const currentPhoto = photos[currentIndex];
        if (currentPhoto) {
            setIsFavorite(currentPhoto.is_favorite || false);
            setIsSelected(currentPhoto.is_selected || false);
        }
    }, [currentIndex, photos]);

    const next = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

    const handleFavorite = async () => {
        const newVal = !isFavorite;
        setIsFavorite(newVal);
        
        try {
            await supabase.from('photos')
                .update({ is_favorite: newVal })
                .eq('id', photos[currentIndex].id);
        } catch (error) {
            console.error('Error updating favorite:', error);
            // Revert on error
            setIsFavorite(!newVal);
        }
    };

    const handleSelect = async () => {
        const newVal = !isSelected;
        setIsSelected(newVal);
        
        try {
            await supabase.from('photos')
                .update({ is_selected: newVal })
                .eq('id', photos[currentIndex].id);
        } catch (error) {
            console.error('Error updating selected:', error);
            // Revert on error
            setIsSelected(!newVal);
        }
    };

    const handleDownload = async () => {
        const photo = photos[currentIndex];
        try {
            const response = await fetch(photo.src);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `foto-${currentIndex + 1}.jpg`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading photo:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col">
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div className="text-white/70 text-sm">{currentIndex + 1} / {photos.length}</div>
                <button onClick={onClose} className="text-white/70 hover:text-white p-2">
                    <X className="h-6 w-6" />
                </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden"
                onTouchStart={(e) => { touchStart.current = e.touches[0].clientX }}
                onTouchEnd={(e) => {
                    const diff = touchStart.current - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 50) { 
                        diff > 0 ? next() : prev(); 
                    }
                }}>
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
                    onClick={handleFavorite}
                    className={`flex flex-col items-center gap-1 transition-colors ${isFavorite ? "text-fz-accent" : "text-white/70 hover:text-white"}`}
                >
                    <Heart className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} />
                    <span className="text-xs">Favoritar</span>
                </button>
                <button
                    onClick={handleSelect}
                    className={`flex flex-col items-center gap-1 transition-colors ${isSelected ? "text-green-500" : "text-white/70 hover:text-white"}`}
                >
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-xs">Selecionar</span>
                </button>
                <button onClick={handleDownload} className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors">
                    <Download className="h-6 w-6" />
                    <span className="text-xs">Baixar</span>
                </button>
            </div>
        </div>
    );
}
