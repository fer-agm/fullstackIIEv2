import { fireEvent, screen } from '@testing-library/react';
import { getProductByCode, getUserByEmail, getCategories } from '../utils/storage.js';
import { resetStorage, loginAsAdmin, loginAsDuoc, renderApp } from './helpers.jsx';

// Formularios del panel (rutas protegidas: se entra como administrador)
describe('formularios de administración', () => {
  beforeEach(() => {
    resetStorage();
    loginAsAdmin();
    spyOn(window, 'alert');
  });

  // Orden de los campos de ProductForm: textboxes = [código, nombre, origen, descripción, imagen]
  // spinbuttons = [precio, precio de oferta, stock]
  function fillProduct({ code, name = 'Producto Test', price = '10000', offer = '', stock = '5' }) {
    const text = screen.getAllByRole('textbox');
    const nums = screen.getAllByRole('spinbutton');
    fireEvent.change(text[0], { target: { value: code } });
    fireEvent.change(text[1], { target: { value: name } });
    fireEvent.change(nums[0], { target: { value: price } });
    fireEvent.change(nums[1], { target: { value: offer } });
    fireEvent.change(nums[2], { target: { value: stock } });
    fireEvent.change(text[2], { target: { value: 'Fabricante' } });
    fireEvent.change(text[3], { target: { value: 'Descripción' } });
    fireEvent.submit(document.querySelector('form'));
  }

  describe('Nuevo producto', () => {
    it('crea el producto con su stock y vuelve a la lista', async () => {
      renderApp('/admin/productos/nuevo');
      fillProduct({ code: 'ZZ001' });
      expect(await screen.findByRole('heading', { name: 'Gestión de Productos' })).toBeTruthy();
      const p = getProductByCode('ZZ001');
      expect(p.price).toBe(10000);
      expect(p.stock).toBe(5);
      expect(p.image).toBe('default.png');
    });

    it('rechaza un código de producto repetido', () => {
      renderApp('/admin/productos/nuevo');
      fillProduct({ code: 'JM001' });
      expect(window.alert).toHaveBeenCalledWith('El código de producto ya existe.');
    });

    it('rechaza un precio de oferta mayor o igual al precio normal', () => {
      renderApp('/admin/productos/nuevo');
      fillProduct({ code: 'ZZ002', price: '10000', offer: '10000' });
      expect(window.alert).toHaveBeenCalledWith('El precio de oferta debe ser menor al precio normal.');
      expect(getProductByCode('ZZ002')).toBeUndefined();
    });

    it('guarda el precio de oferta cuando es válido', async () => {
      renderApp('/admin/productos/nuevo');
      fillProduct({ code: 'ZZ003', price: '10000', offer: '8000' });
      await screen.findByRole('heading', { name: 'Gestión de Productos' });
      expect(getProductByCode('ZZ003').offerPrice).toBe(8000);
    });
  });

  describe('Editar producto', () => {
    it('carga los datos del producto y deja el código de solo lectura', () => {
      renderApp('/admin/productos/editar?code=JM001');
      const [code, name] = screen.getAllByRole('textbox');
      expect(code.value).toBe('JM001');
      expect(code.readOnly).toBeTrue();
      expect(name.value).toBe('Catan');
    });

    it('actualiza el precio y conserva la imagen y la oferta', async () => {
      renderApp('/admin/productos/editar?code=JM001');
      fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '35000' } });
      fireEvent.submit(document.querySelector('form'));
      await screen.findByRole('heading', { name: 'Gestión de Productos' });
      const p = getProductByCode('JM001');
      expect(p.price).toBe(35000);
      expect(p.image).toBe('catan.jpg');
      expect(p.offerPrice).toBe(24990);
    });
  });

  describe('Usuarios', () => {
    it('Nuevo usuario: rechaza a un menor de 18 años', () => {
      renderApp('/admin/usuarios/nuevo');
      const [nombre, correo] = screen.getAllByRole('textbox');
      fireEvent.change(nombre, { target: { value: 'Menor' } });
      fireEvent.change(correo, { target: { value: 'menor@mail.cl' } });
      fireEvent.change(document.querySelector('input[type=password]'), { target: { value: 'x' } });
      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '17' } });
      fireEvent.submit(document.querySelector('form'));
      expect(window.alert).toHaveBeenCalledWith('El usuario debe tener al menos 18 años.');
      expect(getUserByEmail('menor@mail.cl')).toBeUndefined();
    });

    it('Nuevo usuario: crea un usuario Duoc y vuelve a la lista', async () => {
      renderApp('/admin/usuarios/nuevo');
      const [nombre, correo] = screen.getAllByRole('textbox');
      fireEvent.change(nombre, { target: { value: 'Nueva Duoc' } });
      fireEvent.change(correo, { target: { value: 'nueva@duoc.cl' } });
      fireEvent.change(document.querySelector('input[type=password]'), { target: { value: 'x' } });
      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '20' } });
      fireEvent.submit(document.querySelector('form'));
      expect(await screen.findByRole('heading', { name: 'Gestión de Usuarios' })).toBeTruthy();
      expect(getUserByEmail('nueva@duoc.cl').isDuoc).toBeTrue();
    });

    it('Editar usuario: actualiza los puntos', async () => {
      renderApp('/admin/usuarios/editar?email=estudiante%40duoc.cl');
      const [, puntos] = screen.getAllByRole('spinbutton'); // [edad, puntos]
      fireEvent.change(puntos, { target: { value: '500' } });
      fireEvent.submit(document.querySelector('form'));
      await screen.findByRole('heading', { name: 'Gestión de Usuarios' });
      expect(getUserByEmail('estudiante@duoc.cl').points).toBe(500);
    });

    it('Historial de compras: muestra las órdenes del usuario', () => {
      localStorage.setItem('lu_orders', JSON.stringify([
        { id: '2026101801', code: 'ORDER2026101801', date: new Date().toISOString(), status: 'success', total: 39990, userEmail: 'estudiante@duoc.cl', customer: {}, address: {}, items: [{ code: 'MS001', name: 'Mouse', price: 39990, qty: 1 }] },
        { id: '2026101802', code: 'ORDER2026101802', date: new Date().toISOString(), status: 'success', total: 1000, userEmail: 'otro@mail.cl', customer: {}, address: {}, items: [] },
      ]));
      renderApp('/admin/usuarios/historial?email=estudiante%40duoc.cl');
      expect(screen.getByText('#2026101801')).toBeTruthy();
      expect(screen.queryByText('#2026101802')).toBeNull();
    });

    it('Historial de compras: avisa si el usuario no existe', () => {
      renderApp('/admin/usuarios/historial?email=nadie%40mail.cl');
      expect(screen.getByText('Usuario no encontrado.')).toBeTruthy();
    });
  });

  describe('Categorías', () => {
    it('crea una categoría nueva', async () => {
      renderApp('/admin/categorias/nueva');
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Streaming' } });
      fireEvent.submit(document.querySelector('form'));
      expect(await screen.findByRole('heading', { name: 'Gestión de Categorías' })).toBeTruthy();
      expect(getCategories()).toContain('Streaming');
    });

    it('rechaza un nombre repetido sin distinguir mayúsculas', () => {
      renderApp('/admin/categorias/nueva');
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'consolas' } });
      fireEvent.submit(document.querySelector('form'));
      expect(window.alert).toHaveBeenCalledWith('Ya existe una categoría con ese nombre.');
    });

    it('renombra una categoría y actualiza sus productos', async () => {
      renderApp('/admin/categorias/editar?name=Mouse');
      const input = screen.getByRole('textbox');
      expect(input.value).toBe('Mouse');
      fireEvent.change(input, { target: { value: 'Ratones' } });
      fireEvent.submit(document.querySelector('form'));
      await screen.findByRole('heading', { name: 'Gestión de Categorías' });
      expect(getProductByCode('MS001').category).toBe('Ratones');
    });

    it('avisa si la categoría a editar no existe', () => {
      renderApp('/admin/categorias/editar?name=Inexistente');
      expect(screen.getByText('Categoría no encontrada.')).toBeTruthy();
    });
  });

  describe('Boleta', () => {
    it('muestra el detalle de una orden guardada', () => {
      localStorage.setItem('lu_orders', JSON.stringify([
        { id: '2026101801', code: 'ORDER2026101801', date: new Date().toISOString(), status: 'failed', subtotal: 39990, discount: 0, total: 39990, userEmail: null,
          customer: { nombre: 'Pedro', apellidos: 'Hacker', correo: 'p@mail.cl' },
          address: { calle: 'Calle 1', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Cerrillos', indicaciones: '' },
          items: [{ code: 'MS001', name: 'Mouse Gamer Logitech G502 HERO', price: 39990, qty: 1 }] },
      ]));
      renderApp('/admin/ordenes/2026101801');
      expect(screen.getByRole('heading', { name: 'Boleta #2026101801' })).toBeTruthy();
      expect(screen.getByText('Rechazada')).toBeTruthy();
      expect(document.body.textContent).toContain('Total a pagar: $39.990 CLP');
    });

    it('avisa si la orden no existe', () => {
      renderApp('/admin/ordenes/0000');
      expect(screen.getByText('Orden no encontrada.')).toBeTruthy();
    });
  });
});

describe('sesión', () => {
  beforeEach(() => {
    resetStorage();
    spyOn(window, 'alert');
  });

  it('"Salir" cierra la sesión y lleva al inicio de sesión', async () => {
    loginAsDuoc();
    renderApp('/');
    fireEvent.click(screen.getByText('Salir'));
    expect(await screen.findByRole('heading', { name: 'Iniciar Sesión' })).toBeTruthy();
    expect(localStorage.getItem('lu_session')).toBeNull();
  });
});
