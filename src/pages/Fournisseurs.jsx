import React, { useState, useEffect, useCallback } from 'react';
import { fournisseurService } from '../services/api';
import Modal from '../components/Modal';
import { Input, FormActions, FormRow } from '../components/FormFields';
import { PageHeader, ActionBtn, Table, Badge, Toast, ConfirmDialog, Loading } from '../components/UI';

const EMPTY = { nom: '', email: '', telephone: '', adresse: '', ville: '' };

export default function Fournisseurs() {
  const [data, setData] = useState([]);
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
      const res = await fournisseurService.getAll();
      setData(res.data);
    } catch {
      notify('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true); };
  const openEdit = (row) => {
    setForm({ nom: row.nom, email: row.email || '', telephone: row.telephone || '', adresse: row.adresse || '', ville: row.ville || '' });
    setEditId(row.id);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setForm(EMPTY); setEditId(null); };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await fournisseurService.update(editId, form);
        notify('Fournisseur mis à jour !');
      } else {
        await fournisseurService.create(form);
        notify('Fournisseur créé !');
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
      await fournisseurService.delete(confirm.id);
      notify('Fournisseur supprimé !');
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
      key: 'nom', label: 'Fournisseur',
      render: (v, row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{v}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>{row.ville || ''}</div>
        </div>
      ),
    },
    { key: 'email', label: 'Email', render: v => v ? <a href={`mailto:${v}`} style={{ color: 'var(--accent)' }}>{v}</a> : '—' },
    { key: 'telephone', label: 'Téléphone' },
    {
      key: 'ville', label: 'Statut',
      render: () => <Badge color="var(--accent2)">Actif</Badge>,
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Fournisseurs"
        subtitle={`${data.length} fournisseur${data.length !== 1 ? 's' : ''} enregistré${data.length !== 1 ? 's' : ''}`}
        action={<ActionBtn onClick={openCreate}>+ Nouveau fournisseur</ActionBtn>}
      />

      {loading ? <Loading /> : (
        <Table columns={columns} data={data} onEdit={openEdit} onDelete={(row) => setConfirm(row)} />
      )}

      <Modal isOpen={modalOpen} onClose={closeModal} title={editId ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}>
        <form onSubmit={handleSubmit}>
          <Input label="Nom *" value={form.nom} onChange={set('nom')} placeholder="Nom de l'entreprise" required />
          <FormRow>
            <Input label="Email" value={form.email} onChange={set('email')} type="email" placeholder="contact@exemple.com" />
            <Input label="Téléphone" value={form.telephone} onChange={set('telephone')} placeholder="+216 XX XXX XXX" />
          </FormRow>
          <Input label="Adresse" value={form.adresse} onChange={set('adresse')} placeholder="Rue, numéro..." />
          <Input label="Ville" value={form.ville} onChange={set('ville')} placeholder="Ex: Tunis" />
          <FormActions onCancel={closeModal} loading={saving} submitLabel={editId ? 'Mettre à jour' : 'Créer'} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirm}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
        message={`Supprimer le fournisseur "${confirm?.nom}" ?`}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
