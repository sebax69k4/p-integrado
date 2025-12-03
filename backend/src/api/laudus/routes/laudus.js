'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/laudus/import-stock',
      handler: 'laudus.importStock',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/laudus/export-pedidos',
      handler: 'laudus.exportPedidos',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
