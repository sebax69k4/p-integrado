import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('jwt', { path: '/' });
  return redirect('/login');
};
