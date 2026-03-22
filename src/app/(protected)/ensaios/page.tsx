"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Plus, Search, ChevronDown, Eye, Users, Clock, Camera, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { SessionCard } from "@/components/framez/session-card"
import { createClient } from "@/lib/supabase/client"
import { getPhotographer } from "@/lib/supabase/photographer"
import { cn } from "@/lib/utils"
import { SharedTopBar } from "@/components/dashboard/shared-top-bar"

const sortOptions = [
    { id: "date-desc", label: "Data (recente)" },
    { id: "date-asc", label: "Data (antiga)" },
    { id: "views", label: "Mais visitados" },
    { id: "name", label: "Nome A-Z" },
]

type DbSession = {
    id: string
    title: string
    client_name: string
    slug: string
    status: string
    view_count: number | null
    created_at: string
}

export default function EnsaiosPage() {
    const supabase = createClient()
    const [sessions, setSessions] = useState<DbSession[]>([])
    const [favoritesBySession, setFavoritesBySession] = useState<Record<string, number>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false
        async function fetchSessions() {
            setLoadError(null)
            const photographer = await getPhotographer(supabase)
            if (!photographer) {
                if (!cancelled) {
                    setLoadError("Perfil de fotógrafo não encontrado.")
                    setIsLoading(false)
                }
                return
            }

            const { data, error } = await supabase
                .from("sessions")
                .select("id, title, client_name, slug, status, view_count, created_at")
                .eq("photographer_id", photographer.id)
                .order("created_at", { ascending: false })

            if (error) {
                if (!cancelled) {
                    setLoadError(error.message)
                    setIsLoading(false)
                }
                return
            }

            const rows = (data ?? []) as DbSession[]
            if (!cancelled) setSessions(rows)

            const ids = rows.map((r) => r.id)
            if (ids.length > 0) {
                const { data: photos } = await supabase.from("photos").select("session_id, is_favorite").in("session_id", ids)
                const favMap: Record<string, number> = {}
                for (const p of photos ?? []) {
                    if (p.is_favorite) {
                        favMap[p.session_id] = (favMap[p.session_id] ?? 0) + 1
                    }
                }
                if (!cancelled) setFavoritesBySession(favMap)
            }

            if (!cancelled) setIsLoading(false)
        }
        fetchSessions()
        return () => {
            cancelled = true
        }
    }, [supabase])

    const [activeFilter, setActiveFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("date-desc")
    const [showSortDropdown, setShowSortDropdown] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const statusCounts = useMemo(() => {
        const all = sessions.length
        const active = sessions.filter((s) => s.status === "active").length
        const draft = sessions.filter((s) => s.status === "draft").length
        const archived = sessions.filter((s) => s.status === "archived").length
        return { all, active, draft, archived }
    }, [sessions])

    const statusFilters = [
        { id: "all", label: "Todos", count: statusCounts.all },
        { id: "active", label: "Ativos", count: statusCounts.active },
        { id: "draft", label: "Rascunhos", count: statusCounts.draft },
        { id: "archived", label: "Arquivados", count: statusCounts.archived },
    ]

    const filteredSessions = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        let list = sessions.filter((session) => {
            const matchesFilter = activeFilter === "all" || session.status === activeFilter
            const title = (session.title || "").toLowerCase()
            const client = (session.client_name || "").toLowerCase()
            const matchesSearch = !q || client.includes(q) || title.includes(q)
            return matchesFilter && matchesSearch
        })

        list = [...list].sort((a, b) => {
            if (sortBy === "date-desc") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            if (sortBy === "date-asc") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            if (sortBy === "views") return (b.view_count ?? 0) - (a.view_count ?? 0)
            if (sortBy === "name") return (a.client_name || "").localeCompare(b.client_name || "", "pt-BR")
            return 0
        })

        return list
    }, [sessions, activeFilter, searchQuery, sortBy])

    const pageSize = 12
    const totalPages = Math.max(1, Math.ceil(filteredSessions.length / pageSize))
    const pageSlice = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filteredSessions.slice(start, start + pageSize)
    }, [filteredSessions, currentPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [activeFilter, searchQuery, sortBy])

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages)
    }, [currentPage, totalPages])

    const uniqueClients = useMemo(() => new Set(sessions.map((s) => s.client_name.trim().toLowerCase())).size, [sessions])
    const totalViews = useMemo(() => sessions.reduce((acc, s) => acc + (s.view_count ?? 0), 0), [sessions])
    const lastSession = sessions[0]

    const toCardSession = (d: DbSession, index: number) => {
        const created = new Date(d.created_at)
        const gradientType =
            d.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 6
        return {
            id: d.id,
            slug: d.slug,
            clientName: d.client_name,
            title: d.title,
            date: created.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
            views: d.view_count ?? 0,
            favorites: favoritesBySession[d.id] ?? 0,
            status: d.status as "active" | "draft" | "archived",
            gradientType,
            isNew: Date.now() - created.getTime() < 604800000,
        }
    }

    const hasNoSessionsEver = !isLoading && sessions.length === 0
    const hasNoMatches = !isLoading && sessions.length > 0 && filteredSessions.length === 0

    return (
        <div className="flex flex-col w-full">
            <SharedTopBar
                title="Ensaios"
                actionButton={
                    <Link
                        href="/ensaios/novo"
                        className="flex items-center justify-center gap-2 rounded-full md:rounded-lg bg-gradient-to-r from-[#E85D24] to-[#F5A623] h-10 w-10 md:h-auto md:w-auto md:px-4 md:py-2 text-[14px] font-medium text-white shadow-[0_0_20px_rgba(232,93,36,0.3)] transition-all duration-150 md:duration-300 hover:shadow-[0_0_30px_rgba(232,93,36,0.4)] animate-gradient shrink-0 active:scale-[0.98] active:opacity-90"
                    >
                        <Plus className="h-5 w-5 md:h-4 md:w-4 shrink-0" />
                        <span className="hidden md:inline">Novo Ensaio</span>
                    </Link>
                }
            />

            <div className="mx-auto w-full max-w-[1200px] px-4 py-5 md:p-8 flex flex-col space-y-5 md:space-y-6">
                {loadError && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{loadError}</div>
                )}

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex w-full overflow-x-auto pb-1 items-center gap-2 hide-scrollbar">
                        {statusFilters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={cn(
                                    "rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-150 whitespace-nowrap active:scale-[0.98] active:opacity-90",
                                    activeFilter === filter.id
                                        ? "bg-[#E85D24] text-white"
                                        : "bg-[#161616] text-[#888880] md:hover:bg-[#1a1a1a] hover:text-[#F5F5F0]"
                                )}
                            >
                                {filter.label} <span className="hidden md:inline">({filter.count})</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888880]" />
                            <input
                                type="text"
                                placeholder="Buscar por cliente ou título..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-11 md:h-10 w-full md:w-[280px] rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#161616] pl-10 pr-4 text-[16px] md:text-[13px] text-[#F5F5F0] placeholder:text-[#888880] transition-colors focus:border-[rgba(232,93,36,0.4)] focus:outline-none"
                            />
                        </div>

                        <div className="relative w-full md:w-auto">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="flex w-full justify-between md:justify-start h-11 md:h-10 items-center gap-2 rounded-lg bg-[#161616] px-4 text-[14px] md:text-[13px] text-[#888880] transition-colors hover:text-[#F5F5F0]"
                            >
                                Ordenar por: {sortOptions.find((o) => o.id === sortBy)?.label}
                                <ChevronDown className={cn("h-4 w-4 transition-transform", showSortDropdown && "rotate-180")} />
                            </button>
                            {showSortDropdown && (
                                <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#161616] py-1 shadow-xl">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                setSortBy(option.id)
                                                setShowSortDropdown(false)
                                            }}
                                            className={cn(
                                                "w-full px-4 py-2 text-left text-[13px] transition-colors hover:bg-[#1a1a1a]",
                                                sortBy === option.id ? "text-[#E85D24]" : "text-[#888880]"
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex min-h-[48px] items-center justify-between rounded-[10px] bg-[#111111] p-4 md:px-5">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6 md:flex w-full md:items-center md:gap-6 text-[13px]">
                        <span className="text-[#888880]">
                            <span className="text-[#F5F5F0]">{sessions.length}</span> ensaios
                        </span>
                        <div className="hidden md:block h-4 w-px bg-[rgba(255,255,255,0.07)]" />
                        <span className="flex items-center gap-1.5 text-[#888880]">
                            <Eye className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-[#F5F5F0]">{totalViews.toLocaleString("pt-BR")}</span> visitas
                        </span>
                        <div className="hidden md:block h-4 w-px bg-[rgba(255,255,255,0.07)]" />
                        <span className="flex items-center gap-1.5 text-[#888880]">
                            <Users className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-[#F5F5F0]">{uniqueClients}</span> clientes
                        </span>
                        <div className="hidden md:block h-4 w-px bg-[rgba(255,255,255,0.07)]" />
                        <span className="flex items-center gap-1.5 text-[#888880] whitespace-nowrap">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            Último:{" "}
                            <span className="text-[#F5F5F0]">
                                {lastSession
                                    ? new Date(lastSession.created_at).toLocaleDateString("pt-BR", {
                                          day: "2-digit",
                                          month: "short",
                                      })
                                    : "—"}
                            </span>
                        </span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="mt-16 flex flex-col items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 text-[#E85D24] animate-spin" />
                        <h3 className="mt-6 text-[20px] font-medium text-[#F5F5F0]">Carregando ensaios...</h3>
                    </div>
                ) : hasNoSessionsEver ? (
                    <div className="mt-16 flex flex-col items-center justify-center py-16">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(232,93,36,0.1)]">
                            <Camera className="h-8 w-8 text-[#E85D24]" />
                        </div>
                        <h3 className="mt-6 text-[20px] font-medium text-[#F5F5F0]">Crie seu primeiro ensaio</h3>
                        <p className="mt-2 text-[14px] text-[#888880] text-center max-w-md">
                            Você ainda não tem ensaios. Comece agora e compartilhe suas galerias com os clientes.
                        </p>
                        <Link
                            href="/ensaios/novo"
                            className="mt-6 flex items-center gap-2 rounded-lg bg-[#E85D24] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#D14D14]"
                        >
                            <Plus className="h-4 w-4" />
                            Criar primeiro ensaio
                        </Link>
                    </div>
                ) : hasNoMatches ? (
                    <div className="mt-16 flex flex-col items-center justify-center py-16">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(232,93,36,0.1)]">
                            <Camera className="h-8 w-8 text-[#E85D24]" />
                        </div>
                        <h3 className="mt-6 text-[20px] font-medium text-[#F5F5F0]">Nenhum ensaio encontrado</h3>
                        <p className="mt-2 text-[14px] text-[#888880]">Tente ajustar os filtros ou a busca.</p>
                        <Link
                            href="/ensaios/novo"
                            className="mt-6 flex items-center gap-2 rounded-lg bg-[#E85D24] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#D14D14]"
                        >
                            <Plus className="h-4 w-4" />
                            Novo ensaio
                        </Link>
                    </div>
                ) : (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {pageSlice.map((session, index) => (
                            <SessionCard key={session.id} session={toCardSession(session, index)} index={index} />
                        ))}
                    </div>
                )}

                {!isLoading && !hasNoSessionsEver && filteredSessions.length > 0 && (
                    <div className="mt-8 flex items-center justify-between">
                        <span className="text-[13px] text-[#888880]">
                            Exibindo {(currentPage - 1) * pageSize + 1}-
                            {Math.min(currentPage * pageSize, filteredSessions.length)} de {filteredSessions.length} ensaios
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] text-[#888880] transition-colors hover:bg-[#161616] hover:text-[#F5F5F0] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-4 w-4 shrink-0" />
                                <span className="hidden md:inline">Anterior</span>
                            </button>
                            <div className="hidden md:flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium transition-colors",
                                            currentPage === page
                                                ? "bg-[#E85D24] text-white"
                                                : "text-[#888880] hover:bg-[#161616] hover:text-[#F5F5F0]"
                                        )}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] text-[#888880] transition-colors hover:bg-[#161616] hover:text-[#F5F5F0] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="hidden md:inline">Próxima</span>
                                <ChevronRight className="h-4 w-4 shrink-0" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
