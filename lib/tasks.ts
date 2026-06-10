// lib/tasks.ts  — toutes les opérations CRUD
import { supabase } from './supabase'
import type { Task, TaskInsert, TaskUpdate } from './database.types'

// ── Lecture ────────────────────────────────────────────────────────
export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

// ── Création ───────────────────────────────────────────────────────
export async function createTask(input: TaskInsert): Promise<Task> {
  // Calcule la prochaine position
  const { data: last } = await supabase
    .from('tasks')
    .select('position')
    .eq('date', input.date)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  const position = last ? last.position + 1000 : 1000

  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...input, position })
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Mise à jour ────────────────────────────────────────────────────
export async function updateTask(id: string, update: TaskUpdate): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Suppression ────────────────────────────────────────────────────
export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

// ── Suppression en masse ───────────────────────────────────────────
export async function deleteTasks(ids: string[]): Promise<void> {
  const { error } = await supabase.from('tasks').delete().in('id', ids)
  if (error) throw error
}

// ── Replanification en masse ───────────────────────────────────────
export async function rescheduleTasks(ids: string[], date: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ date, updated_at: new Date().toISOString() })
    .in('id', ids)
  if (error) throw error
}

// ── Réordonnancement ───────────────────────────────────────────────
export async function reorderTasks(
  orderedIds: string[]
): Promise<void> {
  // Met à jour les positions par batch
  const updates = orderedIds.map((id, i) =>
    supabase.from('tasks').update({ position: (i + 1) * 1000 }).eq('id', id)
  )
  await Promise.all(updates)
}
