import type { APIRoute } from 'astro';
import { validarUsuario, rechazarUsuario } from '../../../lib/strapi';

export const POST: APIRoute = async ({ request, cookies }) => {
    const token = cookies.get('jwt')?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
    }

    try {
        const data = await request.json();
        const { userId, action, lista_precios } = data;

        if (!userId || !action) {
            return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), { status: 400 });
        }

        if (action === 'approve') {
            if (!lista_precios) {
                return new Response(JSON.stringify({ error: 'Lista de precios requerida para aprobar' }), { status: 400 });
            }
            await validarUsuario(token, userId, lista_precios);
            return new Response(JSON.stringify({ success: true, message: 'Usuario aprobado' }), { status: 200 });
        } else if (action === 'reject') {
            await rechazarUsuario(token, userId);
            return new Response(JSON.stringify({ success: true, message: 'Usuario rechazado' }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: 'Acción inválida' }), { status: 400 });
        }

    } catch (error: any) {
        console.error('Error validating user:', error);
        return new Response(JSON.stringify({ error: error.message || 'Error interno' }), { status: 500 });
    }
};
