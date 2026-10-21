// Punto de entrada de Karma: importa todos los *.spec.js / *.spec.jsx (.cjs: el package.json es type=module y require.context necesita CommonJS)
const context = require.context('.', true, /\.spec\.jsx?$/);
context.keys().forEach(context);
