function ReadonlyField({ label, value, className = 'col-md-4' }) {
  return (
    <div className={className}>
      <label>{label}</label>
      <input type="text" value={value || '—'} readOnly style={{ opacity: 0.8 }} />
    </div>
  );
}

// Datos del cliente y dirección de una orden (solo lectura)
export default function OrderDetails({ order }) {
  const { customer: c, address: a } = order;
  return (
    <>
      <div className="row g-3">
        <ReadonlyField label="Nombre" value={c.nombre} />
        <ReadonlyField label="Apellidos" value={c.apellidos} />
        <ReadonlyField label="Correo" value={c.correo} />
      </div>

      <h5 className="mt-4">Dirección de entrega de los productos</h5>
      <div className="row g-3">
        <ReadonlyField label="Calle" value={a.calle} className="col-md-6" />
        <ReadonlyField label="Departamento" value={a.departamento} className="col-md-6" />
        <ReadonlyField label="Región" value={a.region} className="col-md-6" />
        <ReadonlyField label="Comuna" value={a.comuna} className="col-md-6" />
        <div className="col-12">
          <label>Indicaciones para la entrega</label>
          <textarea rows="2" value={a.indicaciones || '—'} readOnly style={{ opacity: 0.8 }} />
        </div>
      </div>
    </>
  );
}
