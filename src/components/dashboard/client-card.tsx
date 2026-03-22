"use client"

import { Eye, Heart, Calendar, Camera, MessageCircle, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"

interface ClientCardProps {
  client: {
    id: string
    name: string
    initials: string
    status: "active" | "inactive"
    sessionsCount: number
    totalVisits: number
    favoritePhotos: number
    lastAccess: string
    phone?: string
    email?: string
    coverGradient: string
  }
  index: number
  onViewSessions: (clientId: string) => void
}

export function ClientCard({ client, index, onViewSessions }: ClientCardProps) {
  const contactInfo = client.phone || client.email
  const ContactIcon = client.phone ? MessageCircle : Mail

  return (
    <div
      className={cn(
        "bg-[#111111] rounded-xl overflow-hidden border border-transparent",
        "hover:border-[rgba(232,93,36,0.3)] hover:-translate-y-[3px]",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "animate-stagger-in opacity-0"
      )}
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: "forwards" }}
    >
      {/* Cover Section */}
      <div className="relative h-[160px]">
        {/* Cinematic gradient background */}
        <div
          className={cn("absolute inset-0", client.coverGradient)}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.95)] via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-medium tracking-[-0.05em]",
              client.status === "active"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-[#888880]/20 text-[#888880]"
            )}
          >
            {client.status === "active" ? "Ativo" : "Inativo"}
          </span>
        </div>

        {/* Avatar */}
        <div className="absolute bottom-0 left-4 translate-y-1/2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E85D24] to-[#FF7A45] flex items-center justify-center border-2 border-[#111111]">
            <span className="text-white font-semibold text-sm tracking-[-0.05em]">
              {client.initials}
            </span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-4 pt-8 pb-3">
        <h3 className="text-[#F5F5F0] font-semibold text-base tracking-[-0.05em]">
          {client.name}
        </h3>
        <p className="text-[#888880] text-[13px] mt-1 tracking-[-0.05em]">
          {client.sessionsCount} ensaios
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
          <StatItem icon={Eye} value={client.totalVisits.toLocaleString("pt-BR")} label="visitas totais" />
          <StatItem icon={Heart} value={client.favoritePhotos.toString()} label="fotos favoritadas" />
          <StatItem icon={Calendar} value={client.lastAccess} label="último acesso" />
          <StatItem icon={Camera} value={client.sessionsCount.toString()} label="ensaios" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[rgba(255,255,255,0.06)] mx-4" />

      {/* Actions */}
      <div className="p-3 flex flex-col sm:flex-row items-center gap-2 w-full">
        <Link
          href={`/clientes/${client.id}`}
          className="w-full sm:flex-1 h-11 sm:h-[38px] flex items-center justify-center rounded-lg border border-[#F5F5F0]/20 text-[#F5F5F0] text-[13px] font-medium tracking-[-0.05em] hover:bg-[#F5F5F0]/5 transition-all active:scale-[0.97]"
        >
          Ver ensaios
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-full sm:w-9 h-11 sm:h-[38px] rounded-lg bg-[#E85D24] flex items-center justify-center hover:bg-[#E85D24]/90 transition-all active:scale-[0.97]"
              >
                <ContactIcon className="w-4 h-4 text-white" />
                <span className="sm:hidden ml-2 text-white font-medium text-[13px]">Contato</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#161616] border-[rgba(255,255,255,0.07)] text-[#F5F5F0] hidden sm:block">
              <p className="text-xs">{contactInfo}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

function StatItem({ icon: Icon, value, label }: { icon: typeof Eye; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-[#888880]" />
      <div className="flex items-baseline gap-1">
        <span className="text-[#F5F5F0] text-[13px] font-medium tracking-[-0.05em]">{value}</span>
        <span className="text-[#888880] text-[11px] tracking-[-0.05em]">{label}</span>
      </div>
    </div>
  )
}
