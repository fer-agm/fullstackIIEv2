import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { computeTotals, clp } from '../utils/pricing.js';
import ProductImage from '../components/ProductImage.jsx';
import OrderTotals from '../components/OrderTotals.jsx';
import Button from '../components/Button.jsx';

export default function Carrito() {
  const { items, setQty, remove, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subtotal, discount, total } = computeTotals(items, user);

  const goToCheckout = () => {
    if (items.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container">
      <h2>Tu Carrito de Compras</h2>

      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>El carrito está vacío.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.code}>
                    <td>
                      <ProductImage product={item} style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#000' }} />
                    </td>
                    <td><strong>{item.name}</strong></td>
                    <td>{clp(item.price)}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        style={{ width: '70px' }}
                        onChange={(e) => {
                          const qty = parseInt(e.target.value);
                          if (!Number.isNaN(qty)) setQty(item.code, qty);
                        }}
                      />
                    </td>
                    <td>{clp(item.price * item.qty)} CLP</td>
                    <td><button className="btn-danger" onClick={() => remove(item.code)}>X</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ borderTop: '1px solid #333', marginTop: '1.5rem', paddingTop: '0.5rem' }}>
          <OrderTotals subtotal={subtotal} discount={discount} total={total} totalLabel="Total Final" />
          <div className="d-flex flex-wrap justify-content-end gap-2 mt-3">
            <Button variant="secondary" onClick={clear} disabled={items.length === 0}>Limpiar</Button>
            <Button onClick={goToCheckout} style={{ fontSize: '1.1rem' }}>Ir a pagar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
