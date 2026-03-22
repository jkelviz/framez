"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

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
      router.push(`/auth/callback?code=${code}`)
      return
    }

    // Handle auth error
    if (error) {
      console.error("Auth error:", error, errorDescription)
      router.push("/login")
      return
    }

    // Default redirect to dashboard for authenticated users or login
    router.push("/dashboard")
  }, [router, searchParams])

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E85D24]"></div>
    </div>
  )
}
