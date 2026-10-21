# Historial de git por etapas — Level-Up Gamer (React)

`crear-historial.mjs` toma el proyecto final y lo va subiendo a un repositorio **en 13 commits**, uno por etapa.
Cada etapa deja el proyecto funcionando (el script puede comprobarlo compilando antes de hacer el commit).

## Qué necesitas
- Node.js y git instalados.
- Tu identidad de git configurada (una sola vez):
  ```
  git config --global user.name "Tu Nombre"
  git config --global user.email "tu@correo.com"
  ```
- El proyecto final con las dependencias instaladas (solo si usarás `--verify`):
  ```
  cd levelup-react
  npm install
  ```

## Las 13 etapas
```
node crear-historial.mjs --list
```
| # | Commit |
|---|---|
| 1 | chore: inicializa proyecto Vite + React |
| 2 | feat: agrega estilos base y capa de datos con CRUD en localStorage |
| 3 | feat: agrega sesión, carrito, header, footer y layout |
| 4 | feat: integra Bootstrap (grilla responsive, navbar y tema oscuro) |
| 5 | feat: migra las páginas públicas de la tienda a React |
| 6 | feat: agrega inicio de sesión y registro de usuarios |
| 7 | feat: agrega checkout y pantallas de pago correcto y con error |
| 8 | feat: agrega categorías, ofertas y detalle de blogs |
| 9 | feat: agrega panel de administración con dashboard y CRUD de productos y usuarios |
| 10 | feat: agrega categorías, órdenes, boletas, reportes y perfil al panel admin |
| 11 | test: configura Jasmine y Karma con cobertura |
| 12 | test: agrega pruebas de componentes, páginas y formularios |
| 13 | docs: agrega README final y package-lock.json |

## Cómo usarlo (recomendado: una etapa por sesión de trabajo)

1. **Primera etapa** (crea la carpeta del repositorio y el primer commit):
   ```
   node crear-historial.mjs ../levelup-react ../levelup-gamer-react --verify
   ```
2. **Conecta el repositorio de GitHub** (solo la primera vez):
   ```
   cd ../levelup-gamer-react
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```
3. **Las siguientes etapas**: repite el comando del paso 1 cuando quieras avanzar.
   Cada ejecución aplica **solo la siguiente etapa**, hace su commit e imprime *qué debes entender de ella*.
   Después haz `git push`.

El script recuerda en qué etapa vas (en `.git/historial-etapa`, que no se sube).

### Opciones
| Opción | Qué hace |
|---|---|
| `--next` | Aplica la siguiente etapa (es lo que hace por defecto). |
| `--all` | Aplica todas las etapas pendientes de una vez. |
| `--verify` | Compila (`npm run build`) cada etapa antes del commit. Si no compila, no hace el commit. |
| `--verify-tests` | Además corre `npm test` en las etapas 11 a 13. Necesita Chrome (ver `CHROME_BIN` en el README del proyecto). |
| `--list` | Muestra las etapas. |

## Sobre las fechas
Los commits llevan la fecha y hora **reales** en que ejecutas cada etapa. Por eso conviene hacerlo en varias
sesiones: si usas `--all`, los 13 commits quedarán con la misma hora, y eso es lo que verá quien revise el repositorio.
No cambies las fechas a mano: el historial debe reflejar lo que realmente hiciste.

## Antes de cada commit
- Lee los archivos de la etapa (el script imprime la lista de ideas clave).
- Ejecuta la app (`npm run dev`) y prueba lo que acabas de agregar.
- Recuerda que cada integrante del grupo responderá preguntas sobre el código en la presentación.

## Cosas que conviene saber
- Algunos archivos se **generan por etapa** a partir de la versión final: `package.json` (solo las dependencias que ya se usan),
  `index.html`, `main.jsx`, `style.css` (por secciones) y `App.jsx` (solo las rutas de páginas que ya existen).
- `package-lock.json` se agrega en la última etapa.
- Si ya tienes imágenes o videos en `public/assets/img/`, se suben en la etapa 2 (cuidado: GitHub rechaza archivos de más de 100 MB).
- Si cambias el proyecto final después de crear el historial, las etapas ya hechas no se actualizan.
