import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const data = await request.formData();
  const username = data.get('username');
  const email = data.get('email');
  const password = data.get('password');
  const rut = data.get('rut');
  const razon_social = data.get('razon_social');
  const giro = data.get('giro');
  const direccion = data.get('direccion');
  const telefono = data.get('telefono');
  const tipo_persona = data.get('tipo_persona');

  try {
    const res = await fetch(`${import.meta.env.STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        rut,
        razon_social,
        giro,
        direccion,
        telefono,
        tipo_persona,
        validado_por_admin: false
      }),
    });

    const responseData = await res.json();

    if (responseData.error) {
      return new Response(JSON.stringify({
        error: responseData.error.message
      }), { status: 400 });
    }

    // Set cookie
    cookies.set('jwt', responseData.jwt, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return redirect('/pendiente');
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Error de conexión"
    }), { status: 500 });
  }
};
