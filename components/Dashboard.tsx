'use client'
// components/Dashboard.tsx
interface Props {
  total: number
  done:  number
  left:  number
  overdue: number
}

interface StatProps { value: number; label: string; color: string }

function Stat({ value, label, color }: StatProps) {
  return (
    <div className="flex-1 min-w-[90px] rounded-xl p-3 border"
         style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="text-2xl font-bold leading-none" style={{ color }}>{value}</div>
      <div className="text-[11px] mt-1" style={{ color: 'var(--muted)' }}>{label}</div>
    </div>
  )
}

export default function Dashboard({ total, done, left, overdue }: Props) {
  return (
    <div className="flex gap-2.5 px-4 md:px-5 pt-4 flex-wrap">
      <Stat value={total}   label="Tâches du jour"  color="var(--accent)"   />
      <Stat value={done}    label="Terminées"        color="var(--success)"  />
      <Stat value={left}    label="Restantes"        color="var(--text)"     />
      <Stat value={overdue} label="En retard"        color="var(--critical)" />
    </div>
  )
}
