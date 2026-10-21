import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from '../App.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { CartProvider, useCart } from '../context/CartContext.jsx';
import { initStorage, setCurrentUser, getUserByEmail } from '../utils/storage.js';

// Deja localStorage como una instalación nueva (productos, usuarios y categorías por defecto)
export function resetStorage() {
  localStorage.clear();
  initStorage();
}

export const loginAs = (email) => setCurrentUser(getUserByEmail(email));
export const loginAsAdmin = () => loginAs('admin@levelup.cl');
export const loginAsDuoc = () => loginAs('estudiante@duoc.cl');

// Renderiza un componente con Router, sesión y carrito (igual que en la app real)
export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <CartProvider>{ui}</CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

// Renderiza toda la aplicación (rutas incluidas) partiendo en `route`
export const renderApp = (route = '/') => renderWithProviders(<App />, { route });

// Componente auxiliar que expone el estado del carrito en el DOM
export function CartProbe() {
  const { count, subtotal } = useCart();
  return <div data-testid="cart-probe">{count}|{subtotal}</div>;
}
