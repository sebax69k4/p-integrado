import utils from '@strapi/utils';
const { ApplicationError, ValidationError } = utils.errors;

const sanitizeUser = async (user: any, ctx: any) => {
    // En Strapi v5, devolvemos el usuario sin campos sensibles
    const { password, resetPasswordToken, confirmationToken, ...sanitizedUser } = user;
    return sanitizedUser;
};

// Simple email validation regex
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default (plugin) => {
    console.log('#######################################################');
    console.log('### CUSTOM USERS-PERMISSIONS EXTENSION LOADED (TS) ###');
    console.log('#######################################################');

    // Save original controller
    const originalRegister = plugin.controllers.auth.register;

    plugin.controllers.auth.register = async (ctx) => {
        console.log('### CUSTOM REGISTER CONTROLLER EXECUTED ###');
        console.log('Request Body:', JSON.stringify(ctx.request.body, null, 2));

        const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
        const settings: any = await pluginStore.get({ key: 'advanced' });

        if (!settings.allow_register) {
            throw new ApplicationError('Register action is currently disabled');
        }

        const params = {
            ...ctx.request.body,
            provider: 'local',
        };

        // Manual validation to replace validateRegisterBody
        if (!params.email) {
            throw new ValidationError('Email is required');
        }
        if (!params.username) {
            throw new ValidationError('Username is required');
        }
        if (!params.password) {
            throw new ValidationError('Password is required');
        }

        // Validate email format
        if (!emailRegExp.test(params.email)) {
            throw new ValidationError('Please provide a valid email address');
        }

        const role = await strapi
            .query('plugin::users-permissions.role')
            .findOne({ where: { type: settings.default_role } });

        if (!role) {
            throw new ApplicationError('Impossible to find the default role');
        }

        const { email, username, provider } = params;

        const identifierFilter = {
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() },
            ],
        };

        const conflictingUserCount = await strapi.db.query('plugin::users-permissions.user').count({
            where: { ...identifierFilter, provider },
        });

        if (conflictingUserCount > 0) {
            throw new ApplicationError('Email or Username are already taken');
        }

        if (settings.unique_email) {
            const conflictingUserCount = await strapi.db.query('plugin::users-permissions.user').count({
                where: { email: email.toLowerCase() },
            });

            if (conflictingUserCount > 0) {
                throw new ApplicationError('Email is already taken');
            }
        }

        const newUser = {
            ...params,
            role: role.id,
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            confirmed: !settings.email_confirmation,
            validado_por_admin: false,
            estado: 'pendiente',
        };

        const user = await strapi.plugin('users-permissions').service('user').add(newUser);
        const sanitizedUser = await sanitizeUser(user, ctx);

        if (settings.email_confirmation) {
            try {
                await strapi.plugin('users-permissions').service('user').sendConfirmationEmail(sanitizedUser);
            } catch (err) {
                throw new ApplicationError(err.message);
            }
            return ctx.send({ user: sanitizedUser });
        }

        const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: user.id });

        return ctx.send({
            jwt,
            user: sanitizedUser,
        });
    };

    return plugin;
};
