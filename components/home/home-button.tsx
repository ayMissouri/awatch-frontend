import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const homeButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[-0.005em] transition-colors duration-150 select-none",
  {
    variants: {
      variant: {
        primary: "bg-marquee text-white hover:bg-marquee-hover",
        secondary: "bg-neutral-50 text-neutral-950 hover:bg-neutral-200",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-white/[0.04]",
        outlineLight:
          "border border-white/45 bg-black/35 text-white hover:bg-black/50",
        ghost: "text-muted-foreground hover:bg-white/[0.04]",
      },
      size: {
        xs: "h-6 px-2 text-[11px] [&_svg]:size-3",
        sm: "h-[30px] px-3 text-xs [&_svg]:size-3.5",
        md: "h-9 px-3.5 text-[13px] [&_svg]:size-3.5",
        lg: "h-11 px-[18px] text-sm [&_svg]:size-4",
        xl: "h-[52px] px-[22px] text-[15px] [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type HomeButtonProps = VariantProps<typeof homeButtonVariants> &
  (
    | ({ asChild: true } & React.ComponentProps<"a">)
    | ({ asChild?: false } & React.ComponentProps<"button">)
  );

export function HomeButton({
  className,
  variant,
  size,
  asChild,
  ...props
}: HomeButtonProps) {
  if (asChild) {
    return (
      <a
        className={cn(homeButtonVariants({ variant, size, className }))}
        {...(props as React.ComponentProps<"a">)}
      />
    );
  }
  return (
    <button
      className={cn(homeButtonVariants({ variant, size, className }))}
      {...(props as React.ComponentProps<"button">)}
    />
  );
}

export const HomeIconButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    Pick<VariantProps<typeof homeButtonVariants>, "variant"> & { size?: number }
>(function HomeIconButton(
  { className, variant = "outline", size = 30, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        homeButtonVariants({ variant }),
        "p-0 [&_svg]:size-[46%]",
        className,
      )}
      style={{ width: size, height: size }}
      {...props}
    />
  );
});
