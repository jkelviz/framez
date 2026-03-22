"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react";
import { PasswordGate } from "@/components/gallery/password-gate";
import { SplashScreen } from "@/components/gallery/splash-screen";
import { GridLayout } from "@/components/gallery/grid-layout";
import { CinematicLayout } from "@/components/gallery/cinematic-layout";
import { StoryLayout } from "@/components/gallery/story-layout";
import { FullscreenViewer } from "@/components/gallery/fullscreen-viewer";
import { ReviverSlideshow } from "@/components/gallery/reviver-slideshow";
import { FloatingBar } from "@/components/gallery/floating-bar";
import { createClient } from "@/lib/supabase/client";

export default function GaleriaPage({ params }: { params: { slug: string } }) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showSplash, setShowSplash] = useState(true);
    const [sessionData, setSessionData] = useState<any>(null);
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // Viewer state
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);
    const [showReviver, setShowReviver] = useState(false);

    useEffect(() => {
        async function fetchSession() {
            try {
                // Fetch session by slug
                const { data: session, error: sessionError } = await supabase
                    .from("sessions")
                    .select("*")
                    .eq("slug", params.slug)
                    .single();

                if (sessionError || !session) {
                    console.error("Session not found:", sessionError);
                    setLoading(false);
                    return;
                }

                setSessionData(session);

                // Fetch photos for this session
                const { data: sessionPhotos, error: photosError } = await supabase
                    .from("photos")
                    .select("*")
                    .eq("session_id", session.id)
                    .order("order_index", { ascending: true });

                if (photosError) {
                    console.error("Error fetching photos:", photosError);
                } else {
                    setPhotos(sessionPhotos || []);
                }
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSession();
    }, [params.slug, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-fz-bg-base flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fz-accent"></div>
            </div>
        );
    }

    if (!sessionData) {
        return (
            <div className="min-h-screen bg-fz-bg-base flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-serif text-fz-text-primary mb-4">Galeria não encontrada</h1>
                    <p className="text-fz-text-secondary">Esta galeria não existe ou foi removida.</p>
                </div>
            </div>
        );
    }

    // If no password protection, unlock automatically
    if (!sessionData.password_hash && !isUnlocked) {
        setIsUnlocked(true);
    }

    if (!isUnlocked) {
        return <PasswordGate onSuccess={() => setIsUnlocked(true)} sessionPasswordHash={sessionData.password_hash} />;
    }

    return (
        <div className="min-h-screen bg-fz-bg-base text-fz-text-primary">
            {showSplash && (
                <SplashScreen
                    clientName={sessionData.client_name}
                    onComplete={() => setShowSplash(false)}
                />
            )}

            {/* Header */}
            <header className={`py-12 text-center transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
                <h1 className="font-serif text-5xl mb-2">{sessionData.client_name}</h1>
                <p className="text-fz-text-secondary tracking-widest uppercase text-sm">{sessionData.title || 'Galeria Privada'}</p>
            </header>

            {/* Main Gallery Layout */}
            {!showSplash && (
                <main className="animate-in fade-in duration-1000">
                    {sessionData.style === "grid" && <GridLayout photos={photos} onPhotoClick={setViewerIndex} />}
                    {sessionData.style === "cinematic" && <CinematicLayout photos={photos} onPhotoClick={setViewerIndex} />}
                    {sessionData.style === "story" && <StoryLayout photos={photos} onPhotoClick={setViewerIndex} />}
                    {!sessionData.style && <GridLayout photos={photos} onPhotoClick={setViewerIndex} />}
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
