import { createMiddleware } from "@solidjs/start/middleware";

export default createMiddleware({
  onRequest: [
    async (event) => {
      const url = new URL(event.request.url);

      // LOG: Para confirmar en tu terminal que el middleware se está ejecutando
      console.log(`>> [Middleware] Request: ${url.pathname}`);

      // 0. VITAL: Ignorar recursos internos de Vite/Vinxi y Assets
      // Si no haces esto, bloqueas el JS que hace funcionar la app
      if (url.pathname.startsWith("/_build") ||
          url.pathname.startsWith("/assets") ||
          url.pathname.includes(".")) { // Ignora archivos con extensión (imágenes, css) superficialmente
         return;
      }

      // 1. Rutas públicas
      const publicPaths = ["/login", "/api/auth", "/favicon.ico"];
      const isPublic = publicPaths.some((path) => url.pathname.startsWith(path));

      if (isPublic) {
        return;
      }

      // 2. Verificar sesión con Regex Estricta
      // Busca "auth_token=" al inicio del string O después de un punto y coma
      const cookieHeader = event.request.headers.get("Cookie") || "";
      const isAuthenticated = /(?:^|; )auth_token=/.test(cookieHeader);

      // 3. Redirección
      if (!isAuthenticated) {
        console.log(">> [Middleware] ⛔ No autorizado. Redirigiendo a /login");
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/login",
            "Cache-Control": "no-store",
          },
        });
      }
    },
  ],
});