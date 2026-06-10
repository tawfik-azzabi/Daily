// app/page.tsx
import { getTasks } from '@/lib/tasks'
import TaskApp from '@/components/TaskApp'

export const dynamic = 'force-dynamic'   // pas de cache — toujours frais

export default async function Home() {
  let tasks = []
  try {
    tasks = await getTasks()
  } catch (e) {
    // Si Supabase n'est pas configuré, on démarre avec 0 tâche
    console.error('Supabase fetch error:', e)
  }

  return <TaskApp initialTasks={tasks} />
}
