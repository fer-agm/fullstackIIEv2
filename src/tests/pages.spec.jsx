import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import {
  getProducts, getProductByCode, getCart, addToCart, getOrders, getCategories, saveCategory, getUserByEmail,
} from '../utils/storage.js';
import { hasOffer } from '../utils/pricing.js';
import { isCritical } from '../utils/inventory.js';
import { resetStorage, loginAsAdmin, loginAsDuoc, renderApp } from './helpers.jsx';

const cards = () => document.querySelectorAll('.product-card');

describe('páginas de la tienda', () => {
  beforeEach(() => {
    resetStorage();
    spyOn(window, 'alert');
  });

  describe('Productos (lista, filtros y estado)', () => {
    it('renderiza todos los productos del conjunto de datos', () => {
      renderApp('/productos');
      expect(cards().length).toBe(getProducts().length);
    });

    it('filtra por texto al escribir en el buscador', () => {
      renderApp('/productos');
      fireEvent.change(screen.getByPlaceholderText('Buscar por nombre...'), { target: { value: 'catan' } });
      expect(cards().length).toBe(1);
      expect(screen.getByRole('heading', { name: 'Catan' })).toBeTruthy();
    });

    it('filtra por categoría', () => {
      renderApp('/productos');
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Accesorios' } });
      expect(cards().length).toBe(2);
    });

    it('no muestra tarjetas cuando la búsqueda no tiene resultados', () => {
      renderApp('/productos');
      fireEvent.change(screen.getByPlaceholderText('Buscar por nombre...'), { target: { value: 'zzzzzz' } });
      expect(cards().length).toBe(0);
    });
  });

  describe('Home', () => {
    it('muestra 6 productos destacados', () => {
      renderApp('/');
      expect(cards().length).toBe(6);
    });

    it('"Comprar Ahora" agrega el producto y navega al carrito', () => {
      renderApp('/');
      fireEvent.click(screen.getAllByRole('button', { name: 'Comprar Ahora' })[0]);
      expect(getCart().length).toBe(1);
      expect(screen.getByRole('heading', { name: 'Tu Carrito de Compras' })).toBeTruthy();
    });
  });

  describe('Ofertas y Categorías', () => {
    it('Ofertas muestra únicamente los productos en oferta', () => {
      renderApp('/ofertas');
      const expected = getProducts().filter(hasOffer).length;
      expect(expected).toBeGreaterThan(0);
      expect(cards().length).toBe(expected);
    });

    it('Categorías muestra por defecto la primera categoría', () => {
      renderApp('/categorias');
      expect(screen.getByRole('heading', { level: 3, name: getCategories()[0] })).toBeTruthy();
    });

    it('Categorías muestra los productos de la categoría pedida en la URL', () => {
      renderApp('/categorias?cat=Consolas');
      expect(screen.getByRole('heading', { level: 3, name: 'Consolas' })).toBeTruthy();
      expect(cards().length).toBe(1);
    });
  });

  describe('Detalle de producto (renderizado condicional)', () => {
    it('muestra el producto pedido', () => {
      renderApp('/detalle-producto?code=JM001');
      expect(screen.getByRole('heading', { level: 2, name: 'Catan' })).toBeTruthy();
    });

    it('avisa cuando no se especifica un producto', () => {
      renderApp('/detalle-producto');
      expect(document.body.textContent).toContain('No se especificó ningún producto');
    });

    it('avisa cuando el producto no existe', () => {
      renderApp('/detalle-producto?code=NOEXISTE');
      expect(document.body.textContent).toContain('Producto no encontrado');
    });

    it('agrega el producto al carrito desde el detalle', () => {
      renderApp('/detalle-producto?code=AC001');
      fireEvent.click(screen.getByRole('button', { name: /Agregar al Carrito/ }));
      expect(getCart()[0].code).toBe('AC001');
    });
  });

  describe('Contacto (estado del formulario)', () => {
    it('actualiza el valor de los campos mientras el usuario escribe', () => {
      renderApp('/contacto');
      const [nombre, correo, mensaje] = screen.getAllByRole('textbox');
      fireEvent.change(nombre, { target: { value: 'Fernanda' } });
      fireEvent.change(correo, { target: { value: 'f@mail.cl' } });
      fireEvent.change(mensaje, { target: { value: 'Hola' } });
      expect(nombre.value).toBe('Fernanda');
      expect(correo.value).toBe('f@mail.cl');
      expect(mensaje.value).toBe('Hola');
    });

    it('al enviar avisa y limpia el formulario', () => {
      renderApp('/contacto');
      const [nombre] = screen.getAllByRole('textbox');
      fireEvent.change(nombre, { target: { value: 'Fernanda' } });
      fireEvent.submit(document.querySelector('form'));
      expect(window.alert).toHaveBeenCalledWith(jasmine.stringMatching(/Mensaje enviado/));
      expect(nombre.value).toBe('');
    });
  });

  describe('Blogs', () => {
    it('lista los dos artículos', () => {
      renderApp('/blogs');
      expect(screen.getAllByText('Leer artículo y ver video').length).toBe(2);
    });

    it('el detalle muestra el artículo y su video', () => {
      renderApp('/blogs/1');
      expect(screen.getByRole('heading', { name: 'Cómo armar tu PC' })).toBeTruthy();
      expect(document.querySelector('video source').getAttribute('src')).toBe('/assets/img/instrucciones.mp4');
    });

    it('avisa cuando el artículo no existe', () => {
      renderApp('/blogs/99');
      expect(document.body.textContent).toContain('Artículo no encontrado');
    });
  });

  describe('Carrito', () => {
    it('muestra el mensaje de carrito vacío', () => {
      renderApp('/carrito');
      expect(screen.getByText('El carrito está vacío.')).toBeTruthy();
    });

    it('"Ir a pagar" con el carrito vacío avisa y no navega', () => {
      renderApp('/carrito');
      fireEvent.click(screen.getByRole('button', { name: 'Ir a pagar' }));
      expect(window.alert).toHaveBeenCalledWith('El carrito está vacío.');
      expect(screen.getByRole('heading', { name: 'Tu Carrito de Compras' })).toBeTruthy();
    });

    it('lista los productos agregados', () => {
      addToCart('AC001');
      addToCart('AC002');
      renderApp('/carrito');
      expect(screen.getByText('Controlador Inalámbrico Xbox Series X')).toBeTruthy();
      expect(screen.getByText('Auriculares Gamer HyperX Cloud II')).toBeTruthy();
    });

    it('recalcula el total al cambiar la cantidad', () => {
      addToCart('AC001'); // $59.990
      renderApp('/carrito');
      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3' } });
      expect(screen.getByRole('heading', { level: 3 }).textContent).toContain('$179.970');
    });

    it('elimina un producto con el botón X', () => {
      addToCart('AC001');
      renderApp('/carrito');
      fireEvent.click(screen.getByRole('button', { name: 'X' }));
      expect(screen.getByText('El carrito está vacío.')).toBeTruthy();
      expect(getCart().length).toBe(0);
    });

    it('aplica el descuento Duoc a un usuario Duoc', () => {
      loginAsDuoc();
      addToCart('JM001'); // $24.990 con oferta → 20% = $4.998
      renderApp('/carrito');
      expect(document.body.textContent).toContain('Descuento Duoc (20%): -$4.998 CLP');
    });

    it('no muestra descuento a un invitado', () => {
      addToCart('JM001');
      renderApp('/carrito');
      expect(document.body.textContent).not.toContain('Descuento Duoc');
    });
  });

  describe('Sesión y registro', () => {
    it('Inicio de sesión: rechaza credenciales incorrectas', () => {
      renderApp('/login');
      fireEvent.change(screen.getByPlaceholderText('admin@levelup.cl'), { target: { value: 'admin@levelup.cl' } });
      fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: 'mala' } });
      fireEvent.submit(document.querySelector('form'));
      expect(window.alert).toHaveBeenCalledWith('Correo o contraseña incorrectos.');
      expect(localStorage.getItem('lu_session')).toBeNull();
    });

    it('Inicio de sesión: un administrador entra al dashboard', async () => {
      renderApp('/login');
      fireEvent.change(screen.getByPlaceholderText('admin@levelup.cl'), { target: { value: 'admin@levelup.cl' } });
      fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: 'admin' } });
      fireEvent.submit(document.querySelector('form'));
      expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeTruthy();
    });

    it('Inicio de sesión: un cliente vuelve a la tienda', async () => {
      renderApp('/login');
      fireEvent.change(screen.getByPlaceholderText('admin@levelup.cl'), { target: { value: 'estudiante@duoc.cl' } });
      fireEvent.change(screen.getByPlaceholderText('admin'), { target: { value: '123' } });
      fireEvent.submit(document.querySelector('form'));
      expect(await screen.findByRole('heading', { level: 1 })).toBeTruthy();
      expect(screen.queryByRole('heading', { name: 'Dashboard' })).toBeNull();
    });

    it('Registro: bloquea a menores de 18 años', () => {
      renderApp('/registro');
      const [nombre, correo] = screen.getAllByRole('textbox');
      fireEvent.change(nombre, { target: { value: 'Joven' } });
      fireEvent.change(correo, { target: { value: 'joven@mail.cl' } });
      fireEvent.change(document.querySelector('input[type=password]'), { target: { value: 'x' } });
      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '15' } });
      fireEvent.submit(document.querySelector('form'));
      expect(window.alert).toHaveBeenCalledWith(jasmine.stringMatching(/mayor de 18/));
      expect(getUserByEmail('joven@mail.cl')).toBeUndefined();
    });

    it('Registro: crea la cuenta de un mayor de edad y va al inicio de sesión', async () => {
      renderApp('/registro');
      const [nombre, correo] = screen.getAllByRole('textbox');
      fireEvent.change(nombre, { target: { value: 'Adulta' } });
      fireEvent.change(correo, { target: { value: 'adulta@mail.cl' } });
      fireEvent.change(document.querySelector('input[type=password]'), { target: { value: 'x' } });
      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '22' } });
      fireEvent.submit(document.querySelector('form'));
      expect(await screen.findByRole('heading', { name: 'Iniciar Sesión' })).toBeTruthy();
      expect(getUserByEmail('adulta@mail.cl').name).toBe('Adulta');
    });
  });

  describe('Flujo de compra (checkout)', () => {
    function fillCheckout() {
      fireEvent.change(screen.getByLabelText('Nombre *'), { target: { value: 'Pedro' } });
      fireEvent.change(screen.getByLabelText('Apellidos *'), { target: { value: 'Hacker' } });
      fireEvent.change(screen.getByLabelText('Correo *'), { target: { value: 'pedro@mail.cl' } });
      fireEvent.change(screen.getByLabelText('Calle *'), { target: { value: 'Los Crisantemos 123' } });
      fireEvent.submit(document.querySelector('form'));
    }

    it('sin productos en el carrito no muestra el formulario', () => {
      renderApp('/checkout');
      expect(screen.getByText('No hay productos en el carrito para pagar.')).toBeTruthy();
      expect(document.querySelector('form')).toBeNull();
    });

    it('si hay sesión, completa nombre y correo automáticamente', () => {
      loginAsDuoc();
      addToCart('MS001');
      renderApp('/checkout');
      expect(screen.getByLabelText('Nombre *').value).toBe('Estudiante');
      expect(screen.getByLabelText('Apellidos *').value).toBe('Duoc');
      expect(screen.getByLabelText('Correo *').value).toBe('estudiante@duoc.cl');
    });

    it('pago aprobado: guarda la orden, vacía el carrito y descuenta stock', async () => {
      spyOn(Math, 'random').and.returnValue(0.1); // < 0.7 → aprobado
      const stockAntes = getProductByCode('MS001').stock;
      addToCart('MS001');
      renderApp('/checkout');
      fillCheckout();

      expect(await screen.findByText(/Se ha realizado la compra/, {}, { timeout: 4000 })).toBeTruthy();
      expect(getCart().length).toBe(0);
      expect(getOrders()[0].status).toBe('success');
      expect(getProductByCode('MS001').stock).toBe(stockAntes - 1);
      expect(document.body.textContent).toContain('Total pagado: $39.990');
    });

    it('pago aprobado: un usuario con sesión suma 50 puntos', async () => {
      spyOn(Math, 'random').and.returnValue(0.1);
      loginAsDuoc();
      addToCart('MS001');
      renderApp('/checkout');
      fireEvent.change(screen.getByLabelText('Calle *'), { target: { value: 'Calle 1' } });
      fireEvent.submit(document.querySelector('form'));

      await screen.findByText(/Se ha realizado la compra/, {}, { timeout: 4000 });
      expect(getUserByEmail('estudiante@duoc.cl').points).toBe(150);
    });

    it('pago rechazado: conserva el carrito y el stock, y permite reintentar con los datos', async () => {
      spyOn(Math, 'random').and.returnValue(0.99); // ≥ 0.7 → rechazado
      const stockAntes = getProductByCode('MS001').stock;
      addToCart('MS001');
      renderApp('/checkout');
      fillCheckout();

      expect(await screen.findByText(/No se pudo realizar el pago/, {}, { timeout: 4000 })).toBeTruthy();
      expect(getCart().length).toBe(1);
      expect(getOrders()[0].status).toBe('failed');
      expect(getProductByCode('MS001').stock).toBe(stockAntes);

      fireEvent.click(screen.getByRole('button', { name: 'VOLVER A REALIZAR EL PAGO' }));
      expect(screen.getByLabelText('Nombre *').value).toBe('Pedro');
      expect(screen.getByLabelText('Calle *').value).toBe('Los Crisantemos 123');
    });

    it('las páginas de resultado avisan si la orden no corresponde', () => {
      renderApp('/pago-correcto/9999');
      expect(screen.getByText('No se encontró la orden solicitada.')).toBeTruthy();
    });
  });
});

describe('panel de administración', () => {
  beforeEach(() => {
    resetStorage();
    spyOn(window, 'alert');
  });

  it('sin sesión de administrador bloquea el acceso y vuelve a la tienda', async () => {
    renderApp('/admin');
    expect(window.alert).toHaveBeenCalledWith('Acceso restringido para administradores.');
    expect(await screen.findByRole('heading', { level: 1 })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Dashboard' })).toBeNull();
  });

  it('un cliente tampoco puede entrar', () => {
    loginAsDuoc();
    renderApp('/admin/productos');
    expect(window.alert).toHaveBeenCalledWith('Acceso restringido para administradores.');
  });

  it('el dashboard muestra los totales y el aviso de stock crítico', () => {
    loginAsAdmin();
    renderApp('/admin');
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeTruthy();
    const criticos = getProducts().filter(isCritical).length;
    expect(criticos).toBeGreaterThan(0);
    expect(document.body.textContent).toContain(`${criticos} productos con stock crítico`);
  });

  it('el listado de stock crítico solo incluye productos críticos', () => {
    loginAsAdmin();
    renderApp('/admin/productos/criticos');
    const filas = document.querySelectorAll('tbody tr');
    expect(filas.length).toBe(getProducts().filter(isCritical).length);
  });

  it('elimina un producto desde la tabla de productos', () => {
    loginAsAdmin();
    renderApp('/admin/productos');
    const fila = screen.getByText('Catan').closest('tr');
    fireEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }));
    expect(getProductByCode('JM001')).toBeUndefined();
    expect(screen.queryByText('Catan')).toBeNull();
  });

  it('no permite eliminar una categoría que tiene productos', () => {
    loginAsAdmin();
    renderApp('/admin/categorias');
    const fila = screen.getByText('Consolas').closest('tr');
    fireEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }));
    expect(window.alert).toHaveBeenCalledWith(jasmine.stringMatching(/No se puede eliminar/));
    expect(getCategories()).toContain('Consolas');
  });

  it('elimina una categoría vacía', () => {
    saveCategory('Streaming');
    loginAsAdmin();
    renderApp('/admin/categorias');
    const fila = screen.getByText('Streaming').closest('tr');
    fireEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }));
    expect(getCategories()).not.toContain('Streaming');
  });

  it('no permite eliminar al usuario con la sesión iniciada', () => {
    loginAsAdmin();
    renderApp('/admin/usuarios');
    const fila = screen.getByText('admin@levelup.cl').closest('tr');
    fireEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }));
    expect(window.alert).toHaveBeenCalledWith(jasmine.stringMatching(/No puedes eliminar tu propia cuenta/));
    expect(getUserByEmail('admin@levelup.cl')).toBeTruthy();
  });

  it('el perfil rechaza una contraseña actual incorrecta', () => {
    loginAsAdmin();
    renderApp('/admin/perfil');
    const [actual, nueva, confirmar] = document.querySelectorAll('input[type=password]');
    fireEvent.change(actual, { target: { value: 'incorrecta' } });
    fireEvent.change(nueva, { target: { value: 'nueva123' } });
    fireEvent.change(confirmar, { target: { value: 'nueva123' } });
    fireEvent.submit(document.querySelector('form'));
    expect(window.alert).toHaveBeenCalledWith('La contraseña actual no es correcta.');
    expect(getUserByEmail('admin@levelup.cl').password).toBe('admin');
  });

  it('el perfil cambia la contraseña cuando los datos son correctos', () => {
    loginAsAdmin();
    renderApp('/admin/perfil');
    const [actual, nueva, confirmar] = document.querySelectorAll('input[type=password]');
    fireEvent.change(actual, { target: { value: 'admin' } });
    fireEvent.change(nueva, { target: { value: 'nueva123' } });
    fireEvent.change(confirmar, { target: { value: 'nueva123' } });
    fireEvent.submit(document.querySelector('form'));
    expect(getUserByEmail('admin@levelup.cl').password).toBe('nueva123');
  });

  it('la lista de órdenes muestra el mensaje vacío y luego las órdenes guardadas', async () => {
    loginAsAdmin();
    const { unmount } = renderApp('/admin/ordenes');
    expect(screen.getByText('Aún no hay órdenes.')).toBeTruthy();
    unmount();

    localStorage.setItem('lu_orders', JSON.stringify([{
      id: '2026101801', code: 'ORDER2026101801', date: new Date().toISOString(), status: 'success', total: 39990,
      userEmail: null, customer: { nombre: 'Pedro', apellidos: 'Hacker', correo: 'p@mail.cl' }, address: {}, items: [],
    }]));
    renderApp('/admin/ordenes');
    expect(await screen.findByText('#2026101801')).toBeTruthy();
    expect(screen.getByText('Pagada')).toBeTruthy();
    await waitFor(() => expect(screen.getByText('Ver boleta')).toBeTruthy());
  });
});
