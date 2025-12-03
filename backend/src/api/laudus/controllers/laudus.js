'use strict';

module.exports = {
  async importStock(ctx) {
    try {
      const { files } = ctx.request;
      
      if (!files || !files.file) {
        return ctx.badRequest('No se proporcionó archivo CSV');
      }
      
      const fs = require('fs');
      const csvContent = fs.readFileSync(files.file.filepath, 'utf-8');
      
      const result = await strapi.service('api::laudus.laudus').importStock(csvContent);
      
      return {
        message: 'Importación completada',
        updated: result.updated,
        errors: result.errors,
      };
    } catch (error) {
      strapi.log.error('Error en importStock:', error);
      return ctx.badRequest(error.message);
    }
  },
  
  async exportPedidos(ctx) {
    try {
      const { estado, detalle } = ctx.query;
      
      let csv;
      if (detalle === 'true') {
        csv = await strapi.service('api::laudus.laudus').exportPedidosDetalle(estado);
      } else {
        csv = await strapi.service('api::laudus.laudus').exportPedidos(estado);
      }
      
      const filename = detalle === 'true' 
        ? `pedidos_detalle_${Date.now()}.csv`
        : `pedidos_${Date.now()}.csv`;
      
      ctx.set('Content-Type', 'text/csv');
      ctx.set('Content-Disposition', `attachment; filename="${filename}"`);
      
      return csv;
    } catch (error) {
      strapi.log.error('Error en exportPedidos:', error);
      return ctx.badRequest(error.message);
    }
  },
};
