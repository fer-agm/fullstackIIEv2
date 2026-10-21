import {
  getProducts, getProductByCode, saveProduct, updateProduct, deleteProduct,
  getUsers, getUserByEmail, saveUser, updateUser, deleteUser, registerUserLogic,
  getCart, addToCart, updateCartQty, removeFromCart, clearCart,
  getOrders, getOrderById, saveOrder, getNextOrderNumber,
  getCategories, saveCategory, renameCategory, deleteCategory, decrementStock,
} from '../utils/storage.js';
import { resetStorage } from './helpers.jsx';

describe('storage (CRUD sobre localStorage)', () => {
  beforeEach(() => {
    resetStorage();
    spyOn(window, 'alert');
  });

  describe('productos', () => {
    const nuevo = { code: 'ZZ001', category: 'Mouse', name: 'Mouse Test', price: 1000, stock: 7, origin: 'X', desc: 'd', image: 'a.png' };

    it('carga los productos por defecto', () => {
      expect(getProducts().length).toBe(10);
      expect(getProductByCode('JM001').name).toBe('Catan');
    });

    it('crea un producto', () => {
      saveProduct(nuevo);
      expect(getProductByCode('ZZ001')).toEqual(nuevo);
      expect(getProducts().length).toBe(11);
    });

    it('actualiza un producto', () => {
      saveProduct(nuevo);
      updateProduct({ ...nuevo, price: 2000 });
      expect(getProductByCode('ZZ001').price).toBe(2000);
    });

    it('elimina un producto', () => {
      deleteProduct('JM001');
      expect(getProductByCode('JM001')).toBeUndefined();
    });
  });

  describe('usuarios', () => {
    it('carga los usuarios por defecto y busca por correo sin distinguir mayúsculas', () => {
      expect(getUsers().length).toBe(2);
      expect(getUserByEmail('ADMIN@LEVELUP.CL').role).toBe('admin');
    });

    it('crea, actualiza y elimina un usuario', () => {
      const u = { name: 'Ana', email: 'ana@mail.cl', password: 'x', age: 25, role: 'user', points: 0, isDuoc: false };
      saveUser(u);
      expect(getUserByEmail('ana@mail.cl').name).toBe('Ana');
      updateUser({ ...u, points: 50 });
      expect(getUserByEmail('ana@mail.cl').points).toBe(50);
      deleteUser('ana@mail.cl');
      expect(getUserByEmail('ana@mail.cl')).toBeUndefined();
    });

    it('rechaza el registro de menores de 18 años', () => {
      expect(registerUserLogic('Joven', 'joven@mail.cl', 'x', 17, '')).toBeFalse();
      expect(getUserByEmail('joven@mail.cl')).toBeUndefined();
      expect(window.alert).toHaveBeenCalledWith(jasmine.stringMatching(/mayor de 18/));
    });

    it('rechaza un correo ya registrado', () => {
      expect(registerUserLogic('Otro', 'admin@levelup.cl', 'x', 30, '')).toBeFalse();
      expect(window.alert).toHaveBeenCalledWith(jasmine.stringMatching(/ya se encuentra registrado/));
    });

    it('marca como Duoc a quien se registra con correo duoc', () => {
      expect(registerUserLogic('Eva', 'eva@duoc.cl', 'x', 20, '')).toBeTrue();
      expect(getUserByEmail('eva@duoc.cl').isDuoc).toBeTrue();
    });

    it('entrega 100 puntos al registrarse con código de referido', () => {
      registerUserLogic('Ref', 'ref@mail.cl', 'x', 20, 'REF123');
      registerUserLogic('SinRef', 'sin@mail.cl', 'x', 20, '');
      expect(getUserByEmail('ref@mail.cl').points).toBe(100);
      expect(getUserByEmail('sin@mail.cl').points).toBe(0);
    });
  });

  describe('carrito', () => {
    it('agrega un producto y acumula la cantidad si se repite', () => {
      addToCart('AC001');
      addToCart('AC001', 2);
      expect(getCart().length).toBe(1);
      expect(getCart()[0].qty).toBe(3);
    });

    it('guarda el precio de oferta en el carrito', () => {
      addToCart('JM001'); // Catan: $29.990 con oferta de $24.990
      expect(getCart()[0].price).toBe(24990);
      expect(getCart()[0].originalPrice).toBe(29990);
    });

    it('ignora códigos de producto inexistentes', () => {
      addToCart('NOEXISTE');
      expect(getCart().length).toBe(0);
    });

    it('actualiza la cantidad y elimina el item si queda en 0', () => {
      addToCart('AC001');
      updateCartQty('AC001', 5);
      expect(getCart()[0].qty).toBe(5);
      updateCartQty('AC001', 0);
      expect(getCart().length).toBe(0);
    });

    it('elimina un item y vacía el carrito', () => {
      addToCart('AC001');
      addToCart('AC002');
      removeFromCart('AC001');
      expect(getCart().map((c) => c.code)).toEqual(['AC002']);
      clearCart();
      expect(getCart()).toEqual([]);
    });
  });

  describe('órdenes', () => {
    const orden = (id, status = 'success') => ({ id, code: `ORDER${id}`, status, total: 1000, items: [], customer: {}, address: {} });

    it('guarda y busca una orden por id', () => {
      saveOrder(orden('20260101'));
      expect(getOrderById('20260101').code).toBe('ORDER20260101');
      expect(getOrders().length).toBe(1);
    });

    it('genera números de orden correlativos dentro del día', () => {
      const first = getNextOrderNumber();
      expect(first.endsWith('01')).toBeTrue();
      saveOrder(orden(first));
      expect(getNextOrderNumber().endsWith('02')).toBeTrue();
    });
  });

  describe('categorías', () => {
    it('trae las 8 categorías por defecto', () => {
      expect(getCategories().length).toBe(8);
    });

    it('crea y elimina una categoría', () => {
      saveCategory('Streaming');
      expect(getCategories()).toContain('Streaming');
      deleteCategory('Streaming');
      expect(getCategories()).not.toContain('Streaming');
    });

    it('al renombrar una categoría actualiza sus productos', () => {
      renameCategory('Consolas', 'Consolas de Juego');
      expect(getCategories()).toContain('Consolas de Juego');
      expect(getProductByCode('CO001').category).toBe('Consolas de Juego');
    });
  });

  describe('stock', () => {
    it('descuenta el stock de los productos comprados', () => {
      const antes = getProductByCode('MS001').stock;
      decrementStock([{ code: 'MS001', qty: 2 }]);
      expect(getProductByCode('MS001').stock).toBe(antes - 2);
    });

    it('nunca deja el stock bajo 0', () => {
      decrementStock([{ code: 'JM002', qty: 999 }]);
      expect(getProductByCode('JM002').stock).toBe(0);
    });
  });
});
