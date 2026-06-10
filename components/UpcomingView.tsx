'use client'
// components/UpcomingView.tsx
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import type { ViewProps } from './viewProps'
import { isFutureDate, formatDate, todayStr } from '@/lib/dates'
import type { Task } from '@/lib/database.types'
import TaskCard from './TaskCard'
import { SectionHeader, EmptyState, SmallBtn } from './ui'

export default function UpcomingView(p: ViewProps) {
  const upcoming = p.tasks
    .filter(t => isFutureDate(t.date))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Group by date
  const groups = upcoming.reduce<Record<string, Task[]>>((acc, t) => {
    ;(acc[t.date] = acc[t.date] || []).push(t)
    return acc
  }, {})
  const sortedDates = Object.keys(groups).sort()

  function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const { source, destination } = result
    const srcDate = source.droppableId
    const dstDate = destination.droppableId

    if (srcDate === dstDate) {
      // Reorder within group
      const group = [...(groups[srcDate] || [])]
      const [moved] = group.splice(source.index, 1)
      group.splice(destination.index, 0, moved)
      // Rebuild full tasks list
      const others = p.tasks.filter(t => t.date !== srcDate)
      p.onReorder([...others, ...group])
    } else {
      // Move to another date group
      const task = groups[srcDate][source.index]
      p.onReschedule([task.id])
      // Note: the actual date change is persisted via reschedule
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6 fade-in">
      <SectionHeader
        title="À venir"
        count={`${upcoming.length} tâche${upcoming.length !== 1 ? 's' : ''}`}
        actions={<SmallBtn onClick={() => p.onAddTask()}>+ Ajouter</SmallBtn>}
      />

      {upcoming.length === 0 ? (
        <EmptyState icon="🗓️" text="Aucune tâche à venir" sub="Ajoutez une tâche pour une date future." />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          {sortedDates.map(date => (
            <div key={date} className="mb-5">
              <div className="flex items-center gap-2 pb-2 mb-2 border-b"
                   style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  {formatDate(date)}
                </span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>({groups[date].length})</span>
                <SmallBtn onClick={() => p.onAddTask(date)} className="ml-auto">+ Ajouter</SmallBtn>
              </div>
              <Droppable droppableId={date}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-1.5">
                    {groups[date].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(drag, snapshot) => (
                          <div ref={drag.innerRef} {...drag.draggableProps}>
                            <TaskCard
                              task={task}
                              onToggleDone={p.onToggleDone}
                              onEdit={p.onEdit}
                              onDelete={p.onDelete}
                              onReschedule={p.onReschedule}
                              selectMode={false}
                              selected={false}
                              onToggleSelect={p.onToggleSelect}
                              dragHandleProps={drag.dragHandleProps ?? undefined}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      )}
    </div>
  )
}
