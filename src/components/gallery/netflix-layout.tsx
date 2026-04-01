"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Photo {
    id: string;
    src: string;
    width: number;
    height: number;
    category?: string;
}

interface NetflixLayoutProps {
    photos: Photo[];
    onPhotoClick: (index: number) => void;
}

export function NetflixLayout({ photos, onPhotoClick }: NetflixLayoutProps) {
    // Grupo as fotos por categoria (falso por enquanto se não houver)
    const groupedPhotos = photos.reduce((acc, photo) => {
        const cat = photo.category || "Todas as Fotos";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(photo);
        return acc;
    }, {} as Record<string, Photo[]>);

    const categories = Object.keys(groupedPhotos);

    return (
        <div className="w-full pb-16">
            {categories.map((category) => (
                <div key={category} className="mb-10 w-full overflow-hidden">
                    <h2 className="px-4 md:px-12 text-xl md:text-2xl font-bold text-white mb-4 tracking-[-0.03em]">
                        {category}
                    </h2>
                    
                    <div className="relative group w-full">
                        {/* Fade edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
                        
                        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 md:px-12 snap-x snap-mandatory">
                            {groupedPhotos[category].map((photo, i) => {
                                const globalIndex = photos.findIndex(p => p.id === photo.id);
                                return (
                                    <div
                                        key={photo.id}
                                        onClick={() => onPhotoClick(globalIndex)}
                                        className="relative flex-shrink-0 w-[240px] md:w-[320px] aspect-[4/5] md:aspect-video rounded-md overflow-hidden cursor-pointer snap-start transition-transform duration-300 hover:scale-105 hover:z-20 group/item"
                                    >
                                        <img
                                            src={photo.src}
                                            alt={category}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">Expandir</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
