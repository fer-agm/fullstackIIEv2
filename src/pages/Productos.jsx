import { useState } from 'react';
import { getProducts, getCategories } from '../utils/storage.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductGrid from '../components/ProductGrid.jsx';


export default function Productos() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('ALL');

  const q = query.toLowerCase();
  const filtered = getProducts().filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    const matchesCat = cat === 'ALL' || p.category === cat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="container">
      <h2>Catálogo Gamer</h2>

      <div className="card">
        <div className="row g-2">
          <div className="col-12 col-md-8">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="ALL">Todas las Categorías</option>
              {getCategories().map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <ProductGrid>
        {filtered.map((p) => (
          <ProductCard key={p.code} product={p} />
        ))}
      </ProductGrid>
    </div>
  );
}
