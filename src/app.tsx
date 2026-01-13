import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal, createEffect, Show, onMount, onCleanup } from "solid-js";
import Nav from "~/components/Nav";
import { request } from "~/utils/request";
import "./app.css";

import IconUser from '~icons/lucide/user';
import IconLogOut from '~icons/lucide/log-out';
import IconPanelLeft from '~icons/lucide/panel-left';
import IconSearch from '~icons/lucide/search';
import IconUsers from '~icons/lucide/users';
import IconBell from '~icons/lucide/bell';
import IconSun from '~icons/lucide/sun';
import IconMoon from '~icons/lucide/moon';

interface TenantInfo { name: string; logo: string; primary_color: string; light_color: string; logo_width: string; }
interface MenuItem { id: string; label: string; href: string; icon: string; is_active?: boolean;}
interface HeaderData { full_name: string; position_name: string; avatar: string;}

interface TemplateData {
	tenant: TenantInfo;
	main_menu: MenuItem[];
	header: HeaderData;
}

const fetchTemplate = async () => {
	try
	{
		return await request<TemplateData>("http://localhost/xcctechpeople/tools/xccui_api/template");
	}
	catch (e)
	{
		return {
			tenant: { name: "", logo: "", primary_color: "", light_color: "", logo_width: "" },
			main_menu: [/* TODO: Skeleton...*/ ],
			header: { full_name: "", position_name: "", avatar: "" }
		};
	}
};

export default function App()
{
	const [template, setTemplate] = createSignal<TemplateData>({
		tenant: { name: "Skeleton...", logo: "xcc", primary_color: "#219ebc", light_color: "#E3F6FB", logo_width: "96px" },
		main_menu: [],
		header: { full_name: "Skeleton...", position_name: "Skeleton...", avatar: "" }
	});

	const [isSidebarCollapsed, setIsSidebarCollapsed] = createSignal(false);

	onMount(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setIsSidebarCollapsed(true);
			} else {
				setIsSidebarCollapsed(false);
			}
		};

		handleResize(); // Check on mount
		window.addEventListener("resize", handleResize);

		onCleanup(() => window.removeEventListener("resize", handleResize));
	});

return (
	<Router
		root={(props) => {
		const location = useLocation();

		createEffect(() => {
			if (location.pathname === "/login") {
				localStorage.removeItem("template_data");
				if (template().tenant.name !== "Skeleton...") {
					setTemplate({
						tenant: { name: "Skeleton...", logo: "xcc", primary_color: "#219ebc", light_color: "#E3F6FB", logo_width: "96px" },
						main_menu: [],
						header: { full_name: "Skeleton...", position_name: "Skeleton...", avatar: "" }
					});
				}
			} else {
				const cached = localStorage.getItem("template_data");
				if (cached) {
					if (template().tenant.name === "Skeleton...") {
						setTemplate(JSON.parse(cached));
					}
				} else {
					if (template().tenant.name === "Skeleton...") {
						fetchTemplate().then((data) => {
							//localStorage.setItem("template_data", JSON.stringify(data));
							setTemplate(data);
						});
					}
				}
			}
		});

		return (
		<div class="flex h-screen bg-background">
			<style>{`:root {--primary: ${template().tenant?.primary_color}; --light-color: ${template().tenant?.light_color}; --logo-width: ${template().tenant?.logo_width};}`}</style>
		<Show when={location.pathname !== "/login"}>
		<aside class={`border-r border-sidebar-border bg-sidebar flex flex-col h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed() ? 'w-[70px]' : 'w-[240px]'}`}>
			<div class={`h-16 flex items-center ${isSidebarCollapsed() ? 'justify-center' : 'justify-between px-3'} border-b border-sidebar-border transition-all duration-300`}>
			<div class="flex items-center gap-2.5 overflow-hidden">
				<img src={`/assets/images/${template().tenant?.logo}_small.png`} alt="Logo" class="w-8 h-8 shrink-0" />
				<span class={`font-semibold text-sidebar-foreground tracking-tight whitespace-nowrap transition-all duration-300 ${isSidebarCollapsed() ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
				{template().tenant?.name}
				</span>
			</div>
			</div>
			<div class="flex-1 py-4 overflow-y-auto overflow-x-hidden">
			<Nav items={template().main_menu} collapsed={isSidebarCollapsed()} />
			</div>
			<div class="mt-auto">
			<div data-orientation="horizontal" role="none" data-slot="separator" class={`bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-3 ${isSidebarCollapsed() ? 'hidden' : ''}`}></div>
			<div class={`py-3 space-y-0.5 ${isSidebarCollapsed() ? 'px-2' : 'px-3'}`}>
				<a href="/perfil" class={`flex items-center w-full rounded-md text-[13px] font-medium transition-colors ${isSidebarCollapsed() ? 'justify-center px-2' : 'justify-start gap-3 px-3'} py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground`} data-state="closed" data-slot="tooltip-trigger" title={isSidebarCollapsed() ? "Mi perfil" : undefined}>
					<IconUser class="lucide h-[18px] w-[18px] shrink-0" />
					<span class={isSidebarCollapsed() ? 'hidden' : ''}>Mi perfil</span>
				</a>
				<a href="/system/users/logout_public" class={`flex items-center w-full rounded-md text-[13px] font-medium transition-colors ${isSidebarCollapsed() ? 'justify-center px-2' : 'justify-start gap-3 px-3'} py-2 text-destructive/80 hover:bg-destructive/10 hover:text-destructive`} data-state="closed" data-slot="tooltip-trigger" title={isSidebarCollapsed() ? "Cerrar sesión" : undefined}>
					<IconLogOut class="lucide h-[18px] w-[18px] shrink-0" />
					<span class={isSidebarCollapsed() ? 'hidden' : ''}>Cerrar sesión</span>
				</a>
			</div>
			</div>
		</aside>
		</Show>

		<div class="flex-1 flex flex-col">
			<Show when={location.pathname !== "/login" && template().header}>
				<header class="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4">
				<div class="flex items-center gap-3">
					<button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed())} data-slot="tooltip-trigger" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 text-muted-foreground hover:text-foreground" data-state="closed">
						<IconPanelLeft class="lucide h-5 w-5" />
					</button>
					<div class="relative hidden md:flex items-center"></div>
				</div>
				<div class="flex items-center gap-1">
					<button data-slot="tooltip-trigger" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 text-muted-foreground hover:text-foreground md:hidden" data-state="closed">
						<IconSearch class="lucide h-[18px] w-[18px]" />
					</button>
					<button data-slot="tooltip-trigger" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 text-muted-foreground hover:text-foreground relative" data-state="closed"><IconUsers class="lucide h-[18px] w-[18px]" /></button><button data-slot="tooltip-trigger" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 text-muted-foreground hover:text-foreground relative" data-state="closed"><IconBell class="lucide h-[18px] w-[18px]" /></button>
						<button data-slot="tooltip-trigger" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 text-muted-foreground hover:text-foreground" data-state="closed"><IconSun class="lucide h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /><IconMoon class="lucide absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /></button><div class="w-px h-6 bg-border mx-2"></div>
					<Show when={template().header}>
						<button class="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg hover:bg-muted/50 transition-colors" type="button" id="radix-_r_h_" aria-haspopup="menu" aria-expanded="false" data-state="closed" data-slot="dropdown-menu-trigger"><div class="text-right hidden sm:block"><p class="text-sm font-semibold text-foreground leading-none">{template().header?.full_name}</p><p class="text-[11px] text-muted-foreground mt-0.5">{template().header?.position_name}</p></div><span data-slot="avatar" class="relative flex size-8 shrink-0 overflow-hidden rounded-full h-9 w-9 border-2 border-primary/20">
							<img data-slot="avatar-image" class="aspect-square size-full" src="/assets/images/default_avatar.png" /></span>
						</button>
					</Show>
				</div>
				</header>
			</Show>
			<main id="app" class="bg-dots-pattern flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dot-pattern w-full">
				<div class={location.pathname === "/login" ? "w-full relative z-10" : "max-w-7xl mx-auto relative z-10 p-6 lg:p-8 w-full"} id="app-content">
				<Suspense>{props.children}</Suspense>
				</div>
			</main>
		</div>
		</div>
		);
	}}
	>
	<FileRoutes />
	</Router>
);
}
