"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react";
import { PasswordGate } from "@/components/gallery/password-gate";
import { SplashScreen } from "@/components/gallery/splash-screen";
import { GridLayout } from "@/components/gallery/grid-layout";
import { CinematicLayout } from "@/components/gallery/cinematic-layout";
import { StoryLayout } from "@/components/gallery/story-layout";
import { FullscreenViewer } from "@/components/gallery/fullscreen-viewer";
import { ReviverSlideshow } from "@/components/gallery/reviver-slideshow";
import { FloatingBar } from "@/components/gallery/floating-bar";

// Mock photos for the UI
const photos = [
    { id: "1", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop", width: 2069, height: 1379 },
    { id: "2", src: "https://images.unsplash.com/photo-1519225421980-715cb0211a19?q=80&w=2070&auto=format&fit=crop", width: 2070, height: 1380 },
    { id: "3", src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop", width: 2070, height: 1380 },
    { id: "4", src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=2070&auto=format&fit=crop", width: 2070, height: 3105 },
    { id: "5", src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop", width: 2070, height: 1380 },
    { id: "6", src: "https://images.unsplash.com/photo-1541250848049-b4f714612052?q=80&w=2070&auto=format&fit=crop", width: 2070, height: 3105 },
];

export default function GaleriaPage({ params }: { params: { slug: string } }) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    // Viewer state
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);
    const [showReviver, setShowReviver] = useState(false);

    // Mock session data
    const sessionData = {
        clientName: "Maria & João",
        style: "grid" as "grid" | "cinematic" | "story",
    };

    if (!isUnlocked) {
        return <PasswordGate onSuccess={() => setIsUnlocked(true)} />;
    }

    return (
        <div className="min-h-screen bg-fz-bg-base text-fz-text-primary">
            {showSplash && (
                <SplashScreen
                    clientName={sessionData.clientName}
                    onComplete={() => setShowSplash(false)}
                />
            )}

            {/* Header */}
            <header className={`py-12 text-center transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
                <h1 className="font-serif text-5xl mb-2">{sessionData.clientName}</h1>
                <p className="text-fz-text-secondary tracking-widest uppercase text-sm">Casamento na Praia</p>
            </header>

            {/* Main Gallery Layout */}
            {!showSplash && (
                <main className="animate-in fade-in duration-1000">
                    {sessionData.style === "grid" && <GridLayout photos={photos} onPhotoClick={setViewerIndex} />}
                    {sessionData.style === "cinematic" && <CinematicLayout photos={photos} onPhotoClick={setViewerIndex} />}
                    {sessionData.style === "story" && <StoryLayout photos={photos} onPhotoClick={setViewerIndex} />}
                </main>
            )}

            {/* Overlays */}
            {viewerIndex !== null && (
                <FullscreenViewer
                    photos={photos}
                    initialIndex={viewerIndex}
                    onClose={() => setViewerIndex(null)}
                />
            )}

            {showReviver && (
                <ReviverSlideshow
                    photos={photos}
                    onClose={() => setShowReviver(false)}
                />
            )}

            {/* Floating Bar - Only show if not in fullscreen viewers */}
            {viewerIndex === null && !showReviver && !showSplash && (
                <FloatingBar onReviver={() => setShowReviver(true)} />
            )}
        </div>
    );
}
