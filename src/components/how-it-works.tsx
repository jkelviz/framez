"use client"

import { useEffect, useRef } from "react"
import { UserPlus, Upload, Link2, Heart } from "lucide-react"

export function HowItWorks() {
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

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Crie uma conta",
    },
    {
      number: "02",
      icon: Upload,
      title: "Faça upload das fotos",
    },
    {
      number: "03",
      icon: Link2,
      title: "Compartilhe o link",
    },
    {
      number: "04",
      icon: Heart,
      title: "Cliente revive o momento",
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="py-[60px] lg:py-[100px] border-t border-[rgba(255,255,255,0.05)]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12 lg:mb-20">
          <h2 className="reveal font-medium tracking-tighter text-3xl lg:text-5xl text-[#F5F5F0] mb-4">
            Como funciona
          </h2>
          <p className="reveal text-[#888880] text-base lg:text-lg max-w-2xl mx-auto" style={{ transitionDelay: "0.1s" }}>
            Em quatro passos simples, transforme a entrega dos seus ensaios
          </p>
        </div>

        {/* Steps with connecting line */}
        <div className="relative">
          {/* Connecting line - horizontal on desktop, vertical on mobile */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-[2px] bg-[rgba(255,255,255,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E85D24]/0 via-[#E85D24]/50 to-[#E85D24]/0" />
          </div>

          {/* Vertical line for mobile */}
          <div className="lg:hidden absolute top-0 bottom-0 left-10 w-[2px] bg-[rgba(255,255,255,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#E85D24]/0 via-[#E85D24]/50 to-[#E85D24]/0" />
          </div>

          {/* Mobile: vertical layout */}
          <div className="flex flex-col gap-8 lg:hidden">
            {steps.map((step, index) => (
              <div
                key={index}
                className="reveal relative flex items-center gap-6 pl-0"
                style={{ transitionDelay: `${0.1 * (index + 1)}s` }}
              >
                {/* Icon circle */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-[#111111] border border-[rgba(255,255,255,0.1)] flex items-center justify-center flex-shrink-0">
                  <step.icon size={28} className="text-[#888880]" />
                </div>

                <div>
                  {/* Number */}
                  <div className="font-medium tracking-tighter text-3xl text-[#E85D24] mb-1 leading-none">
                    {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="text-[#F5F5F0] text-base font-medium">
                    {step.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: horizontal layout */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="reveal relative flex flex-col items-center text-center"
                style={{ transitionDelay: `${0.1 * (index + 1)}s` }}
              >
                {/* Icon circle */}
                <div className="relative z-10 w-24 h-24 rounded-full bg-[#111111] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6">
                  <step.icon size={28} className="text-[#888880]" />
                </div>

                {/* Number */}
                <div className="font-medium tracking-tighter text-5xl text-[#E85D24] mb-3 leading-none">
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="text-[#F5F5F0] text-lg font-medium max-w-[160px]">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
