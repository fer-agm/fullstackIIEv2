const VARIANTS = {
  green: 'btn-green',
  blue: 'btn-blue',
  danger: 'btn-danger',
  secondary: 'btn btn-secondary',
};

// Botón reutilizable: recibe la etiqueta (children) y la función onClick por props
export default function Button({ children, onClick, variant = 'green', type = 'button', disabled = false, className = '', style }) {
  return (
    <button
      type={type}
      className={`${VARIANTS[variant] || VARIANTS.green} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
