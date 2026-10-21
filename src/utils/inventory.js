export const CRITICAL_STOCK = 5; // stock igual o menor a este valor se considera crítico
export const isCritical = (p) => (p.stock ?? 0) <= CRITICAL_STOCK;
