import { useStore } from '@nanostores/react';
import { isCartOpen, cartItems } from '../../stores/cartStore';
import { formatCurrency } from '../../lib/utils';

const IVA_RATE = 0.19;

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);

  if (!$isCartOpen) return null;

  const neto = $cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const iva = Math.round(neto * IVA_RATE);
  const total = neto + iva;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => isCartOpen.set(false)} />
      <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Carrito ({$cartItems.length})</h2>
          <button 
            onClick={() => isCartOpen.set(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {$cartItems.length === 0 ? (
            <p className="text-gray-500 text-center">El carrito está vacío</p>
          ) : (
            <ul className="space-y-4">
              {$cartItems.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <img 
                    src={item.imagen || '/placeholder.svg'} 
                    alt={item.nombre} 
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => { e.target.src = '/placeholder.svg'; }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.nombre}</h3>
                    <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                    <p className="text-sm text-gray-600">Cant: {item.cantidad}</p>
                    <p className="text-sm font-semibold text-blue-600">{formatCurrency(item.precio * item.cantidad)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t">
          <div className="space-y-1 text-sm mb-3">
            <div className="flex justify-between text-gray-600">
              <span>Neto:</span>
              <span>{formatCurrency(neto)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>IVA (19%):</span>
              <span>{formatCurrency(iva)}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t">
              <span>Total:</span>
              <span className="text-blue-600">{formatCurrency(total)}</span>
            </div>
          </div>
          <a 
            href="/carrito" 
            className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors"
            onClick={() => isCartOpen.set(false)}
          >
            Ver Carrito
          </a>
        </div>
      </div>
    </div>
  );
}
