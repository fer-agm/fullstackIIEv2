import { clp } from '../utils/pricing.js';
import ProductImage from './ProductImage.jsx';

// Tabla de solo lectura con los productos de una compra
export default function OrderItemsTable({ items }) {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.code}>
              <td>
                <ProductImage product={item} style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#000' }} />
              </td>
              <td>{item.name}</td>
              <td>{clp(item.price)}</td>
              <td>{item.qty}</td>
              <td>{clp(item.price * item.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
