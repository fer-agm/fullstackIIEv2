import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm.jsx';
import { getCategories, getProductByCode, saveProduct } from '../utils/storage.js';

export default function NuevoProducto() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    code: '', category: getCategories()[0], name: '', price: '', offerPrice: '', stock: '', origin: '', desc: '', image: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      code: values.code,
      category: values.category,
      name: values.name,
      price: parseInt(values.price),
      stock: parseInt(values.stock),
      origin: values.origin,
      desc: values.desc,
      image: values.image.trim() || 'default.png',
    };
    if (values.offerPrice !== '') product.offerPrice = parseInt(values.offerPrice);

    if (product.offerPrice !== undefined && product.offerPrice >= product.price) {
      alert('El precio de oferta debe ser menor al precio normal.');
      return;
    }

    if (getProductByCode(product.code)) {
      alert('El código de producto ya existe.');
      return;
    }

    saveProduct(product);
    alert('Producto guardado exitosamente. Ahora es visible en la página de productos.');
    navigate('/admin/productos');
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h2>Agregar Nuevo Producto</h2>
        <ProductForm
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          codePlaceholder="Ej: AC003"
          originPlaceholder="Ej: Sony / Japón"
          imageLabel="Nombre de la Imagen (Guardada en assets/img/):"
          imagePlaceholder="Ejemplo: ps5.png o auricular.jpg"
          submitText="Guardar Producto"
          submitClass="btn-green"
        />
      </div>
    </div>
  );
}
