'use client'
// components/TaskModal.tsx
import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Task, Priority } from '@/lib/database.types'
import { todayStr } from '@/lib/dates'

interface Props {
  task:        Task | null
  defaultDate: string
  onClose:     () => void
  onSaved:     (t: Task) => void
}

export default function TaskModal({ task, defaultDate, onClose, onSaved }: Props) {
  const [title,    setTitle]    = useState(task?.title ?? '')
  const [desc,     setDesc]     = useState(task?.description ?? '')
  const [date,     setDate]     = useState(task?.date ?? defaultDate)
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'normal')
  const [saving,   setSaving]   = useState(false)
  const [err,      setErr]      = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setTimeout(() => titleRef.current?.focus(), 80) }, [])

  async function save() {
    if (!title.trim()) { setErr('Le titre est obligatoire.'); titleRef.current?.focus(); return }
    setSaving(true); setErr('')
    try {
      const body = { title: title.trim(), description: desc.trim() || null, date, priority, status: task?.status ?? 'todo' }
      const url    = task ? `/api/tasks/${task.id}` : '/api/tasks'
      const method = task ? 'PATCH' : 'POST'
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(await res.text())
      const saved: Task = await res.json()
      onSaved(saved)
    } catch (e: any) {
      setErr(e.message || 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.75)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
           style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {/* Title bar */}
        <div className="flex items-center mb-5">
          <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
            {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <button onClick={onClose} className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--card)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}>
            <X size={16} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <Field label="Titre *">
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save() }}
              placeholder="Que faut-il faire ?"
              style={inputStyle}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Détails optionnels…"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }}
            />
          </Field>

          <div className="flex gap-3">
            <Field label="Date" className="flex-1">
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Criticité" className="flex-1">
              <select value={priority} onChange={e => setPriority(e.target.value as Priority)} style={inputStyle}>
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="critique">Critique</option>
              </select>
            </Field>
          </div>
        </div>

        {err && <p className="text-xs mt-3" style={{ color: 'var(--critical)' }}>{err}</p>}

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose}
                  className="px-4 py-2 text-sm rounded-lg border transition-all"
                  style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--muted2)', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--text)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted2)' }}>
            Annuler
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 text-sm font-semibold rounded-lg transition-opacity"
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .6 : 1 }}
          >
            {saving ? 'Sauvegarde…' : task ? 'Sauvegarder' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
             style={{ color: 'var(--muted2)' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '9px 12px',
  color: 'var(--text)',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'inherit',
}
