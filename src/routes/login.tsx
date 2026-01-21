import { Component, createEffect } from "solid-js";
import { action, useSubmission} from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";

const loginAction = action(async (formData: FormData) => {
	"use server";
	const event = getRequestEvent();

	const env = event?.nativeEvent.context.cloudflare.env as Env;

	if (!env || !env.NX32_CORE)
	{
		throw new Error("El servicio Core no está conectado (Binding missing).");
	}

	try
	{
		const payload = Object.fromEntries(formData);
		const request = new Request("https://dummy.nx32.app", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: formData,
		});

		const response = await env.NX32_CORE.fetch(request);

		if (!response.ok)
		{
			const errorText = await response.text();
			console.error('Login failed:', response.status, errorText);
			throw new Error(`Credenciales inválidas (${response.status}): ${errorText}`);
		}

		const data = await response.json();
		const setCookie = response.headers.get("Set-Cookie");

		if (setCookie && event)
		{
			event.response.headers.append("Set-Cookie", setCookie);
		}

		return data;
	}
	catch (error)
	{
		console.error("Error conectando con el Core:", error);
        throw error;
	}
});

const Login: Component = () => {
	const submission = useSubmission(loginAction);

	createEffect(() => {
		if (submission.result)
		{
			localStorage.setItem("template_data", JSON.stringify(submission.result));
			window.location.href = "/";
		}
	});

	return (
		<div class="flex min-h-screen items-center justify-center bg-background">
		<div class="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
			<div class="text-center">
			<h2 class="text-2xl font-bold tracking-tight text-foreground">
				Iniciar Sesión
			</h2>
			<p class="mt-2 text-sm text-muted-foreground">
				Ingresa tus credenciales para acceder
			</p>
			</div>

			<form action={loginAction} method="post" class="mt-8 space-y-6">
			<div class="space-y-4 rounded-md shadow-sm">
				<div>
				<label for="username" class="block text-sm font-medium text-foreground">
					Núm. documento de identidad
				</label>
				<input
					id="username"
					name="username"
					type="text"
					autocomplete="username"
					required
					class="relative mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
					placeholder="usuario"
				/>
				</div>
				<div>
				<label for="password" class="block text-sm font-medium text-foreground">
					Contraseña
				</label>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
					class="relative mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
					placeholder="••••••••"
				/>
				</div>
			</div>

			<div>
				<button
				type="submit"
				class="group relative flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
				>
				Ingresar
				</button>
			</div>
			</form>
		</div>
		</div>
	);
};

export default Login;
