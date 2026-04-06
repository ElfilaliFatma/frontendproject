import React from 'react';

const inputStyle = {
  width: '100%',
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text)',
  padding: '10px 14px',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text2)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

const fieldStyle = { marginBottom: 16 };

export function Field({ label, children }) {
  return (
    <div style={fieldStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      {children}
    </div>
  );
}

export function Input({ label, ...props }) {
  return (
    <Field label={label}>
      <input
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
        {...props}
      />
    </Field>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <Field label={label}>
      <textarea
        style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
        {...props}
      />
    </Field>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <Field label={label}>
      <select
        style={{ ...inputStyle, cursor: 'pointer' }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}

export function FormRow({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {children}
    </div>
  );
}

export function FormActions({ onCancel, submitLabel = 'Enregistrer', loading }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
      <button
        type="button"
        onClick={onCancel}
        style={{
          padding: '9px 20px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          background: 'transparent',
          color: 'var(--text2)',
          fontSize: 14, fontWeight: 500,
          transition: 'all 0.15s',
        }}
      >
        Annuler
      </button>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '9px 22px',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          background: loading ? 'var(--border)' : 'var(--accent)',
          color: '#fff',
          fontSize: 14, fontWeight: 600,
          boxShadow: loading ? 'none' : 'var(--shadow-accent)',
          transition: 'all 0.15s',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Enregistrement...' : submitLabel}
      </button>
    </div>
  );
}
