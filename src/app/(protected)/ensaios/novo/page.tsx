"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Grid3X3,
    Maximize,
    AlignVerticalJustifyStart,
    Camera,
    Check,
    Plus,
    X,
    GripVertical,
    Pencil,
    Star,
    Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PublishSuccessModal } from "@/components/framez/publish-modal"
import { createClient } from "@/lib/supabase/client"
import { getPhotographer } from "@/lib/supabase/photographer"
import { sha256Hex } from "@/lib/hash-password"
import { toast } from "sonner"

function slugify(input: string) {
    return input.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "ensaio"
}

const galleryStyles = [
    { id: "grid", label: "Grid", icon: Grid3X3 },
    { id: "cinematic", label: "Cinematic", icon: Maximize },
    { id: "story", label: "Story", icon: AlignVerticalJustifyStart },
]

const photoGradients = [
    "linear-gradient(135deg, #3D1F0A 0%, #1A0A00 100%)",
    "linear-gradient(135deg, #0A1F2A 0%, #051015 100%)",
    "linear-gradient(135deg, #2A1500 0%, #0D0800 100%)",
    "linear-gradient(135deg, #2A0F15 0%, #0F0508 100%)",
    "linear-gradient(135deg, #0A1A0A 0%, #030803 100%)",
    "linear-gradient(135deg, #0A0F2A 0%, #030510 100%)",
    "linear-gradient(135deg, #1A1A0A 0%, #0A0A00 100%)",
    "linear-gradient(135deg, #0A2A1A 0%, #001008 100%)",
    "linear-gradient(135deg, #2A1A2A 0%, #100810 100%)",
]

export default function NovoEnsaioPage() {
    const router = useRouter()
    const supabase = createClient()
    const [clientName, setClientName] = useState("")
    const [sessionTitle, setSessionTitle] = useState("")
    const [selectedStyle, setSelectedStyle] = useState("grid")
    const [passwordProtected, setPasswordProtected] = useState(false)
    const [password, setPassword] = useState("")
    const [hasExpiration, setHasExpiration] = useState(false)
    const [expirationDate, setExpirationDate] = useState("")
    const [showInPortfolio, setShowInPortfolio] = useState(true)
    const [photos, setPhotos] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8])
    const [isDragOver, setIsDragOver] = useState(false)
    const [showPublishModal, setShowPublishModal] = useState(false)
    const [galleryUrl, setGalleryUrl] = useState("")
    const [saving, setSaving] = useState(false)
    const [coverIndex, setCoverIndex] = useState<number | null>(null)
    const [isEditingSlug, setIsEditingSlug] = useState(false)
    const [customSlug, setCustomSlug] = useState("")

    const defaultSlug = clientName
        ? clientName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        : "familia-silva"

    const displaySlug = customSlug || defaultSlug

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index))
    }

    async function resolveUniqueSlug(base: string) {
        let s = slugify(base)
        let n = 0
        while (true) {
            const candidate = n === 0 ? s : `${s}-${n}`
            const { data } = await supabase.from("sessions").select("id").eq("slug", candidate).maybeSingle()
            if (!data) return candidate
            n += 1
        }
    }

    async function saveSession(status: "draft" | "active") {
        if (!clientName.trim()) {
            toast.error("Informe o nome do cliente.")
            return
        }
        if (passwordProtected && !password.trim()) {
            toast.error("Defina uma senha ou desative a proteção.")
            return
        }
        setSaving(true)
        try {
            const photographer = await getPhotographer(supabase)
            if (!photographer) {
                toast.error("Perfil de fotógrafo não encontrado.")
                return
            }
            const title = sessionTitle.trim() || clientName.trim() || "Ensaio"
            const finalSlug = await resolveUniqueSlug(displaySlug || clientName)
            const password_hash =
                passwordProtected && password.trim() ? await sha256Hex(password.trim()) : null
            const expires_at =
                hasExpiration && expirationDate
                    ? new Date(`${expirationDate}T23:59:59`).toISOString()
                    : null

            const { data, error } = await supabase
                .from("sessions")
                .insert({
                    photographer_id: photographer.id,
                    title,
                    client_name: clientName.trim(),
                    slug: finalSlug,
                    style: selectedStyle,
                    password_hash,
                    expires_at,
                    status,
                })
                .select("id")
                .single()

            if (error) throw error
            if (!data?.id) throw new Error("Resposta inválida do servidor.")

            const origin = typeof window !== "undefined" ? window.location.origin : ""
            const publicUrl = `${origin}/galeria/${finalSlug}`

            if (status === "draft") {
                toast.success("Rascunho salvo.")
                router.push(`/ensaios/${data.id}`)
            } else {
                setGalleryUrl(publicUrl)
                setShowPublishModal(true)
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Erro ao salvar."
            toast.error(msg)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="p-8">
            <div className="mx-auto max-w-[1200px]">
                {/* Top Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/ensaios"
                            className="flex items-center gap-1.5 text-[14px] text-[#888880] transition-colors hover:text-[#F5F5F0]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Ensaios
                        </Link>
                        <h1 className="text-[28px] font-semibold tracking-[-0.05em] text-[#F5F5F0]">
                            Novo Ensaio
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => saveSession("draft")}
                            className="rounded-lg border border-[rgba(255,255,255,0.15)] bg-transparent px-4 py-2.5 text-[14px] font-medium text-[#F5F5F0] transition-colors hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-50 inline-flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Salvar rascunho
                        </button>
                        <button
                            type="button"
                            disabled={saving}
                            onClick={() => saveSession("active")}
                            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#E85D24] to-[#F5A623] px-5 py-2.5 text-[14px] font-medium text-white shadow-[0_0_20px_rgba(232,93,36,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(232,93,36,0.4)] animate-gradient disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Publicar
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                        </button>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="mt-8 flex gap-6">
                    {/* Left Column - Settings */}
                    <div className="w-[400px] shrink-0">
                        <div className="rounded-xl bg-[#111111] p-7">
                            {/* Cliente Section */}
                            <div>
                                <h3 className="text-[14px] font-semibold text-[#F5F5F0]">Cliente</h3>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="mb-2 block text-[12px] font-medium text-[#888880]">
                                            Nome do cliente *
                                        </label>
                                        <input
                                            type="text"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            placeholder="Ex: Família Silva"
                                            className="h-11 w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#161616] px-4 text-[14px] text-[#F5F5F0] placeholder:text-[#555] transition-colors focus:border-[rgba(232,93,36,0.4)] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-[12px] font-medium text-[#888880]">
                                            Título do ensaio
                                        </label>
                                        <input
                                            type="text"
                                            value={sessionTitle}
                                            onChange={(e) => setSessionTitle(e.target.value)}
                                            placeholder="Ex: Ensaio de Natal 2025"
                                            className="h-11 w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[#161616] px-4 text-[14px] text-[#F5F5F0] placeholder:text-[#555] transition-colors focus:border-[rgba(232,93,36,0.4)] focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isEditingSlug ? (
                                            <div className="flex flex-1 items-center gap-1 rounded-lg border border-[rgba(232,93,36,0.4)] bg-[#161616] px-3 py-2">
                                                <span className="shrink-0 text-[12px] text-[#555]">framez.com.br/galeria/</span>
                                                <input
                                                    type="text"
                                                    value={customSlug || defaultSlug}
                                                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                                                    onBlur={() => setIsEditingSlug(false)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") setIsEditingSlug(false)
                                                    }}
                                                    autoFocus
                                                    className="w-full bg-transparent text-[12px] text-[#F5F5F0] outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-[12px] text-[#888880]">
                                                    framez.com.br/galeria/{displaySlug}
                                                </span>
                                                <button
                                                    onClick={() => setIsEditingSlug(true)}
                                                    className="shrink-0 rounded p-1 text-[#888880] transition-colors hover:bg-[#161616] hover:text-[#F5F5F0]"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Estilo da galeria Section */}
                            <div className="mt-6 border-t border-[rgba(255,255,255,0.07)] pt-6">
                                <h3 className="text-[14px] font-semibold text-[#F5F5F0]">Estilo da galeria</h3>
                                <div className="mt-4 grid grid-cols-3 gap-3">
                                    {galleryStyles.map((style) => {
                                        const Icon = style.icon
                                        const isSelected = selectedStyle === style.id
                                        return (
                                            <button
                                                key={style.id}
                                                onClick={() => setSelectedStyle(style.id)}
                                                className={cn(
                                                    "relative flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all",
                                                    isSelected
                                                        ? "border-[1.5px] border-[#E85D24] bg-[rgba(232,93,36,0.08)]"
                                                        : "border-[rgba(255,255,255,0.08)] bg-[#161616] hover:border-[rgba(255,255,255,0.15)]"
                                                )}
                                            >
                                                {isSelected && (
                                                    <div className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E85D24] shadow-lg">
                                                        <Check className="h-2.5 w-2.5 text-white" />
                                                    </div>
                                                )}
                                                <Icon className={cn("h-5 w-5", isSelected ? "text-[#E85D24]" : "text-[#888880]")} />
                                                <span className={cn("text-[12px] font-medium", isSelected ? "text-[#F5F5F0]" : "text-[#888880]")}>
                                                    {style.label}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Proteção Section */}
                            <div className="mt-6 border-t border-[rgba(255,255,255,0.07)] pt-6">
                                <h3 className="text-[14px] font-semibold text-[#F5F5F0]">Proteção</h3>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[13px] text-[#888880]">Proteger com senha</span>
                                            <button
                                                onClick={() => setPasswordProtected(!passwordProtected)}
                                                className={cn(
                                                    "relative h-6 w-11 rounded-full transition-colors",
                                                    passwordProtected ? "bg-[#E85D24]" : "bg-[#333]"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                                                        passwordProtected ? "left-6" : "left-1"
                                                    )}
                                                />
                                            </button>
                                        </div>
                                        {passwordProtected && (
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Digite a senha"
                                                className="mt-3 h-10 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#161616] px-3 text-[13px] text-[#F5F5F0] placeholder:text-[#555] transition-colors focus:border-[rgba(232,93,36,0.4)] focus:outline-none"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[13px] text-[#888880]">Data de expiração</span>
                                            <button
                                                onClick={() => setHasExpiration(!hasExpiration)}
                                                className={cn(
                                                    "relative h-6 w-11 rounded-full transition-colors",
                                                    hasExpiration ? "bg-[#E85D24]" : "bg-[#333]"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                                                        hasExpiration ? "left-6" : "left-1"
                                                    )}
                                                />
                                            </button>
                                        </div>
                                        {hasExpiration && (
                                            <input
                                                type="date"
                                                value={expirationDate}
                                                onChange={(e) => setExpirationDate(e.target.value)}
                                                className="mt-3 h-10 w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#161616] px-3 text-[13px] text-[#F5F5F0] transition-colors focus:border-[rgba(232,93,36,0.4)] focus:outline-none"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Portfólio Section */}
                            <div className="mt-6 border-t border-[rgba(255,255,255,0.07)] pt-6">
                                <h3 className="text-[14px] font-semibold text-[#F5F5F0]">Portfólio</h3>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[13px] text-[#888880]">Exibir no portfólio público</span>
                                        <button
                                            onClick={() => setShowInPortfolio(!showInPortfolio)}
                                            className={cn(
                                                "relative h-6 w-11 rounded-full transition-colors",
                                                showInPortfolio ? "bg-[#E85D24]" : "bg-[#333]"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                                                    showInPortfolio ? "left-6" : "left-1"
                                                )}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Plan Usage */}
                            <div className="mt-6 border-t border-[rgba(255,255,255,0.07)] pt-6">
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-[#888880]">
                                        <span className="text-[#F5F5F0]">1</span> de <span className="text-[#F5F5F0]">3</span> ensaios ativos · Plano Free
                                    </span>
                                    <button className="font-medium text-[#E85D24] transition-colors hover:text-[#F5A623]">
                                        Fazer upgrade
                                    </button>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#161616]">
                                    <div className="h-full w-[33.33%] rounded-full bg-gradient-to-r from-[#E85D24] to-[#F5A623]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Photos */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[14px] font-semibold text-[#F5F5F0]">
                                Fotos ({photos.length})
                            </span>
                            <button className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.15)] bg-transparent px-4 py-2 text-[13px] font-medium text-[#F5F5F0] transition-colors hover:bg-[rgba(255,255,255,0.05)]">
                                <Plus className="h-4 w-4" />
                                Adicionar fotos
                            </button>
                        </div>

                        {photos.length === 0 ? (
                            /* Upload Zone - Empty State */
                            <div
                                className={cn(
                                    "mt-4 flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all",
                                    isDragOver
                                        ? "border-[#E85D24] bg-[rgba(232,93,36,0.04)]"
                                        : "border-[rgba(232,93,36,0.25)]"
                                )}
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setIsDragOver(true)
                                }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    setIsDragOver(false)
                                    // Handle file drop
                                }}
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(232,93,36,0.1)]">
                                    <Camera className="h-6 w-6 text-[#E85D24]" />
                                </div>
                                <p className="mt-4 text-[20px] font-medium text-[#F5F5F0]">
                                    Arraste suas fotos aqui
                                </p>
                                <p className="mt-1 text-[14px] text-[#888880]">
                                    ou clique para selecionar
                                </p>
                                <p className="mt-3 text-[12px] text-[#555]">
                                    JPG, PNG, WEBP · máx 20MB por foto
                                </p>
                            </div>
                        ) : (
                            /* Photo Grid - Filled State */
                            <>
                                <div className="mt-4 grid grid-cols-3 gap-2">
                                    {photos.map((photoIndex, index) => {
                                        const isCover = coverIndex === index
                                        return (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "group relative aspect-square overflow-hidden rounded-lg",
                                                    isCover && "ring-[1.5px] ring-[#E85D24]"
                                                )}
                                                style={{ background: photoGradients[photoIndex % photoGradients.length] }}
                                            >
                                                {/* Star icon - top left for cover photo */}
                                                {isCover && (
                                                    <div className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#E85D24]">
                                                        <Star className="h-3 w-3 fill-white text-white" />
                                                    </div>
                                                )}
                                                {/* CAPA badge - bottom left for cover photo */}
                                                {isCover && (
                                                    <span className="absolute bottom-2 left-2 z-10 rounded-full bg-[#E85D24] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                                                        CAPA
                                                    </span>
                                                )}
                                                {/* Drag handle - top left on hover (only if not cover) */}
                                                {!isCover && (
                                                    <div className="absolute left-2 top-2 flex h-6 w-6 cursor-grab items-center justify-center rounded bg-[rgba(0,0,0,0.6)] opacity-0 transition-opacity group-hover:opacity-100">
                                                        <GripVertical className="h-3.5 w-3.5 text-white" />
                                                    </div>
                                                )}
                                                {/* Delete button - top right on hover */}
                                                <button
                                                    onClick={() => {
                                                        if (isCover) setCoverIndex(null)
                                                        removePhoto(index)
                                                    }}
                                                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded bg-[rgba(0,0,0,0.6)] opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500"
                                                >
                                                    <X className="h-3.5 w-3.5 text-white" />
                                                </button>
                                                {/* Set as cover button - bottom center on hover (only if not already cover) */}
                                                {!isCover && (
                                                    <button
                                                        onClick={() => setCoverIndex(index)}
                                                        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[rgba(0,0,0,0.75)] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-[rgba(0,0,0,0.9)]"
                                                    >
                                                        Definir como capa
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                                {coverIndex === null && (
                                    <p className="mt-3 text-center text-[12px] italic text-[#888880]">
                                        Passe o mouse sobre uma foto para definir a capa
                                    </p>
                                )}
                                <p className="mt-3 text-center text-[12px] text-[#888880]">
                                    Arraste as fotos para reordenar
                                </p>
                                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[rgba(232,93,36,0.4)] bg-transparent py-3 text-[13px] font-medium text-[#E85D24] transition-colors hover:border-[#E85D24] hover:bg-[rgba(232,93,36,0.04)]">
                                    <Camera className="h-4 w-4" />
                                    Adicionar mais fotos
                                </button>
                                <p className="mt-3 text-right text-[13px] text-[#888880]">
                                    {photos.length} fotos adicionadas
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Publish Success Modal */}
            <PublishSuccessModal
                isOpen={showPublishModal}
                onClose={() => setShowPublishModal(false)}
                galleryUrl={galleryUrl}
            />
        </div>
    )
}
