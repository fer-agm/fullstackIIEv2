import { getCategories } from '../utils/storage.js';

// Formulario compartido por NuevoProducto y EditarProducto
export default function ProductForm({ values, onChange, onSubmit, isEdit, imagePlaceholder, imageLabel, codePlaceholder, originPlaceholder, submitText, submitClass }) {
  const set = (field) => (e) => onChange({ ...values, [field]: e.target.value });

  return (
    <form onSubmit={onSubmit}>
      {isEdit ? (
        <>
          <label>Código (No editable):</label>
          <input type="text" value={values.code} readOnly style={{ opacity: 0.6 }} />
        </>
      ) : (
        <>
          <label>Código:</label>
          <input type="text" value={values.code} onChange={set('code')} required placeholder={codePlaceholder} />
        </>
      )}

      <label>Categoría:</label>
      <select value={values.category} onChange={set('category')} required>
        {[...new Set([...getCategories(), values.category])].filter(Boolean).map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label>Nombre:</label>
      <input type="text" value={values.name} onChange={set('name')} required />

      <label>Precio (CLP):</label>
      <input type="number" value={values.price} onChange={set('price')} required />

      <label>Precio de oferta (CLP, opcional):</label>
      <input type="number" min="1" value={values.offerPrice} onChange={set('offerPrice')} placeholder="Dejar vacío si no está en oferta" />

      <label>Stock (unidades):</label>
      <input type="number" min="0" value={values.stock} onChange={set('stock')} required />

      <label>Origen / Fabricante:</label>
      <input type="text" value={values.origin} onChange={set('origin')} required placeholder={originPlaceholder} />

      <label>Descripción:</label>
      <textarea rows="3" value={values.desc} onChange={set('desc')} required />

      <label>{imageLabel}</label>
      <input type="text" value={values.image} onChange={set('image')} placeholder={imagePlaceholder} />

      <button type="submit" className={submitClass} style={{ marginTop: '1.5rem', width: '100%' }}>
        {submitText}
      </button>
    </form>
  );
}
