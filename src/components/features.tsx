"use client"

import { useEffect, useRef } from "react"
import { Play, LayoutGrid, Maximize2, Upload, Music, Image, Folder, Share2 } from "lucide-react"

export function Features() {
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

  const features = [
    {
      title: "Galeria do Cliente",
      description: "Uma experiência visual que impressiona",
      bullets: [
        { icon: LayoutGrid, text: "Visualização em grid elegante" },
        { icon: Maximize2, text: "Fullscreen imersivo" },
        { icon: Share2, text: "Favoritos e download fácil" },
      ],
      mockupType: "gallery",
    },
    {
      title: "Modo Reviver",
      description: "O momento ganha vida novamente",
      bullets: [
        { icon: Play, text: "Slideshow cinematográfico" },
        { icon: Music, text: "Música ambiente integrada" },
        { icon: Maximize2, text: "Experiência fullscreen" },
      ],
      mockupType: "slideshow",
    },
    {
      title: "Editor de Ensaios",
      description: "Upload simples, resultado profissional",
      bullets: [
        { icon: Upload, text: "Drag & drop intuitivo" },
        { icon: Folder, text: "Organização em pastas" },
        { icon: Image, text: "Capa e descrição personalizadas" },
      ],
      mockupType: "editor",
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="recursos"
      className="py-[60px] lg:py-[100px] border-t border-[rgba(255,255,255,0.05)]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12 lg:mb-20">
          <h2 className="reveal font-medium tracking-tighter text-3xl lg:text-5xl text-[#F5F5F0] mb-4">
            Recursos que encantam
          </h2>
          <p className="reveal text-[#888880] text-base lg:text-lg max-w-2xl mx-auto" style={{ transitionDelay: "0.1s" }}>
            Ferramentas pensadas para transformar a forma como você entrega seus ensaios
          </p>
        </div>

        <div className="space-y-12 lg:space-y-24">
          {features.map((feature, index) => {
            const isReversed = index % 2 === 1

            return (
              <div
                key={index}
                className={`reveal flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-6 lg:gap-16 items-center`}
                style={{ transitionDelay: `${0.1 * (index + 1)}s` }}
              >
                {/* Mockup / GIF Placeholder */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/3] bg-[#111111] rounded-2xl border border-[rgba(255,255,255,0.07)] overflow-hidden group cursor-pointer feature-card">
                    {/* Mockup content based on type */}
                    {feature.mockupType === "gallery" && (
                      <div className="absolute inset-0 p-4">
                        <div className="grid grid-cols-3 gap-2 h-full">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-[#1a1a1a] rounded-lg" />
                          ))}
                        </div>
                      </div>
                    )}
                    {feature.mockupType === "slideshow" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 aspect-video bg-[#252525] rounded-lg" />
                        </div>
                      </div>
                    )}
                    {feature.mockupType === "editor" && (
                      <div className="absolute inset-0 p-4">
                        <div className="h-full border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-xl flex items-center justify-center">
                          <Upload size={48} className="text-[rgba(255,255,255,0.2)]" />
                        </div>
                      </div>
                    )}

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-[#E85D24] flex items-center justify-center">
                        <Play size={28} className="text-[#F5F5F0] ml-1" fill="#F5F5F0" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <h3 className="font-medium tracking-tighter text-2xl lg:text-4xl text-[#F5F5F0] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#888880] text-base lg:text-lg mb-6 lg:mb-8">
                    {feature.description}
                  </p>

                  <ul className="space-y-4 inline-block text-left">
                    {feature.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                          <bullet.icon size={20} className="text-[#E85D24]" />
                        </div>
                        <span className="text-[#F5F5F0] text-base">{bullet.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
