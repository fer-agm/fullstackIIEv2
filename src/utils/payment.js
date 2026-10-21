// Simulación de pasarela de pago (no hay backend todavía).
// Cambia PAYMENT_SUCCESS_RATE a 1 (siempre aprobado) o 0 (siempre rechazado) para probar cada vista.
export const PAYMENT_SUCCESS_RATE = 0.7;

export function simulatePayment(order, rate = PAYMENT_SUCCESS_RATE, delay = 800) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: Math.random() < rate }), delay);
  });
}
