"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getPhotographer } from "@/lib/supabase/photographer"
import { toast } from "sonner"
import { Upload, User, Lock, Settings, Trash2, Download, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { SharedTopBar } from "@/components/dashboard/shared-top-bar"

export default function ConfiguracoesPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [photographer, setPhotographer] = useState<any>(null)
    
    // Profile state
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [bio, setBio] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")
    
    // Security state
    const [emailNotifications, setEmailNotifications] = useState(true)
    
    // Gallery settings state
    const [defaultStyle, setDefaultStyle] = useState("grid")
    const [showFramezBrand, setShowFramezBrand] = useState(true)
    const [allowDownloads, setAllowDownloads] = useState(true)
    const [showPhotoCounter, setShowPhotoCounter] = useState(true)
    
    // Account state
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        async function fetchData() {
            const photographerData = await getPhotographer(supabase)
            if (photographerData) {
                // Fetch full photographer details
                const { data } = await supabase
                    .from('photographers')
                    .select('*')
                    .eq('user_id', photographerData.user_id)
                    .single()
                
                // Fetch auth user for email
                const { data: { user } } = await supabase.auth.getUser()
                
                if (data) {
                    setPhotographer(data)
                    setName(data.name || "")
                    setEmail(user?.email || "")
                    setBio(data.bio || "")
                    setAvatarUrl(data.avatar_url || "")
                    // Note: These settings are not in the database schema yet
                    // setEmailNotifications(data.email_notifications !== false)
                    // setDefaultStyle(data.default_gallery_style || "grid")
                    // setShowFramezBrand(data.show_framez_brand !== false)
                    // setAllowDownloads(data.allow_downloads !== false)
                    // setShowPhotoCounter(data.show_photo_counter !== false)
                }
            }
            setLoading(false)
        }
        fetchData()
    }, [supabase])

    const handleSaveProfile = async () => {
        setSaving(true)
        try {
            const { error } = await supabase
                .from('photographers')
                .update({
                    name,
                    phone,
                    bio,
                    email_notifications: emailNotifications,
                    default_gallery_style: defaultStyle,
                    show_framez_brand: showFramezBrand,
                    allow_downloads: allowDownloads,
                    show_photo_counter: showPhotoCounter
                })
                .eq('user_id', photographer.user_id)
            
            if (error) throw error
            toast.success("Perfil atualizado com sucesso!")
        } catch (error: any) {
            toast.error("Erro ao salvar perfil: " + error.message)
        } finally {
            setSaving(false)
        }
    }

    const handlePasswordReset = async () => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email)
            if (error) throw error
            toast.success("Email de redefinição enviado!")
        } catch (error: any) {
            toast.error("Erro ao enviar email: " + error.message)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            // This would need proper implementation with cascading deletes
            toast.error("Funcionalidade em desenvolvimento")
            setShowDeleteModal(false)
        } catch (error: any) {
            toast.error("Erro ao excluir conta: " + error.message)
        }
    }

    const handleExportData = async () => {
        try {
            // This would need proper implementation
            toast.success("Preparando seus dados...")
        } catch (error: any) {
            toast.error("Erro ao exportar dados: " + error.message)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col w-full min-h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E85D24]"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full dashboard-page">
            <SharedTopBar title="Configurações" />

            <div className="mx-auto w-full max-w-[1200px] px-4 py-5 md:p-8 space-y-8">
                {/* PERFIL DO FOTÓGRAFO */}
                <div className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.06)] p-6 md:p-8">
                    <h2 className="text-[20px] font-semibold text-[#F5F5F0] mb-6 tracking-[-0.05em]">Perfil do Fotógrafo</h2>
                    
                    <div className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E85D24] to-[#FF7A45] flex items-center justify-center border-2 border-dashed border-[#E85D24] cursor-pointer transition-all hover:border-[#FF7A45]">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-white" />
                                    )}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div>
                                <p className="text-[14px] font-medium text-[#F5F5F0]">Foto de perfil</p>
                                <p className="text-[12px] text-[#888880]">Clique para alterar</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[13px] font-medium text-[#888880] mb-2">Nome profissional</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-11 px-4 bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#F5F5F0] placeholder:text-[#555] focus:outline-none focus:border-[rgba(232,93,36,0.4)] transition-colors"
                                    placeholder="Seu nome"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-[#888880] mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full h-11 px-4 bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#555] placeholder:text-[#555] cursor-not-allowed"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-[#888880] mb-2">Telefone / WhatsApp</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full h-11 px-4 bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#F5F5F0] placeholder:text-[#555] focus:outline-none focus:border-[rgba(232,93,36,0.4)] transition-colors"
                                    placeholder="+55 (00) 00000-0000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[13px] font-medium text-[#888880] mb-2">
                                Bio <span className="text-[11px]">({bio.length}/300)</span>
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value.slice(0, 300))}
                                className="w-full h-24 px-4 py-3 bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#F5F5F0] placeholder:text-[#555] focus:outline-none focus:border-[rgba(232,93,36,0.4)] transition-colors resize-none"
                                placeholder="Conte um pouco sobre seu trabalho e estilo..."
                            />
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="px-6 py-3 bg-gradient-to-r from-[#E85D24] to-[#F5A623] text-[14px] font-medium text-white rounded-lg transition-all hover:shadow-[0_0_20px_rgba(232,93,36,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Salvando..." : "Salvar alterações"}
                        </button>
                    </div>
                </div>

                {/* SEGURANÇA */}
                <div className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.06)] p-6 md:p-8">
                    <h2 className="text-[20px] font-semibold text-[#F5F5F0] mb-6 tracking-[-0.05em]">Segurança</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <button
                                onClick={handlePasswordReset}
                                className="px-4 py-2 bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] text-[#F5F5F0] rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                            >
                                Alterar senha
                            </button>
                            <p className="mt-2 text-[12px] text-[#888880]">Um email será enviado para redefinir sua senha</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[14px] font-medium text-[#F5F5F0]">Notificações por email</p>
                                <p className="text-[12px] text-[#888880]">Novas visualizações, favoritos, downloads</p>
                            </div>
                            <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={cn(
                                    "relative h-6 w-11 rounded-full transition-colors",
                                    emailNotifications ? "bg-[#E85D24]" : "bg-[#333]"
                                )}
                            >
                                <div
                                    className={cn(
                                        "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                                        emailNotifications ? "left-6" : "left-1"
                                    )}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* GALERIA — CONFIGURAÇÕES PADRÃO */}
                <div className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.06)] p-6 md:p-8">
                    <h2 className="text-[20px] font-semibold text-[#F5F5F0] mb-6 tracking-[-0.05em]">Galeria — Configurações Padrão</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[13px] font-medium text-[#888880] mb-2">Estilo padrão das galerias</label>
                            <select
                                value={defaultStyle}
                                onChange={(e) => setDefaultStyle(e.target.value)}
                                className="w-full h-11 px-4 bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#F5F5F0] focus:outline-none focus:border-[rgba(232,93,36,0.4)] transition-colors"
                            >
                                <option value="grid">Grid</option>
                                <option value="cinematic">Cinematic</option>
                                <option value="story">Story</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[14px] font-medium text-[#F5F5F0]">Mostrar marca FrameZ nas galerias</p>
                                    <p className="text-[12px] text-[#888880]">Desativado no plano Pro+</p>
                                </div>
                                <button
                                    onClick={() => setShowFramezBrand(!showFramezBrand)}
                                    disabled={photographer?.plan === 'pro' || photographer?.plan === 'professional'}
                                    className={cn(
                                        "relative h-6 w-11 rounded-full transition-colors",
                                        showFramezBrand ? "bg-[#E85D24]" : "bg-[#333]",
                                        (photographer?.plan === 'pro' || photographer?.plan === 'professional') && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                                            showFramezBrand ? "left-6" : "left-1"
                                        )}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[14px] font-medium text-[#F5F5F0]">Permitir download das fotos</p>
                                    <p className="text-[12px] text-[#888880]">Clientes podem baixar as fotos</p>
                                </div>
                                <button
                                    onClick={() => setAllowDownloads(!allowDownloads)}
                                    className={cn(
                                        "relative h-6 w-11 rounded-full transition-colors",
                                        allowDownloads ? "bg-[#E85D24]" : "bg-[#333]"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                                            allowDownloads ? "left-6" : "left-1"
                                        )}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[14px] font-medium text-[#F5F5F0]">Exibir contador de fotos</p>
                                    <p className="text-[12px] text-[#888880]">Mostrar número de fotos na galeria</p>
                                </div>
                                <button
                                    onClick={() => setShowPhotoCounter(!showPhotoCounter)}
                                    className={cn(
                                        "relative h-6 w-11 rounded-full transition-colors",
                                        showPhotoCounter ? "bg-[#E85D24]" : "bg-[#333]"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                                            showPhotoCounter ? "left-6" : "left-1"
                                        )}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTA */}
                <div className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.06)] p-6 md:p-8">
                    <h2 className="text-[20px] font-semibold text-[#F5F5F0] mb-6 tracking-[-0.05em]">Conta</h2>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-[12px] text-[#888880] mb-1">Membro desde</p>
                                <p className="text-[14px] font-medium text-[#F5F5F0]">
                                    {photographer?.created_at ? new Date(photographer.created_at).toLocaleDateString('pt-BR', { 
                                        day: '2-digit', 
                                        month: 'long', 
                                        year: 'numeric' 
                                    }) : '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[12px] text-[#888880] mb-1">Total de ensaios criados</p>
                                <p className="text-[14px] font-medium text-[#F5F5F0]">0</p> {/* TODO: Fetch real count */}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                            <button
                                onClick={handleExportData}
                                className="px-4 py-2 border border-[rgba(255,255,255,0.06)] text-[#F5F5F0] rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Exportar meus dados
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 border border-red-600/20 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Excluir conta
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
                    <div className="w-full max-w-md rounded-xl bg-[#1A1A1A] border border-[rgba(255,255,255,0.1)] p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Excluir conta</h3>
                        </div>
                        <p className="text-sm text-[#888880] mb-6">
                            Tem certeza? Esta ação não pode ser desfeita. Todos os seus ensaios e dados serão permanentemente excluídos.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 rounded-lg border border-[rgba(255,255,255,0.1)] bg-transparent px-4 py-2 text-[13px] font-medium text-[#888880] transition-colors hover:bg-[rgba(255,255,255,0.05)]"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-red-700"
                            >
                                Excluir conta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
