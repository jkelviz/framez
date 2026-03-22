"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"

const periods = ["7 dias", "30 dias", "3 meses"]

type ChartSession = {
    id: string
    view_count: number | null
    created_at: string
}

function buildDataset(period: string, sessions: ChartSession[]) {
    const sorted = [...sessions].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    const now = Date.now()
    const dayMs = 86400000

    if (period === "7 dias") {
        const points: { date: string; visits: number; favorites: number }[] = []
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(now - i * dayMs)
            dayStart.setHours(0, 0, 0, 0)
            const dayEnd = new Date(dayStart.getTime() + dayMs)
            const sum = sorted
                .filter((s) => {
                    const t = new Date(s.created_at).getTime()
                    return t >= dayStart.getTime() && t < dayEnd.getTime()
                })
                .reduce((acc, s) => acc + (s.view_count ?? 0), 0)
            points.push({
                date: dayStart.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
                visits: sum,
                favorites: 0,
            })
        }
        if (points.every((p) => p.visits === 0) && sorted.length) {
            const last7 = sorted.slice(-7)
            return last7.map((s) => ({
                date: new Date(s.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
                visits: s.view_count ?? 0,
                favorites: 0,
            }))
        }
        return points.length ? points : [{ date: "—", visits: 0, favorites: 0 }]
    }

    if (period === "30 dias") {
        const points: { date: string; visits: number; favorites: number }[] = []
        for (let w = 3; w >= 0; w--) {
            const end = now - w * 7 * dayMs
            const start = end - 7 * dayMs
            const sum = sorted
                .filter((s) => {
                    const t = new Date(s.created_at).getTime()
                    return t >= start && t <= end
                })
                .reduce((acc, s) => acc + (s.view_count ?? 0), 0)
            points.push({
                date: `Sem ${4 - w}`,
                visits: sum,
                favorites: 0,
            })
        }
        return points.length ? points : [{ date: "—", visits: 0, favorites: 0 }]
    }

    const monthBuckets = 6
    const points: { date: string; visits: number; favorites: number }[] = []
    for (let m = monthBuckets - 1; m >= 0; m--) {
        const d = new Date()
        d.setMonth(d.getMonth() - m)
        d.setDate(1)
        const start = d.getTime()
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime()
        const sum = sorted
            .filter((s) => {
                const t = new Date(s.created_at).getTime()
                return t >= start && t < end
            })
            .reduce((acc, s) => acc + (s.view_count ?? 0), 0)
        points.push({
            date: d.toLocaleDateString("pt-BR", { month: "short" }),
            visits: sum,
            favorites: 0,
        })
    }
    return points.length ? points : [{ date: "—", visits: 0, favorites: 0 }]
}

const width = 800
const height = 200
const padding = 20

export function VisitsChart({ sessions }: { sessions: ChartSession[] }) {
    const [selectedPeriod, setSelectedPeriod] = useState("30 dias")
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const dataset = useMemo(
        () => (mounted ? buildDataset(selectedPeriod, sessions) : [{ date: "—", visits: 0, favorites: 0 }]),
        [mounted, selectedPeriod, sessions]
    )

    const maxVisits = Math.max(1, ...dataset.map((d) => d.visits)) * 1.1

    const points = useMemo(() => {
        const n = dataset.length
        const stepX = n > 1 ? (width - padding * 2) / (n - 1) : 0
        return dataset.map((d, i) => ({
            x: padding + i * stepX,
            y: height - padding - (d.visits / maxVisits) * (height - padding * 2),
        }))
    }, [dataset, maxVisits])

    const linePath = useMemo(() => {
        if (points.length === 0) return ""
        let path = `M ${points[0].x},${points[0].y}`
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i]
            const p1 = points[i + 1]
            const cp1x = p0.x + (p1.x - p0.x) / 3
            const cp1y = p0.y
            const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3
            const cp2y = p1.y
            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`
        }
        return path
    }, [points])

    const areaPath = useMemo(() => {
        if (points.length === 0) return ""
        let path = `M ${padding},${height - padding}`
        path += ` L ${points[0].x},${points[0].y}`
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i]
            const p1 = points[i + 1]
            const cp1x = p0.x + (p1.x - p0.x) / 3
            const cp1y = p0.y
            const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3
            const cp2y = p1.y
            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`
        }
        path += ` L ${points[points.length - 1].x},${height - padding}`
        path += " Z"
        return path
    }, [points])

    const totalVisits = dataset.reduce((acc, curr) => acc + curr.visits, 0)
    const avgVisits = dataset.length ? Math.round(totalVisits / dataset.length) : 0
    const peakDay = dataset.reduce((prev, current) => (prev.visits > current.visits ? prev : current), dataset[0] ?? { visits: 0, date: "—" })

    return (
        <div className="rounded-xl border border-border bg-card p-6 animate-fade-in-up stagger-4">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
                <h3 className="text-lg font-medium text-foreground tracking-[-0.05em]">Visitas por período</h3>
                <div className="flex gap-1 rounded-lg bg-[#161616] p-1 w-full md:w-auto overflow-x-auto hide-scrollbar">
                    {periods.map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={cn(
                                "whitespace-nowrap flex-1 md:flex-none rounded-md px-3 py-1.5 text-[13px] md:text-xs font-medium tracking-[-0.05em] transition-all duration-200",
                                selectedPeriod === period
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.05)]"
                            )}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <svg
                    key={selectedPeriod}
                    className="h-[160px] md:h-[200px] w-full"
                    viewBox="0 0 800 200"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(232, 93, 36, 0.3)" />
                            <stop offset="100%" stopColor="rgba(232, 93, 36, 0)" />
                        </linearGradient>
                    </defs>

                    {[0, 1, 2, 3, 4].map((i) => (
                        <line
                            key={i}
                            x1="20"
                            y1={20 + i * 40}
                            x2="780"
                            y2={20 + i * 40}
                            stroke="rgba(255, 255, 255, 0.04)"
                            strokeWidth="1"
                        />
                    ))}

                    {points.length > 0 && <path d={areaPath} fill="url(#chartGradient)" className="animate-fade-in" />}
                    {points.length > 0 && (
                        <path
                            d={linePath}
                            fill="none"
                            stroke="#E85D24"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="animate-draw-line"
                        />
                    )}

                    {dataset.map((_, i) => {
                        const pt = points[i]
                        if (!pt) return null
                        return (
                            <g key={i}>
                                <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r="20"
                                    fill="transparent"
                                    onMouseEnter={() => setHoveredPoint(i)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                    className="cursor-pointer"
                                />
                                {(hoveredPoint === i || dataset.length <= 10) && (
                                    <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="4"
                                        fill={hoveredPoint === i ? "#FFF" : "#E85D24"}
                                        stroke="#0A0A0A"
                                        strokeWidth="2"
                                        className="transition-colors"
                                    />
                                )}
                            </g>
                        )
                    })}
                </svg>

                {hoveredPoint !== null && points[hoveredPoint] && (
                    <div
                        className="pointer-events-none absolute z-10 rounded-lg bg-[#222] border border-[rgba(255,255,255,0.08)] px-3 py-2 shadow-lg"
                        style={{
                            left: `${(points[hoveredPoint].x / 800) * 100}%`,
                            top: `${(points[hoveredPoint].y / 200) * 100 - 15}%`,
                            transform: "translate(-50%, -100%)",
                        }}
                    >
                        <p className="text-xs text-[#888880] tracking-[-0.05em] mb-1">{dataset[hoveredPoint].date}</p>
                        <p className="text-[14px] font-medium text-white tracking-[-0.05em] leading-none">
                            {dataset[hoveredPoint].visits} visitas
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2 md:gap-3">
                <div className="rounded-full border border-[rgba(255,255,255,0.06)] bg-[#111] px-4 py-2 text-[11px] md:text-xs font-medium text-muted-foreground tracking-[-0.05em]">
                    Pico: <span className="text-foreground">{peakDay.visits} visitas</span> · {peakDay.date}
                </div>
                <div className="rounded-full border border-[rgba(255,255,255,0.06)] bg-[#111] px-4 py-2 text-[11px] md:text-xs font-medium text-muted-foreground tracking-[-0.05em]">
                    Média: <span className="text-foreground">{avgVisits}</span> / intervalo
                </div>
                <div className="rounded-full border border-[rgba(255,255,255,0.06)] bg-[#111] px-4 py-2 text-[11px] md:text-xs font-medium text-muted-foreground tracking-[-0.05em]">
                    Total do período: <span className="text-foreground">{totalVisits.toLocaleString("pt-BR")}</span>
                </div>
            </div>
        </div>
    )
}
