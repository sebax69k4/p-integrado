import type { APIRoute } from 'astro';
import { actualizarEstadoPedido } from '../../../lib/strapi';

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
    const { pedidoId, estado } = body;

    if (!pedidoId || !estado) {
      return new Response(JSON.stringify({ error: 'ID de pedido y estado requeridos' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const estadosValidos = ['Recibido', 'En preparacion', 'Facturado', 'Despachado'];
    if (!estadosValidos.includes(estado)) {
      return new Response(JSON.stringify({ error: 'Estado no válido' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await actualizarEstadoPedido(token, pedidoId, estado);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error actualizando estado:', error);
    return new Response(JSON.stringify({ error: error.message || 'Error interno' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
