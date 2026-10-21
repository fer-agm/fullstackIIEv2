const FALLBACK_SMALL = 'https://via.placeholder.com/200x180/111/39FF14?text=Sin+Imagen';

export default function ProductImage({ product, fallback = FALLBACK_SMALL, style }) {
  return (
    <img
      src={`/assets/img/${product.image || 'placeholder.png'}`}
      alt={product.name}
      style={style}
      onError={(e) => {
        e.currentTarget.onerror = null; // evita bucle si el fallback también falla
        e.currentTarget.src = fallback;
      }}
    />
  );
}
