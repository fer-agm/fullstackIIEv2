import { Link } from 'react-router-dom';
import { getProducts } from '../utils/storage.js';
import { hasOffer, discountPercent } from '../utils/pricing.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductGrid from '../components/ProductGrid.jsx';

export default function Ofertas() {
  // Mayor descuento primero
  const offers = getProducts().filter(hasOffer).sort((a, b) => discountPercent(b) - discountPercent(a));

  return (
    <div className="container">
      <h2>Ofertas</h2>

      <div className="card">
        {offers.length === 0 ? (
          <p style={{ color: 'var(--text-sub)' }}>
            Por ahora no hay productos en oferta. <Link to="/productos" className="btn-blue">Ver catálogo</Link>
          </p>
        ) : (
          <ProductGrid>
            {offers.map((p) => (
              <ProductCard key={p.code} product={p} buyNow />
            ))}
          </ProductGrid>
        )}
      </div>
    </div>
  );
}
