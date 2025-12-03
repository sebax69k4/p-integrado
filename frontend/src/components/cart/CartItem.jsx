import { cartItems } from '../../stores/cartStore';
import { formatCurrency } from '../../lib/utils';

export default function CartItem({ item }) {
  const updateQuantity = (newQuantity) => {
    if (newQuantity < 1) {
      // Remove item
      cartItems.set(cartItems.get().filter((i) => i.id !== item.id));
    } else {
      // Update quantity
      cartItems.set(
        cartItems.get().map((i) => 
          i.id === item.id ? { ...i, quantity: newQuantity } : i
        )
      );
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-b-0">
      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        <p className="text-blue-600 font-bold">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded-md">
          <button 
            onClick={() => updateQuantity(item.quantity - 1)}
            className="px-3 py-1 hover:bg-gray-100 text-gray-600"
          >
            -
          </button>
          <span className="px-2 min-w-[2rem] text-center font-medium">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.quantity + 1)}
            className="px-3 py-1 hover:bg-gray-100 text-gray-600"
          >
            +
          </button>
        </div>
        <button 
          onClick={() => updateQuantity(0)}
          className="text-red-500 hover:text-red-700 text-sm underline ml-2"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
