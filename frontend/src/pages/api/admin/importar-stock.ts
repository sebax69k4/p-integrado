import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get('jwt')?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('csvFile') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'Archivo CSV requerido' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Leer contenido del archivo
    const csvContent = await file.text();
    
    // Parsear CSV localmente y actualizar productos via Strapi
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const skuIndex = headers.indexOf('sku');
    const stockIndex = headers.indexOf('stock');
    
    if (skuIndex === -1 || stockIndex === -1) {
      return new Response(JSON.stringify({ error: 'El CSV debe contener las columnas: sku, stock' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let updated = 0;
    const errors: string[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const sku = values[skuIndex];
      const stock = parseInt(values[stockIndex], 10);
      
      if (!sku || isNaN(stock)) {
        errors.push(`Línea ${i + 1}: datos inválidos`);
        continue;
      }
      
      try {
        // Buscar producto por SKU
        const searchRes = await fetch(
          `${import.meta.env.STRAPI_URL}/api/productos?filters[sku][$eq]=${encodeURIComponent(sku)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (!searchRes.ok) {
          errors.push(`Error buscando ${sku}`);
          continue;
        }
        
        const searchData = await searchRes.json();
        const productos = searchData.data || [];
        
        if (productos.length > 0) {
          const productId = productos[0].id;
          
          // Actualizar stock
          const updateRes = await fetch(
            `${import.meta.env.STRAPI_URL}/api/productos/${productId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                data: { stock: stock }
              }),
            }
          );
          
          if (updateRes.ok) {
            updated++;
          } else {
            errors.push(`Error actualizando ${sku}`);
          }
        } else {
          errors.push(`SKU ${sku} no encontrado`);
        }
      } catch (error: any) {
        errors.push(`Error procesando ${sku}: ${error.message}`);
      }
    }
    
    return new Response(JSON.stringify({ 
      message: 'Importación completada',
      updated,
      errors 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error importando stock:', error);
    return new Response(JSON.stringify({ error: error.message || 'Error interno' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
