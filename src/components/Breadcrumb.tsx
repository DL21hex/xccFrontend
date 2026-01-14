import { ComponentProps, For, Show, splitProps, createSignal } from "solid-js";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const [breadcrumbs, setBreadcrumbs] = createSignal<BreadcrumbItem[]>([]);

interface BreadcrumbProps extends ComponentProps<"nav"> {
  items: BreadcrumbItem[];
}

export const Breadcrumb = (props: BreadcrumbProps) => {
  const [local, rest] = splitProps(props, ["items", "class"]);

  return (
    <nav aria-label="breadcrumb" class={local.class} {...rest}>
      <ol class="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5">
        <For each={local.items}>
          {(item, index) => {
            const isLast = index() === local.items.length - 1;

            return (
              <>
                <li
                  class={`inline-flex items-center gap-1.5 ${!isLast ? "hidden md:inline-flex" : ""}`}
                >
                  <Show
                    when={!isLast}
                    fallback={
                      <span class="text-foreground font-normal" aria-current="page">
                        {item.label}
                      </span>
                    }
                  >
                    <a
                      href={item.href || "#"}
                      class="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </a>
                  </Show>
                </li>

                <Show when={!isLast}>
                  <li role="presentation" aria-hidden="true" class="[&>svg]:size-3.5 hidden md:block">
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
                      class="lucide lucide-chevron-right"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </li>
                </Show>
              </>
            );
          }}
        </For>
      </ol>
    </nav>
  );
};
