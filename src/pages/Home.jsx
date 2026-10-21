import { Link } from 'react-router-dom';
import { getProducts } from '../utils/storage.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductGrid from '../components/ProductGrid.jsx';

export default function Home() {
  const products = getProducts();

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
        <h1>¡Desafía tus límites con Level-Up Gamer!</h1>
        <p style={{ color: 'var(--text-sub)', margin: '1rem 0' }}>
          Tu tienda online líder en productos gamer en Chile.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
          <Link to="/productos" className="btn-green">Ver Catálogo Completo</Link>
          <Link to="/login" className="btn-blue">🔐 Iniciar Sesión / Admin</Link>
          <Link to="/registro" className="btn-blue" style={{ background: '#444' }}>Registrarse (20% Desc. Duoc)</Link>
        </div>
      </div>

      <div className="card">
        <h2>Productos Destacados</h2>
        {products.length === 0 ? (
          <p style={{ color: 'var(--text-sub)' }}>Cargando productos...</p>
        ) : (
          <ProductGrid>
            {products.slice(0, 6).map((p) => (
              <ProductCard key={p.code} product={p} buyNow descLength={70} />
            ))}
          </ProductGrid>
        )}
      </div>
    </div>
  );
}
