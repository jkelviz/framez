"use client"

import { Search, Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TopBar() {
  return (
    <header className="flex items-center justify-between animate-fade-in-up stagger-1">
      <h1 className="text-[20px] md:text-[24px] font-medium text-foreground tracking-[-0.05em] whitespace-nowrap truncate mr-2">
        Bom dia, Rafael
      </h1>
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-lg text-muted-foreground hover:bg-[rgba(255,255,255,0.05)] hover:text-foreground"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Pesquisar</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-lg text-muted-foreground hover:bg-[rgba(255,255,255,0.05)] hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
        </Button>
        <Button asChild className="gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-300 hover:opacity-90 animate-gradient">
          <Link href="/ensaios/novo">
            <Plus className="h-4 w-4" />
            Novo Ensaio
          </Link>
        </Button>
      </div>
    </header>
  )
}
