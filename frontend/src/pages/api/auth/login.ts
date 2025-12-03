import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  let email: string | null = null;
  let password: string | null = null;

  // Handle both form data and JSON
  const contentType = request.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    const json = await request.json();
    email = json.email;
    password = json.password;
  } else {
    const formData = await request.formData();
    email = formData.get('email') as string;
    password = formData.get('password') as string;
  }

  if (!email || !password) {
    return new Response(JSON.stringify({
      error: 'Email y contraseña son requeridos'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const res = await fetch(`${import.meta.env.STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: email,
        password: password,
      }),
    });

    const responseData = await res.json();

    if (responseData.error) {
      return new Response(JSON.stringify({
        error: responseData.error.message || 'Credenciales inválidas'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Set JWT cookie
    cookies.set('jwt', responseData.jwt, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Fetch user role to determine redirect
    let redirectUrl = '/';
    try {
      const userRes = await fetch(`${import.meta.env.STRAPI_URL}/api/users/me?populate=role`, {
        headers: {
          Authorization: `Bearer ${responseData.jwt}`,
        },
      });

      if (userRes.ok) {
        const userWithRole = await userRes.json();
        // Check for admin role by type or name
        if (userWithRole.role?.type === 'admin' || userWithRole.role?.name === 'Admin') {
          redirectUrl = '/admin';
        }
      }
    } catch (err) {
      console.error('Error fetching user role:', err);
    }

    return new Response(JSON.stringify({
      success: true,
      redirect: redirectUrl,
      user: {
        username: responseData.user.username,
        email: responseData.user.email,
        validado_por_admin: responseData.user.validado_por_admin,
        estado: responseData.user.estado,
        lista_precios: responseData.user.lista_precios,
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      error: 'Error de conexión con el servidor'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
