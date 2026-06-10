'use client'
// components/RescheduleModal.tsx
import { useState } from 'react'
import { X } from 'lucide-react'
import { nextDays, todayStr } from '@/lib/dates'

interface Props {
  count:     number
  onClose:   () => void
  onConfirm: (date: string) => void
}

export default function RescheduleModal({ count, onClose, onConfirm }: Props) {
  const [custom, setCustom] = useState(todayStr())
  const days = nextDays(8)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.75)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
           style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center mb-5">
          <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
            Reporter {count > 1 ? `${count} tâches` : 'la tâche'}
          </h2>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Quick shortcuts */}
        <div className="flex flex-wrap gap-2 mb-5">
          {days.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onConfirm(value)}
              className="text-xs px-3 py-1.5 rounded-lg border transition-all"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)', cursor: 'pointer' }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.borderColor = 'var(--accent)'; b.style.color = 'var(--accent)'
                b.style.background  = 'rgba(59,130,246,.1)'
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.borderColor = 'var(--border)'; b.style.color = 'var(--text)'
                b.style.background  = 'var(--card)'
              }}
            >{label}</button>
          ))}
        </div>

        {/* Custom date */}
        <div className="mb-5">
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                 style={{ color: 'var(--muted2)' }}>Ou choisir une date</label>
          <input
            type="date"
            value={custom}
            onChange={e => setCustom(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}
                  className="px-4 py-2 text-sm rounded-lg border"
                  style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--muted2)', cursor: 'pointer' }}>
            Annuler
          </button>
          <button
            onClick={() => custom && onConfirm(custom)}
            className="px-5 py-2 text-sm font-semibold rounded-lg"
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}
