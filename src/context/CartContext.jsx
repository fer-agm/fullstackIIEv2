import { createContext, useContext, useState } from 'react';
import { getCart, addToCart, updateCartQty, removeFromCart, clearCart } from '../utils/storage.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => getCart());
  const sync = () => setItems(getCart());

  const value = {
    items,
    count: items.reduce((acc, i) => acc + i.qty, 0),
    subtotal: items.reduce((acc, i) => acc + i.price * i.qty, 0),
    add: (code, qty = 1) => { addToCart(code, qty); sync(); },
    setQty: (code, qty) => { updateCartQty(code, qty); sync(); },
    remove: (code) => { removeFromCart(code); sync(); },
    clear: () => { clearCart(); sync(); },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
