// Datos del cliente (checkout). `onPatch` recibe un objeto parcial con los campos que cambian.
export default function CustomerInfoFields({ values, onPatch }) {
  return (
    <>
      <h5 className="mt-4">Información del cliente</h5>
      <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>Completa la siguiente información</p>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="c-nombre">Nombre *</label>
          <input id="c-nombre" type="text" required value={values.nombre} onChange={(e) => onPatch({ nombre: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label htmlFor="c-apellidos">Apellidos *</label>
          <input id="c-apellidos" type="text" required value={values.apellidos} onChange={(e) => onPatch({ apellidos: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label htmlFor="c-correo">Correo *</label>
          <input id="c-correo" type="email" required value={values.correo} onChange={(e) => onPatch({ correo: e.target.value })} />
        </div>
      </div>
    </>
  );
}
