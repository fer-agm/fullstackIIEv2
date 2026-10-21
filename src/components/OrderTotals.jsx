import { clp } from '../utils/pricing.js';

export default function OrderTotals({ subtotal, discount, total, totalLabel = 'Total' }) {
  return (
    <div className="text-end mt-3">
      <p className="mb-1">Subtotal: {clp(subtotal)} CLP</p>
      {discount > 0 && (
        <p className="mb-1" style={{ color: 'var(--accent-green)' }}>Descuento Duoc (20%): -{clp(discount)} CLP</p>
      )}
      <h3 style={{ color: 'var(--accent-blue)' }}>{totalLabel}: {clp(total)} CLP</h3>
    </div>
  );
}
