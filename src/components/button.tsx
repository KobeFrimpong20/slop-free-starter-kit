import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 font-body text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover active:bg-accent-active",
  secondary:
    "border border-border bg-surface text-foreground hover:border-accent hover:bg-accent-subtle hover:text-accent active:bg-accent-100",
};

/** Button classes, for links that should look like buttons. */
export function buttonStyles(variant: Variant = "primary") {
  return `${base} ${variants[variant]}`;
}

type Props = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className = "", ...props }: Props) {
  return (
    <button
      className={`${buttonStyles(variant)} ${className}`}
      {...props}
    />
  );
}
