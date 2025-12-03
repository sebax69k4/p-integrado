import type { APIRoute } from 'astro';
import { createPedido } from '../../lib/strapi';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('jwt')?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { items, total, direccion_envio } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'El pedido debe tener productos' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!direccion_envio) {
      return new Response(JSON.stringify({ error: 'La dirección de envío es requerida' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const MIN_ORDER_AMOUNT = 35000;
    if (total < MIN_ORDER_AMOUNT) {
      return new Response(JSON.stringify({ 
        error: `El monto mínimo de pedido es $${MIN_ORDER_AMOUNT.toLocaleString('es-CL')}` 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await createPedido(token, {
      items,
      total,
      direccion_envio,
    });

    return new Response(JSON.stringify({
      success: true,
      numero_ticket: result.data?.numero_ticket || `PED-${Date.now()}`,
      pedido_id: result.data?.id,
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error creating order:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Error al crear el pedido' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
