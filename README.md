# Level-Up Gamer (React + Bootstrap)

    npm install
    npm run dev        # desarrollo
    npm run build      # producción
    npm test           # pruebas unitarias (Jasmine + Karma, Chrome headless) + cobertura

- Imágenes y videos: `public/assets/img/`
- Pago simulado: `src/utils/payment.js` (`PAYMENT_SUCCESS_RATE`: 1 = siempre aprobado, 0 = siempre rechazado)
- Datos (CRUD en localStorage): `src/utils/storage.js`

## Pruebas

- Configuración: `karma.conf.cjs` (Karma + Jasmine, webpack + Babel para compilar JSX, karma-coverage).
- Pruebas: `src/tests/*.spec.js(x)`; helpers en `src/tests/helpers.jsx`.
- Se necesita Google Chrome o Chromium instalado. Si Karma no lo encuentra:
  - Linux/macOS: `CHROME_BIN=/ruta/a/chrome npm test`
  - Windows (PowerShell): `$env:CHROME_BIN="C:\Program Files\Google\Chrome\Application\chrome.exe"; npm test`
- Informe de cobertura: `coverage/index.html` (se genera al correr `npm test`).
- `npm run test:watch` deja Karma corriendo y vuelve a ejecutar al guardar.
