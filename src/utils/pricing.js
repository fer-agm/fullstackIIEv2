export const DUOC_DISCOUNT = 0.2;

export const clp = (n) => `$${Number(n).toLocaleString('es-CL')}`;

// Subtotal, descuento Duoc (20%) y total de una lista de items { price, qty }
export function computeTotals(items, user) {
  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const isDuoc = !!(user && user.isDuoc);
  const discount = isDuoc ? Math.round(subtotal * DUOC_DISCOUNT) : 0;
  return { subtotal, discount, total: subtotal - discount, isDuoc };
}

// Ofertas: un producto está en oferta si tiene offerPrice menor al precio normal
export const hasOffer = (p) => Number.isFinite(p.offerPrice) && p.offerPrice > 0 && p.offerPrice < p.price;
export const getEffectivePrice = (p) => (hasOffer(p) ? p.offerPrice : p.price);
export const discountPercent = (p) => (hasOffer(p) ? Math.round((1 - p.offerPrice / p.price) * 100) : 0);
