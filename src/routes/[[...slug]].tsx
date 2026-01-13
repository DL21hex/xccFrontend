import { createSignal, For, Suspense, createEffect, Show } from "solid-js";
import { useLocation } from "@solidjs/router";
import CTA from "~/components/CTA";
import Card from "~/components/Card";
import Nav, { setActiveMenuItem } from "~/components/Nav";
import { request } from "~/utils/request";

interface ComponentItem {
  component: string;
  props: Record<string, any>;
}

const componentMap: Record<string, any> = {
  CTA: CTA,
  Card: Card,
  Nav: Nav,
};

const fetchContent = async (path: string) => {
  return request<ComponentItem[]>(`http://localhost/xcctechpeople/xcc/${path}`);
};

function NotFound() {
  return (
    <div data-slot="empty" class="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12">
      <div data-slot="empty-header" class="flex max-w-sm flex-col items-center gap-2 text-center">
        <div data-slot="empty-icon" data-variant="icon" class="mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-folder-code ">
            <path d="M11 19h-6a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v4"></path>
            <path d="M20 21l2 -2l-2 -2"></path>
            <path d="M17 17l-2 2l2 2"></path>
          </svg>
        </div>
        <div data-slot="empty-title" class="text-lg font-medium tracking-tight">Página no encontrada</div>
        <div data-slot="empty-description" class="text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4">
          La página que buscas no existe o ha ocurrido un error.
        </div>
      </div>
      <div data-slot="empty-content" class="flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance">
        <div class="flex gap-2">
          <a href="/" data-slot="button" data-variant="default" data-size="default" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div data-slot="empty" class="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12 w-full">
      <div data-slot="empty-header" class="flex max-w-sm flex-col items-center gap-2 text-center">
        <div data-slot="empty-icon" data-variant="icon" class="mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle size-4 animate-spin" role="status" aria-label="Loading">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
        </div>
        <div data-slot="empty-title" class="text-lg font-medium tracking-tight">Cargando</div>
        <div data-slot="empty-description" class="text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4">
          Por favor espere mientras cargamos el contenido.
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [items, setItems] = createSignal<ComponentItem[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(true);
  const location = useLocation();

  createEffect(async () => {
    setActiveMenuItem(null);
    setLoading(true);
    setError(null);
    try {
      const path = location.pathname === "/" ? "home/index_for_all" : location.pathname.substring(1);
      const data = await fetchContent(path);

      if (!Array.isArray(data)) {
        throw new Error("Invalid content response");
      }

      setItems(data);
    } catch (err) {
      try {
        const response = await fetch("http://localhost/xcctechpeople/system/users/auth/validate_session_public", {
            credentials: "include"
        });

        if (!response.ok) {
           if (typeof window !== "undefined") window.location.href = "/login";
           return;
        }
      } catch (e) {
          if (typeof window !== "undefined") window.location.href = "/login";
          return;
      }

      setError(err instanceof Error ? err.message : "Error desconocido");
      setItems([]);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Suspense fallback={<Loading />}>
      <Show when={!loading()} fallback={<Loading />}>
        <Show when={!error() && items().length > 0} fallback={<NotFound />}>
          <div class="flex flex-col gap-6">
            <For each={items()}>
              {(item) => {
                const Component = componentMap[item.component];
                return Component ? <Component {...item.props} /> : null;
              }}
            </For>
          </div>
        </Show>
      </Show>
    </Suspense>
  );
}