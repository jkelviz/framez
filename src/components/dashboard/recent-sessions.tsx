"use client"

import { useState } from "react"
import { Eye, Heart, Copy, Pencil, Plus, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const gradients = [
    "from-orange-900 via-amber-800 to-orange-700",
    "from-rose-900 via-pink-800 to-rose-700",
    "from-violet-900 via-purple-800 to-violet-700",
    "from-cyan-900 via-teal-800 to-cyan-700",
    "from-emerald-900 via-green-800 to-emerald-700",
    "from-indigo-900 via-blue-800 to-indigo-700",
]

export type RecentSessionRow = {
    id: string
    title: string
    client_name: string
    slug: string
    status: string
    view_count: number | null
    created_at: string
    favorites_count?: number
}

function hashGradient(id: string) {
    let h = 0
    for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i)
    return gradients[Math.abs(h) % gradients.length]
}

export function RecentSessions({ sessions }: { sessions: RecentSessionRow[] }) {
    const [hoveredSession, setHoveredSession] = useState<string | null>(null)
    const router = useRouter()

    const handleQuickAction = (action: string) => {
        if (action === "copy-portfolio") {
            navigator.clipboard.writeText(`${window.location.origin}/portfolio`)
            toast.success("Link do portfólio copiado!")
        } else {
            router.push(action)
        }
    }

    const handleCopyLink = (slug: string, id: string) => {
        const path = slug ? `/galeria/${slug}` : `/galeria/${id}`
        navigator.clipboard.writeText(`${window.location.origin}${path}`)
        toast.success("Link copiado!")
    }

    const quickActions = [
        { icon: Plus, label: "Novo Ensaio", primary: true, action: "/ensaios/novo" },
        { icon: LinkIcon, label: "Copiar portfólio", primary: false, action: "copy-portfolio" },
    ]

    const mapped = sessions.map((s) => ({
        ...s,
        client: s.client_name,
        date: new Date(s.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
        views: s.view_count ?? 0,
        favorites: s.favorites_count ?? 0,
        isNew: Date.now() - new Date(s.created_at).getTime() < 604800000,
        gradient: hashGradient(s.id),
    }))

    return (
        <div className="animate-fade-in-up stagger-5">
            <div className="mb-4 grid grid-cols-2 gap-3 md:flex md:w-auto">
                {quickActions.map((action, i) => (
                    <button
                        key={i}
                        onClick={() => handleQuickAction(action.action)}
                        className={cn(
                            "flex items-center justify-center gap-2 rounded-lg border px-4 py-3 md:py-2 min-h-[44px] text-[13px] md:text-xs font-medium tracking-[-0.05em] transition-all duration-200 hover:border-primary",
                            action.primary
                                ? "border-dashed border-primary/50 bg-transparent text-muted-foreground"
                                : "border-border bg-card text-muted-foreground"
                        )}
                    >
                        <action.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{action.label}</span>
                    </button>
                ))}
            </div>

            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground tracking-[-0.05em]">Ensaios Recentes</h3>
                <Link href="/ensaios" className="text-sm font-medium text-muted-foreground tracking-[-0.05em] hover:text-foreground">
                    Ver todos →
                </Link>
            </div>

            {mapped.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum ensaio ainda. Crie o primeiro.</p>
            ) : (
                <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mapped.map((session) => (
                        <div
                            key={session.id}
                            className="group relative aspect-[1/1.2] cursor-pointer overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                            onMouseEnter={() => setHoveredSession(session.id)}
                            onMouseLeave={() => setHoveredSession(null)}
                        >
                            <div className={cn("absolute inset-0 bg-gradient-to-br", session.gradient)} />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                            {session.isNew && (
                                <div className="absolute left-3 top-3 rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground tracking-[-0.05em]">
                                    Novo
                                </div>
                            )}

                            <div
                                className={cn(
                                    "absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[-0.05em]",
                                    session.status === "active"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-gray-500/20 text-gray-400"
                                )}
                            >
                                {session.status === "active" ? "Ativo" : session.status === "draft" ? "Rascunho" : "Arquivado"}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h4 className="text-sm font-medium text-foreground tracking-[-0.05em]">{session.client}</h4>
                                <p className="text-xs text-muted-foreground tracking-[-0.05em]">{session.date}</p>

                                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground tracking-[-0.05em]">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {session.views}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Heart className="h-3 w-3" />
                                        {session.favorites}
                                    </span>
                                </div>

                                <div
                                    className={cn(
                                        "mt-3 flex gap-2 transition-all duration-300",
                                        hoveredSession === session.id ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                                    )}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleCopyLink(session.slug, session.id)
                                        }}
                                        className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[10px] font-medium text-foreground tracking-[-0.05em] backdrop-blur-sm hover:bg-white/20"
                                    >
                                        <Copy className="h-3 w-3" />
                                        Copiar link
                                    </button>
                                    <Link
                                        href={`/ensaios/${session.id}`}
                                        className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[10px] font-medium text-foreground tracking-[-0.05em] backdrop-blur-sm hover:bg-white/20"
                                    >
                                        <Pencil className="h-3 w-3" />
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
