import { formatCurrency } from '../../lib/utils';

export default function CartItem({ item }) {
  return (
    <div class="flex items-center gap-4 py-4 border-b">
      <img src={item.image} alt={item.name} class="w-20 h-20 object-cover rounded" />
      <div class="flex-1">
        <h3 class="font-medium">{item.name}</h3>
        <p class="text-blue-600 font-bold">{formatCurrency(item.price)}</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-2 py-1 border rounded">-</button>
        <span>{item.quantity}</span>
        <button class="px-2 py-1 border rounded">+</button>
      </div>
    </div>
  );
}
