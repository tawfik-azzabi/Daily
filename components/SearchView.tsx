'use client'
// components/SearchView.tsx
import type { ViewProps } from './viewProps'
import TaskCard from './TaskCard'
import { SectionHeader, EmptyState } from './ui'

interface Props extends ViewProps { query: string }

export default function SearchView({ query, ...p }: Props) {
  const q = query.toLowerCase()
  const found = p.tasks.filter(t =>
    t.title.toLowerCase().includes(q) ||
    (t.description || '').toLowerCase().includes(q)
  )

  return (
    <div className="max-w-2xl mx-auto w-full space-y-3 fade-in">
      <SectionHeader
        title="Résultats"
        count={`${found.length} pour « ${query} »`}
      />
      {found.length === 0 ? (
        <EmptyState icon="🔍" text="Aucune tâche trouvée" sub={`Aucun résultat pour « ${query} »`} />
      ) : (
        <div className="space-y-1.5">
          {found.map(task => (
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
