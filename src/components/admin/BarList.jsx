// Gráfico de barras horizontal simple (sin librerías)
export default function BarList({ title, items, color = 'var(--accent-blue)' }) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="card">
      <h3 style={{ fontSize: '1.1rem' }}>{title}</h3>
      {items.length === 0 ? (
        <p style={{ color: 'var(--text-sub)' }}>Aún no hay datos para mostrar.</p>
      ) : (
        items.map((i) => (
          <div key={i.label} className="mt-2">
            <div className="d-flex justify-content-between" style={{ fontSize: '0.85rem' }}>
              <span>{i.label}</span>
              <span>{i.display ?? i.value}</span>
            </div>
            <div style={{ background: '#222', borderRadius: '4px', height: '10px' }}>
              <div style={{ width: `${(i.value / max) * 100}%`, background: color, height: '100%', borderRadius: '4px' }} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
