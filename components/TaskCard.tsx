'use client'
// components/TaskCard.tsx
import { Pencil, Calendar, Trash2, GripVertical } from 'lucide-react'
import type { Task } from '@/lib/database.types'
import { formatShort, isOverdue } from '@/lib/dates'
import clsx from 'clsx'

interface Props {
  task:           Task
  onToggleDone:   (id: string) => void
  onEdit:         (t: Task) => void
  onDelete:       (id: string) => void
  onReschedule:   (ids: string[]) => void
  selectMode:     boolean
  selected:       boolean
  onToggleSelect: (id: string) => void
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  isDragging?:    boolean
}

const PRIORITY_BORDER: Record<string, string> = {
  critique:  '#EF4444',
  important: '#F59E0B',
  normal:    '#64748B',
}
const PRIORITY_LABEL: Record<string, string> = {
  critique:  'Critique',
  important: 'Important',
  normal:    'Normal',
}
const PRIORITY_BADGE: Record<string, React.CSSProperties> = {
  critique:  { background: 'rgba(239,68,68,.15)',  color: '#FCA5A5' },
  important: { background: 'rgba(245,158,11,.15)', color: '#FCD34D' },
  normal:    { background: 'rgba(100,116,139,.15)',color: '#94A3B8' },
}

export default function TaskCard({
  task, onToggleDone, onEdit, onDelete, onReschedule,
  selectMode, selected, onToggleSelect,
  dragHandleProps, isDragging,
}: Props) {
  const done = task.status === 'done'
  const overdue = isOverdue(task.date, task.status)

  return (
    <div
      className={clsx(
        'group relative flex items-start gap-3 rounded-xl px-3.5 py-3 border transition-all',
        isDragging ? 'opacity-40' : '',
        selected  ? 'ring-1' : '',
      )}
      style={{
        background:   selected ? 'rgba(59,130,246,.08)' : overdue ? 'rgba(239,68,68,.04)' : 'var(--card)',
        borderColor:  selected ? 'var(--accent)' : 'var(--border)',
        borderLeftColor: PRIORITY_BORDER[task.priority] || 'var(--border)',
        borderLeftWidth: '3px',
        ...(selected ? { '--tw-ring-color': 'var(--accent)' } as any : {}),
      }}
    >
      {/* Checkbox / Select */}
      {selectMode ? (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(task.id)}
          className="mt-0.5 flex-shrink-0 cursor-pointer"
          style={{ accentColor: 'var(--accent)' }}
        />
      ) : (
        <button
          onClick={() => onToggleDone(task.id)}
          className="mt-0.5 flex-shrink-0 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all"
          style={{
            borderColor: done ? 'var(--success)' : 'var(--border)',
            background:  done ? 'var(--success)' : 'transparent',
          }}
          onMouseEnter={e => { if (!done) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)' }}
          onMouseLeave={e => { if (!done) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}
        >
          {done && (
            <svg width="10" height="10" viewBox="0 0 12 10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1.5,5.5 4.5,8.5 10.5,1.5"/>
            </svg>
          )}
        </button>
      )}

      {/* Body */}
      <div className="flex-1 min-w-0">
        <p className={clsx('text-[13px] font-medium leading-snug transition-colors', done ? 'task-done-title' : '')}
           style={{ color: done ? 'var(--muted)' : 'var(--text)' }}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--muted)' }}>
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                style={PRIORITY_BADGE[task.priority]}>
            {PRIORITY_LABEL[task.priority]}
          </span>
          <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
            {formatShort(task.date)}
          </span>
          {overdue && (
            <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(239,68,68,.18)', color: 'var(--critical)' }}>
              En retard
            </span>
          )}
        </div>
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <ActionBtn title="Reporter" onClick={() => onReschedule([task.id])}>
          <Calendar size={12} />
        </ActionBtn>
        <ActionBtn title="Modifier" onClick={() => onEdit(task)}>
          <Pencil size={12} />
        </ActionBtn>
        <ActionBtn title="Supprimer" danger onClick={() => onDelete(task.id)}>
          <Trash2 size={12} />
        </ActionBtn>
        {dragHandleProps && (
          <div {...dragHandleProps}
               className="w-7 h-7 rounded-md flex items-center justify-center cursor-grab transition-colors"
               style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}>
            <GripVertical size={12} />
          </div>
        )}
      </div>
    </div>
  )
}

function ActionBtn({ children, title, onClick, danger }: {
  children: React.ReactNode; title: string; onClick: () => void; danger?: boolean
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
      style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer' }}
      onMouseEnter={e => {
        const b = e.currentTarget as HTMLButtonElement
        b.style.borderColor = danger ? 'var(--critical)' : 'var(--accent)'
        b.style.color       = danger ? 'var(--critical)' : 'var(--text)'
        b.style.background  = danger ? 'rgba(239,68,68,.08)' : 'var(--bg)'
      }}
      onMouseLeave={e => {
        const b = e.currentTarget as HTMLButtonElement
        b.style.borderColor = 'var(--border)'; b.style.color = 'var(--muted)'; b.style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}
