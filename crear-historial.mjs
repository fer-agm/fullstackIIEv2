#!/usr/bin/env node
// Reconstruye el proyecto Level-Up Gamer (React) como un historial de git por etapas.
//
// Uso:
//   node crear-historial.mjs <proyecto-final> <carpeta-destino> [--next | --all] [--verify] [--verify-tests]
//   node crear-historial.mjs --list
//
//   --next          (por defecto) aplica SOLO la siguiente etapa y hace su commit
//   --all           aplica todas las etapas pendientes de una vez
//   --verify        compila (npm run build) cada etapa antes de hacer el commit
//   --verify-tests  además corre `npm test` en las etapas con pruebas (necesita Chrome)
//   --list          muestra las etapas y termina

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execSync } from 'node:child_process';

// ---------------------------------------------------------------- etapas
const u = (...names) => names.map((n) => `src/utils/${n}`);
const comp = (...names) => names.map((n) => `src/components/${n}.jsx`);
const adm = (...names) => names.map((n) => `src/components/admin/${n}.jsx`);
const page = (...names) => names.map((n) => `src/pages/${n}.jsx`);
const apage = (...names) => names.map((n) => `src/pages/admin/${n}.jsx`);

const STAGES = [
  {
    msg: 'chore: inicializa proyecto Vite + React',
    files: ['vite.config.js', '.gitignore'],
    generated: ['package.json', 'index.html', 'src/main.jsx', 'src/App.jsx', 'README.md'],
    notes: [
      'package.json: dependencias (react, react-dom) y scripts dev/build.',
      'vite.config.js: activa el plugin de React.',
      'index.html tiene solo <div id="root">; main.jsx monta React ahí.',
    ],
  },
  {
    msg: 'feat: agrega estilos base y capa de datos con CRUD en localStorage',
    files: ['src/style.css', ...u('storage.js', 'pricing.js')],
    publicDir: true,
    generated: ['src/main.jsx', 'src/App.jsx'],
    notes: [
      'style.css: tu tema Level-Up (variables de color, botones, tarjetas, tablas).',
      'storage.js: "base de datos" simulada. CRUD de productos, usuarios, categorías, carrito y órdenes.',
      'pricing.js: subtotal, descuento Duoc 20% y funciones de ofertas.',
      'La App muestra cuántos productos cargó storage.js (prueba de que la capa de datos funciona).',
    ],
  },
  {
    msg: 'feat: agrega sesión, carrito, header, footer y layout',
    files: [
      'src/context/AuthContext.jsx',
      'src/context/CartContext.jsx',
      ...comp('Layout', 'Header', 'Footer', 'ProductImage'),
    ],
    generated: ['package.json', 'src/main.jsx', 'src/App.jsx'],
    notes: [
      'AuthContext: usuario con sesión iniciada (login/logout) compartido por toda la app.',
      'CartContext: items del carrito; al cambiarlo, el header se actualiza solo.',
      'Layout pone Header y Footer alrededor de cada página (Outlet de React Router).',
      'Se agrega react-router-dom.',
    ],
  },
  {
    msg: 'feat: integra Bootstrap (grilla responsive, navbar y tema oscuro)',
    files: [],
    generated: ['package.json', 'index.html', 'src/main.jsx', 'src/style.css'],
    notes: [
      'main.jsx importa Bootstrap ANTES de style.css, para que tu tema tenga prioridad.',
      'index.html: data-bs-theme="dark" activa los colores oscuros de Bootstrap.',
      'style.css: ajustes para convivir con Bootstrap (botón del menú, enlaces).',
    ],
  },
  {
    msg: 'feat: migra las páginas públicas de la tienda a React',
    files: [
      ...comp('ProductCard', 'ProductGrid', 'PriceTag', 'Button', 'OrderTotals'),
      'src/data/blogs.js',
      ...page('Home', 'Productos', 'DetalleProducto', 'Carrito', 'Blogs', 'Nosotros', 'Contacto'),
    ],
    generated: ['src/App.jsx'],
    notes: [
      'ProductCard/ProductGrid: tarjeta reutilizable y grilla de 1-4 columnas (Home, catálogo y más).',
      'Productos: buscador y filtro por categoría con useState.',
      'Carrito: cantidades, eliminar y totales con descuento Duoc (usa CartContext).',
      'Blogs: lista de artículos desde src/data/blogs.js.',
    ],
  },
  {
    msg: 'feat: agrega inicio de sesión y registro de usuarios',
    files: page('InicioSesion', 'RegistroUsuario'),
    generated: ['src/App.jsx'],
    notes: [
      'InicioSesion: valida correo y contraseña; el admin va a /admin y el cliente a la tienda.',
      'RegistroUsuario: bloquea menores de 18 y activa el descuento Duoc con correo duoc.',
    ],
  },
  {
    msg: 'feat: agrega checkout y pantallas de pago correcto y con error',
    files: [
      ...u('chile.js', 'payment.js'),
      ...comp('OrderItemsTable', 'OrderDetails', 'OrderNotFound', 'CustomerInfoFields', 'DeliveryAddressFields'),
      ...page('Checkout', 'PagoCorrecto', 'PagoError'),
    ],
    generated: ['src/style.css', 'src/App.jsx'],
    notes: [
      'Checkout: datos del cliente y dirección (región → comuna). Con sesión, se autocompleta.',
      'payment.js simula la pasarela: aprueba el 70% de las veces (PAYMENT_SUCCESS_RATE).',
      'Aprobado: guarda la orden, descuenta stock, vacía el carrito y suma 50 puntos.',
      'Rechazado: guarda la orden como fallida, conserva el carrito y permite reintentar.',
      'style.css: reglas de impresión para la boleta.',
    ],
  },
  {
    msg: 'feat: agrega categorías, ofertas y detalle de blogs',
    files: [...comp('CategoryTile', 'BlogVideo'), ...page('Categorias', 'Ofertas', 'BlogDetalle')],
    generated: ['src/App.jsx'],
    notes: [
      'Categorias: tarjetas por categoría y productos de la elegida (?cat=...).',
      'Ofertas: productos con offerPrice menor al precio, mayor descuento primero.',
      'BlogDetalle: artículo, video y enlace externo según el id de la URL.',
    ],
  },
  {
    msg: 'feat: agrega panel de administración con dashboard y CRUD de productos y usuarios',
    files: [
      ...u('inventory.js', 'reports.js'),
      ...adm('AdminLayout', 'StatCard', 'AdminTile'),
      ...comp('ProductForm'),
      ...page('NuevoProducto', 'EditarProducto', 'NuevoUsuario', 'EditarUsuario'),
      ...apage('AdminDashboard', 'AdminProductos', 'AdminUsuarios'),
    ],
    generated: ['src/style.css', 'src/App.jsx'],
    notes: [
      'AdminLayout: barra y menú lateral; solo deja pasar a administradores.',
      'Dashboard: compras, productos, usuarios y aviso de stock crítico.',
      'Productos/Usuarios: listas con crear, editar y eliminar (formularios con validaciones).',
      'inventory.js define "stock crítico" (5 o menos); reports.js calcula las ventas.',
    ],
  },
  {
    msg: 'feat: agrega categorías, órdenes, boletas, reportes y perfil al panel admin',
    files: [
      ...adm('OrderStatusBadge', 'BarList'),
      ...apage(
        'AdminCategorias', 'AdminCategoriaForm', 'AdminOrdenes', 'AdminBoleta', 'AdminHistorialCompras',
        'AdminProductosCriticos', 'AdminReporteProductos', 'AdminReportes', 'AdminPerfil'
      ),
    ],
    generated: ['src/App.jsx'],
    notes: [
      'Categorías: crear, renombrar (actualiza sus productos) y eliminar (si no tiene productos).',
      'Órdenes y boleta: todas las compras, aprobadas y rechazadas, con impresión.',
      'Historial de compras por usuario; stock crítico; reportes de ventas y de productos.',
      'Perfil: cambiar nombre, edad y contraseña.',
    ],
  },
  {
    msg: 'test: configura Jasmine y Karma con cobertura',
    files: ['karma.conf.cjs', 'src/tests/index.cjs', 'src/tests/helpers.jsx', 'src/tests/logic.spec.js', 'src/tests/storage.spec.js'],
    generated: ['package.json'],
    tests: true,
    notes: [
      'karma.conf.cjs: Karma + Jasmine, webpack/Babel para compilar JSX y karma-coverage.',
      'helpers.jsx: resetStorage(), loginAs...(), renderApp() para armar cada prueba.',
      'Primeras pruebas: lógica de precios, reportes, pago simulado y CRUD de storage.',
      'Ejecutar con: npm test',
    ],
  },
  {
    msg: 'test: agrega pruebas de componentes, páginas y formularios',
    files: ['src/tests/components.spec.jsx', 'src/tests/pages.spec.jsx', 'src/tests/forms.spec.jsx'],
    generated: [],
    tests: true,
    notes: [
      'Renderizado, renderizado condicional, props, estado y eventos (las categorías del PDF).',
      'Flujos completos: compra aprobada y rechazada, login, registro y panel admin.',
    ],
  },
  {
    msg: 'docs: agrega README final y package-lock.json',
    files: ['README.md', 'package-lock.json'],
    optional: ['package-lock.json'],
    generated: [],
    tests: true,
    notes: [
      'README: cómo instalar, ejecutar, probar y ver la cobertura.',
      'package-lock.json fija las versiones exactas de las dependencias.',
    ],
  },
];

// ---------------------------------------------------------------- utilidades
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const pos = args.filter((a) => !a.startsWith('--'));
const die = (msg) => { console.error(`\n✖ ${msg}\n`); process.exit(1); };

if (flags.has('--list')) {
  STAGES.forEach((s, i) => console.log(`${String(i + 1).padStart(2)}. ${s.msg}`));
  process.exit(0);
}
if (pos.length < 2) {
  die('Uso: node crear-historial.mjs <proyecto-final> <carpeta-destino> [--next | --all] [--verify] [--verify-tests]');
}

const SRC = path.resolve(pos[0]);
const DEST = path.resolve(pos[1]);
const ALL = flags.has('--all');
const VERIFY = flags.has('--verify') || flags.has('--verify-tests');
const VERIFY_TESTS = flags.has('--verify-tests');

if (!fs.existsSync(path.join(SRC, 'package.json'))) die(`No encuentro el proyecto final en: ${SRC}`);

const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');
const write = (rel, text) => {
  const p = path.join(DEST, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text);
};
const copy = (rel) => {
  const p = path.join(DEST, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.copyFileSync(path.join(SRC, rel), p);
};
const git = (gitArgs, opts = {}) => {
  const r = spawnSync('git', gitArgs, { cwd: DEST, encoding: 'utf8', ...opts });
  if (r.error) die(`No pude ejecutar git: ${r.error.message}`);
  return r;
};

// Archivos (relativos a la raíz) que ya existen al terminar la etapa n (1-based)
function presentFiles(n) {
  const set = new Set();
  STAGES.slice(0, n).forEach((s) => s.files.forEach((f) => set.add(f)));
  return set;
}

// ---------------------------------------------------------------- contenido por etapa
function genPackageJson(n) {
  const fin = JSON.parse(read('package.json'));
  const pick = (obj, names) => Object.fromEntries(Object.keys(obj || {}).filter((k) => names.includes(k)).map((k) => [k, obj[k]]));
  const deps = ['react', 'react-dom'];
  if (n >= 3) deps.push('react-router-dom');
  if (n >= 4) deps.push('bootstrap');
  const devDeps = n >= 11 ? Object.keys(fin.devDependencies) : ['vite', '@vitejs/plugin-react'];
  const scripts = pick(fin.scripts, ['dev', 'build', 'preview']);
  if (n >= 11) Object.assign(scripts, pick(fin.scripts, ['test', 'test:watch']));
  const out = { ...fin, scripts, dependencies: pick(fin.dependencies, deps), devDependencies: pick(fin.devDependencies, devDeps) };
  return JSON.stringify(out, null, 2) + '\n';
}

function genIndexHtml(n) {
  const html = read('index.html');
  return n >= 4 ? html : html.replace(' data-bs-theme="dark"', '');
}

function genMain(n) {
  if (n === 1) {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  }
  if (n === 2) {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  }
  const main = read('src/main.jsx');
  if (n >= 4) return main;
  return main
    .split('\n')
    .filter((l) => !l.includes('bootstrap/dist/css'))
    .join('\n')
    .replace(/import '\.\/style\.css';.*/, "import './style.css';");
}

function genStyle(n) {
  const css = read('src/style.css');
  const cut = (marker) => {
    const i = css.indexOf(marker);
    return i === -1 ? css : css.slice(0, i);
  };
  let out;
  if (n < 4) out = cut('/* ---- Integración con Bootstrap ---- */');
  else if (n < 7) out = cut('/* ---- Impresión de boleta ---- */');
  else if (n < 9) out = cut('/* ---- Panel de administración ---- */');
  else out = css;
  return out.trimEnd() + '\n';
}

// App.jsx: versión final filtrada (solo imports y rutas de páginas que ya existen)
function genApp(n) {
  if (n === 1) return `export default function App() {\n  return <h1>Level-Up Gamer</h1>;\n}\n`;
  if (n === 2) {
    return `import { getProducts } from './utils/storage.js';

export default function App() {
  return (
    <div className="container">
      <h1>LEVEL-UP GAMER</h1>
      <p>{getProducts().length} productos cargados desde la capa de datos.</p>
    </div>
  );
}
`;
  }
  const present = presentFiles(n);
  const lines = read('src/App.jsx').split('\n');
  const importRe = /^import (\w+) from '\.\/(.+)';$/;
  const names = new Set();
  for (const l of lines) {
    const m = l.match(importRe);
    if (m && present.has(`src/${m[2]}`)) names.add(m[1]);
  }
  const out = [];
  let skipping = false;
  for (const l of lines) {
    const imp = l.match(importRe);
    if (imp) { if (names.has(imp[1])) out.push(l); continue; }
    if (skipping) { if (l.trim() === '</Route>') skipping = false; continue; }
    const route = l.match(/<Route\b[^>]*element=\{<(\w+)/);
    if (route && !names.has(route[1])) {
      if (!l.trim().endsWith('/>')) skipping = true; // bloque con hijos (ej: /admin)
      continue;
    }
    out.push(l);
  }
  return out.join('\n');
}

function genReadme(n) {
  if (n >= STAGES.length) return read('README.md');
  return `# Level-Up Gamer (React)

Tienda online gamer — migración a React (Evaluación 2).

    npm install
    npm run dev
`;
}

const GENERATORS = {
  'package.json': genPackageJson,
  'index.html': genIndexHtml,
  'src/main.jsx': genMain,
  'src/style.css': genStyle,
  'src/App.jsx': genApp,
  'README.md': genReadme,
};

// ---------------------------------------------------------------- verificación
function linkNodeModules() {
  const target = path.join(SRC, 'node_modules');
  const link = path.join(DEST, 'node_modules');
  if (!fs.existsSync(target)) die(`Para --verify necesito node_modules en el proyecto final. Ejecuta "npm install" en ${SRC}`);
  if (fs.existsSync(link)) return false;
  fs.symlinkSync(target, link, 'junction');
  return true;
}
function unlinkNodeModules() {
  const link = path.join(DEST, 'node_modules');
  try { fs.unlinkSync(link); } catch { try { fs.rmdirSync(link); } catch { /* nada */ } }
}
function verifyStage(n, stage) {
  const created = linkNodeModules();
  try {
    console.log('   ⏳ compilando (npm run build)...');
    try {
      execSync('npm run build', { cwd: DEST, stdio: 'pipe' });
    } catch (e) {
      console.error(String(e.stdout || ''), String(e.stderr || ''));
      die(`La etapa ${n} NO compila. No se hizo el commit.`);
    }
    console.log('   ✔ compila');
    if (VERIFY_TESTS && stage.tests) {
      console.log('   ⏳ corriendo pruebas (npm test)...');
      try {
        const out = execSync('npm test', { cwd: DEST, stdio: 'pipe', env: process.env }).toString();
        const m = out.replace(/\x1b\[[0-9;]*m/g, '').match(/Executed (\d+) of (\d+).*?(SUCCESS|FAILED)/);
        console.log(`   ✔ pruebas: ${m ? `${m[1]} de ${m[2]} ${m[3]}` : 'ok'}`);
      } catch (e) {
        console.error(String(e.stdout || '').slice(-3000));
        die(`Las pruebas de la etapa ${n} fallan. No se hizo el commit.`);
      }
    }
  } finally {
    fs.rmSync(path.join(DEST, 'dist'), { recursive: true, force: true });
    fs.rmSync(path.join(DEST, 'coverage'), { recursive: true, force: true });
    if (created) unlinkNodeModules();
  }
}

// ---------------------------------------------------------------- aplicar una etapa
function applyStage(n) {
  const stage = STAGES[n - 1];

  const missing = stage.files.filter((f) => !fs.existsSync(path.join(SRC, f)) && !(stage.optional || []).includes(f));
  if (missing.length) die(`Faltan archivos en el proyecto final:\n  - ${missing.join('\n  - ')}`);

  console.log(`\n━━ Etapa ${n}/${STAGES.length}: ${stage.msg}`);

  for (const f of stage.files) {
    if (fs.existsSync(path.join(SRC, f))) copy(f);
  }
  if (stage.publicDir) {
    const pub = path.join(SRC, 'public');
    let copied = 0;
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else { copy(path.relative(SRC, full)); copied++; }
      }
    };
    if (fs.existsSync(pub)) walk(pub);
    if (!copied) write('public/assets/img/.gitkeep', '');
  }
  for (const g of stage.generated) write(g, GENERATORS[g](n));

  if (VERIFY) verifyStage(n, stage);

  git(['add', '-A']);
  const status = git(['status', '--porcelain']).stdout.trim();
  if (!status) { console.log('   (sin cambios, se omite el commit)'); return; }
  const c = git(['commit', '-m', stage.msg]);
  if (c.status !== 0) die(`git commit falló:\n${c.stderr || c.stdout}`);
  console.log(`   ✔ commit: ${stage.msg}`);
  console.log('\n   Qué debes entender de esta etapa (te lo pueden preguntar):');
  stage.notes.forEach((t) => console.log(`    • ${t}`));
}

// ---------------------------------------------------------------- principal
if (spawnSync('git', ['--version'], { encoding: 'utf8' }).status !== 0) die('git no está instalado o no está en el PATH.');
const name = spawnSync('git', ['config', 'user.name'], { encoding: 'utf8' }).stdout.trim();
const mail = spawnSync('git', ['config', 'user.email'], { encoding: 'utf8' }).stdout.trim();
if (!name || !mail) {
  die('Configura tu identidad de git primero:\n  git config --global user.name "Tu Nombre"\n  git config --global user.email "tu@correo.com"');
}

fs.mkdirSync(DEST, { recursive: true });
if (!fs.existsSync(path.join(DEST, '.git'))) {
  git(['init']);
  git(['symbolic-ref', 'HEAD', 'refs/heads/main']);
}
const stateFile = path.join(DEST, '.git', 'historial-etapa');
let done = fs.existsSync(stateFile) ? parseInt(fs.readFileSync(stateFile, 'utf8'), 10) || 0 : 0;

if (done >= STAGES.length) {
  console.log('\nYa se aplicaron todas las etapas. Nada que hacer.');
  process.exit(0);
}

const last = ALL ? STAGES.length : done + 1;
for (let n = done + 1; n <= last; n++) {
  applyStage(n);
  fs.writeFileSync(stateFile, String(n));
}

const total = fs.readFileSync(stateFile, 'utf8');
console.log(`\n✔ Listo. Etapas aplicadas: ${total}/${STAGES.length}`);
if (Number(total) < STAGES.length) {
  console.log('  Cuando quieras avanzar, vuelve a ejecutar el mismo comando (aplica la siguiente etapa).');
}
console.log('\nPara subir a GitHub:');
console.log('  git remote add origin https://github.com/TU-USUARIO/TU-REPO.git   (solo la primera vez)');
console.log('  git push -u origin main');
