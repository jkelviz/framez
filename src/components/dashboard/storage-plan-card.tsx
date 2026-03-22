"use client"

const storageData = [
  { label: "Casamentos", size: "14.2 GB", color: "#E85D24", percentage: 42 },
  { label: "Ensaios", size: "10.8 GB", color: "#F5A623", percentage: 32 },
  { label: "Eventos", size: "6.4 GB", color: "#888880", percentage: 19 },
  { label: "Outros", size: "2.8 GB", color: "#333333", percentage: 7 },
]

export function StoragePlanCard() {
  const totalUsed = 34.2
  const totalStorage = 100

  // Calculate cumulative offsets for donut segments
  let cumulativeOffset = 0
  const segments = storageData.map((item) => {
    const offset = cumulativeOffset
    cumulativeOffset += item.percentage
    return { ...item, offset }
  })

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in-up stagger-2">
      <h3 className="mb-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Armazenamento
      </h3>

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
                {item.percentage}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
