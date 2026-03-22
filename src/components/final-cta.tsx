"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)

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

  return (
    <section
      ref={sectionRef}
      className="py-[60px] lg:py-[100px] border-t border-[rgba(255,255,255,0.05)] relative overflow-hidden"
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 noise-overlay" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="reveal font-medium tracking-tighter text-3xl lg:text-5xl text-[#F5F5F0] mb-6">
          Pronto para transformar suas entregas?
        </h2>
        <p className="reveal text-[#888880] text-lg mb-10 max-w-2xl mx-auto" style={{ transitionDelay: "0.1s" }}>
          Junte-se a mais de 500 fotógrafos que já estão encantando seus clientes com entregas cinematográficas.
        </p>
        <div className="reveal" style={{ transitionDelay: "0.2s" }}>
          <Link href="/cadastro" className="animated-gradient-btn text-[#F5F5F0] px-10 py-4 rounded-lg text-lg font-medium inline-flex items-center gap-2 group">
            Começar grátis
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
