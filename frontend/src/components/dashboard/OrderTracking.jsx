import { useState, useEffect } from 'react';

const ESTADOS = ['Recibido', 'En preparacion', 'Facturado', 'Despachado'];

const ESTADO_ICONS = {
  'Recibido': '📋',
  'En preparacion': '📦',
  'Facturado': '🧾',
  'Despachado': '🚚'
};

export default function OrderTracking({ pedido }) {
  const estadoActual = pedido?.estado || 'Recibido';
  const currentIndex = ESTADOS.indexOf(estadoActual);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-6">Estado del pedido #{pedido?.numero_ticket}</h3>
      
      {/* Timeline de estados */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          {ESTADOS.map((estado, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={estado} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                    ${isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                    }
                    ${isCurrent ? 'ring-4 ring-green-200' : ''}
                  `}
                >
                  {ESTADO_ICONS[estado]}
                </div>
                <span className={`mt-2 text-xs text-center ${isCompleted ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                  {estado}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Línea de progreso */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (ESTADOS.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Historial de estados */}
      {pedido?.historial_estados && pedido.historial_estados.length > 0 && (
        <div className="mt-8">
          <h4 className="font-medium mb-4">Historial de cambios</h4>
          <div className="space-y-3">
            {pedido.historial_estados
              .sort((a, b) => new Date(b.fecha_cambio) - new Date(a.fecha_cambio))
              .map((historial, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                  <div>
                    <p className="font-medium">{historial.estado}</p>
                    <p className="text-gray-500">{formatDate(historial.fecha_cambio)}</p>
                    {historial.comentario && (
                      <p className="text-gray-600 text-xs">{historial.comentario}</p>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
