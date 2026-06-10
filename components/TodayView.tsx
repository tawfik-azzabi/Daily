'use client'
// components/TodayView.tsx
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import type { ViewProps } from './viewProps'
import { isTodayDate, isOverdue, todayStr } from '@/lib/dates'
import TaskCard from './TaskCard'
import { SectionHeader, BulkBar, EmptyState, OverdueBanner, SmallBtn } from './ui'

export default function TodayView(p: ViewProps) {
  const today      = todayStr()
  const todayTasks = p.tasks.filter(t => isTodayDate(t.date))
  const overdueCt  = p.tasks.filter(t => isOverdue(t.date, t.status)).length
  const overdueIds = p.tasks.filter(t => isOverdue(t.date, t.status)).map(t => t.id)

  function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const reordered = [...todayTasks]
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    // Merge back with non-today tasks, preserving original order for others
    const others = p.tasks.filter(t => !isTodayDate(t.date))
    p.onReorder([...reordered, ...others])
  }

  return (
    <div className="max-w-2xl mx-auto w-full space-y-3 fade-in">
      {/* Overdue banner */}
      {overdueCt > 0 && (
        <OverdueBanner
          count={overdueCt}
          onToday={() => p.onReschedule(overdueIds)}
          onOtherDate={() => p.onBulkReschedule(overdueIds)}
        />
      )}

      {/* Bulk bar */}
      {p.selectMode && p.selected.size > 0 && (
        <BulkBar
          count={p.selected.size}
          onDone={p.onBulkDone}
          onReschedule={() => p.onBulkReschedule([...p.selected])}
          onDelete={p.onBulkDelete}
          onCancel={() => { p.onToggleSelectMode() }}
        />
      )}

      <SectionHeader
        title="Aujourd'hui"
        count={`${todayTasks.filter(t => t.status === 'todo').length} restantes`}
        actions={
          <>
            <SmallBtn onClick={() => p.onAddTask(today)}>+ Ajouter</SmallBtn>
            {todayTasks.length > 1 && (
              <SmallBtn onClick={p.onToggleSelectMode}>
                {p.selectMode ? 'Annuler' : 'Sélectionner'}
              </SmallBtn>
            )}
          </>
        }
      />

      {todayTasks.length === 0 ? (
        <EmptyState
          icon="✨"
          text="Aucune tâche pour aujourd'hui"
          sub="Profitez-en, ou ajoutez-en une !"
        />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="today">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-1.5">
                {todayTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(drag, snapshot) => (
                      <div ref={drag.innerRef} {...drag.draggableProps}>
                        <TaskCard
                          task={task}
                          onToggleDone={p.onToggleDone}
                          onEdit={p.onEdit}
                          onDelete={p.onDelete}
                          onReschedule={p.onReschedule}
                          selectMode={p.selectMode}
                          selected={p.selected.has(task.id)}
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
        </DragDropContext>
      )}
    </div>
  )
}
