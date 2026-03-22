"use client"

import { useEffect, useRef } from "react"

export function StatsBar() {
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

  const stats = [
    { value: "+500", label: "fotógrafos" },
    { value: "+12.000", label: "ensaios entregues" },
    { value: "+70.000", label: "fotos entregues" },
  ]

  return (
    <section
      ref={sectionRef}
      className="py-[60px] lg:py-[100px] bg-[#111111] border-y border-[rgba(255,255,255,0.05)]"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-0 md:divide-x md:divide-[rgba(255,255,255,0.1)]">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="reveal text-center px-0 md:px-12 lg:px-20 xl:px-24"
              style={{ transitionDelay: `${0.1 * index}s` }}
            >
              <div className="font-medium tracking-tighter text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#F5F5F0] mb-2 leading-none">
                {stat.value}
              </div>
              <div className="text-[#888880] text-sm md:text-base lg:text-lg uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
