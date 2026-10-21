import { getOrders, getProducts } from '../../utils/storage.js';
import { salesSummary, topProducts, salesByCategory } from '../../utils/reports.js';
import { clp } from '../../utils/pricing.js';
import StatCard from '../../components/admin/StatCard.jsx';
import BarList from '../../components/admin/BarList.jsx';

export default function AdminReportes() {
  const orders = getOrders();
  const sales = salesSummary(orders);
  const top = topProducts(orders, 5);
  const byCategory = salesByCategory(orders, getProducts());

  return (
    <div>
      <h2>Reportes de ventas</h2>
      <p style={{ color: 'var(--text-sub)' }}>Solo se consideran las compras con pago aprobado.</p>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-3">
        <StatCard title="Compras pagadas" value={sales.orders} sub={`${sales.units} unidades vendidas`} variant="primary" />
        <StatCard title="Ventas totales" value={clp(sales.revenue)} variant="success" />
        <StatCard title="Ticket promedio" value={clp(sales.average)} variant="warning" />
        <StatCard title="Pagos rechazados" value={sales.failed} variant="danger" />
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <BarList
            title="Productos más vendidos (unidades)"
            items={top.map((t) => ({ label: t.name, value: t.units, display: `${t.units} u.` }))}
            color="var(--accent-green)"
          />
        </div>
        <div className="col-lg-6">
          <BarList
            title="Ventas por categoría"
            items={byCategory.map((c) => ({ label: c.category, value: c.revenue, display: clp(c.revenue) }))}
          />
        </div>
      </div>
    </div>
  );
}
