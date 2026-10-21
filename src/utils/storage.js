// Equivalente a funciones.js (sin manipulación del DOM)
import { getEffectivePrice } from './pricing.js';

export const DEFAULT_CATEGORIES = [
  'Juegos de Mesa',
  'Accesorios',
  'Consolas',
  'Computadores Gamers',
  'Sillas Gamers',
  'Mouse',
  'Mousepad',
  'Poleras Personalizadas',
];

const baseProducts = [
  { code: 'JM001', category: 'Juegos de Mesa', name: 'Catan', price: 29990, offerPrice: 24990, origin: 'Devir / Alemania', desc: 'Un clásico juego de estrategia donde los jugadores compiten por colonizar la isla de Catan.', image: 'catan.jpg' },
  { code: 'JM002', category: 'Juegos de Mesa', name: 'Carcassonne', price: 24990, origin: 'Hans im Glück / Alemania', desc: 'Un juego de colocación de fichas donde los jugadores construyen el paisaje medieval.', image: 'placeholder.jpg' },
  { code: 'AC001', category: 'Accesorios', name: 'Controlador Inalámbrico Xbox Series X', price: 59990, origin: 'Microsoft', desc: 'Ofrece una experiencia de juego cómoda con botones mapeables y respuesta táctil.', image: 'placeholder.jpg' },
  { code: 'AC002', category: 'Accesorios', name: 'Auriculares Gamer HyperX Cloud II', price: 79990, offerPrice: 64990, origin: 'HyperX', desc: 'Sonido envolvente de calidad con micrófono desmontable y comodidad prolongada.', image: 'placeholder.jpg' },
  { code: 'CO001', category: 'Consolas', name: 'PlayStation 5', price: 549990, origin: 'Sony', desc: 'Gráficos impresionantes y tiempos de carga ultrarrápidos para experiencia inmersiva.', image: 'placeholder.jpg' },
  { code: 'CG001', category: 'Computadores Gamers', name: 'PC Gamer ASUS ROG Strix', price: 1299990, origin: 'ASUS', desc: 'Potente equipo equipado con componentes de alto rendimiento.', image: 'placeholder.jpg' },
  { code: 'SG001', category: 'Sillas Gamers', name: 'Silla Gamer Secretlab Titan', price: 349990, origin: 'Secretlab', desc: 'Diseñada para máximo confort con soporte ergonómico.', image: 'placeholder.jpg' },
  { code: 'MS001', category: 'Mouse', name: 'Mouse Gamer Logitech G502 HERO', price: 49990, offerPrice: 39990, origin: 'Logitech', desc: 'Sensor de alta precisión y botones personalizables.', image: 'placeholder.jpg' },
  { code: 'MP001', category: 'Mousepad', name: 'Mousepad Razer Goliathus Extended Chroma', price: 29990, origin: 'Razer', desc: 'Área de juego amplia con iluminación RGB personalizable.', image: 'placeholder.jpg' },
  { code: 'PP001', category: 'Poleras Personalizadas', name: 'Polera Gamer Personalizada Level-Up', price: 14990, offerPrice: 11990, origin: 'Level-Up Chile', desc: 'Camiseta cómoda con posibilidad de personalizar tu gamer tag.', image: 'placeholder.jpg' },
];

const DEFAULT_STOCK = { JM001: 12, JM002: 3, AC001: 25, AC002: 4, CO001: 2, CG001: 6, SG001: 8, MS001: 15, MP001: 5, PP001: 40 };
const defaultProducts = baseProducts.map((p) => ({ ...p, stock: DEFAULT_STOCK[p.code] ?? 10 }));

const defaultUsers = [
  { name: 'Administrador Principal', email: 'admin@levelup.cl', password: 'admin', age: 30, role: 'admin', points: 1000, isDuoc: false },
  { name: 'Estudiante Duoc', email: 'estudiante@duoc.cl', password: '123', age: 21, role: 'user', points: 100, isDuoc: true },
];

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export function initStorage() {
  if (!localStorage.getItem('lu_products')) write('lu_products', defaultProducts);
  if (!localStorage.getItem('lu_users')) write('lu_users', defaultUsers);
  if (!localStorage.getItem('lu_cart')) write('lu_cart', []);
  if (!localStorage.getItem('lu_categories')) write('lu_categories', DEFAULT_CATEGORIES);

  // Migración única: productos guardados antes de existir el campo stock
  if (!localStorage.getItem('lu_seed_stock')) {
    write('lu_products', read('lu_products', []).map((p) => (p.stock === undefined ? { ...p, stock: DEFAULT_STOCK[p.code] ?? 10 } : p)));
    localStorage.setItem('lu_seed_stock', '1');
  }

  // Migración única: agrega las ofertas por defecto a productos ya guardados antes de existir la vista Ofertas
  if (!localStorage.getItem('lu_seed_offers')) {
    const merged = read('lu_products', []).map((p) => {
      const d = defaultProducts.find((x) => x.code === p.code);
      return d && d.offerPrice && p.offerPrice === undefined ? { ...p, offerPrice: d.offerPrice } : p;
    });
    write('lu_products', merged);
    localStorage.setItem('lu_seed_offers', '1');
  }
}
initStorage();

// Productos
export const getProducts = () => read('lu_products', []);
export const getProductByCode = (code) => getProducts().find((p) => p.code === code);
export function saveProduct(product) {
  write('lu_products', [...getProducts(), product]);
}
export function updateProduct(updated) {
  write('lu_products', getProducts().map((p) => (p.code === updated.code ? updated : p)));
}
export function deleteProduct(code) {
  write('lu_products', getProducts().filter((p) => p.code !== code));
}

// Usuarios
export const getUsers = () => read('lu_users', []);
export const getUserByEmail = (email) =>
  getUsers().find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
export function saveUser(user) {
  write('lu_users', [...getUsers(), user]);
}
export function updateUser(updated) {
  write('lu_users', getUsers().map((u) => (u.email.toLowerCase() === updated.email.toLowerCase() ? updated : u)));
}
export function deleteUser(email) {
  write('lu_users', getUsers().filter((u) => u.email.toLowerCase() !== email.toLowerCase()));
}

// Sesión
export const setCurrentUser = (user) => write('lu_session', user);
export const getCurrentUser = () => read('lu_session', null);
export const clearSession = () => localStorage.removeItem('lu_session');

// Registro: +18 y descuento Duoc
export function registerUserLogic(name, email, password, age, refCode) {
  if (age < 18) {
    alert('Error de Registro: Debes ser mayor de 18 años para registrarte en Level-Up Gamer.');
    return false;
  }
  if (getUserByEmail(email)) {
    alert('Error: El correo electrónico ya se encuentra registrado.');
    return false;
  }
  const isDuoc = email.toLowerCase().includes('duoc');
  const points = refCode ? 100 : 0;
  saveUser({ name, email, password, age, role: 'user', points, isDuoc });
  alert(`¡Registro Exitoso! ${isDuoc ? 'Se ha activado tu beneficio vitalicio del 20% de descuento por ser Duoc UC.' : ''}`);
  return true;
}

// Carrito
export const getCart = () => read('lu_cart', []);
export function addToCart(code, qty = 1) {
  const cart = getCart();
  const product = getProductByCode(code);
  if (!product) return;
  const existing = cart.find((c) => c.code === code);
  if (existing) existing.qty += qty;
  else cart.push({ ...product, price: getEffectivePrice(product), originalPrice: product.price, qty });
  write('lu_cart', cart);
  alert(`${product.name} fue agregado al carrito de compras.`);
}
export function updateCartQty(code, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter((c) => c.code !== code);
  else {
    const item = cart.find((c) => c.code === code);
    if (item) item.qty = qty;
  }
  write('lu_cart', cart);
}
export const removeFromCart = (code) => write('lu_cart', getCart().filter((c) => c.code !== code));
export const clearCart = () => write('lu_cart', []);

// Órdenes de compra
export const getOrders = () => read('lu_orders', []);
export const getOrderById = (id) => getOrders().find((o) => o.id === id);
export function saveOrder(order) {
  write('lu_orders', [...getOrders(), order]);
}
// Número de orden: AAAAMMDD + correlativo del día (ej: 2026101801)
export function getNextOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const todayCount = getOrders().filter((o) => o.id.startsWith(ymd)).length + 1;
  return `${ymd}${String(todayCount).padStart(2, '0')}`;
}

// Categorías (CRUD)
export const getCategories = () => read('lu_categories', DEFAULT_CATEGORIES);
export function saveCategory(name) {
  write('lu_categories', [...getCategories(), name]);
}
// Renombrar también actualiza los productos de esa categoría
export function renameCategory(oldName, newName) {
  write('lu_categories', getCategories().map((c) => (c === oldName ? newName : c)));
  write('lu_products', getProducts().map((p) => (p.category === oldName ? { ...p, category: newName } : p)));
}
export function deleteCategory(name) {
  write('lu_categories', getCategories().filter((c) => c !== name));
}

// Descuenta stock de los productos comprados (no baja de 0)
export function decrementStock(items) {
  write('lu_products', getProducts().map((p) => {
    const it = items.find((i) => i.code === p.code);
    return it ? { ...p, stock: Math.max(0, (p.stock ?? 0) - it.qty) } : p;
  }));
}
