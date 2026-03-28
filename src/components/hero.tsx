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
      <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-5 text-center lg:text-left">
            <div className="reveal" style={{ transitionDelay: "0.1s" }}>
              <span className="text-[#E85D24] text-xs uppercase tracking-[0.2em] font-medium">
                Plataforma para fotógrafos
              </span>
            </div>

            <h1 className="reveal font-medium tracking-tighter text-[36px] md:text-[48px] lg:text-[64px] text-[#F5F5F0] leading-[1.1]" style={{ transitionDelay: "0.2s" }}>
              Seus ensaios merecem uma experiência{" "}
              <span className="gradient-text font-[var(--font-instrument-serif)] font-normal tracking-normal italic">cinematográfica</span>
            </h1>

            <p className="reveal text-[#888880] text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-[1.7]" style={{ transitionDelay: "0.3s" }}>
              Transforme a entrega de fotos em uma experiência memorável.
              <br className="hidden md:block" />
              Galerias imersivas que valorizam seu trabalho e encantam seus clientes.
            </p>

            <div className="reveal flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start" style={{ transitionDelay: "0.4s" }}>
              <Link href="/cadastro" className="animated-gradient-btn text-[#F5F5F0] px-7 py-4 rounded-lg font-medium inline-flex items-center justify-center gap-2 group w-full sm:w-auto">
                Começar grátis
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="#recursos" className="border border-[rgba(255,255,255,0.2)] text-[#F5F5F0] px-7 py-4 rounded-lg font-medium hover:border-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.05)] transition-all inline-flex items-center justify-center gap-2 w-full sm:w-auto">
                <Play size={18} />
                Ver demonstração
              </Link>
            </div>

            <p className="reveal text-[#888880] text-sm pt-2" style={{ transitionDelay: "0.5s" }}>
              Usado por <span className="text-[#F5F5F0]">+de 100 fotógrafos</span>
            </p>
          </div>

          {/* Right side - Split Mockup */}
          <div className="reveal relative order-first lg:order-last" style={{ transitionDelay: "0.4s" }}>
            {/* Radial glow behind both */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] bg-[rgba(232,93,36,0.08)] rounded-full blur-[100px]" />
            </div>

            {/* Mobile: stacked vertically, no rotation, 60% size */}
            <div className="relative flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0 scale-[0.6] lg:scale-100 origin-center">
              {/* Phone mockup - Gallery (on top for mobile) */}
              <div
                className="relative z-20 w-[180px] lg:-mr-0 order-first lg:order-last"
                style={{ transform: "rotate(0deg)" }}
              >
                <div className="lg:hidden">
                  <PhoneMockup />
                </div>
                <div className="hidden lg:block" style={{ transform: "rotate(2deg)" }}>
                  <PhoneMockup />
                </div>
              </div>

              {/* Browser mockup - Dashboard (below for mobile) */}
              <div
                className="relative z-10 w-[320px] lg:-mr-16 order-last lg:order-first"
                style={{ transform: "rotate(0deg)" }}
              >
                <div className="lg:hidden">
                  <BrowserMockup />
                </div>
                <div className="hidden lg:block" style={{ transform: "rotate(-2deg)" }}>
                  <BrowserMockup />
                </div>
              </div>
            </div>
          </div>
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
