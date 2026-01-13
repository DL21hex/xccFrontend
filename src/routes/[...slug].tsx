import { useLocation } from "@solidjs/router";
import { createEffect, createSignal, For, Show, Suspense } from "solid-js";
import Card from "~/components/Card";
import CTA from "~/components/CTA";
import Nav, { setActiveMenuItem } from "~/components/Nav";
import { request } from "~/utils/request";
import IconFolderCode from '~icons/lucide/folder-code';
import IconLoaderCircle from '~icons/lucide/loader-circle';

const componentMap: Record<string, any> = {
	CTA: CTA,
	Card: Card,
	Nav: Nav,
};

interface ComponentItem {
	component: string;
	props: Record<string, any>;
}

interface PageResponse {
	main_menu?: {
		set_active?: string;
	};
	breadcrumbs?: any[];
	content: ComponentItem[];
}

const fetchContent = async (path: string) => {
	const result = path === "/" ? "/home/index_for_all" : path;
	return request<PageResponse>(`http://localhost/xcctechpeople/xcc/${result}`);
};

export default function CatchAll()
{
	const [items, setItems] = createSignal<ComponentItem[]>([]);
	const [notFound, setNotFound] = createSignal(false);
	const [loading, setLoading] = createSignal(true);

	createEffect(async () => {
		setLoading(true);
		setActiveMenuItem(null);
		setNotFound(false);

		try
		{
			const location = useLocation();
			const data = await fetchContent(location.pathname);

			if (data && data.content) {
				setItems(data.content);
			} else {
				setItems([]);
				setNotFound(true);
			}

			if (data && data.main_menu?.set_active) {
				setActiveMenuItem(data.main_menu.set_active);
			}
		}
		catch (error)
		{
			console.error("Error fetching content:", error);
			setItems([]);
			setNotFound(true);
		}
		finally
		{
			setLoading(false);
		}
	});

	return (
		<Suspense>
			<Show when={!loading()} fallback={<Loading />}>
				<Show when={!notFound()} fallback={<NotFound />}>
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

function Loading() {
  return (
	<div data-slot="empty" class="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12 w-full">
	  <div data-slot="empty-header" class="flex max-w-sm flex-col items-center gap-2 text-center">
		<div data-slot="empty-icon" data-variant="icon" class="mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6">
		  <IconLoaderCircle class="size-4 animate-spin" />
		</div>
		<div data-slot="empty-title" class="text-lg font-medium tracking-tight">Cargando</div>
		<div data-slot="empty-description" class="text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4">
		  Por favor espere mientras cargamos el contenido.
		</div>
	  </div>
	</div>
  );
}

function NotFound() {
  return (
	<div data-slot="empty" class="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12">
	  <div data-slot="empty-header" class="flex max-w-sm flex-col items-center gap-2 text-center">
		<div data-slot="empty-icon" data-variant="icon" class="mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6">
		  <IconFolderCode />
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