import { For } from "solid-js";

const iconMap: Record<string, string> = {
  home: 'M3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22 9 12 15 12 15 22',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  "trending-up": 'M22 7 13.5 15.5 8.5 10.5 2 17 M16 7h6v6',
  shield: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
  factory: 'M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z M17 18h1 M12 18h1 M7 18h1',
  "shopping-cart": 'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12',
  cpu: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2 M9 9h6v6H9 M15 2v2 M15 20v2 M2 15h2 M2 9h2 M20 15h2 M20 9h2 M9 2v2 M9 20v2',
  lock: 'M7 11V7a5 5 0 0 1 10 0v4 M3 21h18a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2',
  settings: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
};

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  is_active?: boolean;
}

interface NavProps {
  items: MenuItem[];
}

export default function Nav(props: NavProps) {
  return (
    <>
      <div class="px-3 mb-2">
        <span class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-3">
          Menú principal
        </span>
      </div>
      <nav class="space-y-0.5 px-3">
        <For each={props.items}>
          {(item) => (
            <div>
              <a
                href={item.href}
                class={`flex items-center w-full rounded-md text-[13px] font-medium transition-all duration-150 justify-between px-3 py-2 ${
                  item.is_active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
                data-state="closed"
                data-slot="tooltip-trigger"
              >
                <div class="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class={`lucide h-[18px] w-[18px] shrink-0 ${
                      item.is_active
                        ? "text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/60"
                    }`}
                  >
                    <path d={iconMap[item.icon] || ""}></path>
                  </svg>
                  <span>{item.label}</span>
                </div>
              </a>
            </div>
          )}
        </For>
      </nav>
    </>
  );
}
