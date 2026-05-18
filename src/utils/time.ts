export function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function getPeriodLabel(period: string): string {
  const labels: Record<string, string> = {
    morning: '早间速览',
    noon: '午间速览',
    evening: '晚间速览'
  }
  return labels[period] || period
}

export function getBatchLabel(batchId: string): string {
  const dateStr = batchId.slice(0, 8)
  const hour = parseInt(batchId.slice(9, 11), 10)
  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = dateStr.slice(0, 4)
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)
  const period = hour <= 9 ? '早间' : hour <= 15 ? '午间' : '晚间'
  return `${year}-${pad(parseInt(month, 10))}-${pad(parseInt(day, 10))} ${period}`
}
