import { computeTotals, hasOffer, getEffectivePrice, discountPercent, clp } from '../utils/pricing.js';
import { isCritical, CRITICAL_STOCK } from '../utils/inventory.js';
import { salesSummary, topProducts, salesByCategory, stockByCategory } from '../utils/reports.js';
import { simulatePayment } from '../utils/payment.js';
import { getRegions, getCommunes } from '../utils/chile.js';

describe('pricing', () => {
  const items = [
    { price: 10000, qty: 2 },
    { price: 5000, qty: 1 },
  ];

  it('suma el subtotal y no aplica descuento a un invitado', () => {
    expect(computeTotals(items, null)).toEqual({ subtotal: 25000, discount: 0, total: 25000, isDuoc: false });
  });

  it('aplica 20% de descuento a un usuario Duoc', () => {
    const t = computeTotals(items, { isDuoc: true });
    expect(t.discount).toBe(5000);
    expect(t.total).toBe(20000);
  });

  it('no aplica descuento a un usuario que no es Duoc', () => {
    expect(computeTotals(items, { isDuoc: false }).discount).toBe(0);
  });

  it('detecta ofertas solo si offerPrice es menor al precio normal', () => {
    expect(hasOffer({ price: 100, offerPrice: 80 })).toBeTrue();
    expect(hasOffer({ price: 100, offerPrice: 100 })).toBeFalse();
    expect(hasOffer({ price: 100, offerPrice: 150 })).toBeFalse();
    expect(hasOffer({ price: 100 })).toBeFalse();
  });

  it('entrega el precio efectivo y el porcentaje de descuento', () => {
    expect(getEffectivePrice({ price: 29990, offerPrice: 24990 })).toBe(24990);
    expect(getEffectivePrice({ price: 29990 })).toBe(29990);
    expect(discountPercent({ price: 29990, offerPrice: 24990 })).toBe(17);
    expect(discountPercent({ price: 100 })).toBe(0);
  });

  it('formatea pesos chilenos con separador de miles', () => {
    expect(clp(29990)).toBe('$29.990');
  });
});

describe('inventory', () => {
  it('considera crítico un stock igual o menor al umbral', () => {
    expect(isCritical({ stock: CRITICAL_STOCK })).toBeTrue();
    expect(isCritical({ stock: 0 })).toBeTrue();
    expect(isCritical({ stock: CRITICAL_STOCK + 1 })).toBeFalse();
  });

  it('trata un producto sin stock definido como crítico', () => {
    expect(isCritical({})).toBeTrue();
  });
});

describe('reports', () => {
  const orders = [
    { status: 'success', total: 80000, items: [{ code: 'A', name: 'Prod A', price: 40000, qty: 2 }] },
    { status: 'success', total: 10000, items: [{ code: 'B', name: 'Prod B', price: 10000, qty: 1 }] },
    { status: 'failed', total: 999, items: [{ code: 'A', name: 'Prod A', price: 999, qty: 1 }] },
  ];
  const products = [
    { code: 'A', category: 'Cat1', stock: 3 },
    { code: 'B', category: 'Cat2', stock: 20 },
  ];

  it('resume solo las compras pagadas y cuenta los pagos rechazados', () => {
    expect(salesSummary(orders)).toEqual({ orders: 2, failed: 1, revenue: 90000, average: 45000, units: 3 });
  });

  it('devuelve ceros cuando no hay órdenes', () => {
    expect(salesSummary([])).toEqual({ orders: 0, failed: 0, revenue: 0, average: 0, units: 0 });
  });

  it('ordena los productos más vendidos por unidades e ignora pagos fallidos', () => {
    const top = topProducts(orders);
    expect(top[0]).toEqual({ code: 'A', name: 'Prod A', units: 2, revenue: 80000 });
    expect(top.length).toBe(2);
  });

  it('respeta el límite de productos más vendidos', () => {
    expect(topProducts(orders, 1).length).toBe(1);
  });

  it('agrupa las ventas por categoría', () => {
    expect(salesByCategory(orders, products)).toEqual([
      { category: 'Cat1', revenue: 80000 },
      { category: 'Cat2', revenue: 10000 },
    ]);
  });

  it('resume el stock por categoría con los críticos', () => {
    const result = stockByCategory(products, isCritical);
    expect(result.find((r) => r.category === 'Cat1')).toEqual({ category: 'Cat1', products: 1, units: 3, critical: 1 });
    expect(result.find((r) => r.category === 'Cat2').critical).toBe(0);
  });
});

describe('payment (simulación)', () => {
  it('aprueba el pago cuando la tasa de éxito es 1', async () => {
    expect((await simulatePayment({}, 1, 0)).ok).toBeTrue();
  });

  it('rechaza el pago cuando la tasa de éxito es 0', async () => {
    expect((await simulatePayment({}, 0, 0)).ok).toBeFalse();
  });
});

describe('chile (regiones y comunas)', () => {
  it('incluye las 16 regiones', () => {
    expect(getRegions().length).toBe(16);
  });

  it('la Región Metropolitana tiene sus 52 comunas', () => {
    expect(getCommunes('Región Metropolitana de Santiago').length).toBe(52);
  });

  it('devuelve una lista vacía para una región desconocida', () => {
    expect(getCommunes('Atlantis')).toEqual([]);
  });
});
