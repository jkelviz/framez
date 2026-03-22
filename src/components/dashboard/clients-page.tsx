"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClientCard } from "./client-card"
import { SharedTopBar } from "@/components/dashboard/shared-top-bar"
import { createClient } from "@/lib/supabase/client"
import { getPhotographer } from "@/lib/supabase/photographer"
import { formatRelativeTime } from "@/lib/datetime"
import { Loader2 } from "lucide-react"

const coverGradients = [
    "bg-gradient-to-br from-amber-900/60 via-orange-800/40 to-rose-900/50",
    "bg-gradient-to-br from-violet-900/60 via-purple-800/40 to-fuchsia-900/50",
    "bg-gradient-to-br from-slate-800/60 via-zinc-700/40 to-gray-800/50",
    "bg-gradient-to-br from-rose-900/60 via-pink-800/40 to-red-900/50",
    "bg-gradient-to-br from-teal-900/60 via-emerald-800/40 to-cyan-900/50",
    "bg-gradient-to-br from-indigo-900/60 via-blue-800/40 to-sky-900/50",
]

function hashPick(s: string, arr: string[]) {
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
    return arr[Math.abs(h) % arr.length]
}

function initialsFromName(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase()
    return name.slice(0, 2).toUpperCase() || "?"
}

type FilterStatus = "all" | "active" | "inactive"

type ClientRow = {
    id: string
    name: string
    initials: string
    status: "active" | "inactive"
    sessionsCount: number
    totalVisits: number
    favoritePhotos: number
    lastAccess: string
    lastSessionAt: string
    phone?: string
    email?: string
    memberSince: string
    tags: string[]
    coverGradient: string
}

export function ClientsPage() {
    const supabase = createClient()
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
    const [clients, setClients] = useState<ClientRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        async function load() {
            setError(null)
            const photographer = await getPhotographer(supabase)
            if (!photographer) {
                if (!cancelled) {
                    setError("Perfil de fotógrafo não encontrado.")
                    setLoading(false)
                }
                return
            }

            const { data: sessions, error: se } = await supabase
                .from("sessions")
                .select("id, client_name, view_count, status, created_at")
                .eq("photographer_id", photographer.id)

            if (se || !sessions) {
                if (!cancelled) {
                    setError(se?.message ?? "Erro ao carregar")
                    setLoading(false)
                }
                return
            }

            const sessionIds = sessions.map((s) => s.id)
            let photoRows: { session_id: string; is_favorite: boolean }[] = []
            if (sessionIds.length > 0) {
                const { data: photos } = await supabase.from("photos").select("session_id, is_favorite").in("session_id", sessionIds)
                photoRows = photos ?? []
            }

            const sessionToClient = new Map<string, string>()
            for (const s of sessions) {
                sessionToClient.set(s.id, s.client_name)
            }

            const favByClient = new Map<string, number>()
            for (const p of photoRows) {
                if (!p.is_favorite) continue
                const cn = sessionToClient.get(p.session_id)
                if (!cn) continue
                favByClient.set(cn, (favByClient.get(cn) ?? 0) + 1)
            }

            type SessionRow = (typeof sessions)[number]
            const byName = new Map<string, SessionRow[]>()
            for (const s of sessions) {
                const key = s.client_name.trim()
                if (!byName.has(key)) byName.set(key, [])
                byName.get(key)!.push(s)
            }

            const rows: ClientRow[] = []
            for (const name of Array.from(byName.keys())) {
                const sess = byName.get(name)
                if (!sess?.length) continue
                const totalVisits = sess.reduce((a: number, s: SessionRow) => a + (s.view_count ?? 0), 0)
                const sorted = [...sess].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                const last = sorted[0]
                const oldest = [...sess].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]
                const allArchived = sess.every((s: SessionRow) => s.status === "archived")
                rows.push({
                    id: encodeURIComponent(name),
                    name,
                    initials: initialsFromName(name),
                    status: allArchived ? "inactive" : "active",
                    sessionsCount: sess.length,
                    totalVisits,
                    favoritePhotos: favByClient.get(name) ?? 0,
                    lastAccess: formatRelativeTime(last.created_at),
                    lastSessionAt: last.created_at,
                    memberSince: new Date(oldest.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }),
                    tags: [],
                    coverGradient: hashPick(name, coverGradients),
                })
            }

            rows.sort((a, b) => b.totalVisits - a.totalVisits)

            if (!cancelled) {
                setClients(rows)
                setLoading(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [supabase])

    const filteredClients = clients.filter((client) => {
        const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter =
            filterStatus === "all" ||
            (filterStatus === "active" && client.status === "active") ||
            (filterStatus === "inactive" && client.status === "inactive")
        return matchesSearch && matchesFilter
    })

    // Debug logging
    console.log('Clients data:', clients)
    console.log('Filtered clients:', filteredClients)
    console.log('Loading:', loading)

    const totalClients = clients.length
    const totalSessions = clients.reduce((acc, c) => acc + c.sessionsCount, 0)
    const totalFavorites = clients.reduce((acc, c) => acc + c.favoritePhotos, 0)
    const lastAccessLabel =
        clients.length > 0
            ? formatRelativeTime(
                  clients.reduce((a, b) => (a.lastSessionAt > b.lastSessionAt ? a : b)).lastSessionAt
              )
            : "—"

    if (loading) {
        return (
            <div className="flex flex-col w-full min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#E85D24]" />
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full dashboard-page animate-fade-in-up">
            <SharedTopBar title="Clientes" />

            <div className="mx-auto w-full max-w-[1200px] p-4 md:p-8">
                {error && (
                    <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
                )}

                <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-[10px] w-full min-h-[56px] px-4 flex items-center justify-around divide-x divide-[rgba(255,255,255,0.08)] mb-6 animate-fade-in-up">
                    <StatItem num={totalClients.toString()} labelDesktop="clientes" labelMobile="clientes" />
                    <StatItem num={totalSessions.toString()} labelDesktop="ensaios" labelMobile="ensaios" />
                    <StatItem num={totalFavorites.toLocaleString("pt-BR")} labelDesktop="fotos favoritadas" labelMobile="favoritas" />
                    <StatItem num={lastAccessLabel} labelDesktop="Último acesso" labelMobile="acesso" />
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888880]" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-[300px] h-11 md:h-10 pl-10 pr-4 text-[16px] md:text-sm rounded-lg bg-[#161616] border border-[rgba(255,255,255,0.07)] text-[#F5F5F0] tracking-[-0.05em] placeholder:text-[#888880] focus:outline-none focus:border-[#E85D24]/50 transition-colors"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 md:items-center">
                        <button
                            type="button"
                            className="flex items-center justify-between md:justify-start gap-2 h-11 md:h-10 px-3 py-2 rounded-lg bg-[#161616] border border-[rgba(255,255,255,0.07)] text-[#888880] text-[14px] md:text-sm tracking-[-0.05em] hover:border-[rgba(255,255,255,0.15)] transition-colors"
                        >
                            Ordenar por: Visitas
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#161616]">
                            {(["all", "active", "inactive"] as FilterStatus[]).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-md text-sm font-medium tracking-[-0.05em] transition-all",
                                        filterStatus === status ? "bg-[#E85D24] text-white" : "text-[#888880] hover:text-[#F5F5F0]"
                                    )}
                                >
                                    {status === "all" ? "Todos" : status === "active" ? "Ativos" : "Inativos"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredClients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredClients.map((client, index) => (
                            <ClientCard key={client.id} client={client} index={index} onViewSessions={() => {}} />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    )
}

function StatItem({ num, labelDesktop, labelMobile }: { num: string; labelDesktop: string; labelMobile: string }) {
    return (
        <div className="flex flex-col md:flex-row flex-1 items-center justify-center md:gap-1.5 w-full py-2 md:py-0">
            <span className="text-[18px] md:text-[13px] font-bold md:font-medium text-white md:text-[#F5F5F0] tracking-[-0.05em] leading-none mb-1 md:mb-0">
                {num}
            </span>
            <span className="hidden md:inline text-[13px] text-[#888880] tracking-[-0.05em] leading-none">{labelDesktop}</span>
            <span className="md:hidden text-[11px] font-medium text-[#888880] tracking-[-0.02em] leading-none">{labelMobile}</span>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-full bg-[#E85D24]/10 flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-[#E85D24]" />
            </div>
            <h3 className="text-[#F5F5F0] text-xl font-medium tracking-[-0.05em] mb-2">Nenhum cliente ainda</h3>
            <p className="text-[#888880] text-sm tracking-[-0.05em] text-center max-w-sm">
                Seus clientes aparecerão aqui automaticamente após criar o primeiro ensaio
            </p>
        </div>
    )
}
