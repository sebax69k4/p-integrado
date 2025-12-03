import type { APIRoute } from 'astro';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  rut: string;
  razon_social: string;
  giro: string;
  direccion: string;
  telefono: string;
  tipo_persona: string;
}

export const POST: APIRoute = async ({ request }) => {
  let data: RegisterData;

  // Handle both form data and JSON
  const contentType = request.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    data = await request.json();
  } else {
    const formData = await request.formData();
    data = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      rut: formData.get('rut') as string,
      razon_social: formData.get('razon_social') as string,
      giro: formData.get('giro') as string,
      direccion: formData.get('direccion') as string,
      telefono: formData.get('telefono') as string,
      tipo_persona: formData.get('tipo_persona') as string,
    };
  }

  // Validaciones básicas
  const requiredFields = ['username', 'email', 'password', 'rut', 'razon_social', 'giro', 'direccion', 'telefono', 'tipo_persona'];
  for (const field of requiredFields) {
    if (!data[field as keyof RegisterData]) {
      return new Response(JSON.stringify({
        error: `El campo ${field} es requerido`
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (data.password.length < 6) {
    return new Response(JSON.stringify({
      error: 'La contraseña debe tener al menos 6 caracteres'
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const res = await fetch(`${import.meta.env.STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        rut: data.rut,
        razon_social: data.razon_social,
        giro: data.giro,
        direccion: data.direccion,
        telefono: data.telefono,
        tipo_persona: data.tipo_persona,
        validado_por_admin: false
      }),
    });

    const responseData = await res.json();

    if (responseData.error) {
      let errorMessage = 'Error al registrar';
      
      if (responseData.error.message) {
        errorMessage = responseData.error.message;
      } else if (responseData.error.details?.errors) {
        errorMessage = responseData.error.details.errors.map((e: any) => e.message).join(', ');
      }
      
      return new Response(JSON.stringify({
        error: errorMessage
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Registro exitoso. Tu cuenta está pendiente de validación.',
      user: {
        username: responseData.user.username,
        email: responseData.user.email,
      }
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({
      error: 'Error de conexión con el servidor'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
