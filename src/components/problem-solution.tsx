"use client"

import { useEffect, useRef } from "react"
import { X, Check } from "lucide-react"

export function ProblemSolution() {
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

  const problems = [
    "Links genéricos do Google Drive ou Dropbox",
    "Fotos espalhadas sem ordem ou contexto",
    "Experiência impessoal e esquecível",
  ]

  const solutions = [
    "Galeria com design cinematográfico personalizado",
    "Curadoria organizada com modos de visualização",
    "Experiência imersiva que emociona o cliente",
  ]

  return (
    <section
      ref={sectionRef}
      className="py-[60px] lg:py-[60px] border-t border-[rgba(255,255,255,0.05)]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <div className="reveal text-center mb-12">
          <h2 className="font-medium tracking-tighter text-[32px] md:text-[40px] text-[#F5F5F0] mb-3">
            Por que a FrameZ?
          </h2>
          <p className="text-[#888880] text-lg">
            A diferença está na experiência que você entrega
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem */}
          <div
            className="reveal bg-[#111111] rounded-xl p-7 border border-[rgba(255,255,255,0.07)] feature-card"
            style={{ transitionDelay: "0ms" }}
          >
            <h3 className="text-[#888880] text-sm uppercase tracking-wide mb-6">
              Como os fotógrafos entregam hoje
            </h3>
            <ul className="space-y-5">
              {problems.map((problem, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2a1a1a] flex items-center justify-center mt-0.5">
                    <X size={14} className="text-red-400" />
                  </div>
                  <span className="text-[#F5F5F0] leading-relaxed">{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div
            className="reveal bg-[#111111] rounded-xl p-7 border border-[rgba(255,255,255,0.07)] border-l-2 border-l-[#E85D24] feature-card"
            style={{ transitionDelay: "100ms" }}
          >
            <h3 className="text-[#E85D24] text-sm uppercase tracking-wide mb-6">
              Como a FrameZ entrega
            </h3>
            <ul className="space-y-5">
              {solutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1a2a1a] flex items-center justify-center mt-0.5">
                    <Check size={14} className="text-[#E85D24]" />
                  </div>
                  <span className="text-[#F5F5F0] leading-relaxed">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
