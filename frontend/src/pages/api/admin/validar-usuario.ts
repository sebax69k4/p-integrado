import type { APIRoute } from 'astro';
import { validarUsuario } from '../../../lib/strapi';

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
    const { userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'ID de usuario requerido' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await validarUsuario(token, userId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error validando usuario:', error);
    return new Response(JSON.stringify({ error: error.message || 'Error interno' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
