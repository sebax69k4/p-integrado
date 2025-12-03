import type { Core } from '@strapi/strapi';

/**
 * Seed data for the database
 * Este archivo se ejecuta automáticamente cuando Strapi inicia
 * Solo crea datos si no existen
 */

const productos: Array<{
  nombre: string;
  descripcion: string;
  sku: string;
  stock: number;
  familia: 'Papeleria' | 'Quimicos' | 'Limpieza';
  precio_estandar: number;
}> = [
    // Papelería
    { nombre: "Resma Papel Carta 500 hojas", descripcion: "Papel blanco de alta calidad para impresión. 75g/m².", sku: "PAP-001", stock: 150, familia: "Papeleria", precio_estandar: 4990 },
    { nombre: "Resma Papel Oficio 500 hojas", descripcion: "Papel tamaño oficio, blanco brillante. 75g/m².", sku: "PAP-002", stock: 120, familia: "Papeleria", precio_estandar: 5490 },
    { nombre: "Cuaderno Universitario 100 hojas", descripcion: "Cuaderno con espiral, hojas cuadriculadas.", sku: "PAP-003", stock: 200, familia: "Papeleria", precio_estandar: 2990 },
    { nombre: "Caja Lápices Grafito HB x12", descripcion: "Lápices de grafito HB. Caja con 12 unidades.", sku: "PAP-004", stock: 80, familia: "Papeleria", precio_estandar: 3490 },
    { nombre: "Cinta Adhesiva Pack x6", descripcion: "Cinta adhesiva transparente 18mm x 30m. Pack de 6.", sku: "PAP-005", stock: 100, familia: "Papeleria", precio_estandar: 4290 },
    { nombre: "Archivador Oficio Lomo Ancho", descripcion: "Archivador de palanca, lomo 8cm.", sku: "PAP-006", stock: 60, familia: "Papeleria", precio_estandar: 3990 },

    // Químicos
    { nombre: "Cloro Líquido 5 Litros", descripcion: "Hipoclorito de sodio al 5%.", sku: "QUI-001", stock: 80, familia: "Quimicos", precio_estandar: 3990 },
    { nombre: "Alcohol Isopropílico 1 Litro", descripcion: "Alcohol isopropílico 70%.", sku: "QUI-002", stock: 100, familia: "Quimicos", precio_estandar: 5990 },
    { nombre: "Desinfectante Amonio Cuaternario 5L", descripcion: "Desinfectante de amplio espectro.", sku: "QUI-003", stock: 50, familia: "Quimicos", precio_estandar: 12990 },
    { nombre: "Detergente Industrial 10kg", descripcion: "Detergente en polvo concentrado.", sku: "QUI-004", stock: 40, familia: "Quimicos", precio_estandar: 18990 },
    { nombre: "Gel Antibacterial 1 Litro", descripcion: "Gel desinfectante 70% alcohol.", sku: "QUI-005", stock: 150, familia: "Quimicos", precio_estandar: 4990 },
    { nombre: "Limpiador Multiuso 5 Litros", descripcion: "Limpiador concentrado aroma lavanda.", sku: "QUI-006", stock: 70, familia: "Quimicos", precio_estandar: 7990 },

    // Limpieza
    { nombre: "Escoba Industrial", descripcion: "Escoba de cerdas duras. Mango aluminio.", sku: "LIM-001", stock: 45, familia: "Limpieza", precio_estandar: 6990 },
    { nombre: "Mopa Industrial con Balde", descripcion: "Set mopa con balde escurridor.", sku: "LIM-002", stock: 30, familia: "Limpieza", precio_estandar: 15990 },
    { nombre: "Guantes de Nitrilo Caja x100", descripcion: "Guantes desechables nitrilo. Talla M.", sku: "LIM-003", stock: 200, familia: "Limpieza", precio_estandar: 9990 },
    { nombre: "Bolsas de Basura 80x110 x100", descripcion: "Bolsas negras 100 litros.", sku: "LIM-004", stock: 90, familia: "Limpieza", precio_estandar: 8990 },
    { nombre: "Papel Higiénico Industrial x4", descripcion: "Papel jumbo 500m. Pack de 4.", sku: "LIM-005", stock: 120, familia: "Limpieza", precio_estandar: 11990 },
    { nombre: "Toalla Papel Interfoliada x250", descripcion: "Toallas para dispensador.", sku: "LIM-006", stock: 100, familia: "Limpieza", precio_estandar: 5490 },
    { nombre: "Dispensador Jabón Líquido", descripcion: "Dispensador de pared 1 litro.", sku: "LIM-007", stock: 35, familia: "Limpieza", precio_estandar: 8990 },
    { nombre: "Paño Microfibra Pack x5", descripcion: "Paños multiuso 40x40cm.", sku: "LIM-008", stock: 80, familia: "Limpieza", precio_estandar: 4990 },
  ];

export default async ({ strapi }: { strapi: Core.Strapi }) => {
  console.log('#######################################################');
  console.log('### BOOTSTRAP SEED EXECUTING ###');
  console.log('### NODE_ENV:', process.env.NODE_ENV);
  console.log('#######################################################');

  // Solo ejecutar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    console.log('### SKIPPING SEED IN PRODUCTION ###');
    return;
  }

  strapi.log.info('🌱 Verificando datos de prueba...');

  try {
    // --- CONFIGURAR PERMISOS PÚBLICOS Y AUTENTICADOS (SIEMPRE EJECUTAR) ---
    strapi.log.info('🔓 Configurando permisos públicos...');

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
      for (const permission of productPermissions) {
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
    strapi.log.info('✅ Permisos de productos asignados a Public y Authenticated');

    // --- CREAR ROL ADMIN Y USUARIO ADMIN (SIEMPRE EJECUTAR) ---
    strapi.log.info('🛡️ Verificando rol Admin...');

    let adminRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: { type: 'admin' }
    });

    if (!adminRole) {
      strapi.log.info('⚙️ Creando rol Admin...');
      adminRole = await strapi.db.query('plugin::users-permissions.role').create({
        data: {
          name: 'Admin',
          description: 'Administrador del Frontend',
          type: 'admin',
        }
      });

      // Asignar permisos al rol Admin
      const permissions = [
        // User Validation
        { action: 'api::user-validation.user-validation.approve' },
        { action: 'api::user-validation.user-validation.reject' },
        // Users Permissions
        { action: 'plugin::users-permissions.user.find' },
        { action: 'plugin::users-permissions.user.findOne' },
        { action: 'plugin::users-permissions.user.me' },
        // Productos (Lectura)
        { action: 'api::producto.producto.find' },
        { action: 'api::producto.producto.findOne' },
      ];

      for (const permission of permissions) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: {
            action: permission.action,
            role: adminRole.id,
          }
        });
      }
      strapi.log.info('✅ Rol Admin creado con permisos');
    }

    // Crear usuario Admin
    const existingAdmin = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email: 'admin@ecoformarket.cl' }
    });

    if (!existingAdmin) {
      const userService = strapi.service('plugin::users-permissions.user') as any;
      await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username: 'admin',
          email: 'admin@ecoformarket.cl',
          password: await userService.hashPassword('Admin1234!'),
          confirmed: true,
          blocked: false,
          role: adminRole.id,
          rut: '11.111.111-1',
          razon_social: 'Administrador Sistema',
          direccion: 'Oficina Central',
          telefono: '+56900000000',
          tipo_persona: 'Natural',
          validado_por_admin: true,
          estado: 'activo',
        }
      });
      strapi.log.info('✅ Usuario admin@ecoformarket.cl creado (pass: Admin1234!)');
    }

    // --- CREAR PRODUCTOS (SOLO SI NO EXISTEN) ---
    // Verificar si ya hay productos
    const existingProducts = await strapi.documents('api::producto.producto').findMany({
      limit: 1,
    });

    if (existingProducts.length > 0) {
      strapi.log.info('✅ Ya existen productos en la base de datos');
      return;
    }

    strapi.log.info('📦 Creando productos de prueba...');

    let created = 0;
    for (const producto of productos) {
      try {
        await strapi.documents('api::producto.producto').create({
          data: {
            ...producto,
            publishedAt: new Date(),
          },
        });
        created++;
      } catch (error: any) {
        strapi.log.warn(`Error creando ${producto.sku}: ${error.message}`);
      }
    }

    strapi.log.info(`✅ ${created} productos creados correctamente`);

    // Crear usuario de prueba
    strapi.log.info('👥 Creando usuario de prueba...');

    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { email: 'empresa@demo.cl' }
    });

    if (!existingUser) {
      const defaultRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' }
      });

      const userService = strapi.service('plugin::users-permissions.user') as any;

      await strapi.db.query('plugin::users-permissions.user').create({
        data: {
          username: 'empresa_demo',
          email: 'empresa@demo.cl',
          password: await userService.hashPassword('Demo1234!'),
          confirmed: true,
          blocked: false,
          role: defaultRole.id,
          rut: '76.123.456-7',
          razon_social: 'Empresa Demo SpA',
          giro: 'Venta de productos varios',
          direccion: 'Av. Providencia 1234, Santiago',
          telefono: '+56912345678',
          tipo_persona: 'Empresa',
          validado_por_admin: true,
        }
      });
      strapi.log.info('✅ Usuario empresa@demo.cl creado (validado)');
    } else {
      strapi.log.info('✅ Usuario de prueba ya existe');
    }

    strapi.log.info('🎉 Seed completado!');

  } catch (error: any) {
    strapi.log.error('Error en seed:', error.message);
  }
};
