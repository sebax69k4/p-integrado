# 📘 Manual de Usuario - EcoFor Market

Sistema B2B de comercio electrónico para productos de limpieza, químicos, papelería y EPP.

---

## 📑 Índice

1. [Acceso al Sistema](#1-acceso-al-sistema)
2. [Registro de Cuenta](#2-registro-de-cuenta)
3. [Navegación del Catálogo](#3-navegación-del-catálogo)
4. [Carrito de Compras](#4-carrito-de-compras)
5. [Realizar un Pedido](#5-realizar-un-pedido)
6. [Mi Cuenta - Dashboard](#6-mi-cuenta---dashboard)
7. [Panel de Administración](#7-panel-de-administración)
8. [Integración Laudus](#8-integración-laudus)

---

## 1. Acceso al Sistema

### 1.1 URLs del Sistema

| Componente | URL |
|------------|-----|
| Tienda (Frontend) | http://localhost:4321 |
| Admin Strapi (Backend) | http://localhost:1337/admin |

### 1.2 Iniciar Sesión

1. Ir a la página de **Login** (`/login`)
2. Ingresar su **email** y **contraseña**
3. Hacer clic en **"Iniciar Sesión"**

> ⚠️ **Nota**: Su cuenta debe estar validada por un administrador para poder realizar compras.

---

## 2. Registro de Cuenta

### 2.1 Crear una Nueva Cuenta

1. Ir a la página de **Registro** (`/registro`)
2. Completar el formulario con:
   - **Nombre de Empresa** (obligatorio)
   - **RUT de Empresa** (obligatorio)
   - **Email corporativo** (obligatorio)
   - **Contraseña** (mínimo 6 caracteres)
   - **Dirección comercial**

3. Hacer clic en **"Crear Cuenta"**

### 2.2 Estado Pendiente de Validación

Después de registrarse, su cuenta quedará en estado **"Pendiente de Validación"**.

- Será redirigido a una página de espera (`/pendiente`)
- Un administrador revisará y validará su cuenta
- Recibirá un **email de confirmación** cuando sea aprobado
- Una vez validado, podrá acceder al catálogo completo y realizar compras

---

## 3. Navegación del Catálogo

### 3.1 Página Principal

La página principal muestra todos los productos disponibles organizados por familias:

| Familia | Descripción |
|---------|-------------|
| 🧴 **Químicos** | Productos químicos de limpieza industrial |
| 🧹 **Limpieza** | Artículos y equipos de limpieza |
| 📄 **Papelería** | Suministros de oficina y papelería |
| 🦺 **EPP** | Equipos de Protección Personal |

### 3.2 Filtrar Productos

1. Use los **botones de filtro** en la parte superior para filtrar por familia
2. Haga clic en "Todos" para ver todos los productos
3. Use la **barra de búsqueda** para buscar por nombre o SKU

### 3.3 Ver Detalle de Producto

- Cada tarjeta de producto muestra:
  - Imagen del producto
  - Nombre
  - SKU (código)
  - Precio unitario
  - Stock disponible
  - Botón "Agregar al carrito"

---

## 4. Carrito de Compras

### 4.1 Agregar Productos

1. Navegue al producto deseado
2. Haga clic en **"Agregar al carrito"**
3. El producto se añadirá con cantidad 1
4. Puede seguir agregando más productos

### 4.2 Ver el Carrito

- Haga clic en el **ícono del carrito** 🛒 en la barra de navegación
- Se mostrará un panel lateral con todos los productos agregados

### 4.3 Modificar Cantidades

En el carrito puede:
- **Aumentar cantidad**: Clic en el botón `+`
- **Disminuir cantidad**: Clic en el botón `-`
- **Eliminar producto**: Clic en el botón `🗑️`

### 4.4 Resumen del Pedido

El carrito muestra automáticamente:

| Concepto | Descripción |
|----------|-------------|
| **Subtotal** | Suma de productos sin IVA |
| **IVA (19%)** | Impuesto calculado sobre el subtotal |
| **Total** | Subtotal + IVA |

### 4.5 Monto Mínimo de Compra

> ⚠️ **Importante**: El monto mínimo de compra es **$35.000** (subtotal sin IVA)

- Si no alcanza el mínimo, verá un mensaje indicando cuánto le falta
- El botón de checkout estará deshabilitado hasta alcanzar el mínimo
- Una vez superado el mínimo, verá un mensaje de confirmación en verde

---

## 5. Realizar un Pedido

### 5.1 Proceso de Checkout

1. Con el carrito completado (mínimo $35.000), haga clic en **"Ir al Checkout"**
2. Revise el resumen de su pedido
3. Confirme o modifique la **dirección de envío**
4. Haga clic en **"Confirmar Pedido"**

### 5.2 Confirmación

Después de confirmar:
- Recibirá un **número de ticket** (ej: `PED-1701234567890`)
- El pedido quedará en estado **"Recibido"**
- Recibirá un **email de confirmación** (si está configurado)
- Puede ver el estado del pedido en su Dashboard

### 5.3 Estados del Pedido

Su pedido pasará por los siguientes estados:

| Estado | Descripción | Icono |
|--------|-------------|-------|
| 📋 **Recibido** | Pedido ingresado al sistema | Amarillo |
| 📦 **En preparación** | Se está preparando su pedido | Azul |
| 🧾 **Facturado** | Pedido facturado, listo para despacho | Púrpura |
| 🚚 **Despachado** | Pedido en camino | Verde |

---

## 6. Mi Cuenta - Dashboard

### 6.1 Acceder al Dashboard

1. Inicie sesión en su cuenta
2. Haga clic en su nombre o en **"Mi Cuenta"** en el menú
3. O vaya directamente a `/dashboard`

### 6.2 Secciones Disponibles

#### Mis Pedidos
- Lista de todos sus pedidos realizados
- Estado actual de cada pedido
- Detalle de productos por pedido
- Fecha y total de cada pedido

#### Mi Perfil
- Ver y editar información de su cuenta
- Nombre de empresa
- RUT
- Email
- Dirección

### 6.3 Seguimiento de Pedido

Cada pedido muestra:
- **Timeline visual** con los 4 estados
- Estado actual resaltado
- **Historial de cambios** con fechas y comentarios

---

## 7. Panel de Administración

> 🔒 **Acceso restringido**: Solo para usuarios con rol de Administrador

### 7.1 Acceder al Panel Admin

1. Inicie sesión con una cuenta de administrador
2. Vaya a `/dashboard/admin/validaciones`

### 7.2 Validación de Usuarios

**Ruta**: `/dashboard/admin/validaciones`

Permite aprobar o rechazar nuevos usuarios:

1. Ver lista de usuarios pendientes de validación
2. Revisar datos de la empresa (nombre, RUT, email)
3. **Validar**: Aprobar al usuario para que pueda comprar
4. **Rechazar**: Eliminar la solicitud de registro

> 📧 Al validar un usuario, se envía automáticamente un email de bienvenida

### 7.3 Gestión de Pedidos

**Ruta**: `/dashboard/admin/pedidos`

Permite administrar todos los pedidos:

1. Ver tabla con todos los pedidos del sistema
2. Información: ticket, cliente, total, estado, fecha
3. **Cambiar estado**: Seleccionar nuevo estado en el dropdown
4. **Exportar CSV**: Descargar pedidos para Laudus

#### Cambiar Estado de Pedido

1. Localice el pedido en la tabla
2. En la columna "Acciones", seleccione el nuevo estado
3. El cambio se guarda automáticamente
4. Se registra en el historial del pedido
5. Se envía email al cliente notificando el cambio

### 7.4 Stock / Laudus

**Ruta**: `/dashboard/admin/stock`

#### Importar Stock desde CSV

1. Prepare un archivo CSV con formato:
   ```csv
   sku,stock
   PRD-001,150
   PRD-002,75
   ```
2. Haga clic en "Seleccionar archivo"
3. Seleccione su archivo CSV
4. Haga clic en "Importar Stock"
5. Verá un resumen de productos actualizados

#### Exportar Pedidos

- **Exportar Facturados**: Solo pedidos en estado "Facturado"
- **Exportar Todos**: Todos los pedidos del sistema

El archivo CSV incluye:
- Número de ticket
- Datos del cliente (nombre, RUT, email)
- Dirección de envío
- Total
- Estado
- Fecha

---

## 8. Integración Laudus

### 8.1 Flujo de Trabajo Recomendado

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   EcoFor        │     │     Laudus      │     │   EcoFor        │
│   Market        │ --> │   (Facturación) │ --> │   Market        │
│                 │     │                 │     │                 │
│ Exportar        │     │ Procesar        │     │ Importar        │
│ Pedidos CSV     │     │ Facturas        │     │ Stock CSV       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 8.2 Exportar Pedidos para Laudus

1. Ir a `/dashboard/admin/stock`
2. Clic en "Exportar Facturados" o "Exportar Todos"
3. Se descarga archivo CSV
4. Importar en Laudus para generar facturas

### 8.3 Actualizar Stock desde Laudus

1. Exportar inventario desde Laudus en formato CSV
2. Asegurar que tenga columnas `sku` y `stock`
3. Ir a `/dashboard/admin/stock`
4. Subir el archivo CSV
5. El sistema actualiza automáticamente el stock

---

## 📞 Soporte

Si tiene problemas con el sistema:

1. **Errores de acceso**: Contacte al administrador para verificar su cuenta
2. **Problemas con pedidos**: Revise el estado en su Dashboard
3. **Errores técnicos**: Contacte a soporte técnico

---

## ⌨️ Atajos y Tips

| Acción | Tip |
|--------|-----|
| Buscar productos | Use Ctrl+F en el navegador |
| Agregar rápido | Clic en producto → "Agregar al carrito" |
| Ver carrito | Clic en ícono 🛒 superior derecho |
| Cerrar sesión | Dashboard → "Cerrar Sesión" |

---

## 🔄 Actualizaciones del Sistema

### Versión Actual: 1.0.0

**Funcionalidades incluidas:**
- ✅ Registro y validación de usuarios B2B
- ✅ Catálogo con filtros por familia
- ✅ Carrito con validación de monto mínimo
- ✅ Cálculo automático de IVA (19%)
- ✅ 4 estados de pedido con historial
- ✅ Panel de administración completo
- ✅ Integración CSV con Laudus
- ✅ Notificaciones por email (configurable)

---

*Manual actualizado: Diciembre 2025*
