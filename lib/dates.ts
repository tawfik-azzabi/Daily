// lib/dates.ts
import { format, isToday, isTomorrow, isPast, parseISO, isAfter } from 'date-fns'
import { fr } from 'date-fns/locale'

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function isOverdue(date: string, status: string): boolean {
  if (status === 'done') return false
  return isPast(parseISO(date)) && date < todayStr()
}

export function isTodayDate(date: string): boolean {
  return date === todayStr()
}

export function isFutureDate(date: string): boolean {
  return date > todayStr()
}

export function formatDate(date: string): string {
  const d = parseISO(date)
  if (isToday(d))    return "Aujourd'hui"
  if (isTomorrow(d)) return 'Demain'
  return format(d, 'EEEE d MMM yyyy', { locale: fr })
}

export function formatShort(date: string): string {
  return format(parseISO(date), 'dd/MM/yyyy')
}

export function nextDays(n: number): { label: string; value: string }[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const value = format(d, 'yyyy-MM-dd')
    const label =
      i === 0 ? "Aujourd'hui" :
      i === 1 ? 'Demain' :
      format(d, 'EEE d MMM', { locale: fr })
    return { label, value }
  })
}
