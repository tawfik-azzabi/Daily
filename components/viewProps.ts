// components/viewProps.ts
import type { Task } from '@/lib/database.types'

export interface ViewProps {
  tasks:              Task[]
  onToggleDone:       (id: string) => void
  onDelete:           (id: string) => void
  onEdit:             (t: Task) => void
  onReschedule:       (ids: string[]) => void
  onReorder:          (tasks: Task[]) => void
  onAddTask:          (date?: string) => void
  selectMode:         boolean
  selected:           Set<string>
  onToggleSelect:     (id: string) => void
  onToggleSelectMode: () => void
  onBulkDone:         () => void
  onBulkDelete:       () => void
  onBulkReschedule:   (ids: string[]) => void
}
