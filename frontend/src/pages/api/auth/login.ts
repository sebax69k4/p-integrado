import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const email = data.get('email');
  const password = data.get('password');

  // TODO: Implement Strapi login
  
  return new Response(JSON.stringify({
    message: "Login successful"
  }), { status: 200 });
};
