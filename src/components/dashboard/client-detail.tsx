"use client"

import {
  ArrowLeft,
  MessageCircle,
  Mail,
  MoreHorizontal,
  Eye,
  Heart,
  Download,
  ExternalLink,
  Camera,
  Star,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Session {
  id: string
  slug?: string
  title: string
  date: string
  style: "Grid" | "Cinematic" | "Story"
  thumbnail: string
  views: number
  favorites: number
  downloads: number
  status: "published" | "draft"
}

interface Activity {
  id: string
  action: string
  time: string
}

interface ClientDetailProps {
  client: {
    id: string
    name: string
    initials: string
    memberSince: string
    tags: string[]
    sessionsCount: number
    totalVisits: number
    favoritePhotos: number
    lastAccess: string
    phone?: string
    email?: string
  }
  sessions: Session[]
  activities: Activity[]
  onBack: () => void
}

export function ClientDetail({ client, sessions, activities, onBack }: ClientDetailProps) {
  return (
    <div className="animate-slide-in-right">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/clientes"
            className="flex items-center gap-2 text-[#888880] hover:text-[#F5F5F0] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium tracking-[-0.05em]">Clientes</span>
          </Link>
          <h1 className="text-[#F5F5F0] text-[28px] font-semibold tracking-[-0.05em]">
            {client.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {client.phone && (
            <button
              onClick={() => window.open(`https://wa.me/${client.phone?.replace(/[^0-9]/g, '')}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium tracking-[-0.05em] hover:bg-emerald-600 transition-all active:scale-[0.97]"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          )}
          <button
            onClick={() => window.open(`mailto:${client.email}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#F5F5F0]/20 text-[#F5F5F0] text-sm font-medium tracking-[-0.05em] hover:bg-[#F5F5F0]/5 transition-all active:scale-[0.97]"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button className="w-9 h-9 rounded-lg border border-[#F5F5F0]/20 flex items-center justify-center text-[#888880] hover:text-[#F5F5F0] hover:bg-[#F5F5F0]/5 transition-all">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Client Header Card */}
      <div className="bg-[#111111] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Large Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E85D24] to-[#FF7A45] flex items-center justify-center">
              <span className="text-white font-semibold text-xl tracking-[-0.05em]">
                {client.initials}
              </span>
            </div>
            <div>
              <h2 className="text-[#F5F5F0] text-[22px] font-semibold tracking-[-0.05em]">
                {client.name}
              </h2>
              <p className="text-[#888880] text-[13px] tracking-[-0.05em] mt-0.5">
                Cliente desde {client.memberSince}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {client.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-[#161616] text-[#888880] text-[11px] font-medium tracking-[-0.05em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <StatBox value={client.sessionsCount.toString()} label="ensaios" />
            <StatBox value={client.totalVisits.toLocaleString("pt-BR")} label="visitas" />
            <StatBox value={client.favoritePhotos.toString()} label="favoritos" />
            <StatBox value={client.lastAccess} label="último acesso" />
          </div>
        </div>
      </div>

      {/* Sessions Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-[#F5F5F0] text-lg font-semibold tracking-[-0.05em]">
            Ensaios de {client.name}
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-[#161616] text-[#888880] text-xs font-medium">
            {sessions.length}
          </span>
        </div>

        <div className="space-y-2">
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className={cn(
                "bg-[#161616] rounded-[10px] p-4 flex items-center gap-4",
                "hover:bg-[#1a1a1a] transition-all duration-200",
                "animate-stagger-in opacity-0"
              )}
              style={{ animationDelay: `${index * 40}ms`, animationFillMode: "forwards" }}
            >
              {/* Thumbnail */}
              <div
                className={cn(
                  "w-[60px] h-[60px] rounded-lg flex-shrink-0",
                  session.thumbnail
                )}
              />

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[#F5F5F0] text-sm font-semibold tracking-[-0.05em]">
                    {session.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[#888880] text-xs tracking-[-0.05em]">
                    {session.date}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#111111] text-[#888880] text-[10px] font-medium">
                    {session.style}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-[#888880] text-xs">
                    <Eye className="w-3 h-3" />
                    {session.views}
                  </span>
                  <span className="flex items-center gap-1 text-[#888880] text-xs">
                    <Heart className="w-3 h-3" />
                    {session.favorites}
                  </span>
                  <span className="flex items-center gap-1 text-[#888880] text-xs">
                    <Download className="w-3 h-3" />
                    {session.downloads}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-medium tracking-[-0.05em]",
                    session.status === "published"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  )}
                >
                  {session.status === "published" ? "Publicado" : "Rascunho"}
                </span>
                <button
                  onClick={() =>
                    window.open(`/galeria/${session.slug && session.slug.length > 0 ? session.slug : session.id}`, "_blank")
                  }
                  className="flex items-center gap-1 text-[#888880] hover:text-[#F5F5F0] text-sm transition-colors"
                >
                  Abrir galeria
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div>
        <h3 className="text-[#F5F5F0] text-lg font-semibold tracking-[-0.05em] mb-4">
          Atividade
        </h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-center gap-3 py-2",
                "animate-stagger-in opacity-0"
              )}
              style={{ animationDelay: `${(sessions.length + index) * 40}ms`, animationFillMode: "forwards" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#E85D24]" />
              <span className="text-[#F5F5F0] text-sm tracking-[-0.05em]">
                {activity.action}
              </span>
              <span className="text-[#888880] text-sm tracking-[-0.05em]">
                · {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-[#F5F5F0] text-2xl font-bold tracking-[-0.05em] animate-count-up">
        {value}
      </div>
      <div className="text-[#888880] text-xs tracking-[-0.05em] mt-0.5">
        {label}
      </div>
    </div>
  )
}
