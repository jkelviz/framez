"use client"

import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-[rgba(232,93,36,0.1)] flex items-center justify-center mb-6 mx-auto">
          <span className="text-[#E85D24] font-bold text-2xl">404</span>
        </div>
        
        <h1 className="text-3xl font-serif text-white mb-4">
          Página não encontrada
        </h1>
        
        <p className="text-gray-400 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-[#E85D24] to-[#F5A623] text-white font-medium rounded-full flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(232,93,36,0.3)] transition-all"
          >
            <Home className="w-4 h-4" />
            Página Inicial
          </Link>
          
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-white/20 text-white font-medium rounded-full flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </div>
    </div>
  )
}
