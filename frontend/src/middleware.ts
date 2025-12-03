import { defineMiddleware } from "astro:middleware";
import { getUserMe } from "./lib/strapi";

const PROTECTED_ROUTES = ['/carrito', '/checkout', '/dashboard'];

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get("jwt")?.value;
  const user = token ? await getUserMe(token) : null;

  context.locals.user = user;

  const { pathname } = context.url;

  // 1. Check protected routes
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!user) {
      return context.redirect("/login");
    }
    if (!user.validado_por_admin) {
      return context.redirect("/pendiente");
    }
  }

  // 2. Check pendiente route
  if (pathname === "/pendiente") {
    if (user && user.validado_por_admin) {
      return context.redirect("/");
    }
    if (!user) {
      return context.redirect("/login");
    }
  }

  // 3. Check auth routes (login/register)
  if (pathname === "/login" || pathname === "/registro") {
    if (user) {
      return context.redirect("/");
    }
  }

  return next();
});
