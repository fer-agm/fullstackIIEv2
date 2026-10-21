// Grilla responsive de Bootstrap: 1 / 2 / 3 / 4 columnas según el ancho de pantalla
export default function ProductGrid({ children }) {
  return <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4 mt-1">{children}</div>;
}
