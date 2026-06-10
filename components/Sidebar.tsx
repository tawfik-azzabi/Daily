'use client'
// components/Sidebar.tsx
import { CalendarDays, Clock, AlertTriangle } from 'lucide-react'
import type { View } from './TaskApp'
import clsx from 'clsx'

interface Props {
  view: View
  onView: (v: View) => void
  overdueCt: number
  todayLeft: number
}

const items: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'today',    label: "Aujourd'hui", icon: <CalendarDays size={15} /> },
  { id: 'upcoming', label: 'À venir',     icon: <Clock size={15} /> },
  { id: 'overdue',  label: 'En retard',   icon: <AlertTriangle size={15} /> },
]

export default function Sidebar({ view, onView, overdueCt, todayLeft }: Props) {
  return (
    <aside
      className="hidden md:flex flex-col w-52 flex-shrink-0 border-r p-3 gap-1"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 mt-1"
         style={{ color: 'var(--muted)' }}>Vues</p>

      {items.map(item => {
        const active = view === item.id
        const badge = item.id === 'overdue' ? overdueCt
                    : item.id === 'today'   ? todayLeft
                    : 0
        return (
          <button
            key={item.id}
            onClick={() => onView(item.id)}
            className={clsx(
              'flex items-center gap-2.5 w-full text-left text-[13px] font-medium px-2.5 py-2 rounded-lg transition-all',
              active ? '' : 'hover:opacity-90'
            )}
            style={{
              background:  active ? (item.id === 'overdue' ? 'rgba(239,68,68,.12)' : 'rgba(59,130,246,.12)') : 'transparent',
              color:       active ? (item.id === 'overdue' ? 'var(--critical)' : 'var(--accent)')            : 'var(--muted2)',
              border:      'none',
              cursor:      'pointer',
            }}
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {badge > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: item.id === 'overdue' ? 'var(--critical)' : 'var(--accent)',
                  color: '#fff',
                }}
              >{badge}</span>
            )}
          </button>
        )
      })}
    </aside>
  )
}
