import { useStore } from '@nanostores/react';
import { isCartOpen, cartItems } from '../../stores/cartStore';

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);

  if (!$isCartOpen) return null;

  return (
    <div class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-black bg-opacity-50" onClick={() => isCartOpen.set(false)} />
      <div class="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold">Carrito</h2>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          {$cartItems.length === 0 ? (
            <p class="text-gray-500 text-center">El carrito está vacío</p>
          ) : (
            <ul class="space-y-4">
              {$cartItems.map((item) => (
                <li key={item.id} class="flex gap-4">
                  <img src={item.image} alt={item.name} class="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 class="font-medium">{item.name}</h3>
                    <p class="text-sm text-gray-500">Cant: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div class="p-4 border-t">
          <a href="/carrito" class="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700">
            Ver Carrito
          </a>
        </div>
      </div>
    </div>
  );
}
