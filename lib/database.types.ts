// lib/database.types.ts
export type Priority = 'normal' | 'important' | 'critique'
export type Status   = 'todo' | 'done'

export interface Task {
  id:         string
  title:      string
  description:string | null
  date:       string        // YYYY-MM-DD
  priority:   Priority
  status:     Status
  position:   number
  created_at: string
  updated_at: string
}

export type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at'>
export type TaskUpdate = Partial<Omit<Task, 'id' | 'created_at'>>

// Supabase Database shape (used by createClient generic)
export interface Database {
  public: {
    Tables: {
      tasks: {
        Row:    Task
        Insert: TaskInsert
        Update: TaskUpdate
      }
    }
  }
}
