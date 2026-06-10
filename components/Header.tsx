'use client'
// components/Header.tsx
import { Search, Plus } from 'lucide-react'

interface Props {
  search: string
  onSearch: (v: string) => void
  onAdd: () => void
}

export default function Header({ search, onSearch, onAdd }: Props) {
  return (
    <header
      className="flex items-center gap-3 px-4 md:px-5 h-14 border-b flex-shrink-0 z-10"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 font-bold text-base tracking-tight select-none">
        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
        TaskFlow
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--muted)' }}
        />
        <input
          id="search-input"
          type="text"
          placeholder="Rechercher… (⌘K)"
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-full text-sm pl-8 pr-3 py-1.5 rounded-full outline-none transition-colors"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
          onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      <div className="ml-auto">
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: 'var(--accent)', color: '#fff', border: 'none' }}
        >
          <Plus size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">Nouvelle tâche</span>
          <span className="sm:hidden">Ajouter</span>
        </button>
      </div>
    </header>
  )
}
