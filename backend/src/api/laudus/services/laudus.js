'use strict';

module.exports = {
  /**
   * Importa stock desde CSV
   * @param {string} csvContent - Contenido del archivo CSV
   * @returns {Promise<{updated: number, errors: string[]}>}
   */
  async importStock(csvContent) {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const skuIndex = headers.indexOf('sku');
    const stockIndex = headers.indexOf('stock');
    
    if (skuIndex === -1 || stockIndex === -1) {
      throw new Error('El CSV debe contener las columnas: sku, stock');
    }
    
    let updated = 0;
    const errors = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const sku = values[skuIndex];
      const stock = parseInt(values[stockIndex], 10);
      
      if (!sku || isNaN(stock)) {
        errors.push(`Línea ${i + 1}: datos inválidos`);
        continue;
      }
      
      try {
        // Buscar producto por SKU
        const productos = await strapi.entityService.findMany('api::producto.producto', {
          filters: { sku: sku },
        });
        
        if (productos && productos.length > 0) {
          await strapi.entityService.update('api::producto.producto', productos[0].id, {
            data: { stock: stock }
          });
          updated++;
        } else {
          errors.push(`SKU ${sku} no encontrado`);
        }
      } catch (error) {
        errors.push(`Error actualizando ${sku}: ${error.message}`);
      }
    }
    
    return { updated, errors };
  },
  
  /**
   * Exporta pedidos a formato CSV para Laudus
   * @param {string} estado - Filtrar por estado (opcional)
   * @returns {Promise<string>}
   */
  async exportPedidos(estado) {
    const filters = {};
    if (estado) {
      filters.estado = estado;
    }
    
    const pedidos = await strapi.entityService.findMany('api::pedido.pedido', {
      filters,
      populate: ['user'],
      sort: { createdAt: 'desc' },
    });
    
    // Headers del CSV
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
    
    return rows.join('\n');
  },
  
  /**
   * Exporta items de pedidos para detalle en Laudus
   * @param {string} estado - Filtrar por estado (opcional)
   * @returns {Promise<string>}
   */
  async exportPedidosDetalle(estado) {
    const filters = {};
    if (estado) {
      filters.estado = estado;
    }
    
    const pedidos = await strapi.entityService.findMany('api::pedido.pedido', {
      filters,
      populate: ['user'],
      sort: { createdAt: 'desc' },
    });
    
    // Headers del CSV detalle
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
    
    return rows.join('\n');
  },
};
