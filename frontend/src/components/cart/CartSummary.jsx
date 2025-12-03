import { useStore } from '@nanostores/react';
import { cartTotals } from '../../stores/cartStore';

export default function CartSummary() {
  const totals = useStore(cartTotals);
  
  const formatCLP = (value) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Resumen del pedido</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCLP(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>IVA (19%):</span>
          <span>{formatCLP(totals.iva)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span>{formatCLP(totals.total)}</span>
        </div>
      </div>
      
      {!totals.cumpleMinimo && (
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg text-yellow-800 text-sm">
          <p className="font-semibold">Pedido mínimo: {formatCLP(35000)}</p>
          <p>Te faltan {formatCLP(totals.faltaParaMinimo)} para realizar tu pedido</p>
        </div>
      )}
      
      {totals.cumpleMinimo && (
        <div className="mt-4 p-3 bg-green-100 rounded-lg text-green-800 text-sm">
          <p className="font-semibold">¡Pedido listo!</p>
          <p>Cumples con el mínimo de compra</p>
        </div>
      )}
    </div>
  );
}
