'use strict';

/**
 * Helper para verificar si el servicio de email está disponible
 */
function isEmailConfigured() {
  return strapi.plugins?.email?.services?.email?.send;
}

module.exports = {
  /**
   * Envía email de bienvenida a usuario validado
   */
  async sendUserValidatedEmail(user) {
    if (!isEmailConfigured()) {
      strapi.log.warn('Email no configurado - saltando envío de email de validación');
      return;
    }
    
    try {
      await strapi.plugins['email'].services.email.send({
        to: user.email,
        subject: '¡Tu cuenta ha sido validada! - EcoFor Market',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">¡Bienvenido a EcoFor Market!</h1>
            <p>Hola <strong>${user.nombre_empresa || user.username}</strong>,</p>
            <p>Tu cuenta ha sido validada exitosamente. Ahora puedes realizar compras en nuestra plataforma.</p>
            <p>Como cliente validado, tienes acceso a:</p>
            <ul>
              <li>Catálogo completo de productos</li>
              <li>Precios especiales B2B</li>
              <li>Historial de pedidos</li>
              <li>Seguimiento de envíos</li>
            </ul>
            <p style="margin-top: 20px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:4321'}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Ir a la tienda
              </a>
            </p>
            <p style="margin-top: 30px; color: #666;">
              Saludos,<br>
              El equipo de EcoFor Market
            </p>
          </div>
        `,
      });
      strapi.log.info(`Email de validación enviado a ${user.email}`);
    } catch (error) {
      strapi.log.error(`Error enviando email a ${user.email}:`, error);
    }
  },

  /**
   * Envía email de nuevo pedido al cliente
   */
  async sendNewOrderEmail(pedido, user) {
    if (!isEmailConfigured()) {
      strapi.log.warn('Email no configurado - saltando envío de email de nuevo pedido');
      return;
    }
    
    try {
      const itemsHtml = (pedido.items || []).map(item => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.nombre}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.cantidad}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.subtotal || item.cantidad * item.precio).toLocaleString('es-CL')}</td>
        </tr>
      `).join('');

      await strapi.plugins['email'].services.email.send({
        to: user.email,
        subject: `Pedido ${pedido.numero_ticket} recibido - EcoFor Market`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">¡Gracias por tu pedido!</h1>
            <p>Hola <strong>${user.nombre_empresa || user.username}</strong>,</p>
            <p>Hemos recibido tu pedido correctamente.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Número de ticket:</strong> ${pedido.numero_ticket}</p>
              <p style="margin: 10px 0 0;"><strong>Fecha:</strong> ${new Date(pedido.fecha_pedido || pedido.createdAt).toLocaleDateString('es-CL')}</p>
            </div>
            
            <h3>Detalle del pedido:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 8px; text-align: left;">Producto</th>
                  <th style="padding: 8px; text-align: center;">Cantidad</th>
                  <th style="padding: 8px; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 8px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 8px; text-align: right;"><strong>$${pedido.total.toLocaleString('es-CL')}</strong></td>
                </tr>
              </tfoot>
            </table>
            
            <p><strong>Dirección de envío:</strong> ${pedido.direccion_envio}</p>
            
            <p style="margin-top: 20px; color: #666;">
              Te notificaremos cuando tu pedido cambie de estado.
            </p>
            
            <p style="margin-top: 30px; color: #666;">
              Saludos,<br>
              El equipo de EcoFor Market
            </p>
          </div>
        `,
      });
      strapi.log.info(`Email de nuevo pedido enviado a ${user.email}`);
    } catch (error) {
      strapi.log.error(`Error enviando email de pedido a ${user.email}:`, error);
    }
  },

  /**
   * Envía email cuando cambia el estado del pedido
   */
  async sendOrderStatusEmail(pedido, user, nuevoEstado) {
    if (!isEmailConfigured()) {
      strapi.log.warn('Email no configurado - saltando envío de email de estado');
      return;
    }
    
    const estadoMessages = {
      'En preparacion': 'Tu pedido está siendo preparado.',
      'Facturado': 'Tu pedido ha sido facturado y está listo para despacho.',
      'Despachado': '¡Tu pedido ha sido despachado! Pronto llegará a tu dirección.',
    };

    try {
      await strapi.plugins['email'].services.email.send({
        to: user.email,
        subject: `Actualización de pedido ${pedido.numero_ticket} - EcoFor Market`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Actualización de tu pedido</h1>
            <p>Hola <strong>${user.nombre_empresa || user.username}</strong>,</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Pedido:</strong> ${pedido.numero_ticket}</p>
              <p style="margin: 10px 0 0;"><strong>Nuevo estado:</strong> 
                <span style="color: #059669; font-weight: bold;">${nuevoEstado}</span>
              </p>
            </div>
            
            <p>${estadoMessages[nuevoEstado] || 'El estado de tu pedido ha cambiado.'}</p>
            
            <p style="margin-top: 20px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:4321'}/dashboard" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Ver mis pedidos
              </a>
            </p>
            
            <p style="margin-top: 30px; color: #666;">
              Saludos,<br>
              El equipo de EcoFor Market
            </p>
          </div>
        `,
      });
      strapi.log.info(`Email de estado de pedido enviado a ${user.email}`);
    } catch (error) {
      strapi.log.error(`Error enviando email de estado a ${user.email}:`, error);
    }
  },
};
