import { useNavigate, useParams } from 'react-router-dom';
import { getOrderById } from '../utils/storage.js';
import { clp } from '../utils/pricing.js';
import OrderDetails from '../components/OrderDetails.jsx';
import OrderItemsTable from '../components/OrderItemsTable.jsx';
import OrderNotFound from '../components/OrderNotFound.jsx';
import Button from '../components/Button.jsx';

export default function PagoError() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = getOrderById(orderId);

  if (!order || order.status !== 'failed') return <OrderNotFound />;

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="card">
        <h2 style={{ color: '#ff3333' }}>✖ No se pudo realizar el pago. nro #{order.id}</h2>
        <p style={{ color: 'var(--text-sub)' }}>Detalle de compra</p>

        <div className="text-center my-3">
          <Button onClick={() => navigate('/checkout', { state: { prefill: order } })}>
            VOLVER A REALIZAR EL PAGO
          </Button>
        </div>

        <OrderDetails order={order} />

        <div className="mt-4">
          <OrderItemsTable items={order.items} />
        </div>

        <div className="text-center mt-3 p-3" style={{ background: '#181818', borderRadius: '8px' }}>
          <h3>Total a pagar: {clp(order.total)}</h3>
        </div>
      </div>
    </div>
  );
}
