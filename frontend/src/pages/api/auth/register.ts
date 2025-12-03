import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const username = data.get('username');
  const email = data.get('email');
  const password = data.get('password');

  // TODO: Implement Strapi registration
  
  return new Response(JSON.stringify({
    message: "Registration successful"
  }), { status: 200 });
};
