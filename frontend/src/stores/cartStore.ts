import { atom } from 'nanostores';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export const isCartOpen = atom(false);
export const cartItems = atom<CartItem[]>([]);

export function addCartItem(item: CartItem) {
  const existingEntry = cartItems.get().find((i) => i.id === item.id);
  if (existingEntry) {
    cartItems.set(
      cartItems.get().map((i) => {
        if (i.id === item.id) {
          return { ...i, quantity: i.quantity + 1 };
        }
        return i;
      })
    );
  } else {
    cartItems.set([...cartItems.get(), item]);
  }
}
