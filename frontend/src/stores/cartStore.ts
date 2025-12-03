import { atom, computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

const MINIMO_PEDIDO = 35000;
const IVA_RATE = 0.19;

export type CartItem = {
  id: string;
  nombre: string;
  sku: string;
  precio: number;
  cantidad: number;
  imagen?: string;
};

export const isCartOpen = atom(false);

export const cartItems = persistentAtom<CartItem[]>('cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const cartTotals = computed(cartItems, (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;
  const faltaParaMinimo = Math.max(0, MINIMO_PEDIDO - subtotal);
  const cumpleMinimo = subtotal >= MINIMO_PEDIDO;
  
  return { subtotal, iva, total, faltaParaMinimo, cumpleMinimo, itemCount: items.reduce((sum, item) => sum + item.cantidad, 0) };
});

export function addCartItem(item: Omit<CartItem, 'cantidad'>) {
  const currentItems = cartItems.get();
  const existingEntry = currentItems.find((i) => i.id === item.id);
  
  if (existingEntry) {
    cartItems.set(
      currentItems.map((i) => {
        if (i.id === item.id) {
          return { ...i, cantidad: i.cantidad + 1 };
        }
        return i;
      })
    );
  } else {
    cartItems.set([...currentItems, { ...item, cantidad: 1 }]);
  }
}

export function updateItemQuantity(id: string, cantidad: number) {
  if (cantidad < 1) {
    removeCartItem(id);
    return;
  }
  
  cartItems.set(
    cartItems.get().map((item) =>
      item.id === id ? { ...item, cantidad } : item
    )
  );
}

export const updateQuantity = updateItemQuantity;

export function removeCartItem(id: string) {
  cartItems.set(cartItems.get().filter((item) => item.id !== id));
}

export function clearCart() {
  cartItems.set([]);
}

export function getCartTotal(): number {
  return cartItems.get().reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}
