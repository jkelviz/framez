"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    ArrowLeft, Grid3X3, Maximize, AlignVerticalJustifyStart, Check, Pencil, Loader2, Trash2, AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PublishSuccessModal } from "@/components/framez/publish-modal"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { UploadZone } from "@/components/editor/upload-zone"
import { PhotoGridManager } from "@/components/editor/photo-grid-manager"

const galleryStyles = [
    { id: "grid", label: "Grid", icon: Grid3X3 },
    { id: "cinematic", label: "Cinematic", icon: Maximize },
    { id: "story", label: "Story", icon: AlignVerticalJustifyStart },
]

export default function SessionEditorPage({ params }: { params: { id: string } }) {
    const supabase = createClient()

    const [clientName, setClientName] = useState("")
    const [sessionTitle, setSessionTitle] = useState("")
    const [selectedStyle, setSelectedStyle] = useState("grid")
    const [passwordProtected, setPasswordProtected] = useState(false)
    const [password, setPassword] = useState("")
    const [hasExpiration, setHasExpiration] = useState(false)
    const [expirationDate, setExpirationDate] = useState("")
    const [showInPortfolio, setShowInPortfolio] = useState(true)

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [showPublishModal, setShowPublishModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [isEditingSlug, setIsEditingSlug] = useState(false)
    const [customSlug, setCustomSlug] = useState("")

    const defaultSlug = clientName
        ? clientName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        : "familia-silva"

    const displaySlug = customSlug || defaultSlug

    useEffect(() => {
        const fetchSession = async () => {
            const { data, error } = await supabase
                .from("sessions")
                .select("*")
                .eq("id", params.id)
                .single();

            if (data) {
                setSessionTitle(data.title || "")
                setClientName(data.client_name || "")
                setCustomSlug(data.slug || "")
                setSelectedStyle(data.style || "grid")

                if (data.password_hash) {
                    setPasswordProtected(true)
                    setPassword(data.password_hash)
                }
                if (data.expires_at) {
                    setHasExpiration(true)
                    setExpirationDate(data.expires_at.split('T')[0])
                }
            }
            setIsLoading(false)
        }
        fetchSession()
    }, [params.id, supabase])

    const handleDelete = async () => {
        setIsSaving(true)
        try {
            // First, get all photos for this session to delete from storage
            const { data: photos } = await supabase
                .from('photos')
                .select('url')
                .eq('session_id', params.id)

            // Delete photos from storage
            if (photos) {
                for (const photo of photos) {
                    if (photo.url) {
                        const filePath = photo.url.split('/').pop()
                        if (filePath) {
                            await supabase.storage
                                .from('photos')
                                .remove([`${params.id}/${filePath}`])
                        }
                    }
                }
            }

            // Delete photos from database
            await supabase
                .from('photos')
                .delete()
                .eq('session_id', params.id)

            // Delete session
            const { error } = await supabase
                .from('sessions')
                .delete()
                .eq('id', params.id)

            if (error) throw error

            toast.success('Ensaio excluído com sucesso!')
            window.location.href = '/ensaios'
        } catch (error: any) {
            toast.error('Erro ao excluir ensaio: ' + error.message)
        } finally {
            setIsSaving(false)
            setShowDeleteModal(false)
        }
    }

    const handleSave = async (status: "draft" | "active") => {
        setIsSaving(true)
        try {
            const updatePayload: any = {
                title: sessionTitle,
                client_name: clientName,
                slug: displaySlug,
                style: selectedStyle,
                status: status,
                password_hash: passwordProtected && password ? password : null,
                expires_at: hasExpiration && expirationDate ? new Date(expirationDate).toISOString() : null,
            }

            const { error } = await supabase.from("sessions").update(updatePayload).eq("id", params.id)
            if (error) throw error

            if (status === "active") {
                setShowPublishModal(true)
            } else {
                toast.success("Rascunho salvo com sucesso!")
            }
        } catch (error: any) {
            toast.error("Erro ao salvar: " + error.message)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#E85D24]" /></div>
    }

    return (
        <div className="flex flex-col w-full dashboard-page">
            <div className="mx-auto w-full max-w-[1200px] px-4 py-5 md:p-8 flex flex-col space-y-5 md:space-y-6">
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
                            Editando Ensaio
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleSave("draft")}
                            disabled={isSaving}
                            className="rounded-lg border border-[rgba(255,255,255,0.15)] bg-transparent px-4 py-2.5 text-[14px] font-medium text-[#F5F5F0] transition-colors hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-50"
                        >
                            Salvar rascunho
                        </button>
                        <button
                            onClick={() => handleSave("active")}
                            disabled={isSaving}
                            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#E85D24] to-[#F5A623] px-5 py-2.5 text-[14px] font-medium text-white shadow-[0_0_20px_rgba(232,93,36,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(232,93,36,0.4)] animate-gradient disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publicar"}
                            {!isSaving && <ArrowLeft className="h-4 w-4 rotate-180" />}
                        </button>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="mt-8 flex gap-6 flex-col lg:flex-row">
                    {/* Left Column - Settings */}
                    <div className="w-full lg:w-[400px] shrink-0">
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
                                                className="h-11 md:h-10 w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0A0A0A] px-3 text-[16px] md:text-[14px] text-[#F5F5F0] placeholder:text-[#888880] focus:border-[rgba(232,93,36,0.3)] focus:outline-none transition-colors"
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
                                                className="flex h-11 md:h-10 w-full items-center justify-between rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0A0A0A] px-3 text-[16px] md:text-[14px] text-[#888880] transition-colors focus:border-[rgba(232,93,36,0.4)] focus:outline-none"
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

                            {/* Delete Section */}
                            <div className="mt-6 border-t border-[rgba(255,255,255,0.07)] pt-6">
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/10 border border-red-600/20 px-4 py-3 text-[13px] font-medium text-red-400 transition-colors hover:bg-red-600/20 hover:border-red-600/30"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Excluir ensaio
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Photos Container */}
                    <div className="flex-1 space-y-4">
                        <UploadZone sessionId={params.id} />
                        <PhotoGridManager sessionId={params.id} />
                    </div>
                </div>
            </div>

            <PublishSuccessModal
                isOpen={showPublishModal}
                onClose={() => setShowPublishModal(false)}
                galleryUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/galeria/${displaySlug}`}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
                    <div className="w-full max-w-md rounded-xl bg-[#1A1A1A] border border-[rgba(255,255,255,0.1)] p-6 animate-fade-in">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Excluir ensaio</h3>
                        </div>
                        <p className="text-sm text-[#888880] mb-6">
                            Tem certeza? Esta ação não pode ser desfeita. Todas as fotos e dados do ensaio serão permanentemente excluídos.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isSaving}
                                className="flex-1 rounded-lg border border-[rgba(255,255,255,0.1)] bg-transparent px-4 py-2 text-[13px] font-medium text-[#888880] transition-colors hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isSaving}
                                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Excluindo...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        Excluir
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
