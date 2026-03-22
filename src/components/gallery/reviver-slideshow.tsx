"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
    id: string;
    src: string;
}

interface ReviverSlideshowProps {
    photos: Photo[];
    onClose: () => void;
}

export function ReviverSlideshow({ photos, onClose }: ReviverSlideshowProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Request fullscreen on mount
        if (containerRef.current?.requestFullscreen) {
            containerRef.current.requestFullscreen().catch((err) => console.log(err));
        }

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                onClose();
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % photos.length);
        }, 5000); // 5 seconds per slide
        return () => clearInterval(interval);
    }, [isPlaying, photos.length]);

    const next = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center overflow-hidden w-screen h-screen"
            onMouseMove={() => {
                setShowControls(true);
            }}
        >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-20">
                <motion.div
                    key={currentIndex}
                    initial={{ width: "0%" }}
                    animate={{ width: isPlaying ? "100%" : "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-fz-accent"
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={photos[currentIndex].src}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }} // 800ms crossfade
                    className="absolute inset-0 w-full h-full object-contain md:object-cover"
                />
            </AnimatePresence>

            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 flex flex-col justify-between p-6 bg-gradient-to-b from-black/40 via-transparent to-black/40"
                    >
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    if (document.fullscreenElement) document.exitFullscreen();
                                    onClose();
                                }}
                                className="text-white hover:text-fz-accent transition-colors"
                            >
                                <X className="h-8 w-8" />
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-8 mb-8">
                            <button onClick={prev} className="text-white hover:text-fz-accent"><ChevronLeft className="h-10 w-10" /></button>
                            <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-fz-accent">
                                {isPlaying ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12" />}
                            </button>
                            <button onClick={next} className="text-white hover:text-fz-accent"><ChevronRight className="h-10 w-10" /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
