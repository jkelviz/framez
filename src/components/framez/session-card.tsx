"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Heart, Pencil, Link2, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Session {
  id: string | number
  slug?: string
  clientName?: string
  client?: string
  title?: string
  date: string
  views: number
  favorites: number
  status: "active" | "draft" | "archived" | string
  gradientType?: number
  gradient?: string
  isNew?: boolean
}

const gradients = [
  "linear-gradient(135deg, #3D1F0A 0%, #1A0A00 100%)", // deep amber
  "linear-gradient(135deg, #0A1F2A 0%, #051015 100%)", // teal
  "linear-gradient(135deg, #2A1500 0%, #0D0800 100%)", // warm brown
  "linear-gradient(135deg, #2A0F15 0%, #0F0508 100%)", // dusty rose
  "linear-gradient(135deg, #0A1A0A 0%, #030803 100%)", // forest
  "linear-gradient(135deg, #0A0F2A 0%, #030510 100%)", // navy
]

const statusConfig: Record<string, { label: string, className: string }> = {
  active: {
    label: "Ativo",
    className: "bg-[rgba(34,197,94,0.15)] text-[#22C55E]"
  },
  draft: {
    label: "Rascunho",
    className: "bg-[rgba(255,255,255,0.08)] text-[#888880]"
  },
  archived: {
    label: "Arquivado",
    className: "bg-[rgba(255,255,255,0.05)] text-[#555555]"
  }
}

export function SessionCard({ session, index }: { session: Session; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const status = statusConfig[session.status] || statusConfig.draft
  const clientIdentifier = session.clientName || session.client || "Cliente Desconhecido"
  const backgroundStyle = session.gradient ? { background: "transparent" } : { background: gradients[(session.gradientType || 0) % gradients.length] }

  const gallerySegment = session.slug && String(session.slug).length > 0 ? String(session.slug) : String(session.id)

  const handleCopyLink = () => {
    const link = `${window.location.origin}/galeria/${gallerySegment}`
    navigator.clipboard.writeText(link)
    toast.success("Link copiado!")
  }

  const handleViewGallery = () => {
    window.open(`/galeria/${gallerySegment}`, "_blank")
  }

  return (
    <div
      className={cn(
        "group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[12px] md:hover:scale-[1.03] md:hover:border md:hover:border-[rgba(232,93,36,0.4)] active:scale-[0.98] active:opacity-90 transition-all duration-150 md:duration-300 animate-fade-in md:animate-fade-in-up opacity-0 border border-[rgba(255,255,255,0.06)] bg-[#111111]",
        isHovered && "md:scale-[1.03] md:border md:border-[rgba(232,93,36,0.4)]"
      )}
      style={{
        ...backgroundStyle,
        animationDelay: `${index * 40}ms`,
        animationFillMode: "forwards"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {session.gradient && (
        <div className={cn("absolute inset-0 bg-gradient-to-br", session.gradient)} />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.95)] via-[rgba(0,0,0,0.3)] to-transparent"
        style={{ top: "40%" }} />

      {/* Special badges - top left */}
      <div className="absolute left-3 top-3 flex flex-col gap-2 z-10">
        {session.isNew && (
          <span className="rounded-full bg-[#E85D24] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            NOVO
          </span>
        )}
      </div>

      {/* Status badge - top right */}
      <div className="absolute right-3 top-3 z-10">
        <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-medium", status.className)}>
          {status.label}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-10">
        {/* Default info */}
        <div className={cn(
          "transition-all duration-300",
          isHovered ? "md:translate-y-[-60px] md:opacity-0" : "translate-y-0 opacity-100"
        )}>
          <h3 className="text-[13px] md:text-[15px] font-semibold text-white tracking-[-0.05em] truncate">{clientIdentifier}</h3>
          {(session.title) && <p className="mt-0.5 text-[11px] md:text-[13px] text-[#888880] truncate">{session.title}</p>}
          <p className="mt-1 md:mt-2 text-[10px] md:text-[12px] text-[#888880]">{session.date}</p>
          <div className="mt-1.5 md:mt-2 flex items-center gap-2 md:gap-4 text-[10px] md:text-[12px] text-[#888880]">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {session.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {session.favorites}
            </span>
          </div>
        </div>

        {/* Hover overlay that drops down on Desktop and remains on Mobile */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[rgba(10,10,10,0.95)] via-[rgba(10,10,10,0.6)] to-transparent p-4 opacity-100 md:opacity-0 transition-opacity duration-300 md:group-hover:opacity-100",
            isHovered && "md:opacity-100"
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-2 transition-transform duration-300 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0",
              isHovered && "md:translate-y-0"
            )}
          >
            <div className="flex items-center gap-2">
              <Link
                href={`/ensaios/${session.id}`}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.2)] bg-black/40 text-[12px] font-medium text-white transition-colors hover:bg-[rgba(255,255,255,0.05)]"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Editar</span>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleCopyLink();
                }}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.2)] bg-black/40 text-[12px] font-medium text-white transition-colors hover:bg-[rgba(255,255,255,0.05)]"
              >
                <Link2 className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">Copiar link</span>
              </button>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleViewGallery();
              }}
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E85D24] to-[#F5A623] text-[13px] font-semibold text-white shadow-[0_0_15px_rgba(232,93,36,0.3)] transition-all hover:shadow-[0_0_25px_rgba(232,93,36,0.4)] animate-gradient"
            >
              <Play className="h-4 w-4" />
              Ver galeria
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
