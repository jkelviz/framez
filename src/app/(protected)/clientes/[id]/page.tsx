"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ClientDetail } from "@/components/dashboard/client-detail"
import { createClient } from "@/lib/supabase/client"
import { getPhotographer } from "@/lib/supabase/photographer"
import { formatRelativeTime } from "@/lib/datetime"
import { Loader2 } from "lucide-react"

const coverGradients = [
    "bg-gradient-to-br from-amber-900/60 via-orange-800/40 to-rose-900/50",
    "bg-gradient-to-br from-violet-900/60 via-purple-800/40 to-fuchsia-900/50",
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

export default function ClientRoute({ params }: { params: { id: string } }) {
    const router = useRouter()
    const supabase = createClient()
    const clientName = decodeURIComponent(params.id)
    const [loading, setLoading] = useState(true)
    const [client, setClient] = useState<Parameters<typeof ClientDetail>[0]["client"] | null>(null)
    const [sessions, setSessions] = useState<Parameters<typeof ClientDetail>[0]["sessions"]>([])
    const [activities, setActivities] = useState<Parameters<typeof ClientDetail>[0]["activities"]>([])

    useEffect(() => {
        let cancelled = false
        async function load() {
            const photographer = await getPhotographer(supabase)
            if (!photographer || cancelled) {
                setLoading(false)
                return
            }

            const { data: sess } = await supabase
                .from("sessions")
                .select("id, slug, title, client_name, status, view_count, created_at, style")
                .eq("photographer_id", photographer.id)
                .eq("client_name", clientName)
                .order("created_at", { ascending: false })

            if (cancelled || !sess?.length) {
                setLoading(false)
                return
            }

            const ids = sess.map((s) => s.id)
            const { data: photos } = await supabase.from("photos").select("session_id, is_favorite").in("session_id", ids)

            const favBySession = new Map<string, number>()
            for (const p of photos ?? []) {
                if (p.is_favorite) favBySession.set(p.session_id, (favBySession.get(p.session_id) ?? 0) + 1)
            }

            const totalVisits = sess.reduce((a, s) => a + (s.view_count ?? 0), 0)
            const totalFav = Array.from(favBySession.values()).reduce((a, b) => a + b, 0)
            const sorted = [...sess].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            const oldest = sorted[0]

            setClient({
                id: params.id,
                name: clientName,
                initials: initialsFromName(clientName),
                memberSince: new Date(oldest.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }),
                tags: [],
                sessionsCount: sess.length,
                totalVisits,
                favoritePhotos: totalFav,
                lastAccess: formatRelativeTime(sess[0].created_at),
            })

            const styleMap: Record<string, "Grid" | "Cinematic" | "Story"> = {
                grid: "Grid",
                cinematic: "Cinematic",
                story: "Story",
            }

            setSessions(
                sess.map((s) => ({
                    id: s.id,
                    slug: s.slug,
                    title: s.title,
                    date: new Date(s.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                    style: styleMap[s.style ?? "grid"] ?? "Grid",
                    thumbnail: hashPick(s.id, coverGradients),
                    views: s.view_count ?? 0,
                    favorites: favBySession.get(s.id) ?? 0,
                    downloads: 0,
                    status: s.status === "active" ? "published" : "draft",
                }))
            )

            setActivities(
                sess.slice(0, 6).map((s, i) => ({
                    id: s.id,
                    action: `Ensaio: ${s.title}`,
                    time: formatRelativeTime(s.created_at),
                }))
            )

            setLoading(false)
        }
        load()
        return () => {
            cancelled = true
        }
    }, [supabase, clientName, params.id])

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#E85D24]" />
            </div>
        )
    }

    if (!client) {
        return (
            <div className="p-8 text-center text-[#888880]">
                Cliente não encontrado.{" "}
                <button type="button" className="text-[#E85D24] underline" onClick={() => router.push("/clientes")}>
                    Voltar
                </button>
            </div>
        )
    }

    return (
        <ClientDetail
            client={client}
            sessions={sessions}
            activities={activities}
            onBack={() => router.push("/clientes")}
        />
    )
}
