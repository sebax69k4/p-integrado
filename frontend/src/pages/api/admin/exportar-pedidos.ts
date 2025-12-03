import type { APIRoute } from 'astro';
import { getAllPedidos } from '../../../lib/strapi';

export const GET: APIRoute = async ({ url, cookies }) => {
  const token = cookies.get('jwt')?.value;

  if (!token) {
    return new Response('No autorizado', { status: 401 });
  }

  try {
    const estado = url.searchParams.get('estado');
    const detalle = url.searchParams.get('detalle') === 'true';
    
    // Obtener todos los pedidos
    let pedidos = await getAllPedidos(token);
    
    // Filtrar por estado si se especificó
    if (estado) {
      pedidos = pedidos.filter((p: any) => p.estado === estado);
    }
    
    let csv: string;
    let filename: string;
    
    if (detalle) {
      // CSV con detalle de items
      const headers = ['ticket', 'sku', 'producto', 'cantidad', 'precio_unitario', 'subtotal'];
      const rows = [headers.join(',')];
      
      for (const pedido of pedidos) {
        const items = pedido.items || [];
        for (const item of items) {
          const row = [
            pedido.numero_ticket || '',
            item.sku || '',
            (item.nombre || '').replace(/,/g, ';'),
            item.cantidad || 0,
            item.precio_unitario || item.precio || 0,
            item.subtotal || (item.cantidad * (item.precio_unitario || item.precio)) || 0,
          ];
          rows.push(row.join(','));
        }
      }
      
      csv = rows.join('\n');
      filename = `pedidos_detalle_${Date.now()}.csv`;
    } else {
      // CSV resumen
      const headers = ['ticket', 'cliente', 'rut', 'email', 'direccion', 'total', 'estado', 'fecha'];
      const rows = [headers.join(',')];
      
      for (const pedido of pedidos) {
        const row = [
          pedido.numero_ticket || '',
          (pedido.user?.nombre_empresa || pedido.user?.username || '').replace(/,/g, ';'),
          pedido.user?.rut || '',
          pedido.user?.email || '',
          (pedido.direccion_envio || '').replace(/,/g, ';'),
          pedido.total || 0,
          pedido.estado || '',
          pedido.fecha_pedido ? new Date(pedido.fecha_pedido).toISOString().split('T')[0] : '',
        ];
        rows.push(row.join(','));
      }
      
      csv = rows.join('\n');
      filename = `pedidos_${Date.now()}.csv`;
    }
    
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      }
    });
  } catch (error: any) {
    console.error('Error exportando pedidos:', error);
    return new Response('Error interno', { status: 500 });
  }
};
