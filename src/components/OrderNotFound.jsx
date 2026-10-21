import { Link } from 'react-router-dom';

export default function OrderNotFound() {
  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card text-center">
        <p>No se encontró la orden solicitada.</p>
        <Link to="/productos" className="btn-blue mt-2">Volver al catálogo</Link>
      </div>
    </div>
  );
}
