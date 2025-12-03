import { defineMiddleware } from "astro:middleware";
import { getUserMe } from "./lib/strapi";

// Rutas que requieren usuario validado (pueden comprar)
const VALIDATED_USER_ROUTES = ['/carrito', '/checkout'];

// Rutas que requieren solo autenticación (no validación)
const AUTH_ONLY_ROUTES = ['/dashboard', '/pendiente'];

// Rutas que requieren rol de administrador
const ADMIN_ROUTES = ['/dashboard/admin'];

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get("jwt")?.value;
  const user = token ? await getUserMe(token) : null;

  context.locals.user = user;

  const { pathname } = context.url;

  // 0. Rutas de administrador
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (!user) {
      return context.redirect("/login");
    }
    // Verificar si el usuario tiene rol de admin
    const isAdmin = user.role?.type === 'admin' || user.role?.name === 'Admin' || user.es_admin === true;
    if (!isAdmin) {
      return context.redirect("/dashboard");
    }
  }

  // 1. Rutas que requieren usuario validado (carrito, checkout)
  if (VALIDATED_USER_ROUTES.some(route => pathname.startsWith(route))) {
    if (!user) {
      return context.redirect("/login");
    }
    if (!user.validado_por_admin) {
      return context.redirect("/pendiente");
    }
  }

  // 2. Rutas que solo requieren autenticación
  if (AUTH_ONLY_ROUTES.some(route => pathname.startsWith(route))) {
    if (!user) {
      return context.redirect("/login");
    }
  }

  // 3. Página pendiente: redirigir si ya está validado
  if (pathname === "/pendiente") {
    if (user && user.validado_por_admin) {
      return context.redirect("/");
    }
  }

  // 4. Rutas de autenticación (login/registro): redirigir si ya está logueado
  if (pathname === "/login" || pathname === "/registro") {
    if (user) {
      if (user.validado_por_admin) {
        return context.redirect("/");
      } else {
        return context.redirect("/pendiente");
      }
    }
  }

  return next();
});
