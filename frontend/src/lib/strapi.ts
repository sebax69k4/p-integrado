interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the URL
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - Whether the response is a list of items
 * @returns
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  const res = await fetch(url.toString());
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}

export async function getUserMe(token: string) {
  if (!token) return null;
  try {
    const res = await fetch(`${import.meta.env.STRAPI_URL}/api/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function createPedido(token: string, pedidoData: {
  items: Array<{
    id: string;
    nombre: string;
    sku: string;
    precio_unitario: number;
    cantidad: number;
    subtotal: number;
  }>;
  total: number;
  direccion_envio: string;
}) {
  // Primero obtener el ID del usuario actual
  const userRes = await fetch(`${import.meta.env.STRAPI_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!userRes.ok) {
    throw new Error('No se pudo obtener el usuario');
  }
  
  const user = await userRes.json();

  const res = await fetch(`${import.meta.env.STRAPI_URL}/api/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        items: pedidoData.items,
        total: pedidoData.total,
        direccion_envio: pedidoData.direccion_envio,
        numero_ticket: `PED-${Date.now()}`,
        estado: 'Recibido',
        fecha_pedido: new Date().toISOString(),
        user: user.id, // Asociar al usuario actual
      },
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Error al crear pedido');
  }

  return await res.json();
}

export async function getPedidosUsuario(token: string) {
  const res = await fetch(`${import.meta.env.STRAPI_URL}/api/pedidos?populate=*&sort=createdAt:desc`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return [];
  
  const data = await res.json();
  return data.data || [];
}

export function getStrapiImageUrl(imagen: any): string {
  if (!imagen) return '/placeholder.svg';
  
  const url = imagen.url || imagen.formats?.small?.url || imagen.formats?.thumbnail?.url;
  
  if (!url) return '/placeholder.svg';
  
  // Si la URL ya es absoluta, devolverla tal cual
  if (url.startsWith('http')) return url;
  
  // Si no, agregar la URL de Strapi
  return `${import.meta.env.STRAPI_URL}${url}`;
}

// ==================== ADMIN FUNCTIONS ====================

export async function getUsuariosPendientes(token: string) {
  const res = await fetch(
    `${import.meta.env.STRAPI_URL}/api/users?filters[validado_por_admin][$eq]=false&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) return [];
  return await res.json();
}

export async function getAllPedidos(token: string) {
  const res = await fetch(
    `${import.meta.env.STRAPI_URL}/api/pedidos?populate=user&sort=createdAt:desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) return [];
  
  const data = await res.json();
  return data.data || [];
}

export async function validarUsuario(token: string, userId: number | string) {
  const res = await fetch(`${import.meta.env.STRAPI_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      validado_por_admin: true,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Error al validar usuario');
  }

  return await res.json();
}

export async function rechazarUsuario(token: string, userId: number | string) {
  // Rechazar = eliminar usuario
  const res = await fetch(`${import.meta.env.STRAPI_URL}/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Error al rechazar usuario');
  }

  return { success: true };
}

export async function actualizarEstadoPedido(
  token: string, 
  pedidoId: number | string, 
  estado: string
) {
  const res = await fetch(`${import.meta.env.STRAPI_URL}/api/pedidos/${pedidoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        estado,
      },
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Error al actualizar estado');
  }

  return await res.json();
}

