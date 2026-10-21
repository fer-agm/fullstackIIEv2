import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCategories, saveCategory, renameCategory } from '../../utils/storage.js';

// Sirve para crear (isEdit = false) y editar (isEdit = true) una categoría
export default function AdminCategoriaForm({ isEdit = false }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const original = params.get('name') || '';
  const [name, setName] = useState(isEdit ? original : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = name.trim();
    const exists = getCategories().some((c) => c.toLowerCase() === clean.toLowerCase() && c !== original);
    if (exists) {
      alert('Ya existe una categoría con ese nombre.');
      return;
    }

    if (isEdit) {
      renameCategory(original, clean);
      alert('Categoría actualizada correctamente. Los productos asociados se actualizaron.');
    } else {
      saveCategory(clean);
      alert('Categoría creada exitosamente.');
    }
    navigate('/admin/categorias');
  };

  if (isEdit && !getCategories().includes(original)) {
    return <div className="card"><p>Categoría no encontrada.</p></div>;
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2>{isEdit ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className={isEdit ? 'btn-blue' : 'btn-green'} style={{ marginTop: '1.5rem', width: '100%' }}>
            {isEdit ? 'Actualizar Categoría' : 'Guardar Categoría'}
          </button>
        </form>
      </div>
    </div>
  );
}
