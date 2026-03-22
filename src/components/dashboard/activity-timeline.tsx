"use client"

import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const colorMap = {
    orange: "bg-primary",
    green: "bg-green-500",
    blue: "bg-blue-500",
}

export type TimelineItem = {
    id: string
    color: "orange" | "green" | "blue"
    description: string
    time: string
}

export function ActivityTimeline({ items }: { items: TimelineItem[] }) {
    return (
        <div className="rounded-xl border border-border bg-card p-6 animate-fade-in-up stagger-5">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground tracking-[-0.05em]">Atividade Recente</h3>
                <Bell className="h-5 w-5 text-muted-foreground" />
            </div>

            {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sem atividade ainda. Crie um ensaio ou envie fotos.</p>
            ) : (
                <div className="relative">
                    <div className="absolute left-[5px] top-2 h-[calc(100%-16px)] w-px bg-[rgba(255,255,255,0.08)]" />

                    <ul className="space-y-4">
                        {items.map((activity, i) => (
                            <li
                                key={activity.id}
                                className="relative flex gap-4 pl-6"
                                style={{ animationDelay: `${600 + i * 80}ms` }}
                            >
                                <div
                                    className={cn(
                                        "absolute left-0 top-1.5 h-[10px] w-[10px] rounded-full",
                                        colorMap[activity.color]
                                    )}
                                />

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground tracking-[-0.05em] truncate">{activity.description}</p>
                                    <p className="text-xs font-medium text-muted-foreground tracking-[-0.05em]">{activity.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
