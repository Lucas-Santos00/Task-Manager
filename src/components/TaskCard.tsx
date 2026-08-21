'use client'

import { useState } from 'react'
import type { Task, TaskStatus, Priority } from '@/lib/supabase'

const PRIORITY_LABELS: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Baixa', color: 'var(--priority-low)' },
  medium: { label: 'Média', color: 'var(--priority-medium)' },
  high: { label: 'Alta', color: 'var(--priority-high)' },
}

const MEMBER_COLORS: Record<string, { bg: string; text: string }> = {
  Lucas:   { bg: '#1E3A5F', text: '#60A5FA' },
  Felipe: { bg: '#2D1B69', text: '#A78BFA' },
  Magno: { bg: '#1A3D2B', text: '#4ADE80' },
  Vitor: { bg: '#4A1942', text: '#F0ABFC' },
}

interface Column { id: TaskStatus; label: string; color: string }

interface Props {
  task: Task
  columns: Column[]
  onMove: (id: string, status: TaskStatus) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export default function TaskCard({ task, columns, onMove, onDelete, onEdit }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const [menuMode, setMenuMode] = useState<'main' | 'move'>('main')

  const priority = PRIORITY_LABELS[task.priority]
  const memberColor = task.assignee ? MEMBER_COLORS[task.assignee] : null

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuMode('main')
    setShowMenu(true)
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onClick={() => onEdit(task)}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong, #3A4558)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Top row: priority + menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.6px',
          padding: '2px 7px', borderRadius: 10,
          background: `color-mix(in srgb, ${priority.color} 15%, transparent)`,
          color: priority.color,
        }}>
          {priority.label.toUpperCase()}
        </span>
        {task.story_points != null && (
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10,
            background: 'var(--bg-input)', color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
          }}>
            {task.story_points}pts
          </span>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={openMenu}
            style={{
              width: 24, height: 24, borderRadius: 6, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', fontSize: 16,
              transition: 'background 0.1s, color 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            ···
          </button>

          {showMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={e => { e.stopPropagation(); setShowMenu(false) }} />
              <div
                style={{
                  position: 'absolute', right: 0, top: 28, zIndex: 40,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', minWidth: 160, overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}
                onClick={e => e.stopPropagation()}
              >
                {menuMode === 'main' ? (
                  <>
                    <MenuItem label="Editar" icon="✏️" onClick={() => { onEdit(task); setShowMenu(false) }} />
                    <MenuItem label="Mover para..." icon="→" onClick={() => setMenuMode('move')} />
                    <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '4px 0' }} />
                    <MenuItem label="Excluir" icon="🗑" danger onClick={() => { onDelete(task.id); setShowMenu(false) }} />
                  </>
                ) : (
                  <>
                    <button
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}
                    >
                      ← MOVER PARA
                    </button>
                    {columns.filter(c => c.id !== task.status).map(col => (
                      <MenuItem
                        key={col.id}
                        label={col.label}
                        dotColor={col.color}
                        onClick={() => { onMove(task.id, col.id); setShowMenu(false) }}
                      />
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <p style={{
        fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
        lineHeight: 1.45, marginBottom: task.description || task.assignee ? 8 : 0,
      }}>
        {task.title}
      </p>

      {/* Description preview */}
      {task.description && (
        <p style={{
          fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          marginBottom: 8,
        }}>
          {task.description}
        </p>
      )}

      {/* Assignee */}
      {task.assignee && memberColor && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            background: memberColor.bg, color: memberColor.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 700,
          }}>
            {task.assignee[0]}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{task.assignee}</span>
        </div>
      )}
    </div>
  )
}

function MenuItem({
  label, icon, dotColor, danger, onClick,
}: {
  label: string; icon?: string; dotColor?: string; danger?: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', padding: '8px 14px',
        fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
        color: danger ? 'var(--priority-high)' : 'var(--text-primary)',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.08)' : 'var(--bg-card-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {dotColor && <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />}
      {icon && <span style={{ fontSize: 12 }}>{icon}</span>}
      {label}
    </button>
  )
}
