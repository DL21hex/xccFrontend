import { createSignal, For, Suspense, createEffect, Show } from "solid-js";
import { redirect, useLocation } from "@solidjs/router";
import CTA from "~/components/CTA";
import Card from "~/components/Card";

interface ComponentItem {
  component: string;
  props: Record<string, any>;
}

const componentMap: Record<string, any> = {
  CTA: CTA,
  Card: Card,
};

const fetchContent = async (path: string) => {
  const response = await fetch(`http://localhost:80/xcctechpeople/tools/sandbox/${path}`);
  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }
  return response.json() as Promise<ComponentItem[]>;
};

function NotFound() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Página no encontrada</h1>
    </main>
  );
}

export default function Home() {
  const [items, setItems] = createSignal<ComponentItem[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(true);
  const location = useLocation();

  createEffect(async () => {
    setLoading(true);
    setError(null);
    try {
      const path = location.pathname === "/" ? "home_public" : location.pathname.substring(1);
      const data = await fetchContent(path);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setItems([]);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Suspense fallback={<div class="text-muted-foreground">Cargando...</div>}>
      <Show when={!loading()} fallback={<div class="text-muted-foreground">Cargando...</div>}>
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