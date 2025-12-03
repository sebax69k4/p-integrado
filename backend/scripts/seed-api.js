/**
 * Script para poblar Strapi con datos de prueba via API
 * 
 * ANTES DE EJECUTAR:
 * 1. Strapi debe estar corriendo (npm run develop)
 * 2. Debes tener un usuario admin creado
 * 3. Configura los permisos en Settings > Users & Permissions > Roles > Public:
 *    - Producto: find, findOne (para que el frontend pueda listar productos)
 * 4. Configura los permisos para Authenticated:
 *    - Pedido: create, find
 * 
 * EJECUCIÓN:
 * cd backend
 * node scripts/seed-api.js
 */

const STRAPI_URL = 'http://localhost:1337';

// Credenciales del admin (cámbialas por las tuyas)
const ADMIN_EMAIL = 'admin@ecofort.cl';
const ADMIN_PASSWORD = 'Admin123!';

const productos = [
  // Papelería
  {
    nombre: "Resma Papel Carta 500 hojas",
    descripcion: "Papel blanco de alta calidad para impresión. 75g/m². Ideal para uso en oficinas y empresas.",
    sku: "PAP-001",
    stock: 150,
    familia: "Papeleria",
    precio_estandar: 4990
  },
  {
    nombre: "Resma Papel Oficio 500 hojas",
    descripcion: "Papel tamaño oficio, blanco brillante. 75g/m². Perfecto para documentos legales.",
    sku: "PAP-002",
    stock: 120,
    familia: "Papeleria",
    precio_estandar: 5490
  },
  {
    nombre: "Cuaderno Universitario 100 hojas",
    descripcion: "Cuaderno con espiral, hojas cuadriculadas. Tapa dura resistente.",
    sku: "PAP-003",
    stock: 200,
    familia: "Papeleria",
    precio_estandar: 2990
  },
  {
    nombre: "Caja Lápices Grafito HB x12",
    descripcion: "Lápices de grafito HB de alta calidad. Caja con 12 unidades.",
    sku: "PAP-004",
    stock: 80,
    familia: "Papeleria",
    precio_estandar: 3490
  },
  {
    nombre: "Cinta Adhesiva Transparente Pack x6",
    descripcion: "Cinta adhesiva transparente, fácil de cortar. Pack de 6 unidades 18mm x 30m.",
    sku: "PAP-005",
    stock: 100,
    familia: "Papeleria",
    precio_estandar: 4290
  },
  {
    nombre: "Archivador Oficio Lomo Ancho",
    descripcion: "Archivador de palanca, lomo 8cm. Colores variados.",
    sku: "PAP-006",
    stock: 60,
    familia: "Papeleria",
    precio_estandar: 3990
  },

  // Químicos
  {
    nombre: "Cloro Líquido 5 Litros",
    descripcion: "Hipoclorito de sodio al 5%. Ideal para desinfección de superficies y agua.",
    sku: "QUI-001",
    stock: 80,
    familia: "Quimicos",
    precio_estandar: 3990
  },
  {
    nombre: "Alcohol Isopropílico 1 Litro",
    descripcion: "Alcohol isopropílico 70%. Para desinfección y limpieza de equipos electrónicos.",
    sku: "QUI-002",
    stock: 100,
    familia: "Quimicos",
    precio_estandar: 5990
  },
  {
    nombre: "Desinfectante Amonio Cuaternario 5L",
    descripcion: "Desinfectante de amplio espectro. Elimina el 99.9% de bacterias y virus.",
    sku: "QUI-003",
    stock: 50,
    familia: "Quimicos",
    precio_estandar: 12990
  },
  {
    nombre: "Detergente Industrial 10kg",
    descripcion: "Detergente en polvo concentrado para uso industrial. Alto rendimiento.",
    sku: "QUI-004",
    stock: 40,
    familia: "Quimicos",
    precio_estandar: 18990
  },
  {
    nombre: "Gel Antibacterial 1 Litro",
    descripcion: "Gel desinfectante para manos con 70% de alcohol. Con glicerina hidratante.",
    sku: "QUI-005",
    stock: 150,
    familia: "Quimicos",
    precio_estandar: 4990
  },
  {
    nombre: "Limpiador Multiuso 5 Litros",
    descripcion: "Limpiador concentrado para todo tipo de superficies. Aroma lavanda.",
    sku: "QUI-006",
    stock: 70,
    familia: "Quimicos",
    precio_estandar: 7990
  },

  // Limpieza
  {
    nombre: "Escoba Industrial",
    descripcion: "Escoba de cerdas duras para pisos industriales. Mango de aluminio.",
    sku: "LIM-001",
    stock: 45,
    familia: "Limpieza",
    precio_estandar: 6990
  },
  {
    nombre: "Mopa Industrial con Balde",
    descripcion: "Set de mopa con balde escurridor. Sistema de centrifugado.",
    sku: "LIM-002",
    stock: 30,
    familia: "Limpieza",
    precio_estandar: 15990
  },
  {
    nombre: "Guantes de Nitrilo Caja x100",
    descripcion: "Guantes desechables de nitrilo. Sin polvo. Talla M.",
    sku: "LIM-003",
    stock: 200,
    familia: "Limpieza",
    precio_estandar: 9990
  },
  {
    nombre: "Bolsas de Basura 80x110 x100 unidades",
    descripcion: "Bolsas negras resistentes para basura. Capacidad 100 litros.",
    sku: "LIM-004",
    stock: 90,
    familia: "Limpieza",
    precio_estandar: 8990
  },
  {
    nombre: "Papel Higiénico Industrial x4 rollos",
    descripcion: "Papel higiénico jumbo de 500 metros. Pack de 4 rollos.",
    sku: "LIM-005",
    stock: 120,
    familia: "Limpieza",
    precio_estandar: 11990
  },
  {
    nombre: "Toalla de Papel Interfoliada x250",
    descripcion: "Toallas de papel para dispensador. Alta absorción. Pack x250.",
    sku: "LIM-006",
    stock: 100,
    familia: "Limpieza",
    precio_estandar: 5490
  },
  {
    nombre: "Dispensador Jabón Líquido",
    descripcion: "Dispensador de pared para jabón líquido. Capacidad 1 litro.",
    sku: "LIM-007",
    stock: 35,
    familia: "Limpieza",
    precio_estandar: 8990
  },
  {
    nombre: "Paño Microfibra Pack x5",
    descripcion: "Paños de microfibra multiuso. Colores surtidos. 40x40cm.",
    sku: "LIM-008",
    stock: 80,
    familia: "Limpieza",
    precio_estandar: 4990
  }
];

async function getAdminToken() {
  console.log('🔑 Obteniendo token de admin...');
  
  const response = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    })
  });

  if (!response.ok) {
    throw new Error(`Error al obtener token admin: ${response.status}`);
  }

  const data = await response.json();
  return data.data.token;
}

async function createProduct(token, producto) {
  const response = await fetch(`${STRAPI_URL}/api/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ data: producto })
  });

  const data = await response.json();
  
  if (!response.ok) {
    // Si es error de SKU duplicado, ignorar
    if (data.error?.message?.includes('unique')) {
      console.log(`  ⏭️  SKU ${producto.sku} ya existe, saltando...`);
      return null;
    }
    throw new Error(`Error creando producto: ${JSON.stringify(data.error)}`);
  }

  return data;
}

async function publishProduct(token, documentId) {
  const response = await fetch(`${STRAPI_URL}/api/productos/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      data: {
        publishedAt: new Date().toISOString()
      }
    })
  });

  return response.ok;
}

async function seedProducts() {
  console.log('\n📦 INICIANDO SEED DE PRODUCTOS\n');
  
  let token;
  try {
    token = await getAdminToken();
    console.log('✅ Token obtenido correctamente\n');
  } catch (error) {
    console.error('❌ Error obteniendo token:', error.message);
    console.log('\n⚠️  Asegúrate de:');
    console.log('   1. Strapi esté corriendo (npm run develop)');
    console.log('   2. Tengas un usuario admin creado');
    console.log('   3. Las credenciales en este script sean correctas\n');
    return;
  }

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const producto of productos) {
    try {
      process.stdout.write(`Creando: ${producto.nombre}...`);
      const result = await createProduct(token, producto);
      
      if (result) {
        // Publicar el producto
        if (result.data?.documentId) {
          await publishProduct(token, result.data.documentId);
        }
        console.log(' ✅');
        created++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.log(` ❌ ${error.message}`);
      errors++;
    }
  }

  console.log('\n========== RESUMEN ==========');
  console.log(`✅ Productos creados: ${created}`);
  console.log(`⏭️  Productos saltados: ${skipped}`);
  console.log(`❌ Errores: ${errors}`);
  console.log('============================\n');
}

async function createTestUser() {
  console.log('\n👥 CREANDO USUARIO DE PRUEBA\n');
  
  const testUser = {
    username: "empresa_demo",
    email: "empresa@demo.cl",
    password: "Demo1234!",
    rut: "76.123.456-7",
    razon_social: "Empresa Demo SpA",
    giro: "Venta de productos varios",
    direccion: "Av. Providencia 1234, Santiago",
    telefono: "+56912345678",
    tipo_persona: "Empresa",
    validado_por_admin: true
  };

  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (data.error?.message?.includes('already')) {
        console.log('⏭️  Usuario de prueba ya existe');
        console.log(`   Email: ${testUser.email}`);
        console.log(`   Contraseña: ${testUser.password}`);
      } else {
        throw new Error(data.error?.message || 'Error desconocido');
      }
    } else {
      console.log('✅ Usuario de prueba creado:');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Contraseña: ${testUser.password}`);
      console.log('\n⚠️  IMPORTANTE: Debes marcar "validado_por_admin" como TRUE');
      console.log('   en el panel de Strapi para que pueda comprar.');
    }
  } catch (error) {
    console.log(`❌ Error creando usuario: ${error.message}`);
  }
}

async function main() {
  console.log('🌱 SEED DE DATOS DE PRUEBA - ECOFORT\n');
  console.log('=====================================\n');
  
  await seedProducts();
  await createTestUser();
  
  console.log('\n✨ PROCESO COMPLETADO\n');
  console.log('Próximos pasos:');
  console.log('1. Ve a http://localhost:1337/admin');
  console.log('2. En Settings > Users & Permissions > Roles > Public:');
  console.log('   - Habilita find y findOne en Producto');
  console.log('3. En Settings > Users & Permissions > Roles > Authenticated:');
  console.log('   - Habilita create y find en Pedido');
  console.log('4. Marca el usuario empresa@demo.cl como validado_por_admin = true');
  console.log('5. Prueba el frontend en http://localhost:4321\n');
}

main().catch(console.error);
