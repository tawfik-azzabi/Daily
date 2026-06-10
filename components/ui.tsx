'use client'
// components/ui.tsx — shared small UI pieces

import { X } from 'lucide-react'

// ── BulkBar ──────────────────────────────────────────────────────
interface BulkBarProps {
  count:      number
  onDone:     () => void
  onReschedule: () => void
  onDelete:   () => void
  onCancel:   () => void
}

export function BulkBar({ count, onDone, onReschedule, onDelete, onCancel }: BulkBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 mb-3 text-sm font-medium flex-wrap"
         style={{ background: 'var(--accent)', color: '#fff' }}>
      <span>{count} sélectionnée{count > 1 ? 's' : ''}</span>
      <BulkBtn onClick={onDone}>✓ Terminer</BulkBtn>
      <BulkBtn onClick={onReschedule}>Reporter</BulkBtn>
      <BulkBtn onClick={onDelete}>Supprimer</BulkBtn>
      <button className="ml-auto opacity-70 hover:opacity-100 transition-opacity"
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              onClick={onCancel}>
        <X size={15} />
      </button>
    </div>
  )
}

function BulkBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick}
            className="text-xs font-semibold px-2.5 py-1 rounded-md transition-colors"
            style={{ background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', cursor: 'pointer' }}
            onMouseEnter={e => ((e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,.35)')}
            onMouseLeave={e => ((e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,.2)')}>
      {children}
    </button>
  )
}

// ── SectionHeader ───────────────────────────────────────────────
interface SHProps {
  title:    string
  count?:   number | string
  actions?: React.ReactNode
}

export function SectionHeader({ title, count, actions }: SHProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[15px] font-bold" style={{ color: 'var(--text)' }}>{title}</span>
      {count !== undefined && (
        <span className="text-xs px-2 py-0.5 rounded-full border"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted)' }}>
          {count}
        </span>
      )}
      {actions && <div className="ml-auto flex gap-2">{actions}</div>}
    </div>
  )
}

// ── SmallBtn ─────────────────────────────────────────────────────
interface SBProps { children: React.ReactNode; onClick: () => void; danger?: boolean; className?: string }

export function SmallBtn({ children, onClick, danger, className = '' }: SBProps) {
  return (
    <button onClick={onClick}
            className={`text-xs px-2.5 py-1.5 rounded-md border transition-all ${className}`}
            style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--muted2)', cursor: 'pointer' }}
            onMouseEnter={e => {
              const b = e.currentTarget; b.style.borderColor = danger ? 'var(--critical)' : 'var(--accent)'
              b.style.color = danger ? 'var(--critical)' : 'var(--text)'
            }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = 'var(--border)'; b.style.color = 'var(--muted2)' }}>
      {children}
    </button>
  )
}

// ── EmptyState ───────────────────────────────────────────────────
export function EmptyState({ icon, text, sub }: { icon: string; text: string; sub?: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-sm" style={{ color: 'var(--muted)' }}>{text}</div>
      {sub && <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{sub}</div>}
    </div>
  )
}

// ── OverdueBanner ────────────────────────────────────────────────
interface OBProps {
  count:        number
  onToday:      () => void
  onOtherDate:  () => void
}

export function OverdueBanner({ count, onToday, onOtherDate }: OBProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap rounded-xl px-4 py-3 mb-4 border"
         style={{ background: 'rgba(239,68,68,.07)', borderColor: 'rgba(239,68,68,.25)' }}>
      <span className="text-sm font-medium flex-1" style={{ color: '#FCA5A5' }}>
        ⚠️ {count} tâche{count > 1 ? 's' : ''} en retard
      </span>
      <button onClick={onToday}
              className="text-xs font-semibold px-3 py-1.5 rounded-md transition-opacity hover:opacity-80"
              style={{ background: 'var(--critical)', color: '#fff', border: 'none', cursor: 'pointer' }}>
        Reporter à aujourd'hui
      </button>
      <button onClick={onOtherDate}
              className="text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors"
              style={{ background: 'transparent', borderColor: 'var(--critical)', color: 'var(--critical)', cursor: 'pointer' }}>
        Autre date
      </button>
    </div>
  )
}
