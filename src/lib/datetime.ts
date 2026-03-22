export function formatRelativeTime(iso: string): string {
    const d = new Date(iso)
    const diff = Date.now() - d.getTime()
    if (diff < 0) return "agora"
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return mins <= 1 ? "agora" : `${mins} min`
    const h = Math.floor(diff / 3600000)
    if (h < 24) return `${h}h`
    const days = Math.floor(diff / 86400000)
    if (days === 1) return "ontem"
    if (days < 7) return `${days} dias`
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

export function startOfMonth(d = new Date()): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
}

export function startOfPreviousMonth(d = new Date()): Date {
    return new Date(d.getFullYear(), d.getMonth() - 1, 1, 0, 0, 0, 0)
}
