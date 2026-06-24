"use client";

import * as React from "react";
import Link from "next/link";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const navMenuContentClass = cn(
  "z-50 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden border border-[var(--border-strong)] bg-popover p-1.5 text-popover-foreground",
  "shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)] duration-100",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
  "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
);

export function NavMenuLabel({
  children,
  trailing,
}: {
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <DropdownMenuPrimitive.Label className="flex items-center justify-between px-2.5 pt-2.5 pb-1.5">
      <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground/80 uppercase">
        {children}
      </span>
      {trailing}
    </DropdownMenuPrimitive.Label>
  );
}

export function NavMenuSeparator() {
  return (
    <DropdownMenuPrimitive.Separator className="-mx-1.5 my-1.5 h-px bg-border" />
  );
}

const rowBase =
  "group/row flex h-9 w-full items-center gap-[11px] px-2.5 text-left outline-none select-none cursor-pointer transition-colors focus:outline-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:shrink-0";

export function NavMenuItem({
  icon: Icon,
  label,
  sub,
  shortcut,
  trailing,
  check,
  dot,
  danger,
  accent,
  href,
  onSelect,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  sub?: string;
  shortcut?: string;
  trailing?: React.ReactNode;
  check?: boolean;
  dot?: string;
  danger?: boolean;
  accent?: boolean;
  href?: string;
  onSelect?: (event: Event) => void;
}) {
  const rowClass = cn(
    rowBase,
    sub && "h-auto py-2",
    danger
      ? "text-destructive focus:bg-destructive/10"
      : "focus:bg-white/[0.055]",
  );
  const labelColor = danger
    ? "text-destructive"
    : accent
      ? "text-marquee"
      : "text-foreground";

  const inner = (
    <>
      {dot && (
        <span className="size-[7px] rounded-full" style={{ background: dot }} />
      )}
      {Icon && (
        <Icon
          size={15}
          className={cn(
            danger
              ? "text-destructive"
              : "text-muted-foreground group-focus/row:text-foreground",
          )}
        />
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "truncate text-[13px] leading-tight font-medium tracking-[-0.005em]",
            labelColor,
          )}
        >
          {label}
        </span>
        {sub && (
          <span className="font-mono text-[9.5px] tracking-wide text-muted-foreground/80">
            {sub}
          </span>
        )}
      </span>
      {trailing}
      {shortcut && (
        <kbd className="border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {shortcut}
        </kbd>
      )}
      {check && <Check size={15} className="text-marquee" />}
    </>
  );

  if (href) {
    return (
      <DropdownMenuPrimitive.Item asChild onSelect={onSelect}>
        <Link href={href} className={rowClass}>
          {inner}
        </Link>
      </DropdownMenuPrimitive.Item>
    );
  }
  return (
    <DropdownMenuPrimitive.Item className={rowClass} onSelect={onSelect}>
      {inner}
    </DropdownMenuPrimitive.Item>
  );
}
