"use client"

import { useEffect, useRef } from "react"

export function SocialProof() {
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

  const testimonials = [
    {
      name: "Marina Silva",
      city: "São Paulo, SP",
      quote: "Meus clientes ficam emocionados quando abrem a galeria. É uma experiência que nenhum outro serviço oferece.",
    },
    {
      name: "Ricardo Almeida",
      city: "Rio de Janeiro, RJ",
      quote: "Desde que comecei a usar a FrameZ, meus pedidos de indicação triplicaram. O diferencial está na entrega.",
    },
    {
      name: "Camila Santos",
      city: "Belo Horizonte, MG",
      quote: "O modo Reviver com música é simplesmente incrível. Meus clientes choram de emoção assistindo.",
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="fotografos"
      className="py-[60px] lg:py-[100px] border-t border-[rgba(255,255,255,0.05)]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="reveal font-medium tracking-tighter text-3xl lg:text-5xl text-[#F5F5F0] mb-4">
            O que dizem os fotógrafos
          </h2>
          <p className="reveal text-[#888880] text-base lg:text-lg max-w-2xl mx-auto" style={{ transitionDelay: "0.1s" }}>
            Histórias de quem já transformou sua entrega
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="reveal bg-[#111111] rounded-xl p-6 lg:p-8 border border-[rgba(255,255,255,0.07)] testimonial-card"
              style={{ transitionDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E85D24] to-[#b84a1c]" />
                <div>
                  <div className="text-[#F5F5F0] font-medium">{testimonial.name}</div>
                  <div className="text-[#888880] text-sm">{testimonial.city}</div>
                </div>
              </div>
              <p className="text-[#888880] leading-relaxed italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
