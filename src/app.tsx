import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal, createEffect, Show } from "solid-js";
import Nav from "~/components/Nav";
import { request } from "~/utils/request";
import "./app.css";

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
		return await request<TemplateData>("http://localhost:80/xcctechpeople/tools/sandbox/template_public");
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
		tenant: { name: "Skeleton...", logo: "images/xcc_small.png", primary_color: "#219ebc", light_color: "#E3F6FB", logo_width: "96px" },
		main_menu: [],
		header: { full_name: "Skeleton...", position_name: "Skeleton...", avatar: "" }
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
						tenant: { name: "Skeleton...", logo: "images/xcc_small.png", primary_color: "#219ebc", light_color: "#E3F6FB", logo_width: "96px" },
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
							localStorage.setItem("template_data", JSON.stringify(data));
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
		<aside class="border-r border-sidebar-border bg-sidebar flex flex-col h-screen transition-all duration-300 ease-in-out w-[240px]">
			<div class="h-16 flex items-center justify-between px-3 border-b border-sidebar-border">
			<div class="flex items-center gap-2.5 overflow-hidden">
				<img src={template().tenant?.logo} alt="Logo" class="w-8 h-8 shrink-0" />
				<span class="font-semibold text-sidebar-foreground tracking-tight whitespace-nowrap">
				{template().tenant?.name}
				</span>
			</div>
			</div>
			<div class="flex-1 py-4 overflow-y-auto">
			<Nav items={template().main_menu} />
			</div>
			<div class="mt-auto">
			<div data-orientation="horizontal" role="none" data-slot="separator" class="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-3"></div>
			<div class="py-3 space-y-0.5 px-3">
				<a href="/perfil" class="flex items-center w-full rounded-md text-[13px] font-medium transition-colors gap-3 px-3 py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground" data-state="closed" data-slot="tooltip-trigger">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user h-[18px] w-[18px] shrink-0"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
				Mi perfil
				</a>
				<a href="/logout_public" class="flex items-center w-full rounded-md text-[13px] font-medium transition-colors gap-3 px-3 py-2 text-destructive/80 hover:bg-destructive/10 hover:text-destructive" data-state="closed" data-slot="tooltip-trigger">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out h-[18px] w-[18px] shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
				Cerrar sesión
				</a>
			</div>
			</div>
		</aside>
		</Show>

		<div class="flex-1 flex flex-col">
			<Show when={location.pathname !== "/login" && template().header}>
				<header class="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4">
				<div class="flex items-center gap-3">
					<button data-slot="tooltip-trigger" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 text-muted-foreground hover:text-foreground" data-state="closed">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-left h-5 w-5"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg>
					</button>
					<div class="relative hidden md:flex items-center"></div>
				</div>
				<div class="flex items-center gap-1">
					<button data-slot="tooltip-trigger" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 text-muted-foreground hover:text-foreground md:hidden" data-state="closed">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search h-[18px] w-[18px]"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg></button><button data-slot="tooltip-trigger" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 text-muted-foreground hover:text-foreground relative" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users h-[18px] w-[18px]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></button><button data-slot="tooltip-trigger" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 text-muted-foreground hover:text-foreground relative" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell h-[18px] w-[18px]"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg><span data-slot="badge" class="rounded-md border font-medium whitespace-nowrap shrink-0 [&&gt;svg]:size-3 gap-1 [&&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&]:hover:bg-primary/90 absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">3</span></button><button data-slot="tooltip-trigger" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 text-muted-foreground hover:text-foreground" data-state="closed"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg></button><div class="w-px h-6 bg-border mx-2"></div>
					<Show when={template().header}>
						<button class="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg hover:bg-muted/50 transition-colors" type="button" id="radix-_r_h_" aria-haspopup="menu" aria-expanded="false" data-state="closed" data-slot="dropdown-menu-trigger"><div class="text-right hidden sm:block"><p class="text-sm font-semibold text-foreground leading-none">{template().header?.full_name}</p><p class="text-[11px] text-muted-foreground mt-0.5">{template().header?.position_name}</p></div><span data-slot="avatar" class="relative flex size-8 shrink-0 overflow-hidden rounded-full h-9 w-9 border-2 border-primary/20">
							<img data-slot="avatar-image" class="aspect-square size-full" src={template().header?.avatar || "/images/default_avatar.png"} /></span>
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