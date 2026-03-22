"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, Users, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/ensaios", icon: ImageIcon, label: "Ensaios" },
    { href: "/clientes", icon: Users, label: "Clientes" },
    { href: "/configuracoes", icon: Settings, label: "Configurações" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-fz-border bg-fz-bg-card flex flex-col h-full hidden md:flex">
            <div className="p-6">
                <h2 className="font-serif text-3xl">FrameZ.</h2>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                                isActive
                                    ? "bg-fz-bg-elevated text-fz-accent"
                                    : "text-fz-text-secondary hover:text-fz-text-primary hover:bg-fz-bg-elevated/50"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-fz-border">
                <button className="flex items-center gap-3 px-3 py-2 text-fz-text-secondary hover:text-[hsl(var(--destructive))] w-full transition-colors rounded-md hover:bg-fz-bg-elevated/50">
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
}
