// Script para poblar la base de datos con datos de prueba
// Ejecutar con: node scripts/seed.js

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
    nombre: "Cinta Adhesiva Transparente 18mm x 30m",
    descripcion: "Cinta adhesiva transparente, fácil de cortar. Pack de 6 unidades.",
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

const usuarios = [
  {
    username: "empresa_demo",
    email: "empresa@demo.cl",
    password: "demo1234",
    rut: "76.123.456-7",
    razon_social: "Empresa Demo SpA",
    giro: "Venta de productos varios",
    direccion: "Av. Providencia 1234, Santiago",
    telefono: "+56912345678",
    tipo_persona: "Empresa",
    validado_por_admin: true,
    confirmed: true
  },
  {
    username: "cliente_pendiente",
    email: "pendiente@demo.cl",
    password: "demo1234",
    rut: "12.345.678-9",
    razon_social: "Juan Pérez",
    giro: "Servicios profesionales",
    direccion: "Calle Falsa 123, Ñuñoa",
    telefono: "+56987654321",
    tipo_persona: "Natural",
    validado_por_admin: false,
    confirmed: true
  }
];

console.log("=== DATOS DE PRUEBA PARA STRAPI ===\n");

console.log("📦 PRODUCTOS A CREAR:");
console.log("Total:", productos.length, "productos\n");

productos.forEach((p, i) => {
  console.log(`${i + 1}. [${p.familia}] ${p.nombre} - SKU: ${p.sku} - $${p.precio_estandar.toLocaleString('es-CL')}`);
});

console.log("\n👥 USUARIOS DE PRUEBA:");
usuarios.forEach((u, i) => {
  console.log(`${i + 1}. ${u.username} (${u.email}) - ${u.validado_por_admin ? '✅ Validado' : '⏳ Pendiente'}`);
  console.log(`   Contraseña: ${u.password}`);
});

console.log("\n=== INSTRUCCIONES ===");
console.log("1. Inicia Strapi: cd backend && npm run develop");
console.log("2. Ve al panel admin: http://localhost:1337/admin");
console.log("3. Crea los productos manualmente o usa la API");
console.log("4. Registra los usuarios desde el frontend o usa la API");
console.log("\nPara crear productos via API, usa el siguiente endpoint:");
console.log("POST http://localhost:1337/api/productos");
console.log("Headers: Authorization: Bearer <admin-jwt>");
console.log("\nBody ejemplo:");
console.log(JSON.stringify({ data: productos[0] }, null, 2));

// Exportar para uso programático
module.exports = { productos, usuarios };
