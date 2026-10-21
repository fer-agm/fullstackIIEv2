import { useState } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import Button from '../components/Button.jsx';
import PriceTag from '../components/PriceTag.jsx';
import ProductCard from '../components/ProductCard.jsx';
import CategoryTile from '../components/CategoryTile.jsx';
import OrderTotals from '../components/OrderTotals.jsx';
import ProductForm from '../components/ProductForm.jsx';
import DeliveryAddressFields from '../components/DeliveryAddressFields.jsx';
import Header from '../components/Header.jsx';
import BarList from '../components/admin/BarList.jsx';
import StatCard from '../components/admin/StatCard.jsx';
import { getProductByCode } from '../utils/storage.js';
import { DEFAULT_REGION } from '../utils/chile.js';
import { resetStorage, loginAsAdmin, loginAsDuoc, renderWithProviders, CartProbe } from './helpers.jsx';

describe('componentes', () => {
  beforeEach(() => {
    resetStorage();
    spyOn(window, 'alert');
  });

  // ---------- Pruebas de propiedades (props) y eventos ----------
  describe('Button', () => {
    it('muestra la etiqueta recibida por props', () => {
      renderWithProviders(<Button>Pagar</Button>);
      expect(screen.getByRole('button', { name: 'Pagar' })).toBeTruthy();
    });

    it('ejecuta la función onClick al hacer clic', () => {
      const onClick = jasmine.createSpy('onClick');
      renderWithProviders(<Button onClick={onClick}>Pagar</Button>);
      fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('no ejecuta onClick cuando está deshabilitado', () => {
      const onClick = jasmine.createSpy('onClick');
      renderWithProviders(<Button onClick={onClick} disabled>Pagar</Button>);
      fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('aplica la clase según la variante', () => {
      renderWithProviders(<Button variant="blue">Ver</Button>);
      expect(screen.getByRole('button', { name: 'Ver' }).className).toContain('btn-blue');
    });
  });

  describe('PriceTag (renderizado condicional)', () => {
    it('muestra solo el precio normal cuando no hay oferta', () => {
      const { container } = renderWithProviders(<PriceTag product={{ price: 29990 }} />);
      expect(container.textContent).toContain('$29.990 CLP');
      expect(container.querySelector('.badge')).toBeNull();
    });

    it('muestra precio tachado, oferta y porcentaje cuando hay oferta', () => {
      const { container } = renderWithProviders(<PriceTag product={{ price: 29990, offerPrice: 24990 }} />);
      expect(container.querySelector('.badge').textContent).toBe('-17%');
      expect(container.textContent).toContain('$24.990 CLP');
      expect(container.querySelector('span[style*="line-through"]').textContent).toBe('$29.990');
    });
  });

  describe('ProductCard', () => {
    it('renderiza los datos del producto recibido', () => {
      const product = getProductByCode('AC001');
      renderWithProviders(<ProductCard product={product} />);
      expect(screen.getByRole('heading', { name: product.name })).toBeTruthy();
      expect(document.body.textContent).toContain('Cod: AC001');
    });

    it('agrega al carrito al hacer clic en el botón 🛒', () => {
      renderWithProviders(
        <>
          <ProductCard product={getProductByCode('AC001')} />
          <CartProbe />
        </>
      );
      expect(screen.getByTestId('cart-probe').textContent).toBe('0|0');
      fireEvent.click(screen.getByLabelText('Agregar al carrito'));
      expect(screen.getByTestId('cart-probe').textContent).toBe('1|59990');
    });

    it('muestra "Agotado" y deshabilita la compra cuando no hay stock', () => {
      const sinStock = { ...getProductByCode('AC001'), stock: 0 };
      renderWithProviders(<ProductCard product={sinStock} />);
      const btn = screen.getByLabelText('Agregar al carrito');
      expect(btn.textContent).toBe('Agotado');
      expect(btn.disabled).toBeTrue();
    });

    it('con buyNow muestra el botón "Comprar Ahora"', () => {
      renderWithProviders(<ProductCard product={getProductByCode('AC001')} buyNow />);
      expect(screen.getByRole('button', { name: 'Comprar Ahora' })).toBeTruthy();
    });
  });

  describe('CategoryTile', () => {
    it('usa singular cuando hay un producto y plural en otro caso', () => {
      renderWithProviders(
        <>
          <CategoryTile name="Consolas" count={1} />
          <CategoryTile name="Mouse" count={3} />
        </>
      );
      expect(screen.getByText('1 producto')).toBeTruthy();
      expect(screen.getByText('3 productos')).toBeTruthy();
    });
  });

  describe('OrderTotals (renderizado condicional)', () => {
    it('oculta la línea de descuento cuando es 0', () => {
      renderWithProviders(<OrderTotals subtotal={1000} discount={0} total={1000} />);
      expect(document.body.textContent).not.toContain('Descuento Duoc');
    });

    it('muestra la línea de descuento cuando es mayor a 0', () => {
      renderWithProviders(<OrderTotals subtotal={1000} discount={200} total={800} totalLabel="Total Final" />);
      expect(document.body.textContent).toContain('Descuento Duoc (20%): -$200 CLP');
      expect(document.body.textContent).toContain('Total Final: $800 CLP');
    });
  });

  describe('BarList y StatCard', () => {
    it('renderiza todos los elementos de la lista', () => {
      const items = [
        { label: 'Uno', value: 10, display: '10 u.' },
        { label: 'Dos', value: 5 },
        { label: 'Tres', value: 1 },
      ];
      renderWithProviders(<BarList title="Top" items={items} />);
      ['Uno', 'Dos', 'Tres'].forEach((l) => expect(screen.getByText(l)).toBeTruthy());
      expect(screen.getByText('10 u.')).toBeTruthy();
    });

    it('muestra un mensaje cuando no hay datos', () => {
      renderWithProviders(<BarList title="Top" items={[]} />);
      expect(screen.getByText('Aún no hay datos para mostrar.')).toBeTruthy();
    });

    it('StatCard muestra título, valor y detalle', () => {
      renderWithProviders(<StatCard title="Compras" value={12} sub="Ventas: $1" />);
      expect(screen.getByText('Compras')).toBeTruthy();
      expect(screen.getByText('12')).toBeTruthy();
      expect(screen.getByText('Ventas: $1')).toBeTruthy();
    });
  });

  // ---------- Pruebas de estado (state) ----------
  describe('ProductForm', () => {
    const values = { code: 'X1', category: 'Mouse', name: '', price: '', offerPrice: '', stock: '', origin: '', desc: '', image: '' };

    it('informa el cambio de un campo conservando el resto de los valores', () => {
      const onChange = jasmine.createSpy('onChange');
      renderWithProviders(
        <ProductForm values={values} onChange={onChange} onSubmit={() => {}} imageLabel="Imagen" submitText="Guardar" submitClass="btn-green" />
      );
      const nameInput = screen.getAllByRole('textbox')[1]; // [0] es el código
      fireEvent.change(nameInput, { target: { value: 'Teclado' } });
      expect(onChange).toHaveBeenCalledWith({ ...values, name: 'Teclado' });
    });

    it('en modo edición el código es de solo lectura', () => {
      renderWithProviders(
        <ProductForm isEdit values={values} onChange={() => {}} onSubmit={() => {}} imageLabel="Imagen" submitText="Actualizar" submitClass="btn-blue" />
      );
      expect(screen.getAllByRole('textbox')[0].readOnly).toBeTrue();
    });
  });

  describe('DeliveryAddressFields', () => {
    function Wrapper() {
      const [values, setValues] = useState({ calle: '', departamento: '', region: DEFAULT_REGION, comuna: 'Cerrillos', indicaciones: '' });
      return <DeliveryAddressFields values={values} onPatch={(p) => setValues((v) => ({ ...v, ...p }))} />;
    }

    it('lista las 52 comunas de la Región Metropolitana', () => {
      renderWithProviders(<Wrapper />);
      expect(screen.getByLabelText('Comuna *').querySelectorAll('option').length).toBe(52);
    });

    it('al cambiar de región reinicia la comuna a la primera de esa región', () => {
      renderWithProviders(<Wrapper />);
      fireEvent.change(screen.getByLabelText('Región *'), { target: { value: 'Región de Tarapacá' } });
      const comuna = screen.getByLabelText('Comuna *');
      expect(comuna.value).toBe('Iquique');
      expect(comuna.querySelectorAll('option').length).toBe(4);
    });
  });

  // ---------- Header (sesión + carrito) ----------
  describe('Header', () => {
    it('muestra "Invitado" y oculta "Panel Admin" sin sesión', () => {
      renderWithProviders(<Header />);
      expect(document.body.textContent).toContain('Invitado');
      expect(screen.queryByText('Panel Admin')).toBeNull();
    });

    it('muestra el usuario, su descuento Duoc y sus puntos', () => {
      loginAsDuoc();
      renderWithProviders(<Header />);
      expect(document.body.textContent).toContain('Estudiante Duoc');
      expect(document.body.textContent).toContain('20% Descuento Duoc');
      expect(document.body.textContent).toContain('100 Pts (Novato)');
      expect(screen.queryByText('Panel Admin')).toBeNull();
    });

    it('muestra el link "Panel Admin" solo para administradores', () => {
      loginAsAdmin();
      renderWithProviders(<Header />);
      expect(screen.getByText('Panel Admin')).toBeTruthy();
      expect(document.body.textContent).toContain('1000 Pts (Leyenda)');
    });

    it('actualiza el total del carrito al agregar un producto', () => {
      renderWithProviders(
        <>
          <Header />
          <ProductCard product={getProductByCode('AC001')} />
        </>
      );
      expect(screen.getByText(/Carrito \$0/)).toBeTruthy();
      fireEvent.click(screen.getByLabelText('Agregar al carrito'));
      expect(screen.getByText(/Carrito \$59\.990/)).toBeTruthy();
    });

    it('abre y cierra el menú en móvil con el botón hamburguesa', () => {
      renderWithProviders(<Header />);
      const toggler = screen.getByLabelText('Abrir menú');
      expect(toggler.getAttribute('aria-expanded')).toBe('false');
      fireEvent.click(toggler);
      expect(toggler.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
