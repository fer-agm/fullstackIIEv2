import { useSearchParams } from 'react-router-dom';
import { getCategories, getProducts } from '../utils/storage.js';
import CategoryTile from '../components/CategoryTile.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductGrid from '../components/ProductGrid.jsx';

export default function Categorias() {
  const CATEGORIES = getCategories();
  const [params] = useSearchParams();
  const requested = params.get('cat');
  const selected = CATEGORIES.includes(requested) ? requested : CATEGORIES[0];

  const products = getProducts();
  const inCategory = products.filter((p) => p.category === selected);

  return (
    <div className="container">
      <h2>Categorías</h2>

      <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
        {CATEGORIES.map((name) => (
          <CategoryTile
            key={name}
            name={name}
            count={products.filter((p) => p.category === name).length}
            active={name === selected}
          />
        ))}
      </div>

      <div className="card">
        <h3>{selected}</h3>
        {inCategory.length === 0 ? (
          <p style={{ color: 'var(--text-sub)' }}>No hay productos en esta categoría.</p>
        ) : (
          <ProductGrid>
            {inCategory.map((p) => (
              <ProductCard key={p.code} product={p} />
            ))}
          </ProductGrid>
        )}
      </div>
    </div>
  );
}
