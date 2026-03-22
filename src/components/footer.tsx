import Link from "next/link"
import Image from "next/image"
import { Instagram, Twitter, Youtube, Linkedin } from "lucide-react"

export function Footer() {
  const footerLinks = {
    produto: [
      { label: "Recursos", href: "#recursos" },
      { label: "Preços", href: "#precos" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
    suporte: [
      { label: "Central de ajuda", href: "#" },
      { label: "Contato", href: "#" },
      { label: "Status", href: "#" },
      { label: "API Docs", href: "#" },
    ],
    legal: [
      { label: "Privacidade", href: "#" },
      { label: "Termos de uso", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  }

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ]

  return (
    <footer className="py-12 lg:py-16 border-t border-[rgba(255,255,255,0.05)]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Mobile: single column stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 lg:mb-16">
          {/* Logo and tagline */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="FrameZ Logo"
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
              <span className="font-medium tracking-tighter text-2xl italic text-[#F5F5F0]">
                FrameZ
              </span>
            </Link>
            <p className="text-[#888880] text-sm leading-relaxed">
              A plataforma que transforma a entrega de fotos em uma experiência cinematográfica.
            </p>
          </div>

          {/* Produto */}
          <div>
            <h4 className="text-[#F5F5F0] font-medium mb-4">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-[#888880] text-sm hover:text-[#F5F5F0] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="text-[#F5F5F0] font-medium mb-4">Suporte</h4>
            <ul className="space-y-3">
              {footerLinks.suporte.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-[#888880] text-sm hover:text-[#F5F5F0] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[#F5F5F0] font-medium mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-[#888880] text-sm hover:text-[#F5F5F0] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-[rgba(255,255,255,0.05)]">
          <p className="text-[#888880] text-sm text-center md:text-left">
            © {new Date().getFullYear()} FrameZ. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="w-10 h-10 rounded-full bg-[#111111] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#888880] hover:text-[#F5F5F0] hover:border-[rgba(255,255,255,0.2)] transition-all"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
