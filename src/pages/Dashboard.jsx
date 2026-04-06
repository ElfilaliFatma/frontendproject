import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categorieService, fournisseurService, produitService } from '../services/api';
import { Stat, Loading } from '../components/UI';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    Promise.all([
      categorieService.getAll(),
      fournisseurService.getAll(),
      produitService.getAll(),
    ]).then(([cats, fours, prods]) => {
      setStats({
        categories: cats.data.length,
        fournisseurs: fours.data.length,
        produits: prods.data.length,
        stockTotal: prods.data.reduce((s, p) => s + (p.stock || 0), 0),
      });
      setProduits(prods.data.slice(0, 5));
    }).catch(() => {
      setStats({ categories: 0, fournisseurs: 0, produits: 0, stockTotal: 0 });
    });
  }, []);

  if (!stats) return <Loading />;

  return (
    <div className="fade-in">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(255,101,132,0.08) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '32px 36px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -20, top: -20,
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <h1 style={{
          fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 800,
          background: 'linear-gradient(135deg, var(--text), var(--accent))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 6,
        }}>
          Tableau de bord
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 15 }}>
          Vue d'ensemble de votre plateforme e-commerce
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <Stat label="Catégories" value={stats.categories} accent="var(--accent)" />
        <Stat label="Fournisseurs" value={stats.fournisseurs} accent="var(--accent2)" />
        <Stat label="Produits" value={stats.produits} accent="var(--accent3)" />
        <Stat label="Stock total" value={stats.stockTotal} accent="var(--warning)" />
      </div>

      {/* Quick Links + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* Quick access */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 24,
        }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 15, marginBottom: 16, color: 'var(--text2)' }}>
            ACCÈS RAPIDE
          </h3>
          {[
            { to: '/categories', label: 'Gérer les catégories', icon: '◈', color: 'var(--accent)' },
            { to: '/fournisseurs', label: 'Gérer les fournisseurs', icon: '◉', color: 'var(--accent2)' },
            { to: '/produits', label: 'Gérer les produits', icon: '◆', color: 'var(--accent3)' },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                background: 'var(--surface2)',
                marginBottom: 8, color: 'var(--text)',
                transition: 'all 0.15s', fontSize: 14, fontWeight: 500,
                border: '1px solid transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.color = item.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = 'var(--text)';
              }}
            >
              <span style={{ color: item.color, fontSize: 18 }}>{item.icon}</span>
              {item.label}
              <span style={{ marginLeft: 'auto', color: 'var(--text3)' }}>→</span>
            </Link>
          ))}
        </div>

        {/* Recent products */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 24,
        }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 15, marginBottom: 16, color: 'var(--text2)' }}>
            DERNIERS PRODUITS
          </h3>
          {produits.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: 14 }}>Aucun produit enregistré</p>
          ) : (
            produits.map((p, i) => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '10px 0',
                borderBottom: i < produits.length - 1 ? '1px solid var(--border)' : 'none',
                animation: `fadeIn 0.3s ease ${i * 0.06}s both`,
              }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.nom}
                    style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{
                    width: 42, height: 42, borderRadius: 8,
                    background: 'var(--surface2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text3)', fontSize: 18,
                  }}>◆</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.nom}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                    {p.categorie?.nom || 'Sans catégorie'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent3)', fontSize: 14 }}>
                    {p.prix?.toFixed(2)} TND
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                    Stock: {p.stock}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
