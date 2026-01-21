import { Component, createEffect, Show } from "solid-js";
import { action, useSubmission } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import IconLoaderCircle from '~icons/lucide/loader-circle'; // Asumiendo que tienes este icono configurado igual que en tu slug

// Definimos la interfaz basada en lo que vimos en tu slug que sí funciona
interface Env {
    CORE_SERVICE: {
        fetch: (request: Request | string, init?: RequestInit) => Promise<Response>;
    };
}

const loginAction = action(async (formData: FormData) => {
    "use server";
    const evt = getRequestEvent();

    if (!evt) {
        throw new Error("No se pudo obtener el evento del request.");
    }

    // Accedemos al env exactamente como en tu [...slug].tsx
    const env = evt.nativeEvent.context.cloudflare.env as Env;

    // Verificamos el binding correcto: CORE_SERVICE
    if (!env || !env.CORE_SERVICE) {
        throw new Error("El servicio CORE_SERVICE no está conectado.");
    }

    try {
        // 1. Preparar datos: Convertir FormData a JSON plano para Rust
        const payload = Object.fromEntries(formData);

        // 2. Construir URL: Usamos el dominio que tu Rust reconoce (app.xcc32.app)
        const urlDestino = new URL("https://app.xcc32.app/auth/login");

        // 3. Gestionar Headers: Clonamos los del navegador y ajustamos
        const newHeaders = new Headers(evt.request.headers);

        // IMPORTANTE: Fijamos el Host como en tu ejemplo funcional
        newHeaders.set("Host", "app.xcc32.app");
        // IMPORTANTE: Sobrescribimos Content-Type porque enviaremos JSON, no form-data
        newHeaders.set("Content-Type", "application/json");

        // 4. Hacemos el fetch al Service Binding
        const response = await env.CORE_SERVICE.fetch(urlDestino.toString(), {
            method: "POST", // Login siempre es POST
            headers: newHeaders,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Rust Error (Login):', response.status, errorText);

            // Intentamos parsear el error si es JSON, si no devolvemos texto
            try {
                const jsonError = JSON.parse(errorText);
                throw new Error(jsonError.error || jsonError.message || "Credenciales inválidas");
            } catch {
                throw new Error(errorText || "Error al iniciar sesión");
            }
        }

        // 5. Procesar respuesta exitosa
        const data = await response.json();

        // Si el backend manda cookies (Set-Cookie), las pasamos al navegador
        // (Esto es útil si decides usar cookies además de tokens)
        const setCookie = response.headers.get("Set-Cookie");
        if (setCookie) {
            evt.response.headers.append("Set-Cookie", setCookie);
        }

        return data;
    }
    catch (error: any) {
        console.error("Binding Error:", error);
        throw error; // Esto enviará el error al objeto submission.error
    }
});

const Login: Component = () => {
    const submission = useSubmission(loginAction);

    createEffect(() => {
        // Si el login fue exitoso
        if (submission.result) {
            const result = submission.result as any;

            // Si tu backend devuelve un token, lo guardamos
            if (result.token) {
                localStorage.setItem("auth_token", result.token);
            }

            // Redirección
            window.location.href = "/";
        }
    });

    return (
        <div class="flex min-h-screen items-center justify-center bg-gray-900 text-gray-100">
            <div class="w-full max-w-md space-y-8 rounded-lg border border-gray-700 bg-gray-800 p-8 shadow-lg">
                <div class="text-center">
                    <h2 class="text-2xl font-bold tracking-tight text-white">
                        Iniciar Sesión
                    </h2>
                    <p class="mt-2 text-sm text-gray-400">
                        Ingresa tus credenciales para acceder a xcc32
                    </p>
                </div>

                {/* Mensaje de Error */}
                <Show when={submission.error}>
                    <div class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative text-sm">
                        {submission.error.message}
                    </div>
                </Show>

                <form action={loginAction} method="post" class="mt-8 space-y-6">
                    <div class="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label for="username" class="block text-sm font-medium text-gray-300">
                                Usuario
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autocomplete="username"
                                required
                                class="relative mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
                                placeholder="admin"
                            />
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-300">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autocomplete="current-password"
                                required
                                class="relative mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={submission.pending}
                            class="group relative flex w-full justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
                        >
                            <Show when={submission.pending} fallback="Ingresar">
                                <IconLoaderCircle class="animate-spin size-4" />
                                <span>Verificando...</span>
                            </Show>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;