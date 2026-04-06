import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/categories',  icon: '◈', label: 'Catégories' },
  { to: '/fournisseurs',icon: '◉', label: 'Fournisseurs' },
  { to: '/produits',    icon: '◆', label: 'Produits' },
];

const styles = {
  sidebar: {
    width: 220,
    minHeight: '100vh',
    background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '28px 0',
    position: 'sticky',
    top: 0,
    height: '100vh',
    flexShrink: 0,
  },
  logo: {
    padding: '0 24px 32px',
    borderBottom: '1px solid var(--border)',
    marginBottom: 16,
  },
  logoTitle: {
    fontFamily: 'var(--font-head)',
    fontSize: 22,
    fontWeight: 800,
    background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  logoSub: {
    fontSize: 11,
    color: 'var(--text3)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  nav: { flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '11px 14px',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text2)',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.18s ease',
    position: 'relative',
  },
  icon: { fontSize: 16, lineHeight: 1 },
  footer: {
    padding: '20px 24px',
    borderTop: '1px solid var(--border)',
    fontSize: 12,
    color: 'var(--text3)',
  },
};

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
      </div>

      <nav style={styles.nav}>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              ...styles.link,
              background: isActive ? 'rgba(108,99,255,0.12)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text2)',
              borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
            })}
          >
            <span style={styles.icon}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={styles.footer}>
      </div>
    </aside>
  );
}
