export default function OrderStatusBadge({ status }) {
  return status === 'success'
    ? <span className="badge text-bg-success">Pagada</span>
    : <span className="badge text-bg-danger">Rechazada</span>;
}
