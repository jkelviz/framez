"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LayoutDashboard, Camera, Users, Globe, CreditCard, Settings, HelpCircle, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: any
  label: string
  href: string
  isMobile?: boolean
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", isMobile: true },
  { icon: Camera, label: "Ensaios", href: "/ensaios", isMobile: true },
  { icon: Users, label: "Clientes", href: "/clientes", isMobile: true },
  { icon: Globe, label: "Portfólio", href: "/portfolio", isMobile: true },
]

const bottomNavItems: NavItem[] = [
  { icon: CreditCard, label: "Planos", href: "/configuracoes/planos" },
  { icon: Settings, label: "Config", href: "/configuracoes", isMobile: true },
  { icon: HelpCircle, label: "Ajuda", href: "/ajuda" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const userName = "Rafael Silva"
  const userInitials = "RS"
  const userPlan = "Plano Pro"

  const allMobileItems = [...mainNavItems, bottomNavItems.find(i => i.label === "Config")!].filter(i => i?.isMobile)

  const renderNavItems = (items: typeof mainNavItems) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
        return (
          <li key={item.label} className="relative group">
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-[16px] md:px-[12px] lg:px-[16px] py-[10px] rounded-[8px] transition-all duration-200 text-[14px] font-[500] tracking-[-0.05em]",
                isActive
                  ? "bg-[rgba(232,93,36,1)] text-white"
                  : "text-[#888880] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "w-[18px] h-[18px] md:w-[20px] md:h-[20px] lg:w-[18px] lg:h-[18px] shrink-0 transition-colors",
                  isActive ? "text-white" : "text-[#888880] group-hover:text-white"
                )}
              />
              <span className="md:hidden lg:inline">{item.label}</span>
            </Link>
            <div className="absolute left-[60px] top-1/2 -translate-y-1/2 rounded bg-[#222] px-2 py-1 text-[12px] text-white opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 hidden md:block lg:hidden whitespace-nowrap z-50">
              {item.label}
            </div>
          </li>
        )
      })}
    </ul>
  )

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen hidden md:flex w-[64px] lg:w-[240px] bg-[#0D0D0D] border-r border-[rgba(255,255,255,0.06)] flex-col z-50 transition-all duration-300">
        <div className="p-[20px] lg:px-[24px] lg:py-[24px] border-b border-[rgba(255,255,255,0.06)] flex justify-center lg:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E85D24] flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-[700] text-[18px] tracking-[-0.05em] font-sans md:hidden lg:inline">
              FrameZ
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 lg:px-4 py-6 overflow-y-auto overflow-x-hidden">
          {renderNavItems(mainNavItems)}
          <div className="my-[12px] h-[1px] bg-[rgba(255,255,255,0.06)]" />
          {renderNavItems(bottomNavItems)}
        </nav>

        <div className="border-t border-[rgba(255,255,255,0.06)] p-3 lg:p-4 flex items-center justify-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#E85D24] to-[#FF7A45] flex items-center justify-center shrink-0">
              <span className="text-white font-[500] text-[13px] tracking-[-0.05em]">
                {userInitials}
              </span>
            </div>
            <div className="flex-col hidden lg:flex">
              <span className="text-white text-[13px] font-[500] tracking-[-0.05em] font-sans truncate max-w-[100px]">
                {userName}
              </span>
              <span className="text-[#888880] text-[11px] tracking-[-0.05em]">
                {userPlan}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#888880] hover:text-red-500 hover:bg-[rgba(255,255,255,0.05)] transition-all shrink-0 hidden lg:flex"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.08)] z-50 flex justify-around items-center h-[60px]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {allMobileItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors active:scale-95",
                isActive ? "text-[#E85D24]" : "text-[#555555]"
              )}
            >
              {isActive && (
                <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E85D24]" />
              )}
              <item.icon className="w-[22px] h-[22px] mt-1 shrink-0" />
              <span className="text-[10px] font-medium tracking-[-0.02em] leading-none">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
