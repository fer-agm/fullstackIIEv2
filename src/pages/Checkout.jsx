import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getNextOrderNumber, saveOrder, updateUser, decrementStock } from '../utils/storage.js';
import { computeTotals, clp } from '../utils/pricing.js';
import { simulatePayment } from '../utils/payment.js';
import { DEFAULT_REGION, getCommunes } from '../utils/chile.js';
import OrderItemsTable from '../components/OrderItemsTable.jsx';
import OrderTotals from '../components/OrderTotals.jsx';
import CustomerInfoFields from '../components/CustomerInfoFields.jsx';
import DeliveryAddressFields from '../components/DeliveryAddressFields.jsx';

const POINTS_PER_PURCHASE = 50;

// Si hay sesión, los datos del cliente se completan solos; si viene de un pago fallido, se reutilizan.
function initialForm(user, prefill) {
  if (prefill) return { ...prefill.customer, ...prefill.address };
  const [nombre = '', ...rest] = (user?.name || '').split(' ');
  return {
    nombre,
    apellidos: rest.join(' '),
    correo: user?.email || '',
    calle: '',
    departamento: '',
    region: DEFAULT_REGION,
    comuna: getCommunes(DEFAULT_REGION)[0],
    indicaciones: '',
  };
}

export default function Checkout() {
  const { items, clear } = useCart();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState(() => initialForm(user, state?.prefill));
  const [paying, setPaying] = useState(false);

  const totals = computeTotals(items, user);
  const patch = (partial) => setForm((f) => ({ ...f, ...partial }));

  if (items.length === 0 && !paying) {
    return (
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card text-center">
          <p>No hay productos en el carrito para pagar.</p>
          <Link to="/productos" className="btn-blue mt-2">Ir al catálogo</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaying(true);

    const id = getNextOrderNumber();
    const order = {
      id,
      code: `ORDER${id}`,
      date: new Date().toISOString(),
      userEmail: user?.email ?? null,
      customer: {
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim(),
      },
      address: {
        calle: form.calle.trim(),
        departamento: form.departamento.trim(),
        region: form.region,
        comuna: form.comuna,
        indicaciones: form.indicaciones.trim(),
      },
      items: items.map(({ code, name, price, qty, image }) => ({ code, name, price, qty, image })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      total: totals.total,
    };

    const { ok } = await simulatePayment(order);
    saveOrder({ ...order, status: ok ? 'success' : 'failed' });

    if (ok) {
      decrementStock(order.items);
      clear();
      if (user) {
        const updated = { ...user, points: (user.points || 0) + POINTS_PER_PURCHASE };
        updateUser(updated);
        login(updated);
      }
      navigate(`/pago-correcto/${id}`);
    } else {
      navigate(`/pago-error/${id}`);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="card">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
          <div>
            <h2>Carrito de compra</h2>
            <p style={{ color: 'var(--text-sub)' }}>Completa la siguiente información</p>
          </div>
          <span className="btn-blue">Total a pagar: {clp(totals.total)}</span>
        </div>

        <OrderItemsTable items={items} />
        <OrderTotals subtotal={totals.subtotal} discount={totals.discount} total={totals.total} totalLabel="Total a pagar" />

        <form onSubmit={handleSubmit}>
          <CustomerInfoFields values={form} onPatch={patch} />
          <DeliveryAddressFields values={form} onPatch={patch} />

          <div className="text-end mt-4">
            <button type="submit" className="btn-green" disabled={paying}>
              {paying ? 'Procesando pago...' : `Pagar ahora ${clp(totals.total)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
