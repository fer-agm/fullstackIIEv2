import { Link, useSearchParams } from 'react-router-dom';
import { getProductByCode } from '../utils/storage.js';
import { useCart } from '../context/CartContext.jsx';
import ProductImage from '../components/ProductImage.jsx';
import PriceTag from '../components/PriceTag.jsx';

export default function DetalleProducto() {
  const [params] = useSearchParams();
  const { add } = useCart();
  const code = params.get('code');
  const product = code ? getProductByCode(code) : null;

  let content;
  if (!code) {
    content = (
      <p>No se especificó ningún producto. <Link to="/productos" className="btn-blue">Volver al catálogo</Link></p>
    );
  } else if (!product) {
    content = (
      <p>Producto no encontrado. <Link to="/productos" className="btn-blue">Volver al catálogo</Link></p>
    );
  } else {
    content = (
      <div className="row g-4">
        <div className="col-md-6">
          <ProductImage
            product={product}
            fallback="https://via.placeholder.com/400x300/111/39FF14?text=Sin+Imagen"
            style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', background: '#080808', borderRadius: '8px' }}
          />
        </div>

        <div className="col-md-6">
          <h2>{product.name}</h2>

          <div className="product-meta" style={{ margin: '0.8rem 0' }}>
            <strong>Código:</strong> {product.code} | <strong>Categoría:</strong> {product.category}
          </div>

          <div className="product-meta" style={{ marginBottom: '1rem' }}>
            <strong>Origen / Fabricante:</strong> {product.origin || 'No especificado'}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <PriceTag product={product} large />
          </div>
        </div>

        <div className="col-12">
          <div style={{ background: '#181818', padding: '1rem', borderRadius: '6px' }}>
            <strong>Descripción:</strong>
            <p style={{ marginTop: '0.5rem', lineHeight: 1.5, color: 'var(--text-sub)' }}>{product.desc}</p>
          </div>
        </div>

        <div className="col-12 d-flex flex-wrap gap-2">
          <button onClick={() => add(product.code)} className="btn-green flex-fill">🛒 Agregar al Carrito</button>
          <Link to="/productos" className="btn-blue text-center">Volver al Catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="card">{content}</div>
    </div>
  );
}
