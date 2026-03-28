"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getPhotographer } from "@/lib/supabase/photographer"

export function PlanBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [plan, setPlan] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPlan() {
      const supabase = createClient()
      const photographer = await getPhotographer(supabase)
      if (photographer) {
        setPlan(photographer.plan || 'free')
      }
    }
    fetchPlan()
  }, [])

  if (!isVisible || plan === 'free') return null

  return (
    <div className="flex h-[44px] md:h-11 w-full items-center justify-between rounded-[12px] border border-[rgba(232,93,36,0.2)] bg-[rgba(232,93,36,0.08)] px-3 md:px-4 active:scale-[0.98] active:opacity-90 transition-all duration-150 animate-fade-in md:animate-fade-in-up">
      {/* Left side */}
      <div className="flex items-center gap-2 overflow-hidden mr-2">
        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] md:text-[11px] font-bold uppercase text-primary-foreground tracking-[1px] shrink-0 leading-none">
          {plan === 'free' ? 'Gratuito' : (plan?.charAt(0)?.toUpperCase() + (plan?.slice(1) || ''))}
        </span>
        {plan !== 'free' && (
          <span className="text-[12px] md:text-[13px] text-muted-foreground tracking-[-0.05em] whitespace-nowrap truncate leading-none">
            Próxima cobrança: 15 abr 2026
          </span>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center shrink-0">
        <Link
          href="/planos"
          className="text-[12px] md:text-[13px] font-medium text-[#E85D24] tracking-[-0.05em] transition-all md:hover:underline whitespace-nowrap leading-none"
        >
          Gerenciar
        </Link>
      </div>
    </div>
  )
}
