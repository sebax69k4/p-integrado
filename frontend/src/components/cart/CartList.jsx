import { useStore } from '@nanostores/react';
import { cartItems } from '../../stores/cartStore';
import CartItem from './CartItem';

export default function CartList() {
  const $cartItems = useStore(cartItems);

  if ($cartItems.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <p className="text-gray-500 mb-4">Tu carrito está vacío.</p>
        <a href="/" className="text-blue-600 hover:underline font-medium">
          Volver al catálogo
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        {$cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
