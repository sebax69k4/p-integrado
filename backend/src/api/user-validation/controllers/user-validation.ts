/**
 * A set of functions called "actions" for `user-validation`
 */

export default {
  async approve(ctx) {
    const { id } = ctx.params;
    const { lista_precios } = ctx.request.body;

    if (!lista_precios) {
      return ctx.badRequest('lista_precios is required');
    }

    try {
      const user = await strapi.entityService.update('plugin::users-permissions.user', id, {
        data: {
          estado: 'activo',
          lista_precios,
        },
      });
      return user;
    } catch (err) {
      ctx.body = err;
    }
  },

  async reject(ctx) {
    const { id } = ctx.params;

    try {
      const user = await strapi.entityService.update('plugin::users-permissions.user', id, {
        data: {
          estado: 'rechazado',
        },
      });
      return user;
    } catch (err) {
      ctx.body = err;
    }
  },
};
