
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::producto.producto', ({ strapi }) => ({
    async find(ctx) {
        const { data, meta } = await super.find(ctx);
        const user = ctx.state.user;

        if (!user) {
            const sanitizedData = data.map((item: any) => {
                const { precio_estandar, precio_empresa, ...rest } = item;
                return rest;
            });
            return { data: sanitizedData, meta };
        }

        return { data, meta };
    },

    async findOne(ctx) {
        const { data, meta } = await super.findOne(ctx);
        const user = ctx.state.user;

        if (!user && data) {
            const { precio_estandar, precio_empresa, ...rest } = data;
            return { data: rest, meta };
        }

        return { data, meta };
    },
}));
