import { clp, hasOffer, discountPercent } from '../utils/pricing.js';

// Precio normal, o precio tachado + oferta + % de descuento
export default function PriceTag({ product, large = false }) {
  const priceStyle = large ? { fontSize: '1.6rem' } : undefined;

  if (!hasOffer(product)) {
    return <div className="product-price" style={priceStyle}>{clp(product.price)} CLP</div>;
  }

  return (
    <div>
      <span className="badge text-bg-danger me-2">-{discountPercent(product)}%</span>
      <span style={{ textDecoration: 'line-through', color: 'var(--text-sub)' }}>{clp(product.price)}</span>
      <div className="product-price" style={priceStyle}>{clp(product.offerPrice)} CLP</div>
    </div>
  );
}
