import React, { useState, useEffect, useCallback } from 'react';
import { produitService, categorieService, fournisseurService } from '../services/api';
import Modal from '../components/Modal';
import { Input, Textarea, Select, FormActions, FormRow } from '../components/FormFields';
import { PageHeader, ActionBtn, Table, Badge, Toast, ConfirmDialog, Loading } from '../components/UI';

const EMPTY = { nom: '', description: '', prix: '', stock: '', imageUrl: '', categorieId: '', fournisseurId: '' };

export default function Produits() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const notify = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    try {
      const [prods, cats, fours] = await Promise.all([
        produitService.getAll(),
        categorieService.getAll(),
        fournisseurService.getAll(),
      ]);
      setData(prods.data);
      setCategories(cats.data);
      setFournisseurs(fours.data);
    } catch {
      notify('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true); };
  const openEdit = (row) => {
    setForm({
      nom: row.nom,
      description: row.description || '',
      prix: row.prix,
      stock: row.stock,
      imageUrl: row.imageUrl || '',
      categorieId: row.categorie?.id || '',
      fournisseurId: row.fournisseur?.id || '',
    });
    setEditId(row.id);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setForm(EMPTY); setEditId(null); };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const buildPayload = () => ({
    nom: form.nom,
    description: form.description,
    prix: parseFloat(form.prix),
    stock: parseInt(form.stock) || 0,
    imageUrl: form.imageUrl,
    categorie: form.categorieId ? { id: parseInt(form.categorieId) } : null,
    fournisseur: form.fournisseurId ? { id: parseInt(form.fournisseurId) } : null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await produitService.update(editId, buildPayload());
        notify('Produit mis à jour !');
      } else {
        await produitService.create(buildPayload());
        notify('Produit créé !');
      }
      closeModal();
      load();
    } catch {
      notify('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await produitService.delete(confirm.id);
      notify('Produit supprimé !');
      load();
    } catch {
      notify('Erreur lors de la suppression', 'error');
    } finally {
      setConfirm(null);
    }
  };



  const columns = [
    { key: 'id', label: '#' },
    {
      key: 'nom', label: 'Produit',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={v}
              style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'var(--surface2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text3)', fontSize: 14, flexShrink: 0,
            }}>◆</div>
          )}
          <div>
            <div style={{ fontWeight: 600 }}>{v}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>
              {row.description ? row.description.slice(0, 35) + (row.description.length > 35 ? '...' : '') : ''}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'categorie', label: 'Catégorie',
      render: v => v ? <Badge color="var(--accent)">{v.nom}</Badge> : <span style={{ color: 'var(--text3)' }}>—</span>,
    },
    {
      key: 'fournisseur', label: 'Fournisseur',
      render: v => v ? <Badge color="var(--accent2)">{v.nom}</Badge> : <span style={{ color: 'var(--text3)' }}>—</span>,
    },
    {
      key: 'prix', label: 'Prix',
      render: v => <span style={{ fontWeight: 700, color: 'var(--accent3)' }}>{v?.toFixed(2)} TND</span>,
    },
    {
      key: 'stock', label: 'Stock',
      render: v => (
        <span style={{ color: v > 10 ? 'var(--success)' : v > 0 ? 'var(--warning)' : 'var(--danger)', fontWeight: 600 }}>
          {v}
        </span>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Produits"
        subtitle={`${data.length} produit${data.length !== 1 ? 's' : ''}`}
        action={<ActionBtn onClick={openCreate}>+ Nouveau produit</ActionBtn>}
      />

      {loading ? <Loading /> : (
        <Table columns={columns} data={data} onEdit={openEdit} onDelete={(row) => setConfirm(row)} />
      )}

      <Modal isOpen={modalOpen} onClose={closeModal} title={editId ? 'Modifier le produit' : 'Nouveau produit'}>
        <form onSubmit={handleSubmit}>
          <Input label="Nom *" value={form.nom} onChange={set('nom')} placeholder="Nom du produit" required />
          <Textarea label="Description" value={form.description} onChange={set('description')} placeholder="Description du produit..." />
          <FormRow>
            <Input label="Prix (TND) *" value={form.prix} onChange={set('prix')} type="number" step="0.01" min="0" placeholder="0.00" required />
            <Input label="Stock" value={form.stock} onChange={set('stock')} type="number" min="0" placeholder="0" />
          </FormRow>
          <FormRow>
            <Select label="Catégorie" value={form.categorieId} onChange={set('categorieId')}>
              <option value="">— Sélectionner —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </Select>
            <Select label="Fournisseur" value={form.fournisseurId} onChange={set('fournisseurId')}>
              <option value="">— Sélectionner —</option>
              {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
            </Select>
          </FormRow>
          <Input label="URL Image" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />
          {form.imageUrl && (
            <div style={{ marginBottom: 16 }}>
              <img src={form.imageUrl} alt="preview"
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
          <FormActions onCancel={closeModal} loading={saving} submitLabel={editId ? 'Mettre à jour' : 'Créer'} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirm}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
        message={`Supprimer le produit "${confirm?.nom}" ?`}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
