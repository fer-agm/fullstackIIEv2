import { Link } from 'react-router-dom';
import { getOrders, getProducts, getUsers } from '../../utils/storage.js';
import { salesSummary } from '../../utils/reports.js';
import { isCritical } from '../../utils/inventory.js';
import { clp } from '../../utils/pricing.js';
import StatCard from '../../components/admin/StatCard.jsx';
import AdminTile from '../../components/admin/AdminTile.jsx';

export default function AdminDashboard() {
  const orders = getOrders();
  const products = getProducts();
  const users = getUsers();
  const sales = salesSummary(orders);
  const inventory = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const critical = products.filter(isCritical).length;

  return (
    <div>
      <h2>Dashboard</h2>
      <p style={{ color: 'var(--text-sub)' }}>Resumen de las actividades diarias</p>

      <div className="row row-cols-1 row-cols-md-3 g-3 my-2">
        <StatCard title="Compras" value={sales.orders} sub={`Ventas totales: ${clp(sales.revenue)}`} variant="primary" />
        <StatCard title="Productos" value={products.length} sub={`Inventario actual: ${inventory}`} variant="success" />
        <StatCard title="Usuarios" value={users.length} sub={`Administradores: ${users.filter((u) => u.role === 'admin').length}`} variant="warning" />
      </div>

      {critical > 0 && (
        <div className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
          <span>⚠ {critical} producto{critical === 1 ? '' : 's'} con stock crítico.</span>
          <Link to="/admin/productos/criticos" className="btn btn-sm btn-dark">Ver listado</Link>
        </div>
      )}

      <div className="row row-cols-2 row-cols-md-4 g-3 mt-2">
        <AdminTile to="/admin/ordenes" icon="🧾" title="Órdenes" desc="Gestión y seguimiento de las órdenes de compra realizadas." />
        <AdminTile to="/admin/productos" icon="📦" title="Productos" desc="Administrar inventario y detalles de los productos." />
        <AdminTile to="/admin/categorias" icon="🏷️" title="Categorías" desc="Organizar productos en categorías." />
        <AdminTile to="/admin/usuarios" icon="👥" title="Usuarios" desc="Gestión de cuentas de usuario y sus roles." />
        <AdminTile to="/admin/reportes" icon="📈" title="Reportes" desc="Informes de ventas y operaciones del sistema." />
        <AdminTile to="/admin/productos/criticos" icon="⚠️" title="Stock crítico" desc="Productos con poco inventario." />
        <AdminTile to="/admin/perfil" icon="👤" title="Perfil" desc="Información personal y contraseña." />
        <AdminTile to="/" icon="🏪" title="Tienda" desc="Visualiza la tienda como la ven los clientes." />
      </div>
    </div>
  );
}
