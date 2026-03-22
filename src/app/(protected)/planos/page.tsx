"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getPhotographer } from "@/lib/supabase/photographer"
import { Check, X, AlertTriangle, Download, Star, Zap, Crown, Shield, Headphones, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { SharedTopBar } from "@/components/dashboard/shared-top-bar"

interface Plan {
    id: string
    name: string
    price: string
    features: string[]
    highlighted?: boolean
    current?: boolean
    disabled?: boolean
}

export default function PlanosPage() {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [photographer, setPhotographer] = useState<any>(null)
    const [storageUsed, setStorageUsed] = useState(0)
    const [storageLimit, setStorageLimit] = useState(2) // GB
    const [billingHistory, setBillingHistory] = useState<any[]>([])

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
                
                if (data) {
                    setPhotographer(data)
                    
                    // Set storage limit based on plan
                    const limits = { free: 2, starter: 10, pro: 100, professional: 500 }
                    setStorageLimit(limits[data.plan as keyof typeof limits] || 2)
                    
                    // Fetch storage usage
                    const { data: sessions } = await supabase
                        .from('sessions')
                        .select('id')
                        .eq('photographer_id', data.id)
                    
                    if (sessions && sessions.length > 0) {
                        // Note: file_size_bytes field doesn't exist in photos table yet
                        // const { data: photos } = await supabase
                        //     .from('photos')
                        //     .select('file_size_bytes')
                        //     .in('session_id', sessions.map(s => s.id))
                        
                        // const totalBytes = photos?.reduce((sum, photo) => sum + (photo.file_size_bytes || 0), 0) || 0
                        // setStorageUsed(totalBytes / (1024 * 1024 * 1024)) // Convert to GB
                        
                        // Mock storage for now
                        setStorageUsed(sessions.length * 0.5) // Estimate 0.5GB per session
                    }
                    
                    // Mock billing history for now
                    setBillingHistory([
                        {
                            date: '2024-01-15',
                            plan: 'Starter',
                            amount: 'R$47,00',
                            status: 'Pago',
                            invoice: '#INV-2024-001'
                        }
                    ])
                }
            }
            setLoading(false)
        }
        fetchData()
    }, [supabase])

    const storagePercentage = (storageUsed / storageLimit) * 100
    const storageStatus = storagePercentage > 95 ? 'critical' : storagePercentage > 80 ? 'warning' : 'normal'

    const plans: Plan[] = [
        {
            id: 'free',
            name: 'Free',
            price: 'R$0',
            features: [
                '1 ensaio ativo',
                '15 fotos por ensaio',
                '2GB armazenamento',
                'Link de galeria básico',
                'Modo Reviver',
                'Sem marca FrameZ',
                'Analytics'
            ],
            current: photographer?.plan === 'free' || !photographer?.plan,
            disabled: photographer?.plan === 'free' || !photographer?.plan
        },
        {
            id: 'starter',
            name: 'Starter',
            price: 'R$47/mês',
            features: [
                '5 ensaios ativos',
                '200 fotos por ensaio',
                '10GB armazenamento',
                'Sem marca FrameZ',
                'Modo Reviver',
                'QR Code',
                'Analytics completo',
                'Domínio personalizado'
            ],
            current: photographer?.plan === 'starter'
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 'R$97/mês',
            features: [
                'Ensaios ilimitados',
                'Fotos ilimitadas',
                '100GB armazenamento',
                'Sem marca FrameZ',
                'Modo Reviver + música',
                'Analytics completo',
                'Domínio personalizado',
                'QR Code'
            ],
            highlighted: true,
            current: photographer?.plan === 'pro'
        },
        {
            id: 'professional',
            name: 'Professional',
            price: 'R$197/mês',
            features: [
                'Tudo do Pro',
                '500GB armazenamento',
                'Até 3 fotógrafos',
                'Branding completo',
                'Suporte prioritário',
                'Relatórios avançados'
            ],
            current: photographer?.plan === 'professional'
        }
    ]

    if (loading) {
        return (
            <div className="flex flex-col w-full min-h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E85D24]"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full dashboard-page">
            <SharedTopBar title="Planos" />

            <div className="mx-auto w-full max-w-[1200px] px-4 py-5 md:p-8 space-y-8">
                {/* CURRENT PLAN CARD */}
                <div className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.06)] p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left side - Plan Info */}
                        <div>
                            <p className="text-[11px] uppercase tracking-wider text-[#888880] mb-2">Seu plano atual</p>
                            <h2 className="text-[48px] font-bold bg-gradient-to-r from-[#E85D24] to-[#F5A623] bg-clip-text text-transparent mb-4 tracking-[-0.05em]">
                                {plans.find(p => p.current)?.name || 'Free'}
                            </h2>
                            <p className="text-[16px] text-[#F5F5F0] mb-6">
                                {photographer?.plan === 'free' || !photographer?.plan ? 'Gratuito' : 
                                 `Renova em ${new Date().toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })}`}
                            </p>
                            
                            <div className="space-y-3">
                                {plans.find(p => p.current)?.features.slice(0, 4).map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-[#22C55E]" />
                                        <span className="text-[14px] text-[#F5F5F0]">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right side - Storage Meter */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative w-48 h-48 mb-4">
                                {/* Donut Chart */}
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="#333"
                                        strokeWidth="12"
                                        fill="none"
                                    />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke={storageStatus === 'critical' ? '#DC2626' : storageStatus === 'warning' ? '#F59E0B' : '#E85D24'}
                                        strokeWidth="12"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 88}`}
                                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - storagePercentage / 100)}`}
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                
                                {/* Center text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-[24px] font-bold text-[#F5F5F0]">
                                        {storageUsed.toFixed(1)} GB
                                    </p>
                                    <p className="text-[12px] text-[#888880]">de {storageLimit} GB</p>
                                </div>
                            </div>

                            {/* Storage breakdown */}
                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-[12px]">
                                    <span className="text-[#888880]">Ensaios</span>
                                    <span className="text-[#F5F5F0]">{storageUsed.toFixed(1)} GB</span>
                                </div>
                                <div className="flex justify-between text-[12px]">
                                    <span className="text-[#888880]">Disponível</span>
                                    <span className="text-[#F5F5F0]">{(storageLimit - storageUsed).toFixed(1)} GB</span>
                                </div>
                            </div>

                            {/* Storage status */}
                            <div className="mt-4 text-center">
                                <p className={cn(
                                    "text-[12px]",
                                    storageStatus === 'critical' ? 'text-red-400' :
                                    storageStatus === 'warning' ? 'text-amber-400' :
                                    'text-[#888880]'
                                )}>
                                    {storagePercentage.toFixed(0)}% usado · {(storageLimit - storageUsed).toFixed(1)} GB disponível
                                </p>
                                {storageStatus === 'warning' && (
                                    <p className="text-[11px] text-amber-400 mt-1">⚠️ Seu armazenamento está quase cheio</p>
                                )}
                                {storageStatus === 'critical' && (
                                    <p className="text-[11px] text-red-400 mt-1">🚨 Armazenamento crítico - Faça upgrade</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PLAN COMPARISON */}
                <div>
                    <h2 className="text-[24px] font-semibold text-[#F5F5F0] mb-6 tracking-[-0.05em]">Escolha seu plano</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={cn(
                                    "rounded-xl bg-[#111111] border p-6 transition-all hover-card",
                                    plan.highlighted 
                                        ? "border-[#E85D24] shadow-[0_0_30px_rgba(232,93,36,0.2)]" 
                                        : "border-[rgba(255,255,255,0.06)]"
                                )}
                            >
                                {plan.highlighted && (
                                    <div className="flex justify-center mb-4">
                                        <span className="px-3 py-1 bg-[#E85D24] text-[11px] font-medium text-white rounded-full">
                                            Mais popular
                                        </span>
                                    </div>
                                )}
                                
                                <div className="text-center mb-6">
                                    <h3 className="text-[20px] font-semibold text-[#F5F5F0] mb-2">{plan.name}</h3>
                                    <p className="text-[24px] font-bold text-[#F5F5F0]">{plan.price}</p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                                            <span className="text-[13px] text-[#F5F5F0]">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className={cn(
                                        "w-full py-3 rounded-lg font-medium transition-all",
                                        plan.current
                                            ? "bg-[#333] text-[#888880] cursor-not-allowed"
                                            : plan.highlighted
                                                ? "bg-gradient-to-r from-[#E85D24] to-[#F5A623] text-white hover:shadow-[0_0_20px_rgba(232,93,36,0.3)]"
                                                : "border border-[rgba(255,255,255,0.06)] text-[#F5F5F0] hover:bg-[rgba(255,255,255,0.05)]"
                                    )}
                                    disabled={plan.current}
                                >
                                    {plan.current ? 'Plano atual' : `Assinar ${plan.name}`}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BILLING HISTORY */}
                <div>
                    <h2 className="text-[24px] font-semibold text-[#F5F5F0] mb-6 tracking-[-0.05em]">Histórico de cobranças</h2>
                    
                    {billingHistory.length > 0 ? (
                        <div className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.06)] overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[rgba(255,255,255,0.06)]">
                                        <th className="text-left p-4 text-[13px] font-medium text-[#888880]">Data</th>
                                        <th className="text-left p-4 text-[13px] font-medium text-[#888880]">Plano</th>
                                        <th className="text-left p-4 text-[13px] font-medium text-[#888880]">Valor</th>
                                        <th className="text-left p-4 text-[13px] font-medium text-[#888880]">Status</th>
                                        <th className="text-left p-4 text-[13px] font-medium text-[#888880]">Download NF</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {billingHistory.map((item, index) => (
                                        <tr key={index} className="border-b border-[rgba(255,255,255,0.06)]">
                                            <td className="p-4 text-[14px] text-[#F5F5F0]">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                                            <td className="p-4 text-[14px] text-[#F5F5F0]">{item.plan}</td>
                                            <td className="p-4 text-[14px] text-[#F5F5F0]">{item.amount}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-[rgba(34,197,94,0.15)] text-[#22C55E] text-[12px] rounded-full">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button className="text-[#E85D24] hover:text-[#F5A623] transition-colors flex items-center gap-1">
                                                    <Download className="w-4 h-4" />
                                                    NF
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.06)] p-12 text-center">
                            <FileText className="w-12 h-12 text-[#888880] mx-auto mb-4" />
                            <p className="text-[16px] text-[#F5F5F0] mb-2">Nenhuma cobrança ainda</p>
                            <p className="text-[14px] text-[#888880]">Seu histórico de cobranças aparecerá aqui</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
