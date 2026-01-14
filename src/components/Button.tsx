import { type Component, type JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { SEMANTIC_COLORS, type SemanticType } from "../constants/colors";

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string;
  href?: string;
  icon?: Component<JSX.SvgSVGAttributes<SVGSVGElement>>;
  variant?: "default" | "ghost" | SemanticType;
  size?: "default" | "sm" | "lg" | "icon";
};

const getVariantClass = (variant: ButtonProps["variant"]) => {
  if (!variant || variant === "default") {
    return "bg-white text-foreground hover:bg-accent hover:text-accent-foreground border-border shadow-xs";
  }
  if (variant === "ghost") {
    return "hover:bg-slate-100 hover:text-slate-900 text-muted-foreground border-transparent shadow-none";
  }
  const theme = SEMANTIC_COLORS[variant as SemanticType];
  return `${theme?.bg} ${theme?.text} ${theme?.bgHover} border-transparent shadow-xs`;
};

const sizeClasses = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 rounded-md px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-8 has-[>svg]:px-6",
  icon: "h-9 w-9",
};

export default function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ["label", "icon", "class", "href", "variant", "size"]);
  const variantClass = getVariantClass(local.variant);
  const sizeClass = sizeClasses[local.size || "default"];

  return (
    <Dynamic
      component={local.href ? "a" : "button"}
      href={local.href}
      data-slot="button"
      data-variant={local.variant || "default"}
      data-size={local.size || "default"}
      class={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-normal transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border dark:border-input ${sizeClass} ${variantClass} ${local.class || ""}`}
      {...others}
    >
      {local.icon && <local.icon class="h-4 w-4" />}
      <span class={local.size === "icon" ? "sr-only" : ""}>{local.label}</span>
    </Dynamic>
  );
}
