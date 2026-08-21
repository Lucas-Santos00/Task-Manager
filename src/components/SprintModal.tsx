'use client'

import { useState } from 'react'
import type { Sprint } from '@/lib/supabase'

interface Props {
  onSave: (data: Partial<Sprint>) => void
  onClose: () => void
}

export default function SprintModal({ onSave, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]

  const [name, setName] = useState(`Sprint ${new Date().toLocaleDateString('pt-BR', { month: 'short' })}`)
  const [goal, setGoal] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(twoWeeks)
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) { setError('Nome obrigatório'); return }
    if (endDate < startDate) { setError('Data de fim deve ser após o início'); return }
    onSave({ name: name.trim(), goal: goal.trim() || null, start_date: startDate, end_date: endDate, is_active: isActive })
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
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 460,
        padding: 28, boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
      }}>
        <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
          Novo sprint
        </h2>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Nome *</label>
          <input
            autoFocus value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            style={inputStyle}
          />
          {error && <p style={{ fontSize: 12, color: 'var(--priority-high)', marginTop: 4 }}>{error}</p>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Objetivo do sprint</label>
          <textarea
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="O que queremos alcançar neste sprint?"
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Início</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Fim</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, cursor: 'pointer' }}>
          <div
            onClick={() => setIsActive(v => !v)}
            style={{
              width: 36, height: 20, borderRadius: 10,
              background: isActive ? 'var(--accent)' : 'var(--border)',
              position: 'relative', transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 2, left: isActive ? 18 : 2,
              width: 16, height: 16, borderRadius: '50%',
              background: isActive ? '#0D0F14' : 'var(--text-muted)',
              transition: 'left 0.2s',
            }} />
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Definir como sprint ativo</span>
        </label>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '9px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 13 }}
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
              fontSize: 13, fontWeight: 700, border: 'none',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
          >
            Criar sprint
          </button>
        </div>
      </div>

      <style>{`
        input, textarea {
          background: var(--bg-input) !important; color: var(--text-primary) !important;
          border: 1px solid var(--border) !important; border-radius: var(--radius-sm) !important;
          width: 100%; padding: 9px 12px; font-size: 13px; outline: none;
          transition: border-color 0.15s; font-family: inherit;
        }
        input:focus, textarea:focus { border-color: var(--accent) !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
      `}</style>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--text-secondary)', marginBottom: 6,
}
const inputStyle: React.CSSProperties = {
  background: 'var(--bg-input)', color: 'var(--text-primary)',
  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
  width: '100%', padding: '9px 12px', fontSize: 13, outline: 'none',
}
