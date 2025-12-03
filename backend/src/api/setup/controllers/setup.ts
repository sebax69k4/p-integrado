import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::producto.producto', () => ({
    async execute(ctx) {
        try {
            const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
                where: { type: 'public' }
            });

            const authenticatedRole = await strapi.db.query('plugin::users-permissions.role').findOne({
                where: { type: 'authenticated' }
            });

            const productPermissions = [
                { action: 'api::producto.producto.find' },
                { action: 'api::producto.producto.findOne' },
            ];

            // Asignar permisos a Public
            if (publicRole) {
                for (const permission of productPermissions) {
                    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
                        where: { action: permission.action, role: publicRole.id }
                    });
                    if (!existing) {
                        await strapi.db.query('plugin::users-permissions.permission').create({
                            data: { action: permission.action, role: publicRole.id }
                        });
                    }
                }
            }

            // Asignar permisos a Authenticated
            if (authenticatedRole) {
                const authenticatedPermissions = [
                    ...productPermissions,
                    { action: 'api::pedido.pedido.create' },
                    { action: 'api::pedido.pedido.find' },
                    { action: 'api::pedido.pedido.findOne' },
                ];

                for (const permission of authenticatedPermissions) {
                    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
                        where: { action: permission.action, role: authenticatedRole.id }
                    });
                    if (!existing) {
                        await strapi.db.query('plugin::users-permissions.permission').create({
                            data: { action: permission.action, role: authenticatedRole.id }
                        });
                    }
                }
            }

            ctx.body = { success: true, message: 'Permissions set successfully' };
        } catch (error: any) {
            ctx.body = { success: false, error: error.message };
        }
    },
}));
