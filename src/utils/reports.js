// Funciones puras para los reportes del panel (fáciles de probar)
const paid = (orders) => orders.filter((o) => o.status === 'success');

export function salesSummary(orders) {
  const ok = paid(orders);
  const revenue = ok.reduce((acc, o) => acc + o.total, 0);
  return {
    orders: ok.length,
    failed: orders.filter((o) => o.status === 'failed').length,
    revenue,
    average: ok.length ? Math.round(revenue / ok.length) : 0,
    units: ok.reduce((acc, o) => acc + o.items.reduce((a, i) => a + i.qty, 0), 0),
  };
}

export function topProducts(orders, limit = 5) {
  const map = {};
  paid(orders).forEach((o) =>
    o.items.forEach((i) => {
      map[i.code] ??= { code: i.code, name: i.name, units: 0, revenue: 0 };
      map[i.code].units += i.qty;
      map[i.code].revenue += i.price * i.qty;
    })
  );
  return Object.values(map).sort((a, b) => b.units - a.units).slice(0, limit);
}

export function salesByCategory(orders, products) {
  const categoryOf = Object.fromEntries(products.map((p) => [p.code, p.category]));
  const map = {};
  paid(orders).forEach((o) =>
    o.items.forEach((i) => {
      const cat = categoryOf[i.code] || 'Sin categoría';
      map[cat] = (map[cat] || 0) + i.price * i.qty;
    })
  );
  return Object.entries(map)
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function stockByCategory(products, isCritical) {
  const map = {};
  products.forEach((p) => {
    map[p.category] ??= { category: p.category, products: 0, units: 0, critical: 0 };
    map[p.category].products += 1;
    map[p.category].units += p.stock ?? 0;
    if (isCritical(p)) map[p.category].critical += 1;
  });
  return Object.values(map);
}
