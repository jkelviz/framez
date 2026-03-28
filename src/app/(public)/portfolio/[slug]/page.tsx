"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Camera, Instagram, Loader2 } from "lucide-react";

interface Photographer {
    name: string;
    bio: string | null;
    avatar_url: string | null;
    slug: string;
}

interface Session {
    id: string;
    title: string;
    slug: string;
    cover_photo_url: string | null;
}

export default function PortfolioPage({ params }: { params: { slug: string } }) {
    const supabase = createClient();
    const [photographer, setPhotographer] = useState<Photographer | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchData() {
            // Fetch photographer by slug
            const { data: photographerData, error } = await supabase
                .from("photographers")
                .select("name, bio, avatar_url, slug")
                .eq("slug", params.slug)
                .single();

            if (error || !photographerData) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            setPhotographer(photographerData);

            // Fetch photographer id
            const { data: fullData } = await supabase
                .from("photographers")
                .select("id")
                .eq("slug", params.slug)
                .single();

            if (fullData) {
                // Fetch sessions marked for portfolio
                const { data: sessionData } = await supabase
                    .from("sessions")
                    .select("id, title, slug, cover_photo_url")
                    .eq("photographer_id", fullData.id)
                    .eq("status", "active")
                    .order("created_at", { ascending: false })
                    .limit(12);

                setSessions(sessionData ?? []);
            }

            setLoading(false);
        }

        fetchData();
    }, [params.slug, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#E85D24]" />
            </div>
        );
    }

    if (notFound || !photographer) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-4">
                <Camera className="h-16 w-16 text-[#E85D24] mb-6 opacity-50" />
                <h1 className="text-2xl font-semibold text-[#F5F5F0] mb-2">Portfólio não encontrado</h1>
                <p className="text-[#888880] mb-8">Este fotógrafo ainda não possui portfólio público.</p>
                <Link href="/" className="text-[#E85D24] hover:underline">
                    Voltar ao início
                </Link>
            </div>
        );
    }

    const initials = photographer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] pb-20">
            {/* Header */}
            <header className="pt-20 pb-12 px-4 flex flex-col items-center text-center border-b border-[rgba(255,255,255,0.05)]">
                {photographer.avatar_url ? (
                    <img
                        src={photographer.avatar_url}
                        alt={photographer.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-[rgba(255,255,255,0.1)] mb-6"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E85D24] to-[#FF7A45] flex items-center justify-center border-4 border-[rgba(255,255,255,0.1)] mb-6">
                        <span className="text-white text-2xl font-semibold">{initials}</span>
                    </div>
                )}
                <h1 className="font-medium tracking-tighter text-3xl md:text-4xl text-[#F5F5F0] mb-3">
                    {photographer.name}
                </h1>
                {photographer.bio && (
                    <p className="text-[#888880] max-w-lg text-base leading-relaxed">
                        {photographer.bio}
                    </p>
                )}
                <Link
                    href="/cadastro"
                    className="mt-8 bg-[#E85D24] hover:bg-[#d14f1c] text-white px-8 py-3 rounded-full font-medium transition-colors"
                >
                    Entrar em Contato
                </Link>
            </header>

            {/* Portfolio Grid */}
            <main className="max-w-6xl mx-auto px-4 py-16">
                <h2 className="font-medium tracking-tighter text-2xl md:text-3xl text-[#F5F5F0] mb-8 text-center">
                    Ensaios em Destaque
                </h2>

                {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Camera className="h-12 w-12 text-[#E85D24] mb-4 opacity-50" />
                        <p className="text-[#888880]">Nenhum ensaio público disponível ainda.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessions.map((session) => (
                            <Link
                                href={`/galeria/${session.slug}`}
                                key={session.id}
                                className="group block"
                            >
                                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#111111] border border-[rgba(255,255,255,0.07)]">
                                    {session.cover_photo_url ? (
                                        <img
                                            src={session.cover_photo_url}
                                            alt={session.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Camera className="h-10 w-10 text-[#333]" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 p-5 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-white font-medium text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {session.title}
                                        </h3>
                                        <div className="h-0.5 w-10 bg-[#E85D24] mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-[#888880] tracking-tight">{session.title}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
