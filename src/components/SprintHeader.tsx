'use client'

import { useState } from 'react'
import type { Sprint, Task } from '@/lib/supabase'

const MEMBERS = ['Lucas', 'Felipe', 'Magno', 'Vitor']

interface Props {
  activeSprint: Sprint | null
  sprints: Sprint[]
  tasks: Task[]
  onSelectSprint: (s: Sprint) => void
  onNewSprint: () => void
}

export default function SprintHeader({ activeSprint, sprints, tasks, onSelectSprint, onNewSprint }: Props) {
  const [showDropdown, setShowDropdown] = useState(false)

  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const daysLeft = activeSprint
    ? Math.max(0, Math.ceil((new Date(activeSprint.end_date).getTime() - Date.now()) / 86400000))
    : null

  return (
    <header style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
      {/* Progress bar — signature element */}
      <div style={{ height: 3, background: 'var(--border)' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'var(--accent)',
          transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: pct > 0 ? '0 0 8px rgba(232,160,32,0.4)' : 'none',
        }} />
      </div>

      <div style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, height: 60 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="9" height="9" rx="2" fill="var(--accent)" opacity="0.9"/>
            <rect x="12" y="1" width="9" height="9" rx="2" fill="var(--border)" stroke="var(--border)" strokeWidth="1"/>
            <rect x="1" y="12" width="9" height="9" rx="2" fill="var(--border)" stroke="var(--border)" strokeWidth="1"/>
            <rect x="12" y="12" width="9" height="9" rx="2" fill="var(--border)" stroke="var(--border)" strokeWidth="1"/>
          </svg>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            SprintBoard
          </span>
        </div>

        {/* Sprint selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
              fontSize: 13, fontWeight: 500, transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            {activeSprint?.name ?? 'Sem sprint'}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5 }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showDropdown && (
            <div style={{
              position: 'absolute', top: '110%', left: 0, zIndex: 50,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', minWidth: 200, overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}>
              {sprints.map(s => (
                <button
                  key={s.id}
                  onClick={() => { onSelectSprint(s); setShowDropdown(false) }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 14px',
                    fontSize: 13, color: s.id === activeSprint?.id ? 'var(--accent)' : 'var(--text-primary)',
                    background: s.id === activeSprint?.id ? 'var(--accent-dim)' : 'transparent',
                    borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8,
                  }}
                  onMouseEnter={e => { if (s.id !== activeSprint?.id) e.currentTarget.style.background = 'var(--bg-card-hover)' }}
                  onMouseLeave={e => { if (s.id !== activeSprint?.id) e.currentTarget.style.background = 'transparent' }}
                >
                  {s.is_active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
                  {s.name}
                </button>
              ))}
              <button
                onClick={() => { onNewSprint(); setShowDropdown(false) }}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: 13,
                  color: 'var(--accent)', fontWeight: 500,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-dim)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                + Novo sprint
              </button>
            </div>
          )}
        </div>

        {/* Sprint meta */}
        {activeSprint && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {new Date(activeSprint.start_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              {' → '}
              {new Date(activeSprint.end_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
            {daysLeft !== null && (
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                background: daysLeft <= 2 ? 'rgba(239,68,68,0.15)' : 'var(--accent-dim)',
                color: daysLeft <= 2 ? 'var(--priority-high)' : 'var(--accent)',
                letterSpacing: '0.3px',
              }}>
                {daysLeft}d restantes
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Stats */}
        {total > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{done}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>/{total}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>tarefas concluídas</span>
          </div>
        )}

        {/* Team avatars */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {MEMBERS.map((m, i) => (
            <div key={m} title={m} style={{
              width: 30, height: 30, borderRadius: '50%',
              background: ['#1E3A5F', '#2D1B69', '#1A3D2B', '#4A1942'][i],
              border: '2px solid var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600, color: ['#60A5FA', '#A78BFA', '#4ADE80', '#F0ABFC'][i],
              marginLeft: i > 0 ? -8 : 0, cursor: 'default',
            }}>
              {m[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  )
}
