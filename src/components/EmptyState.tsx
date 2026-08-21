'use client'

interface Props { onNewSprint: () => void }

export default function EmptyState({ onNewSprint }: Props) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: 40,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: 'var(--accent-dim)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="2" width="11" height="11" rx="3" fill="var(--accent)" opacity="0.9"/>
          <rect x="15" y="2" width="11" height="11" rx="3" fill="var(--border)" stroke="var(--border)" strokeWidth="1.5"/>
          <rect x="2" y="15" width="11" height="11" rx="3" fill="var(--border)" stroke="var(--border)" strokeWidth="1.5"/>
          <rect x="15" y="15" width="11" height="11" rx="3" fill="var(--border)" stroke="var(--border)" strokeWidth="1.5"/>
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
          Nenhum sprint ainda
        </h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 320, lineHeight: 1.6 }}>
          Crie o primeiro sprint para começar a organizar as tarefas do time.
        </p>
      </div>
      <button
        onClick={onNewSprint}
        style={{
          marginTop: 8, padding: '10px 24px',
          background: 'var(--accent)', color: '#0D0F14',
          borderRadius: 'var(--radius-md)', border: 'none',
          fontSize: 14, fontWeight: 700, transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
      >
        Criar primeiro sprint
      </button>
    </div>
  )
}
