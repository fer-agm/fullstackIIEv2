import { getRegions, getCommunes } from '../utils/chile.js';

// Dirección de entrega (checkout). Al cambiar de región se reinicia la comuna.
export default function DeliveryAddressFields({ values, onPatch }) {
  return (
    <>
      <h5 className="mt-4">Dirección de entrega de los productos</h5>
      <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>Ingrese dirección de forma detallada</p>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="a-calle">Calle *</label>
          <input id="a-calle" type="text" required value={values.calle} onChange={(e) => onPatch({ calle: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label htmlFor="a-depto">Departamento (opcional)</label>
          <input id="a-depto" type="text" placeholder="Ej: 603" value={values.departamento} onChange={(e) => onPatch({ departamento: e.target.value })} />
        </div>
        <div className="col-md-6">
          <label htmlFor="a-region">Región *</label>
          <select
            id="a-region"
            required
            value={values.region}
            onChange={(e) => onPatch({ region: e.target.value, comuna: getCommunes(e.target.value)[0] })}
          >
            {getRegions().map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="a-comuna">Comuna *</label>
          <select id="a-comuna" required value={values.comuna} onChange={(e) => onPatch({ comuna: e.target.value })}>
            {getCommunes(values.region).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label htmlFor="a-indicaciones">Indicaciones para la entrega (opcional)</label>
          <textarea
            id="a-indicaciones"
            rows="3"
            placeholder="Ej.: Entre calles, color del edificio, no tiene timbre."
            value={values.indicaciones}
            onChange={(e) => onPatch({ indicaciones: e.target.value })}
          />
        </div>
      </div>
    </>
  );
}
