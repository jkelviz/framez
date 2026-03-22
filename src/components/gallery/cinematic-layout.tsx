"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
    id: string;
    src: string;
}

interface CinematicLayoutProps {
    photos: Photo[];
    onPhotoClick: (index: number) => void;
}

export function CinematicLayout({ photos, onPhotoClick }: CinematicLayoutProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

    return (
        <div className="h-[90vh] w-full bg-black relative flex items-center justify-center overflow-hidden rounded-xl border border-fz-border mt-8 max-w-[95vw] mx-auto">
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={photos[currentIndex].src}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-full h-full object-contain cursor-pointer p-4 md:p-12"
                    onClick={() => onPhotoClick(currentIndex)}
                />
            </AnimatePresence>

            <button onClick={prev} className="absolute left-4 p-4 text-white/50 hover:text-white transition-colors z-10 hidden md:block">
                <ChevronLeft className="h-10 w-10" />
            </button>
            <button onClick={next} className="absolute right-4 p-4 text-white/50 hover:text-white transition-colors z-10 hidden md:block">
                <ChevronRight className="h-10 w-10" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest bg-black/50 px-3 py-1 rounded-full">
                {currentIndex + 1} / {photos.length}
            </div>
        </div>
    );
}
