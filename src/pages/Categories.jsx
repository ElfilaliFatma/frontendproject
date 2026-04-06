import React, { useState, useEffect, useCallback } from 'react';
import { categorieService } from '../services/api';
import Modal from '../components/Modal';
import { Input, Textarea, FormActions } from '../components/FormFields';
import { PageHeader, ActionBtn, Table, Badge, Toast, ConfirmDialog, Loading } from '../components/UI';

const EMPTY = { nom: '', description: '' };

export default function Categories() {
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
      const res = await categorieService.getAll();
      setData(res.data);
    } catch {
      notify('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true); };
  const openEdit = (row) => { setForm({ nom: row.nom, description: row.description || '' }); setEditId(row.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setForm(EMPTY); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await categorieService.update(editId, form);
        notify('Catégorie mise à jour !');
      } else {
        await categorieService.create(form);
        notify('Catégorie créée !');
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
      await categorieService.delete(confirm.id);
      notify('Catégorie supprimée !');
      load();
    } catch {
      notify('Erreur lors de la suppression', 'error');
    } finally {
      setConfirm(null);
    }
  };

  const columns = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom', render: v => <strong>{v}</strong> },
    { key: 'description', label: 'Description', render: v => v || <span style={{ color: 'var(--text3)' }}>—</span> },
    {
      key: '_produits', label: 'Statut',
      render: (_, row) => <Badge color="var(--accent)">Active</Badge>,
    },
  ];

  return (
    <div className="fade-in">
      <PageHeader
        title="Catégories"
        subtitle={`${data.length} catégorie${data.length !== 1 ? 's' : ''} enregistrée${data.length !== 1 ? 's' : ''}`}
        action={
          <ActionBtn onClick={openCreate}>
            + Nouvelle catégorie
          </ActionBtn>
        }
      />

      {loading ? <Loading /> : (
        <Table
          columns={columns}
          data={data}
          onEdit={openEdit}
          onDelete={(row) => setConfirm(row)}
        />
      )}

      <Modal isOpen={modalOpen} onClose={closeModal} title={editId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nom *"
            value={form.nom}
            onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
            placeholder="Ex: Électronique"
            required
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Décrivez cette catégorie..."
          />
          <FormActions onCancel={closeModal} loading={saving} submitLabel={editId ? 'Mettre à jour' : 'Créer'} />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirm}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
        message={`Supprimer la catégorie "${confirm?.nom}" ?`}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
