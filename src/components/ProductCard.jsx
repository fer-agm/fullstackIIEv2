import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import ProductImage from './ProductImage.jsx';
import PriceTag from './PriceTag.jsx';

// Tarjeta de producto reutilizable (Home, catálogo, categorías, ofertas)
export default function ProductCard({ product, buyNow = false, descLength = 60 }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const soldOut = product.stock === 0;

  return (
    <div className="col">
      <div className="product-card h-100">
        <ProductImage product={product} />
        <div>
          <h4>{product.name}</h4>
          <div className="product-meta">Cod: {product.code} | Cat: {product.category}</div>
          <PriceTag product={product} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
            {product.desc.substring(0, descLength)}...
          </p>
        </div>

        {buyNow ? (
          <div className="d-flex flex-column gap-2 mt-3">
            <Link to={`/detalle-producto?code=${product.code}`} className="btn-blue text-center">Ver Detalle</Link>
            <button
              className="btn-green"
              disabled={soldOut}
              onClick={() => {
                add(product.code);
                navigate('/carrito');
              }}
            >
              {soldOut ? 'Agotado' : 'Comprar Ahora'}
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2 mt-3">
            <Link to={`/detalle-producto?code=${product.code}`} className="btn-blue flex-fill text-center">Detalle</Link>
            <button className="btn-green" disabled={soldOut} onClick={() => add(product.code)} aria-label="Agregar al carrito">{soldOut ? 'Agotado' : '🛒'}</button>
          </div>
        )}
      </div>
    </div>
  );
}
