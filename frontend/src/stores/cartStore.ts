import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export const isCartOpen = atom(false);

export const cartItems = persistentAtom<CartItem[]>('cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addCartItem(item: CartItem) {
  const currentItems = cartItems.get();
  const existingEntry = currentItems.find((i) => i.id === item.id);
  
  if (existingEntry) {
    cartItems.set(
      currentItems.map((i) => {
        if (i.id === item.id) {
          return { ...i, quantity: i.quantity + 1 };
        }
        return i;
      })
    );
  } else {
    cartItems.set([...currentItems, item]);
  }
}
