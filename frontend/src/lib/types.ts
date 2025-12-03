// Tipos basados en los schemas de Strapi

export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export type Familia = 'Papeleria' | 'Quimicos' | 'Limpieza' | 'EPP';

export interface Producto {
  id: number;
  documentId: string;
  nombre: string;
  descripcion?: string;
  sku: string;
  imagen?: StrapiImage;
  stock: number;
  familia: Familia;
  precio_estandar: number;
  precio_empresa?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export type TipoPersona = 'Natural' | 'Empresa';

export interface User {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  provider?: string;
  confirmed: boolean;
  blocked: boolean;
  rut: string;
  razon_social: string;
  giro?: string;
  direccion: string;
  telefono: string;
  tipo_persona: TipoPersona;
  validado_por_admin: boolean;
  estado: 'pendiente' | 'activo' | 'rechazado';
  lista_precios: 'estandar' | 'empresa';
  role?: {
    id: number;
    name: string;
    type: string;
  };
  pedidos?: Pedido[];
}

export type EstadoPedido = 'Recibido' | 'En preparacion' | 'Facturado' | 'Despachado';

export interface EstadoPedidoHistorial {
  id: number;
  estado_anterior?: EstadoPedido;
  estado_nuevo: EstadoPedido;
  fecha_cambio: string;
  nota?: string;
}

export interface PedidoItem {
  id: string;
  nombre: string;
  sku: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  documentId: string;
  numero_ticket: string;
  total: number;
  estado: EstadoPedido;
  items: PedidoItem[];
  direccion_envio: string;
  fecha_pedido: string;
  user?: User;
  historial_estados?: EstadoPedidoHistorial[];
  createdAt: string;
  updatedAt: string;
}

// Tipo para el carrito local (antes de crear pedido)
export interface CartItem {
  id: string;
  nombre: string;
  sku: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}
