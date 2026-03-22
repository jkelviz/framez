"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isAnnual, setIsAnnual] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 }
    )

    const reveals = sectionRef.current?.querySelectorAll(".reveal")
    reveals?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const plans = [
    {
      name: "Free",
      priceMonthly: 0,
      priceAnnual: 0,
      description: "Entrada para testar a plataforma",
      features: [
        "Até 3 ensaios ativos",
        "Até 2 GB total",
        "Marca FrameZ",
        "Galeria básica",
      ],
      cta: "Começar grátis",
      highlighted: false,
      order: 2, // Mobile order
    },
    {
      name: "Pro",
      priceMonthly: 97,
      priceAnnual: 78,
      description: "Pode usar à vontade",
      features: [
        "Até 50 GB",
        "Ensaios ilimitados",
        "Fotos ilimitadas",
        "Sem marca FrameZ",
        "Modo Reviver",
        "Analytics básico",
      ],
      cta: "Assinar Pro",
      highlighted: true,
      badge: "Mais popular",
      order: 1, // Mobile order - first
    },
    {
      name: "Professional",
      priceMonthly: 247,
      priceAnnual: 197,
      description: "Para escalar seu negócio",
      features: [
        "Até 200 GB",
        "Tudo do Pro",
        "Domínio personalizado",
        "Branding completo",
        "Múltiplos fotógrafos",
        "Analytics avançado",
      ],
      cta: "Assinar Professional",
      highlighted: false,
      order: 3, // Mobile order
    },
  ]

  const formatPrice = (price: number) => {
    return price === 0 ? "R$0" : `R$${price}`
  }

  // Sort plans for mobile (Pro first)
  const sortedPlans = [...plans].sort((a, b) => a.order - b.order)

  return (
    <section
      ref={sectionRef}
      id="precos"
      className="py-[60px] lg:py-[100px] border-t border-[rgba(255,255,255,0.05)]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10 lg:mb-12">
          <h2 className="reveal font-medium tracking-tighter text-3xl lg:text-5xl text-[#F5F5F0] mb-4">
            Planos que crescem com você
          </h2>
          <p className="reveal text-[#888880] text-base lg:text-lg max-w-2xl mx-auto" style={{ transitionDelay: "0.1s" }}>
            Comece grátis e escale conforme sua necessidade
          </p>
        </div>

        {/* Toggle */}
        <div className="reveal flex items-center justify-center gap-3 lg:gap-4 mb-10 lg:mb-12 flex-wrap" style={{ transitionDelay: "0.15s" }}>
          <span className={`text-sm ${!isAnnual ? 'text-[#F5F5F0]' : 'text-[#888880]'}`}>
            Mensal
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-7 rounded-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] transition-colors"
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-[#E85D24] transition-all duration-300 ${isAnnual ? 'left-8' : 'left-1'
                }`}
            />
          </button>
          <span className={`text-sm ${isAnnual ? 'text-[#F5F5F0]' : 'text-[#888880]'}`}>
            Anual
          </span>
          <span className="inline-flex items-center bg-[#E85D24]/20 text-[#E85D24] text-xs font-medium px-3 py-1 rounded-full">
            Economize 20%
          </span>
        </div>

        {/* Mobile: sorted order (Pro first) */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {sortedPlans.map((plan, index) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly
            const period = price === 0 ? "" : "/mês"

            return (
              <PricingCard
                key={plan.name}
                plan={plan}
                price={price}
                period={period}
                formatPrice={formatPrice}
                isAnnual={isAnnual}
                delay={index}
              />
            )
          })}
        </div>

        {/* Tablet/Desktop: original order */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-8">
          {plans.map((plan, index) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly
            const period = price === 0 ? "" : "/mês"

            return (
              <PricingCard
                key={plan.name}
                plan={plan}
                price={price}
                period={period}
                formatPrice={formatPrice}
                isAnnual={isAnnual}
                delay={index}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

interface PricingCardProps {
  plan: {
    name: string
    priceMonthly: number
    priceAnnual: number
    description: string
    features: string[]
    cta: string
    highlighted: boolean
    badge?: string
  }
  price: number
  period: string
  formatPrice: (price: number) => string
  isAnnual: boolean
  delay: number
}

function PricingCard({ plan, price, period, formatPrice, isAnnual, delay }: PricingCardProps) {
  const handleCtaClick = () => {
    if (plan.name === "Free") {
      window.location.href = "/cadastro"
    } else {
      window.location.href = `/api/stripe/checkout?plan=${plan.name.toLowerCase()}`
    }
  }

  return (
    <div
      className={`reveal relative bg-[#111111] rounded-xl p-6 lg:p-8 border ${plan.highlighted
        ? "border-[#E85D24]"
        : "border-[rgba(255,255,255,0.07)]"
        }`}
      style={{ transitionDelay: `${0.1 * (delay + 2)}s` }}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E85D24] text-[#F5F5F0] text-xs font-medium px-4 py-1 rounded-full">
          {plan.badge}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-[#F5F5F0] text-xl font-medium mb-2">{plan.name}</h3>
        <p className="text-[#888880] text-sm">{plan.description}</p>
      </div>

      <div className="mb-8">
        <span className="font-medium tracking-tighter text-4xl text-[#F5F5F0]">
          {formatPrice(price)}
        </span>
        <span className="text-[#888880] text-sm">{period}</span>
        {isAnnual && price > 0 && (
          <div className="text-[#888880] text-xs mt-1">
            cobrado anualmente
          </div>
        )}
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#1a2a1a] flex items-center justify-center flex-shrink-0">
              <Check size={12} className="text-[#E85D24]" />
            </div>
            <span className="text-[#888880] text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleCtaClick}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${plan.highlighted
          ? "animated-gradient-btn text-[#F5F5F0]"
          : "border border-[rgba(255,255,255,0.2)] text-[#F5F5F0] hover:border-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.05)]"
          }`}
      >
        {plan.cta}
      </button>
    </div>
  )
}
