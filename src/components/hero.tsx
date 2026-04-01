"use client"

import { useEffect, useRef } from "react"
import { Play, Heart, Download } from "lucide-react"
import Link from "next/link"

export function Hero() {
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
      className="min-h-screen flex items-center relative overflow-hidden pt-20"
      style={{
        background: "radial-gradient(ellipse at top left, #1a0d08 0%, #0A0A0A 50%)",
      }}
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-80" />
      <div className="max-w-[1000px] mx-auto px-6 py-24 relative z-10 w-full flex flex-col items-center justify-center text-center mt-12">
        <div className="space-y-6 flex flex-col items-center">
            <div className="reveal flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-md" style={{ transitionDelay: "0.1s" }}>
              <span className="w-2 h-2 rounded-full bg-[#E85D24] animate-pulse" />
              <span className="text-[#F5F5F0] text-[11px] uppercase tracking-[0.2em] font-medium">Apresentando FrameZ 2.0</span>
            </div>

            <h1 className="reveal font-semibold tracking-[-0.03em] text-[48px] md:text-[64px] lg:text-[80px] text-white leading-[1.05]" style={{ transitionDelay: "0.2s" }}>
              O palco principal <br className="hidden md:block" /> para suas obras.
            </h1>

            <p className="reveal text-[#888880] text-lg md:text-xl max-w-2xl mx-auto leading-[1.6]" style={{ transitionDelay: "0.3s" }}>
              Uma plataforma premium projetada meticulosamente para fotógrafos que exigem o absoluto melhor. Entregue ensaios com a qualidade visual de um filme de cinema.
            </p>

            <div className="reveal flex flex-col sm:flex-row gap-4 pt-8 justify-center w-full sm:w-auto" style={{ transitionDelay: "0.4s" }}>
              <Link href="/cadastro" className="bg-[#E85D24] text-white px-8 py-4 rounded-full font-medium text-[15px] hover:bg-[#E85D24]/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(232,93,36,0.3)]">
                Começar gratuitamente
                <Play className="w-4 h-4 fill-white" />
              </Link>
              <Link href="#recursos" className="border border-[rgba(255,255,255,0.15)] text-[#F5F5F0] px-8 py-4 rounded-full font-medium text-[15px] hover:bg-[rgba(255,255,255,0.05)] transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                Explorar recursos
              </Link>
            </div>
          </div>
      </div>
      <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[80%] max-w-[1200px] aspect-[21/9] z-20 mx-auto hidden md:block perspective-[1000px]">
        <div className="w-full h-full transform transition-transform duration-1000 rotate-x-[15deg] hover:rotate-x-0 rounded-t-[2rem] overflow-hidden border-t-2 border-x-2 border-[rgba(255,255,255,0.1)] shadow-[0_-20px_50px_rgba(232,93,36,0.15)] bg-black">
          <BrowserMockup />
        </div>
      </div>
    </section>
  )
}

function PhoneMockup() {
  return (
    <div className="bg-[#1a1a1a] rounded-[24px] p-1.5 border border-[rgba(255,255,255,0.15)] shadow-2xl">
      {/* Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#0A0A0A] rounded-full z-30" />

      {/* Screen */}
      <div className="bg-[#0A0A0A] rounded-[20px] overflow-hidden">
        {/* Gallery content */}
        <div className="p-2 pt-6 space-y-1.5">
          {/* Masonry grid */}
          <div className="grid grid-cols-2 gap-1.5">
            <div className="space-y-1.5">
              <div
                className="aspect-[3/4] rounded-lg bg-gradient-to-br from-[#3d2817] to-[#1a1a1a] photo-fade"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="aspect-square rounded-lg bg-gradient-to-br from-[#173d3d] to-[#1a1a1a] photo-fade"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
            <div className="space-y-1.5 pt-3">
              <div
                className="aspect-square rounded-lg bg-gradient-to-br from-[#2a1f17] to-[#1a1a1a] photo-fade"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="aspect-[3/4] rounded-lg bg-gradient-to-br from-[#17263d] to-[#1a1a1a] photo-fade"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>
        </div>

        {/* Bottom floating bar */}
        <div className="mx-2 mb-2 bg-[rgba(255,255,255,0.1)] backdrop-blur-md rounded-full px-4 py-2 flex items-center justify-center gap-6">
          <Heart size={14} className="text-[#F5F5F0]" />
          <Download size={14} className="text-[#F5F5F0]" />
        </div>
      </div>
    </div>
  )
}

function BrowserMockup() {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[rgba(255,255,255,0.1)] overflow-hidden shadow-2xl">
      {/* Browser header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[rgba(255,255,255,0.07)] bg-[#111111]">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
          <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 mx-2">
          <div className="bg-[#0A0A0A] rounded px-2 py-1 text-[10px] text-[#888880] text-center truncate">
            app.framez.com.br/dashboard
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-3 bg-[#0A0A0A]">
        <div className="flex gap-2">
          {/* Sidebar */}
          <div className="w-8 flex flex-col items-center gap-2 py-2">
            <div className="w-4 h-4 rounded bg-[#E85D24]/20" />
            <div className="w-4 h-4 rounded bg-[#2a2a2a]" />
            <div className="w-4 h-4 rounded bg-[#2a2a2a]" />
          </div>

          {/* Main area */}
          <div className="flex-1 space-y-2">
            <p className="text-[9px] text-[#888880] font-medium">Ensaios Recentes</p>

            {/* Horizontal cards */}
            <div className="flex gap-1.5">
              {[
                "from-[#2a1810] to-[#1a1a1a]",
                "from-[#1a2a20] to-[#1a1a1a]",
                "from-[#201a2a] to-[#1a1a1a]",
              ].map((gradient, i) => (
                <div key={i} className="flex-1">
                  <div className={`aspect-[3/2] rounded bg-gradient-to-br ${gradient}`} />
                  <p className="text-[7px] text-[#666] mt-1 truncate">Cliente {i + 1}</p>
                </div>
              ))}
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-4 gap-1 pt-1">
              {["12", "48", "3.2k", "95%"].map((num, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded p-1.5 text-center">
                  <p className="text-[10px] text-[#F5F5F0] font-medium">{num}</p>
                  <p className="text-[6px] text-[#666]">stat</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
