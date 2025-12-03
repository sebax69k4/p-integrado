'use strict';

module.exports = {
  async afterUpdate(event) {
    const { result, params } = event;
    
    // Verificar si se actualizó el campo validado_por_admin
    if (params.data && params.data.validado_por_admin === true) {
      // Verificar que el usuario tiene email
      if (result.email) {
        try {
          await strapi.service('api::email.email').sendUserValidatedEmail(result);
        } catch (error) {
          strapi.log.error('Error en lifecycle de usuario:', error);
        }
      }
    }
  },
};
