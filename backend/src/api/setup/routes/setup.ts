export default {
    routes: [
        {
            method: 'POST',
            path: '/setup-permissions',
            handler: 'setup.execute',
            config: {
                auth: false,
            },
        },
    ],
};
