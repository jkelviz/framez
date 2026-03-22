"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getPhotographer } from "@/lib/supabase/photographer"

interface StorageData {
  label: string
  size: string
  color: string
  percentage: number
}

export function StoragePlanCard() {
  const [storageData, setStorageData] = useState<StorageData[]>([
    { label: "Ensaios", size: "0 GB", color: "#E85D24", percentage: 0 },
  ])
  const [totalUsed, setTotalUsed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  const refreshStorage = async () => {
    setLastUpdate(Date.now())
    await fetchStorageData()
  }

  async function fetchStorageData() {
    try {
      const supabase = createClient()
      const photographer = await getPhotographer(supabase)
      
      if (!photographer) {
        setLoading(false)
        return
      }

      // Get real storage data from photographers table
      const { data: photographerData } = await supabase
        .from("photographers")
        .select("plan")
        .eq("user_id", photographer.user_id)
        .single()

      // Mock storage calculation based on session count for now
      const { data: sessions } = await supabase
        .from("sessions")
        .select("id")
        .eq("photographer_id", photographer.id)
      
      const sessionCount = sessions?.length || 0
      const usedGB = sessionCount * 0.5 // Estimate 0.5GB per session
      
      // Plan limits
      const planLimits: Record<string, number> = {
        free: 2,
        starter: 10,
        pro: 100,
        professional: 500
      }
      
      const planLimit = planLimits[photographerData?.plan || 'free'] || 2
      const percentage = (usedGB / planLimit) * 100

      // For now, group all as "Ensaios" since we don't have session types
      const data: StorageData[] = [
        {
          label: "Ensaios",
          size: `${usedGB.toFixed(1)} GB`,
          color: "#E85D24",
          percentage: Math.min(percentage, 100)
        }
      ]

      setStorageData(data)
      setTotalUsed(parseFloat(usedGB.toFixed(1)))
    } catch (error) {
      console.error("Error fetching storage data:", error)
      // Show zeros on error
      setStorageData([
        { label: "Ensaios", size: "0 GB", color: "#E85D24", percentage: 0 }
      ])
      setTotalUsed(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStorageData()
    
    // Set up periodic refresh and storage event listener
    const interval = setInterval(fetchStorageData, 30000) // Refresh every 30 seconds
    
    // Listen for storage events from photo uploads
    const handleStorageUpdate = () => {
      fetchStorageData()
    }
    
    window.addEventListener('storageUpdate', handleStorageUpdate)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('storageUpdate', handleStorageUpdate)
    }
  }, [])

  const totalStorage = 100

  // Calculate cumulative offsets for donut segments
  let cumulativeOffset = 0
  const segments = storageData.map((item) => {
    const offset = cumulativeOffset
    cumulativeOffset += item.percentage
    return { ...item, offset }
  })

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 animate-fade-in-up stagger-2">
        <h3 className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Armazenamento
        </h3>
        <div className="flex items-center justify-center h-[180px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in-up stagger-2">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Armazenamento
        </h3>
        <button
          onClick={refreshStorage}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Atualizar
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
        {/* Donut Chart */}
        <div className="relative h-[160px] w-[160px] md:h-[180px] md:w-[180px] shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            {segments.map((segment, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={segment.color}
                strokeWidth="12"
                strokeDasharray={`${segment.percentage * 2.51} 251`}
                strokeDashoffset={-segment.offset * 2.51}
                className="transition-all duration-500"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-medium text-foreground tracking-[-0.05em]">{totalUsed} GB</span>
            <span className="text-xs text-muted-foreground tracking-[-0.05em]">de {totalStorage} GB</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap md:flex-col justify-center gap-3 w-full md:w-auto">
          {storageData.map((item, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-3 px-2 md:px-0">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[13px] md:text-sm font-medium text-muted-foreground tracking-[-0.05em]">{item.label}</span>
              <span className="text-[13px] md:text-sm font-medium text-foreground tracking-[-0.05em]">{item.size}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar - stacked segments */}
        <div className="w-full flex-1 mt-4 md:mt-0">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground tracking-[-0.05em]">Uso por categoria</span>
            <span className="text-xs font-medium text-foreground tracking-[-0.05em]">{totalUsed}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#161616]">
            <div className="flex h-full">
              {storageData.map((item, i) => (
                <div
                  key={i}
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-muted-foreground tracking-[-0.05em]">
            {storageData.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.percentage.toFixed(1)}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
