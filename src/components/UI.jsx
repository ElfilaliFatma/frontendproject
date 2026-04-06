import React from 'react';

export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      marginBottom: 28,
    }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
          {title}
        </h1>
        {subtitle && <p style={{ color: 'var(--text2)', fontSize: 14 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function ActionBtn({ onClick, children, variant = 'primary', small }) {
  const bg = variant === 'primary' ? 'var(--accent)'
           : variant === 'danger' ? 'rgba(255,71,87,0.15)'
           : 'var(--surface2)';
  const color = variant === 'primary' ? '#fff'
              : variant === 'danger' ? 'var(--danger)'
              : 'var(--text2)';
  return (
    <button
      onClick={onClick}
      style={{
        background: bg, color, border: 'none',
        padding: small ? '5px 12px' : '9px 18px',
        borderRadius: 'var(--radius-sm)',
        fontSize: small ? 12 : 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        transition: 'all 0.15s',
        boxShadow: variant === 'primary' ? 'var(--shadow-accent)' : 'none',
        fontFamily: 'var(--font-body)',
      }}
    >
      {children}
    </button>
  );
}

export function Table({ columns, data, onEdit, onDelete }) {
  if (!data.length) {
    return (
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '48px 24px',
        textAlign: 'center', color: 'var(--text3)',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>◇</div>
        <div style={{ fontSize: 15 }}>Aucun enregistrement trouvé</div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden',
      boxShadow: 'var(--shadow)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
            {columns.map(col => (
              <th key={col.key} style={{
                padding: '13px 16px', textAlign: 'left',
                fontSize: 11, fontWeight: 700,
                color: 'var(--text3)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                fontFamily: 'var(--font-body)',
              }}>
                {col.label}
              </th>
            ))}
            <th style={{
              padding: '13px 16px', textAlign: 'right',
              fontSize: 11, fontWeight: 700,
              color: 'var(--text3)', textTransform: 'uppercase',
              letterSpacing: '0.1em', fontFamily: 'var(--font-body)',
            }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id}
              style={{
                borderBottom: i < data.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.12s',
                animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map(col => (
                <td key={col.key} style={{
                  padding: '13px 16px',
                  fontSize: 14,
                  color: col.key === 'id' ? 'var(--text3)' : 'var(--text)',
                }}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
              <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <ActionBtn onClick={() => onEdit(row)} variant="secondary" small>✎ Modifier</ActionBtn>
                  <ActionBtn onClick={() => onDelete(row)} variant="danger" small>✕ Supprimer</ActionBtn>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Badge({ children, color = 'var(--accent)' }) {
  return (
    <span style={{
      background: `${color}20`,
      color,
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
    }}>
      {children}
    </span>
  );
}

export function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px 24px',
      borderTop: `3px solid ${accent || 'var(--accent)'}`,
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-head)', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text2)' }}>{label}</div>
    </div>
  );
}

export function Toast({ message, type, onClose }) {
  if (!message) return null;
  const bg = type === 'success' ? 'var(--success)' : 'var(--danger)';
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 2000,
      background: bg, color: '#fff',
      padding: '12px 20px', borderRadius: 'var(--radius-sm)',
      fontSize: 14, fontWeight: 500,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'fadeIn 0.25s ease',
    }}>
      {type === 'success' ? '✓' : '✕'} {message}
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: '#fff',
        cursor: 'pointer', fontSize: 16, marginLeft: 4,
      }}>×</button>
    </div>
  );
}

export function ConfirmDialog({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(4px)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1100,
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: 28, maxWidth: 380, width: '100%',
        textAlign: 'center', animation: 'fadeIn 0.2s ease',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠</div>
        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 17, marginBottom: 8 }}>
          Confirmer la suppression
        </h3>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>
          {message || 'Cette action est irréversible.'}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <ActionBtn onClick={onCancel} variant="secondary">Annuler</ActionBtn>
          <ActionBtn onClick={onConfirm} variant="danger">Supprimer</ActionBtn>
        </div>
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 48, color: 'var(--text3)',
    }}>
      <div style={{ animation: 'pulse 1.4s ease infinite', fontSize: 14 }}>
        Chargement...
      </div>
    </div>
  );
}
