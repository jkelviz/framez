"use client"

import { Search, Bell } from "lucide-react"

interface SharedTopBarProps {
    title: string
    actionButton?: React.ReactNode
}

export function SharedTopBar({ title, actionButton }: SharedTopBarProps) {
    return (
        <div className="flex h-[64px] min-h-[64px] shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.06)] bg-[#0A0A0A] px-4 md:px-8 w-full sticky top-0 z-40">
            <h1 className="text-[22px] font-semibold tracking-[-0.05em] text-[#F5F5F0]">
                {title}
            </h1>
            <div className="flex items-center gap-3">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-[#888880] hover:bg-[#161616] hover:text-[#F5F5F0] transition-colors">
                    <Search className="h-5 w-5" />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-[#888880] hover:bg-[#161616] hover:text-[#F5F5F0] transition-colors">
                    <Bell className="h-5 w-5" />
                </button>
                {actionButton}
            </div>
        </div>
    )
}
