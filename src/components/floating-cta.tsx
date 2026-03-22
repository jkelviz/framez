"use client"

import { useEffect, useState } from "react"

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight
      const pricingSection = document.getElementById("precos")
      
      if (pricingSection) {
        const pricingTop = pricingSection.getBoundingClientRect().top
        const pricingBottom = pricingSection.getBoundingClientRect().bottom
        
        // Show after scrolling past hero, hide when pricing is visible
        const isPricingVisible = pricingTop < window.innerHeight && pricingBottom > 0
        setIsVisible(scrollY > heroHeight * 0.5 && !isPricingVisible)
      } else {
        setIsVisible(scrollY > heroHeight * 0.5)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <button className="bg-[#E85D24] text-[#F5F5F0] px-8 py-3 rounded-full font-medium shadow-lg shadow-[#E85D24]/25 hover:bg-[#d14f1c] transition-colors flex items-center gap-2">
        Começar grátis
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.33337 8H12.6667M12.6667 8L8.00004 3.33333M12.6667 8L8.00004 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}
