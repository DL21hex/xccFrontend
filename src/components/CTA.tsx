import { createSignal, Show } from "solid-js";
import Button from "./Button";
import { SEMANTIC_COLORS, type SemanticType } from "../constants/colors";
import IconAlert from '~icons/lucide/alert-triangle';
import IconError from '~icons/lucide/x-circle';
import IconInfo from '~icons/lucide/info';
import IconSuccess from '~icons/lucide/check-circle-2';
import IconArrowRight from '~icons/lucide/arrow-right';
import IconClose from '~icons/lucide/x';

const typeIconMap: Record<string, typeof IconAlert> = {
  warning: IconAlert,
  info: IconInfo,
  success: IconSuccess,
  error: IconError,
};

interface CTAProps {
  type: SemanticType;
  badge: string;
  title: string;
  description: string;
  button_name: string;
  button_href: string;
}

export default function CTA(props: CTAProps) {
  const [isDismissed, setIsDismissed] = createSignal(false);
  const type = SEMANTIC_COLORS[props.type] ? props.type : "warning";
  const theme = SEMANTIC_COLORS[type];
  const IconComponent = typeIconMap[type] || IconAlert;

  return (
    <Show when={!isDismissed()}>
      <div
        data-slot="card"
        class={`text-card-foreground flex flex-col gap-6 rounded-xl border py-6 border-l-4 overflow-hidden transition-all duration-300 hover:shadow-md shadow-sm ${theme.border} ${theme.gradient}`}
      >
        <div data-slot="card-content" class="p-4 sm:p-5">
        <div class="flex items-start gap-4">
          <div class={`p-2.5 rounded-xl ${theme.iconText} ${theme.iconBg} shrink-0`}>
            <IconComponent class="lucide h-5 w-5" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span
                data-slot="badge"
                class={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 w-fit whitespace-nowrap shrink-0 text-xs font-medium ${theme.lightBg} ${theme.lightText}`}
              >
                {props.badge}
              </span>
            </div>
            <h3 class="font-semibold text-slate-900 mb-1">{props.title}</h3>
            <p class="text-sm text-muted-foreground line-clamp-2">
              {props.description}
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <Button
              href={props.button_href}
              label={props.button_name}
              icon={IconArrowRight}
              variant={type}
            />
            <Button
              label="Descartar"
              icon={IconClose}
              variant="ghost"
              size="icon"
              class="h-8 w-8 text-muted-foreground hover:text-slate-700"
              onClick={() => setIsDismissed(true)}
            />
          </div>
        </div>
        </div>
      </div>
    </Show>
  );
}
