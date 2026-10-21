import { useParams } from 'react-router-dom';
import { getOrderById } from '../utils/storage.js';
import { clp } from '../utils/pricing.js';
import OrderDetails from '../components/OrderDetails.jsx';
import OrderItemsTable from '../components/OrderItemsTable.jsx';
import OrderNotFound from '../components/OrderNotFound.jsx';

export default function PagoCorrecto() {
  const { orderId } = useParams();
  const order = getOrderById(orderId);

  if (!order || order.status !== 'success') return <OrderNotFound />;

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="card">
        <div className="text-end" style={{ color: 'var(--text-sub)', fontSize: '0.8rem' }}>
          Código orden: {order.code}
        </div>
        <h2 style={{ color: 'var(--accent-green)' }}>✔ Se ha realizado la compra. nro #{order.id}</h2>
        <p style={{ color: 'var(--text-sub)' }}>Resumen de tu compra</p>

        <OrderDetails order={order} />

        <div className="mt-4">
          <OrderItemsTable items={order.items} />
        </div>

        <div className="text-center mt-3 p-3" style={{ background: '#181818', borderRadius: '8px' }}>
          {order.discount > 0 && (
            <p className="mb-1" style={{ color: 'var(--accent-green)' }}>Descuento Duoc (20%): -{clp(order.discount)}</p>
          )}
          <h3>Total pagado: {clp(order.total)}</h3>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3 d-print-none">
          <button className="btn btn-danger btn-sm" onClick={() => window.print()}>Imprimir boleta en PDF</button>
          <button
            className="btn btn-success btn-sm"
            onClick={() => alert(`Boleta enviada a ${order.customer.correo}`)}
          >
            Enviar boleta por email
          </button>
        </div>
      </div>
    </div>
  );
}
