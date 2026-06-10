'use client'
// components/OverdueView.tsx
import type { ViewProps } from './viewProps'
import { isOverdue, todayStr } from '@/lib/dates'
import TaskCard from './TaskCard'
import { SectionHeader, EmptyState, SmallBtn } from './ui'

export default function OverdueView(p: ViewProps) {
  const overdue    = p.tasks.filter(t => isOverdue(t.date, t.status)).sort((a,b)=>a.date.localeCompare(b.date))
  const overdueIds = overdue.map(t => t.id)

  return (
    <div className="max-w-2xl mx-auto w-full space-y-3 fade-in">
      <SectionHeader
        title="Tâches en retard"
        count={overdue.length}
        actions={overdue.length > 0 ? (
          <>
            <SmallBtn onClick={() => p.onReschedule(overdueIds)}>Tout → aujourd'hui</SmallBtn>
            <SmallBtn onClick={() => p.onBulkReschedule(overdueIds)} danger>Autre date</SmallBtn>
          </>
        ) : undefined}
      />

      {overdue.length === 0 ? (
        <EmptyState icon="🎉" text="Aucun retard !" sub="Beau travail, continuez ainsi." />
      ) : (
        <div className="space-y-1.5">
          {overdue.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleDone={p.onToggleDone}
              onEdit={p.onEdit}
              onDelete={p.onDelete}
              onReschedule={p.onReschedule}
              selectMode={false}
              selected={false}
              onToggleSelect={p.onToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
