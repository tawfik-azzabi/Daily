'use client'
// components/TaskApp.tsx
import { useState, useEffect, useCallback, useTransition } from 'react'
import type { Task } from '@/lib/database.types'
import { todayStr, isOverdue, isTodayDate, isFutureDate, formatDate } from '@/lib/dates'
import Header from './Header'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import TodayView from './TodayView'
import UpcomingView from './UpcomingView'
import OverdueView from './OverdueView'
import SearchView from './SearchView'
import TaskModal from './TaskModal'
import RescheduleModal from './RescheduleModal'

export type View = 'today' | 'upcoming' | 'overdue'

interface Props { initialTasks: Task[] }

export default function TaskApp({ initialTasks }: Props) {
  const [tasks, setTasks]       = useState<Task[]>(initialTasks)
  const [view, setView]         = useState<View>('today')
  const [search, setSearch]     = useState('')
  const [, startT]              = useTransition()

  // Modal state
  const [modalOpen, setModalOpen]     = useState(false)
  const [editTask, setEditTask]       = useState<Task | null>(null)
  const [modalDate, setModalDate]     = useState<string>(todayStr())

  // Reschedule modal
  const [reschedOpen, setReschedOpen] = useState(false)
  const [reschedIds, setReschedIds]   = useState<string[]>([])

  // Selection mode
  const [selected, setSelected]       = useState<Set<string>>(new Set())
  const [selectMode, setSelectMode]   = useState(false)

  // ── Derived counts ─────────────────────────────────────────────
  const todayTasks   = tasks.filter(t => isTodayDate(t.date))
  const overdueTasks = tasks.filter(t => isOverdue(t.date, t.status))
  const overdueCt    = overdueTasks.length
  const todayLeft    = todayTasks.filter(t => t.status === 'todo').length
  const todayDone    = todayTasks.filter(t => t.status === 'done').length

  // ── API helpers ────────────────────────────────────────────────
  const apiPatch = useCallback(async (id: string, data: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<Task>
  }, [])

  const apiDelete = useCallback(async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  }, [])

  const apiBulk = useCallback(async (action: string, ids: string[], extra?: object) => {
    await fetch('/api/tasks/bulk', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ids, ...extra }),
    })
  }, [])

  const apiReorder = useCallback(async (orderedIds: string[]) => {
    await fetch('/api/tasks/reorder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds }),
    })
  }, [])

  // ── Task mutations ─────────────────────────────────────────────
  const toggleDone = useCallback((id: string) => {
    const t = tasks.find(x => x.id === id)
    if (!t) return
    const newStatus = t.status === 'done' ? 'todo' : 'done'
    setTasks(prev => prev.map(x => x.id === id ? { ...x, status: newStatus } : x))
    startT(() => { apiPatch(id, { status: newStatus }) })
  }, [tasks, apiPatch])

  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(x => x.id !== id))
    selected.delete(id)
    startT(() => { apiDelete(id) })
  }, [apiDelete, selected])

  const handleReorder = useCallback((newTasks: Task[]) => {
    setTasks(newTasks)
    startT(() => { apiReorder(newTasks.map(t => t.id)) })
  }, [apiReorder])

  const handleReschedule = useCallback((ids: string[], date: string) => {
    setTasks(prev => prev.map(t => ids.includes(t.id) ? { ...t, date } : t))
    startT(() => { apiBulk('reschedule', ids, { date }) })
    setReschedOpen(false)
    setReschedIds([])
    setSelectMode(false); setSelected(new Set())
  }, [apiBulk])

  const openReschedule = useCallback((ids: string[]) => {
    setReschedIds(ids); setReschedOpen(true)
  }, [])

  const bulkDelete = useCallback(() => {
    if (!confirm(`Supprimer ${selected.size} tâche(s) ?`)) return
    const ids = [...selected]
    setTasks(prev => prev.filter(t => !ids.includes(t.id)))
    setSelectMode(false); setSelected(new Set())
    startT(() => { apiBulk('delete', ids) })
  }, [selected, apiBulk])

  const bulkDone = useCallback(() => {
    const ids = [...selected]
    setTasks(prev => prev.map(t => ids.includes(t.id) ? { ...t, status: 'done' } : t))
    setSelectMode(false); setSelected(new Set())
    ids.forEach(id => startT(() => { apiPatch(id, { status: 'done' }) }))
  }, [selected, apiPatch])

  const toggleSelect = useCallback((id: string) => {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }, [])

  // ── Modal callbacks ────────────────────────────────────────────
  const openAdd = useCallback((date?: string) => {
    setEditTask(null)
    setModalDate(date || todayStr())
    setModalOpen(true)
  }, [])

  const openEdit = useCallback((task: Task) => {
    setEditTask(task)
    setModalDate(task.date)
    setModalOpen(true)
  }, [])

  const onSaved = useCallback((task: Task) => {
    setTasks(prev => {
      const idx = prev.findIndex(x => x.id === task.id)
      return idx >= 0
        ? prev.map(x => x.id === task.id ? task : x)
        : [...prev, task]
    })
    setModalOpen(false)
  }, [])

  // ── Keyboard ───────────────────────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setModalOpen(false); setReschedOpen(false) }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        document.getElementById('search-input')?.focus(); e.preventDefault()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  // ── Shared view props ──────────────────────────────────────────
  const viewProps = {
    tasks,
    onToggleDone: toggleDone,
    onDelete:     removeTask,
    onEdit:       openEdit,
    onReschedule: openReschedule,
    onReorder:    handleReorder,
    onAddTask:    openAdd,
    selectMode,
    selected,
    onToggleSelect: toggleSelect,
    onToggleSelectMode: () => { setSelectMode(v => !v); setSelected(new Set()) },
    onBulkDone:   bulkDone,
    onBulkDelete: bulkDelete,
    onBulkReschedule: (ids: string[]) => openReschedule(ids),
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        search={search}
        onSearch={setSearch}
        onAdd={() => openAdd()}
      />

      {/* Mobile tabs */}
      <div className="flex md:hidden border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {(['today','upcoming','overdue'] as View[]).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="flex-1 py-3 text-xs font-semibold transition-colors relative"
            style={{ color: view === v ? 'var(--accent)' : 'var(--muted)', background: 'transparent', border: 'none' }}
          >
            {v === 'today' ? "Aujourd'hui" : v === 'upcoming' ? 'À venir' : 'En retard'}
            {v === 'overdue' && overdueCt > 0 && (
              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--critical)', color: '#fff' }}>{overdueCt}</span>
            )}
            {view === v && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--accent)' }} />}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          view={view}
          onView={setView}
          overdueCt={overdueCt}
          todayLeft={todayLeft}
        />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Dashboard strip — only on today */}
          {view === 'today' && !search && (
            <Dashboard
              total={todayTasks.length}
              done={todayDone}
              left={todayLeft}
              overdue={overdueCt}
            />
          )}

          <main className="flex-1 overflow-y-auto p-4 md:p-5">
            {search ? (
              <SearchView query={search} {...viewProps} />
            ) : view === 'today' ? (
              <TodayView {...viewProps} />
            ) : view === 'upcoming' ? (
              <UpcomingView {...viewProps} />
            ) : (
              <OverdueView {...viewProps} />
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      {modalOpen && (
        <TaskModal
          task={editTask}
          defaultDate={modalDate}
          onClose={() => setModalOpen(false)}
          onSaved={onSaved}
        />
      )}
      {reschedOpen && (
        <RescheduleModal
          count={reschedIds.length}
          onClose={() => setReschedOpen(false)}
          onConfirm={date => handleReschedule(reschedIds, date)}
        />
      )}
    </div>
  )
}
