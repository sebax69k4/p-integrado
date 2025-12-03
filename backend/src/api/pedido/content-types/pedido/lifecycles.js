'use strict';

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    
    // Crear registro inicial de historial
    await strapi.entityService.create('api::estado-pedido.estado-pedido', {
      data: {
        estado: 'Recibido',
        fecha_cambio: new Date(),
        comentario: 'Pedido creado',
        usuario_responsable: 'Sistema',
        pedido: result.id
      }
    });
    
    // Enviar email de confirmación al cliente
    try {
      // Obtener datos del usuario
      const pedidoConUsuario = await strapi.entityService.findOne('api::pedido.pedido', result.id, {
        populate: ['user']
      });
      
      if (pedidoConUsuario?.user) {
        await strapi.service('api::email.email').sendNewOrderEmail(pedidoConUsuario, pedidoConUsuario.user);
      }
    } catch (error) {
      strapi.log.error('Error enviando email de nuevo pedido:', error);
    }
  },
  
  async beforeUpdate(event) {
    const { params, state } = event;
    
    // Obtener el estado actual antes del update
    const existingPedido = await strapi.entityService.findOne('api::pedido.pedido', params.where.id, {
      populate: ['user']
    });
    state.previousEstado = existingPedido?.estado;
    state.user = existingPedido?.user;
  },
  
  async afterUpdate(event) {
    const { result, state } = event;
    
    // Si el estado cambió, crear registro de historial y enviar email
    if (state.previousEstado && result.estado !== state.previousEstado) {
      await strapi.entityService.create('api::estado-pedido.estado-pedido', {
        data: {
          estado: result.estado,
          fecha_cambio: new Date(),
          comentario: `Estado cambiado de ${state.previousEstado} a ${result.estado}`,
          usuario_responsable: 'Administrador',
          pedido: result.id
        }
      });
      
      // Enviar email de actualización de estado
      try {
        if (state.user) {
          await strapi.service('api::email.email').sendOrderStatusEmail(result, state.user, result.estado);
        }
      } catch (error) {
        strapi.log.error('Error enviando email de cambio de estado:', error);
      }
    }
  }
};
