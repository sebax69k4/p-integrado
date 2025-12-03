import { updateItemQuantity, removeCartItem } from '../../stores/cartStore';
import { formatCurrency } from '../../lib/utils';

export default function CartItem({ item }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-b-0">
      <img 
        src={item.imagen || '/placeholder.svg'} 
        alt={item.nombre} 
        className="w-20 h-20 object-cover rounded"
        onError={(e) => { e.target.src = '/placeholder.svg'; }}
      />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.nombre}</h3>
        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
        <p className="text-blue-600 font-bold">{formatCurrency(item.precio)}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded-md">
          <button 
            onClick={() => updateItemQuantity(item.id, item.cantidad - 1)}
            className="px-3 py-1 hover:bg-gray-100 text-gray-600"
          >
            -
          </button>
          <span className="px-2 min-w-[2rem] text-center font-medium">{item.cantidad}</span>
          <button 
            onClick={() => updateItemQuantity(item.id, item.cantidad + 1)}
            className="px-3 py-1 hover:bg-gray-100 text-gray-600"
          >
            +
          </button>
        </div>
        <button 
          onClick={() => removeCartItem(item.id)}
          className="text-red-500 hover:text-red-700 text-sm underline ml-2"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
