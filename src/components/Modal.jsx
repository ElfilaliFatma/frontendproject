import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          width: '100%',
          maxWidth: 520,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          animation: 'fadeIn 0.25s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface2)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'var(--border)', border: 'none', color: 'var(--text2)',
              width: 28, height: 28, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >×</button>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
