"use client"

import { useState } from "react"
import { Search, MessageCircle, ChevronDown, ChevronUp, Phone, Mail, Shield, CreditCard, Image, Upload, Lock, HelpCircle, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { SharedTopBar } from "@/components/dashboard/shared-top-bar"

interface FAQItem {
    question: string
    answer: string
}

interface FAQSection {
    title: string
    icon: any
    items: FAQItem[]
}

export default function AjudaPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [expandedItems, setExpandedItems] = useState<string[]>([])

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        )
    }

    const faqSections: FAQSection[] = [
        {
            title: "COMEÇANDO",
            icon: HelpCircle,
            items: [
                {
                    question: "Como criar meu primeiro ensaio?",
                    answer: "Clique em \"+ Novo Ensaio\" no menu, preencha o nome do cliente, faça upload das fotos e clique em Publicar. Em segundos você terá um link para compartilhar com seu cliente."
                },
                {
                    question: "Como compartilhar a galeria com meu cliente?",
                    answer: "Após publicar, copie o link na página do ensaio ou clique em \"Copiar link\". Envie por WhatsApp, email ou qualquer outro canal."
                },
                {
                    question: "Meu cliente precisa criar uma conta?",
                    answer: "Não! Seu cliente acessa a galeria direto pelo link, sem precisar se cadastrar."
                }
            ]
        },
        {
            title: "GALERIAS",
            icon: Image,
            items: [
                {
                    question: "Qual a diferença entre Grid, Cinematic e Story?",
                    answer: "Grid: fotos em mosaico, ideal para casamentos e ensaios completos. Cinematic: uma foto por vez em fullscreen, muito impactante. Story: scroll vertical contínuo, estilo Instagram."
                },
                {
                    question: "Como funciona o Modo Reviver?",
                    answer: "O Modo Reviver é um slideshow cinematográfico que passa as fotos automaticamente com transições suaves. Seu cliente clica em \"Reviver\" na galeria e revive o momento."
                },
                {
                    question: "Posso proteger a galeria com senha?",
                    answer: "Sim! Ao criar ou editar um ensaio, ative \"Proteger com senha\" e defina uma senha. Apenas quem tiver a senha acessa."
                }
            ]
        },
        {
            title: "FOTOS E UPLOAD",
            icon: Upload,
            items: [
                {
                    question: "Quais formatos de foto são aceitos?",
                    answer: "JPG, PNG e WEBP. Tamanho máximo de 20MB por foto."
                },
                {
                    question: "Posso reordenar as fotos após o upload?",
                    answer: "Sim, arraste as fotos para mudar a ordem na página de edição."
                },
                {
                    question: "Como definir a foto de capa do ensaio?",
                    answer: "Passe o mouse sobre qualquer foto e clique em \"Definir como capa\"."
                }
            ]
        },
        {
            title: "PLANOS E PAGAMENTO",
            icon: CreditCard,
            items: [
                {
                    question: "Posso cancelar a qualquer momento?",
                    answer: "Sim, sem multa ou fidelidade. Cancele quando quiser em Configurações → Planos."
                },
                {
                    question: "O que acontece com meus ensaios se eu cancelar?",
                    answer: "Seus ensaios ficam acessíveis por 30 dias após o cancelamento. Após esse prazo, as galerias são arquivadas."
                },
                {
                    question: "Emitem nota fiscal?",
                    answer: "Sim, a nota fiscal é enviada automaticamente por email após cada cobrança."
                }
            ]
        },
        {
            title: "CONTA E SEGURANÇA",
            icon: Shield,
            items: [
                {
                    question: "Como alterar minha senha?",
                    answer: "Vá em Configurações → Segurança → Alterar senha. Você receberá um email com o link para redefinição."
                },
                {
                    question: "Meus dados são seguros?",
                    answer: "Sim. Todos os dados são criptografados e armazenados em servidores na União Europeia com backup diário."
                }
            ]
        }
    ]

    // Filter FAQ items based on search
    const filteredSections = faqSections.map(section => ({
        ...section,
        items: section.items.filter(item => 
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(section => section.items.length > 0)

    return (
        <div className="flex flex-col w-full dashboard-page">
            <SharedTopBar title="Ajuda" />

            <div className="mx-auto w-full max-w-[1200px] px-4 py-5 md:p-8 space-y-8">
                {/* SEARCH BAR */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888880]" />
                    <input
                        type="text"
                        placeholder="Buscar nas perguntas frequentes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-xl text-[#F5F5F0] placeholder:text-[#555] focus:outline-none focus:border-[#E85D24] transition-colors"
                    />
                </div>

                {/* WHATSAPP SUPPORT CARD */}
                <div className="rounded-xl bg-[rgba(37,211,102,0.1)] border border-[#25D366] p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center">
                                <MessageCircle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-[18px] font-semibold text-[#F5F5F0] mb-1">Falar com o suporte</h3>
                                <p className="text-[14px] text-[#888880]">Resposta em até 2 horas · Seg-Sex 9h-18h</p>
                            </div>
                        </div>
                        <a
                            href="https://wa.me/5500000000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-[#25D366] text-[14px] font-medium text-white rounded-lg hover:bg-[#128C7E] transition-colors flex items-center gap-2"
                        >
                            Abrir WhatsApp
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* FAQ SECTIONS */}
                <div className="space-y-8">
                    {filteredSections.map((section, sectionIndex) => {
                        const Icon = section.icon
                        return (
                            <div key={sectionIndex}>
                                <div className="flex items-center gap-3 mb-6">
                                    <Icon className="w-6 h-6 text-[#E85D24]" />
                                    <h2 className="text-[20px] font-semibold text-[#F5F5F0] tracking-[-0.05em]">
                                        {section.title}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {section.items.map((item, itemIndex) => {
                                        const itemId = `${sectionIndex}-${itemIndex}`
                                        const isExpanded = expandedItems.includes(itemId)

                                        return (
                                            <div
                                            key={itemId}
                                            className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.06)] overflow-hidden transition-all hover-card"
                                        >
                                                <button
                                                    onClick={() => toggleExpanded(itemId)}
                                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                                                >
                                                    <h3 className="text-[15px] font-medium text-[#F5F5F0] pr-4">
                                                        {item.question}
                                                    </h3>
                                                    <div className="flex-shrink-0">
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-5 h-5 text-[#888880]" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-[#888880]" />
                                                        )}
                                                    </div>
                                                </button>
                                                
                                                <div
                                                    className={cn(
                                                        "overflow-hidden accordion-content",
                                                        isExpanded ? "max-h-96" : "max-h-0"
                                                    )}
                                                >
                                                    <div className="px-6 pb-4">
                                                        <p className="text-[14px] text-[#888880] leading-relaxed">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* BOTTOM CTA */}
                <div className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.06)] p-8 text-center">
                    <h3 className="text-[20px] font-semibold text-[#F5F5F0] mb-2">
                        Não encontrou o que procurava?
                    </h3>
                    <p className="text-[14px] text-[#888880] mb-6">
                        Entre em contato pelo WhatsApp e te ajudamos em minutos
                    </p>
                    <a
                        href="https://wa.me/5500000000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-[14px] font-medium text-white rounded-lg hover:bg-[#128C7E] transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Falar com suporte
                    </a>
                </div>
            </div>
        </div>
    )
}
