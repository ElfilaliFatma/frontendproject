import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import Categories from './pages/Categories';
import Fournisseurs from './pages/Fournisseurs';
import Produits from './pages/Produits';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar />
        <main style={{
          flex: 1,
          padding: '36px 40px',
          minWidth: 0,
          overflowY: 'auto',
          maxHeight: '100vh',
        }}>
          <Routes>
            <Route path="/" element={<Categories />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/fournisseurs" element={<Fournisseurs />} />
            <Route path="/produits" element={<Produits />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
