'use client'

import type { Task, TaskStatus } from '@/lib/supabase'
import TaskCard from './TaskCard'

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'var(--status-backlog)' },
  { id: 'in_progress', label: 'Em andamento', color: 'var(--status-progress)' },
  { id: 'review', label: 'Revisão', color: 'var(--status-review)' },
  { id: 'done', label: 'Concluído', color: 'var(--status-done)' },
]

interface Props {
  tasks: Task[]
  onMoveTask: (id: string, status: TaskStatus) => void
  onDeleteTask: (id: string) => void
  onEditTask: (task: Task) => void
  onNewTask: (status: TaskStatus) => void
}

export default function KanbanBoard({ tasks, onMoveTask, onDeleteTask, onEditTask, onNewTask }: Props) {
  const getColumnTasks = (status: TaskStatus) => tasks.filter(t => t.status === status)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 0,
      flex: 1,
      padding: '20px 16px',
      minHeight: 0,
      overflowX: 'auto',
    }}>
      {COLUMNS.map((col, idx) => {
        const colTasks = getColumnTasks(col.id)
        return (
          <div
            key={col.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRight: idx < COLUMNS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              padding: '0 12px',
              minWidth: 240,
            }}
          >
            {/* Column header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: col.color, flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 600, fontSize: 13,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}>
                {col.label}
              </span>
              <span style={{
                marginLeft: 'auto', fontSize: 11, fontWeight: 600,
                padding: '1px 7px', borderRadius: 10,
                background: 'var(--bg-card)',
                color: colTasks.length > 0 ? col.color : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
              }}>
                {colTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {colTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  columns={COLUMNS}
                  onMove={onMoveTask}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              ))}

              {/* Add task button */}
              <button
                onClick={() => onNewTask(col.id)}
                style={{
                  marginTop: 4, padding: '8px 12px',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)',
                  fontSize: 12, fontWeight: 500,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = col.color
                  e.currentTarget.style.color = col.color
                  e.currentTarget.style.background = 'var(--bg-card)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Adicionar tarefa
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
