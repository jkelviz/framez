"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { label: "Recursos", href: "#recursos" },
    { label: "Preços", href: "#precos" },
    { label: "Como funciona", href: "#como-funciona" },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-[rgba(10,10,10,0.9)] backdrop-blur-[20px] border-b border-[rgba(255,255,255,0.07)]"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/images/logo.png"
              alt="FrameZ Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span className="font-medium tracking-tighter text-2xl italic text-[#F5F5F0]">
              FrameZ
            </span>
          </Link>

          {/* Center Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#888880] hover:text-[#F5F5F0] transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[#888880] hover:text-[#F5F5F0] transition-colors text-sm hidden sm:block">
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="animated-gradient-btn text-[#F5F5F0] px-5 py-2.5 rounded-lg text-sm font-medium hidden sm:block"
            >
              Começar grátis
            </Link>

            {/* Hamburger menu - Mobile only */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-[#F5F5F0]"
              aria-label="Abrir menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-[#0A0A0A] transition-transform duration-300 md:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image
                src="/images/logo.png"
                alt="FrameZ Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="font-medium tracking-tighter text-2xl italic text-[#F5F5F0]">
                FrameZ
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-[#F5F5F0]"
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-6 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#F5F5F0] text-2xl font-medium tracking-tighter hover:text-[#E85D24] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Bottom buttons */}
          <div className="flex flex-col gap-4">
            <Link
              href="/cadastro"
              className="animated-gradient-btn text-[#F5F5F0] px-6 py-4 rounded-lg text-center font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Começar grátis
            </Link>
            <Link
              href="/login"
              className="border border-[rgba(255,255,255,0.2)] text-[#F5F5F0] px-6 py-4 rounded-lg text-center font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
