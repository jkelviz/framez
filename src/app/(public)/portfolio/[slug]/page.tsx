"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PortfolioPage({ params }: { params: { slug: string } }) {
    // Mock data
    const photographer = {
        name: "John Doe Photography",
        bio: "Capturando momentos inesquecíveis com um olhar cinematográfico. Especialista em casamentos e ensaios de casais.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&auto=format&fit=crop",
    };

    const sessions = [
        { id: "1", title: "Casamento Praia", slug: "casamento-praia-m-j", cover: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop" },
        { id: "2", title: "Ensaio Gestante", slug: "gestante-ana", cover: "https://images.unsplash.com/photo-1519225421980-715cb0211a19?q=80&w=800&auto=format&fit=crop" },
    ];

    return (
        <div className="min-h-screen bg-fz-bg-base text-fz-text-primary pb-20">
            {/* Header */}
            <header className="pt-20 pb-12 px-4 flex flex-col items-center text-center border-b border-fz-border bg-fz-bg-card">
                <img src={photographer.avatar} alt={photographer.name} className="w-32 h-32 rounded-full object-cover border-4 border-fz-bg-elevated mb-6" />
                <h1 className="font-serif text-5xl mb-4">{photographer.name}</h1>
                <p className="text-fz-text-secondary max-w-lg text-lg leading-relaxed">{photographer.bio}</p>
                <Button className="mt-8 bg-fz-accent hover:bg-fz-accent-hover text-white rounded-full px-8">
                    Entrar em Contato
                </Button>
            </header>

            {/* Portfolio Grid */}
            <main className="max-w-6xl mx-auto px-4 py-16">
                <h2 className="font-serif text-3xl mb-8 text-center">Ensaios em Destaque</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sessions.map((session) => (
                        <Link href={`/galeria/${session.slug}`} key={session.id} className="group block">
                            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-fz-bg-elevated border border-fz-border">
                                <img
                                    src={session.cover}
                                    alt={session.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 p-6 w-full transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                                    <h3 className="font-serif text-2xl text-white mb-1">{session.title}</h3>
                                    <div className="h-0.5 w-12 bg-fz-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
