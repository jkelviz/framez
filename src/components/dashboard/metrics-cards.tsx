"use client"

import { useEffect, useState, useRef } from "react"

interface MetricCardProps {
    title: string
    value: number
    suffix?: string
    trend: string
    trendColor: "green" | "red" | "neutral"
    chart: "sparkline" | "progress" | "area" | "donut" | "split"
    delay: number
    progressFraction?: number
    splitFraction?: number
    donutFraction?: number
}

function useCountUp(end: number, duration: number = 800, startAnimation: boolean) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!startAnimation) return

        let startTime: number
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(end * easeOut))
            if (progress < 1) {
                requestAnimationFrame(step)
            }
        }
        requestAnimationFrame(step)
    }, [end, duration, startAnimation])

    return count
}

function ProgressChart({ fraction }: { fraction: number }) {
    const pct = Math.min(100, Math.max(0, fraction * 100))
    return (
        <div className="flex flex-col gap-1.5 w-full justify-center h-8">
            <div className="text-[11px] text-[#888880] font-medium tracking-[1px] uppercase">Uso</div>
            <div className="w-full h-1.5 bg-[#161616] rounded-full overflow-hidden">
                <div className="h-full bg-[#E85D24] rounded-full transition-all duration-1000 delay-300" style={{ width: `${pct}%` }} />
            </div>
        </div>
    )
}

function SplitBarChart({ fraction }: { fraction: number }) {
    const pct = Math.min(100, Math.max(0, fraction * 100))
    return (
        <div className="flex flex-col gap-1.5 w-full justify-center h-8">
            <div className="w-full h-1.5 bg-[#333333] rounded-full overflow-hidden">
                <div className="h-full bg-[#E85D24] rounded-full transition-all duration-1000 delay-300" style={{ width: `${pct}%` }} />
            </div>
        </div>
    )
}

function DonutRingChart({ fraction }: { fraction: number }) {
    const pct = Math.min(1, Math.max(0, fraction))
    const circumference = 2 * Math.PI * 15
    const dash = pct * circumference * 0.25
    const dasharray = `${dash} ${circumference}`
    return (
        <div className="h-8 flex items-center">
            <svg className="h-8 w-8" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="none" stroke="#333333" strokeWidth="5" />
                <circle
                    cx="20"
                    cy="20"
                    r="15"
                    fill="none"
                    stroke="#E85D24"
                    strokeWidth="5"
                    strokeDasharray={dasharray}
                    className="-rotate-90 origin-center transition-all duration-1000 delay-300"
                />
            </svg>
        </div>
    )
}

function SparklineChart() {
    const points = [10, 25, 20, 40, 35, 50, 45, 55, 50, 60]
    const maxY = Math.max(...points)
    const pathData = points.map((p, i) => `${i * 13},${35 - (p / maxY) * 30}`).join(" L ")

    return (
        <svg className="h-8 w-full animate-fade-in delay-300" viewBox="0 0 120 40" preserveAspectRatio="none">
            <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(232, 93, 36, 0.3)" />
                    <stop offset="100%" stopColor="rgba(232, 93, 36, 0)" />
                </linearGradient>
            </defs>
            <path d={`M 0,35 L ${pathData} L 117,35 Z`} fill="url(#areaGradient)" />
            <path d={`M ${pathData}`} fill="none" stroke="#E85D24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function MetricCard({
    title,
    value,
    suffix,
    trend,
    trendColor,
    chart,
    delay,
    progressFraction = 0.4,
    splitFraction = 0.1,
    donutFraction = 0.25,
}: MetricCardProps) {
    const [isVisible, setIsVisible] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), Math.min(delay, 150))
        return () => clearTimeout(timer)
    }, [delay])

    const displayValue = useCountUp(value, Math.min(800, 300), isVisible)

    const formatValue = (val: number) => {
        if (val >= 1000) {
            return val.toLocaleString("pt-BR")
        }
        return val.toString()
    }

    const getTrendColorClass = () => {
        if (trendColor === "green") return "text-green-500"
        if (trendColor === "red") return "text-red-400"
        return "text-[#888880]"
    }

    return (
        <div
            ref={cardRef}
            className="group flex flex-col justify-between rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[#111111] p-4 transition-all duration-150 md:duration-300 md:hover:-translate-y-1 md:hover:border-primary/25 active:scale-[0.98] active:opacity-90 animate-fade-in md:animate-fade-in-up"
            style={{ opacity: isVisible ? 1 : 0 }}
        >
            <div className="mb-4 flex items-center h-8">
                {chart === "progress" && <ProgressChart fraction={progressFraction} />}
                {chart === "donut" && <DonutRingChart fraction={donutFraction} />}
                {chart === "area" && <SparklineChart />}
                {chart === "split" && <SplitBarChart fraction={splitFraction} />}
            </div>
            <div>
                <div className="mb-2 text-[32px] md:text-[36px] font-bold leading-none text-foreground tracking-[-0.05em] flex items-baseline gap-1">
                    {formatValue(chart === "progress" ? value : displayValue)}
                    {suffix && <span className="text-[18px] md:text-[20px] font-bold text-[#F5F5F0]">{suffix}</span>}
                </div>
                <p className="text-[11px] font-[500] text-[#888880] uppercase tracking-[1.5px] leading-none mb-1.5">{title}</p>
                <p className={`text-[11px] font-bold tracking-[-0.02em] leading-none ${getTrendColorClass()}`}>{trend}</p>
            </div>
        </div>
    )
}

export function MetricsCards({
    activeSessions,
    uniqueClients,
    visitsThisMonth,
    visitsPrevMonth,
    photosTotal,
}: {
    activeSessions: number
    uniqueClients: number
    visitsThisMonth: number
    visitsPrevMonth: number
    photosTotal: number
}) {
    const visitsTrendPct =
        visitsPrevMonth > 0 ? Math.round(((visitsThisMonth - visitsPrevMonth) / visitsPrevMonth) * 100) : visitsThisMonth > 0 ? 100 : 0
    const visitsTrend =
        visitsPrevMonth === 0
            ? visitsThisMonth > 0
                ? "Primeiro mês com dados"
                : "Sem visitas (sessões novas)"
            : `${visitsTrendPct >= 0 ? "↑" : "↓"} ${Math.abs(visitsTrendPct)}% vs mês anterior`

    const visitsTrendColor: "green" | "red" | "neutral" =
        visitsPrevMonth === 0 && visitsThisMonth === 0 ? "neutral" : visitsTrendPct >= 0 ? "green" : "red"

    const metrics: MetricCardProps[] = [
        {
            title: "Ensaios Ativos",
            value: activeSessions,
            trend: `${activeSessions} publicados`,
            trendColor: "neutral",
            chart: "progress",
            delay: 0,
            progressFraction: Math.min(1, activeSessions / 12),
        },
        {
            title: "Clientes Únicos",
            value: uniqueClients,
            trend: "Por nome de cliente",
            trendColor: "neutral",
            chart: "donut",
            delay: 50,
            donutFraction: Math.min(1, uniqueClients / 20),
        },
        {
            title: "Visitas (novos ensaios no mês)",
            value: visitsThisMonth,
            trend: visitsTrend,
            trendColor: visitsTrendColor,
            chart: "area",
            delay: 100,
        },
        {
            title: "Fotos na plataforma",
            value: photosTotal,
            trend: "Total em todas as galerias",
            trendColor: "neutral",
            chart: "split",
            delay: 150,
            splitFraction: Math.min(1, photosTotal / 500),
        },
    ]

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
            {metrics.map((metric, i) => (
                <MetricCard key={i} {...metric} />
            ))}
        </div>
    )
}
