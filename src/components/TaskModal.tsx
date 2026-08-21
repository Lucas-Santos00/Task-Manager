'use client'

import { useState, useEffect } from 'react'
import type { Task, TaskStatus, Priority } from '@/lib/supabase'

const MEMBERS = ['Ana', 'Bruno', 'Carla', 'Diego']
const STATUSES: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in_progress', label: 'Em andamento' },
  { id: 'review', label: 'Revisão' },
  { id: 'done', label: 'Concluído' },
]
const PRIORITIES: { id: Priority; label: string; color: string }[] = [
  { id: 'low', label: 'Baixa', color: 'var(--priority-low)' },
  { id: 'medium', label: 'Média', color: 'var(--priority-medium)' },
  { id: 'high', label: 'Alta', color: 'var(--priority-high)' },
]

interface Props {
  task: Task | null
  defaultStatus: TaskStatus
  onSave: (data: Partial<Task>) => void
  onClose: () => void
}

export default function TaskModal({ task, defaultStatus, onSave, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('backlog')
  const [priority, setPriority] = useState<Priority>('medium')
  const [assignee, setAssignee] = useState('')
  const [points, setPoints] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description ?? '')
      setStatus(task.status)
      setPriority(task.priority)
      setAssignee(task.assignee ?? '')
      setPoints(task.story_points?.toString() ?? '')
    } else {
      setStatus(defaultStatus)
    }
  }, [task, defaultStatus])

  const handleSubmit = () => {
    if (!title.trim()) { setError('Título obrigatório'); return }
    onSave({
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      assignee: assignee || null,
      story_points: points ? parseInt(points) : null,
    })
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 540,
        padding: 28,
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
      }}>
        <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
          {task ? 'Editar tarefa' : 'Nova tarefa'}
        </h2>

        {/* Title */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Título *</label>
          <input
            autoFocus
            value={title}
            onChange={e => { setTitle(e.target.value); setError('') }}
            placeholder="O que precisa ser feito?"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              ...inputStyle,
              borderColor: error ? 'var(--priority-high)' : 'var(--border)',
            }}
          />
          {error && <p style={{ fontSize: 12, color: 'var(--priority-high)', marginTop: 4 }}>{error}</p>}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Descrição</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Detalhes, critérios de aceitação..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
          />
        </div>

        {/* Row: status + priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)} style={inputStyle}>
              {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Prioridade</label>
            <select value={priority} onChange={e => setPriority(e.target.value as Priority)} style={inputStyle}>
              {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
        </div>

        {/* Row: assignee + points */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          <div>
            <label style={labelStyle}>Responsável</label>
            <select value={assignee} onChange={e => setAssignee(e.target.value)} style={inputStyle}>
              <option value="">Sem responsável</option>
              {MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Story points</label>
            <input
              type="number" min={0} max={100}
              value={points}
              onChange={e => setPoints(e.target.value)}
              placeholder="0"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 18px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)', color: 'var(--text-secondary)',
              fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-muted)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '9px 22px', borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)', color: '#0D0F14',
              fontSize: 13, fontWeight: 700, transition: 'background 0.15s',
              border: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
          >
            {task ? 'Salvar' : 'Criar tarefa'}
          </button>
        </div>
      </div>

      <style>{`
        input, textarea, select {
          background: var(--bg-input) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--radius-sm) !important;
          width: 100%; padding: 9px 12px; font-size: 13px;
          outline: none; transition: border-color 0.15s;
        }
        input:focus, textarea:focus, select:focus {
          border-color: var(--accent) !important;
        }
        select option { background: var(--bg-card); }
      `}</style>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--text-secondary)', marginBottom: 6,
  letterSpacing: '0.3px',
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-input)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  width: '100%', padding: '9px 12px',
  fontSize: 13, outline: 'none',
  transition: 'border-color 0.15s',
}
