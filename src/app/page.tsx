"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    // Handle auth callback
    if (code) {
      // Redirect to proper auth callback route
      router.replace(`/auth/callback?code=${code}`)
      return
    }

    // Handle auth error
    if (error) {
      console.error("Auth error:", error, errorDescription)
      router.replace("/login")
      return
    }

    // Default redirect to dashboard for authenticated users or login
    router.replace("/dashboard")
  }, [router, searchParams])

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#E85D24]" />
    </div>
  )
}
