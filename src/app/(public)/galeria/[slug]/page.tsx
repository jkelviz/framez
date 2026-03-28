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

    // Calculate counts
    const favoritesCount = photos.filter(p => p.is_favorite).length;
    const selectedCount = photos.filter(p => p.is_selected).length;

    // Get hero photo
    const heroPhoto = sessionData?.cover_photo_url || photos[0]?.src;

    const handleDownloadSelected = async () => {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        const selectedPhotos = photos.filter(p => p.is_selected);
        
        for (let i = 0; i < selectedPhotos.length; i++) {
            try {
                const response = await fetch(selectedPhotos[i].src);
                const blob = await response.blob();
                zip.file(`foto-${i+1}.jpg`, blob);
            } catch (error) {
                console.error('Error downloading photo:', error);
            }
        }
        
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fotos-selecionadas.zip';
        a.click();
        URL.revokeObjectURL(url);
    };

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

                // Increment view count
                // TODO: Create increment_view_count RPC function in Supabase
                console.log('View count increment skipped - RPC not available yet');

                // Fetch photos for this session
                const { data: sessionPhotos, error: photosError } = await supabase
                    .from("photos")
                    .select("*")
                    .eq("session_id", session.id)
                    .order("order_index", { ascending: true });

                if (photosError) {
                    console.error("Error fetching photos:", photosError);
                } else {
                    // Map photos to expected format
                    const mappedPhotos = (sessionPhotos || []).map(p => ({
                        ...p,
                        src: p.url,
                        width: p.width || 800,
                        height: p.height || 600,
                    }));
                    setPhotos(mappedPhotos);
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
            <header className={`py-12 text-center transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    backgroundImage: heroPhoto 
                        ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${heroPhoto})`
                        : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent py-12">
                    <h1 className="font-serif text-5xl mb-2">{sessionData.client_name}</h1>
                    <p className="text-fz-text-secondary tracking-widest uppercase text-sm">{sessionData.title || 'Galeria Privada'}</p>
                </div>
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
                    onPhotoUpdate={(photoId, updates) => {
                        setPhotos(prev => prev.map(p => p.id === photoId ? {...p, ...updates} : p))
                    }}
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
                <FloatingBar 
                    onReviver={() => setShowReviver(true)} 
                    favoritesCount={favoritesCount}
                    selectedCount={selectedCount}
                    onDownloadSelected={handleDownloadSelected}
                />
            )}
        </div>
    );
}
