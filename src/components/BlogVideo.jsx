export default function BlogVideo({ src, caption }) {
  return (
    <div className="my-3">
      <video width="700" height="450" controls preload="metadata" style={{ maxWidth: '100%', height: 'auto' }}>
        <source src={src} type="video/mp4" />
        {caption || 'Tu navegador no soporta video HTML5.'}
      </video>
    </div>
  );
}
