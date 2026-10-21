import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm.jsx';
import { getCategories, getProductByCode, updateProduct } from '../utils/storage.js';

export default function EditarProducto() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const code = params.get('code');

  const [values, setValues] = useState(() => {
    const prod = getProductByCode(code);
    return prod
      ? { ...prod, image: prod.image || '', offerPrice: prod.offerPrice ?? '', stock: prod.stock ?? 0 }
      : { code: '', category: getCategories()[0], name: '', price: '', offerPrice: '', stock: '', origin: '', desc: '', image: '' };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      code: values.code,
      category: values.category,
      name: values.name,
      price: parseInt(values.price),
      stock: parseInt(values.stock),
      origin: values.origin,
      desc: values.desc,
      image: values.image.trim(), // se conserva la imagen al editar
    };
    if (values.offerPrice !== '' && values.offerPrice !== null) updated.offerPrice = parseInt(values.offerPrice);

    if (updated.offerPrice !== undefined && updated.offerPrice >= updated.price) {
      alert('El precio de oferta debe ser menor al precio normal.');
      return;
    }
    updateProduct(updated);
    alert('Producto actualizado correctamente.');
    navigate('/admin/productos');
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h2>Editar Producto</h2>
        <ProductForm
          isEdit
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          imageLabel="Nombre de la Imagen (assets/img/):"
          imagePlaceholder="Ejemplo: ps5.png"
          submitText="Actualizar Producto"
          submitClass="btn-blue"
        />
      </div>
    </div>
  );
}
