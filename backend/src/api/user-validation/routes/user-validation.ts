export default {
    routes: [
        {
            method: 'PUT',
            path: '/user-validation/:id/approve',
            handler: 'user-validation.approve',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'PUT',
            path: '/user-validation/:id/reject',
            handler: 'user-validation.reject',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
