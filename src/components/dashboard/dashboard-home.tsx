"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getPhotographer } from "@/lib/supabase/photographer"
import { formatRelativeTime, startOfMonth, startOfPreviousMonth } from "@/lib/datetime"
import { PlanBanner } from "@/components/dashboard/plan-banner"
import { StoragePlanCard } from "@/components/dashboard/storage-plan-card"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { VisitsChart } from "@/components/dashboard/visits-chart"
import { RecentSessions } from "@/components/dashboard/recent-sessions"
import { ActivityTimeline } from "@/components/dashboard/activity-timeline"
import { SharedTopBar } from "@/components/dashboard/shared-top-bar"

type SessionRow = {
    id: string
    title: string
    client_name: string
    slug: string
    status: string
    view_count: number | null
    created_at: string
    cover_photo_url: string | null
}

export function DashboardHome() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [photographerName, setPhotographerName] = useState<string | null>(null)
    const [metrics, setMetrics] = useState({
        activeSessions: 0,
        uniqueClients: 0,
        visitsThisMonth: 0,
        visitsPrevMonth: 0,
        photosTotal: 0,
    })
    const [recentSessions, setRecentSessions] = useState<SessionRow[]>([])
    const [chartSessions, setChartSessions] = useState<SessionRow[]>([])
    const [timelineItems, setTimelineItems] = useState<{ id: string; description: string; time: string; color: "orange" | "green" | "blue" }[]>([])

    useEffect(() => {
        let cancelled = false
        async function load() {
            const photographer = await getPhotographer(supabase)
            if (!photographer || cancelled) {
                setLoading(false)
                return
            }
            setPhotographerName(photographer.name)

            const { data: sessions } = await supabase
                .from("sessions")
                .select("id, title, client_name, slug, status, view_count, created_at, cover_photo_url")
                .eq("photographer_id", photographer.id)
                .order("created_at", { ascending: false })

            if (cancelled || !sessions) {
                setLoading(false)
                return
            }

            const sessionIds = sessions.map((s) => s.id)
            let photosCount = 0
            if (sessionIds.length > 0) {
                const { count } = await supabase
                    .from("photos")
                    .select("*", { count: "exact", head: true })
                    .in("session_id", sessionIds)
                photosCount = count ?? 0
            }

            const activeSessions = sessions.filter((s) => s.status === "active").length
            const totalSessions = sessions.length
            const uniqueClients = new Set(sessions.map((s) => s.client_name.trim().toLowerCase())).size

            const monthStart = startOfMonth()
            const prevStart = startOfPreviousMonth()
            const prevEnd = startOfMonth()

            const visitsThisMonth = sessions
                .filter((s) => new Date(s.created_at) >= monthStart)
                .reduce((acc, s) => acc + (s.view_count ?? 0), 0)

            const visitsPrevMonth = sessions
                .filter((s) => {
                    const c = new Date(s.created_at)
                    return c >= prevStart && c < prevEnd
                })
                .reduce((acc, s) => acc + (s.view_count ?? 0), 0)

            setMetrics({
                activeSessions: totalSessions, // Exibiremos o total para não confundir se for rascunho
                uniqueClients,
                visitsThisMonth,
                visitsPrevMonth,
                photosTotal: photosCount,
            })

            setRecentSessions(sessions.slice(0, 6))
            setChartSessions(sessions)

            const sessionById = new Map(sessions.map((s) => [s.id, s]))
            type Ev = {
                id: string
                at: number
                description: string
                color: "orange" | "green" | "blue"
            }
            const events: Ev[] = []
            for (const s of sessions.slice(0, 8)) {
                events.push({
                    id: `s-${s.id}`,
                    at: new Date(s.created_at).getTime(),
                    description: `Ensaio criado: ${s.title}`,
                    color: "orange",
                })
            }

            if (sessionIds.length > 0) {
                const { data: photoRows } = await supabase
                    .from("photos")
                    .select("id, created_at, session_id, is_favorite")
                    .in("session_id", sessionIds)
                    .order("created_at", { ascending: false })
                    .limit(20)

                for (const p of photoRows ?? []) {
                    const title = sessionById.get(p.session_id)?.title ?? "Ensaio"
                    events.push({
                        id: `p-${p.id}`,
                        at: new Date(p.created_at).getTime(),
                        description: p.is_favorite
                            ? `Foto favoritada — ${title}`
                            : `Foto adicionada — ${title}`,
                        color: p.is_favorite ? "green" : "blue",
                    })
                }
            }

            events.sort((a, b) => b.at - a.at)
            setTimelineItems(
                events.slice(0, 8).map((e) => ({
                    id: e.id,
                    description: e.description,
                    time: formatRelativeTime(new Date(e.at).toISOString()),
                    color: e.color,
                }))
            )

            setLoading(false)
        }
        load()
        return () => {
            cancelled = true
        }
    }, [supabase])

    const greeting = () => {
        const h = new Date().getHours()
        if (h < 12) return "Bom dia"
        if (h < 18) return "Boa tarde"
        return "Boa noite"
    }

    if (loading) {
        return (
            <div className="flex flex-col w-full min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#E85D24]" />
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full">
            <SharedTopBar
                title="Dashboard"
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
                <h2 className="text-[24px] font-semibold tracking-[-0.05em] text-[#F5F5F0] animate-fade-in-up">
                    {greeting()}
                    {photographerName ? `, ${photographerName.split(" ")[0]}` : ""}
                </h2>

                <PlanBanner />

                <StoragePlanCard />

                <MetricsCards
                    activeSessions={metrics.activeSessions}
                    uniqueClients={metrics.uniqueClients}
                    visitsThisMonth={metrics.visitsThisMonth}
                    visitsPrevMonth={metrics.visitsPrevMonth}
                    photosTotal={metrics.photosTotal}
                />

                <VisitsChart sessions={chartSessions} />

                <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
                    <RecentSessions sessions={recentSessions} />
                    <ActivityTimeline items={timelineItems} />
                </div>
            </div>
        </div>
    )
}
