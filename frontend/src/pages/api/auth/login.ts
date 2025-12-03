import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const data = await request.formData();
  const email = data.get('email');
  const password = data.get('password');

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

    const data = await res.json();

    if (data.error) {
      return new Response(JSON.stringify({
        error: data.error.message
      }), { status: 400 });
    }

    // Set cookie
    cookies.set('jwt', data.jwt, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return redirect('/');
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Error de conexión"
    }), { status: 500 });
  }
};
