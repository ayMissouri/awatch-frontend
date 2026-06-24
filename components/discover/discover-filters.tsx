"use client";

import { useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DISCOVER_MODES,
  type DiscoverMode,
} from "@/components/discover/discover-data";

export function ModeTabs({
  mode,
  onChange,
}: {
  mode: DiscoverMode;
  onChange: (m: DiscoverMode) => void;
}) {
  return (
    <div className="flex gap-5 md:gap-[26px]">
      {DISCOVER_MODES.map((m) => {
        const on = m.id === mode;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={cn(
              "relative px-px pb-2.5 text-[13px] tracking-[-0.01em] transition-colors md:text-[15px]",
              on
                ? "font-semibold text-white"
                : "font-medium text-muted-foreground/80 hover:text-foreground",
            )}
          >
            {m.label}
            <span
              className={cn(
                "absolute inset-x-0 -bottom-px h-0.5 transition-colors",
                on ? "bg-marquee" : "bg-transparent",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export function FilterChip({
  label,
  tint,
  active,
  onClick,
}: {
  label: string;
  tint?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-[34px] shrink-0 items-center gap-[7px] whitespace-nowrap border px-[15px] text-[13px] font-medium tracking-[-0.005em] transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-white/20 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground",
      )}
    >
      {tint && (
        <span
          className="size-[7px] shrink-0 rounded-full"
          style={{ background: tint }}
        />
      )}
      {label}
    </button>
  );
}

function ArrowButton({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      className="inline-flex size-[34px] shrink-0 items-center justify-center border border-border bg-card text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground"
    >
      <Icon size={15} />
    </button>
  );
}

export interface ChipOption {
  id: string;
  label: string;
  tint?: string;
}

export function ChipRail({
  options,
  value,
  onSelect,
  allLabel,
  withDot = false,
}: {
  options: ChipOption[];
  value: string | null;
  onSelect: (id: string | null) => void;
  allLabel: string;
  withDot?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) =>
    ref.current?.scrollBy({ left: d * 340, behavior: "smooth" });
  return (
    <div className="relative flex items-center gap-2.5">
      <div
        ref={ref}
        className="flex flex-1 gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <FilterChip
          label={allLabel}
          active={value == null}
          onClick={() => onSelect(null)}
        />
        {options.map((opt) => (
          <FilterChip
            key={opt.id}
            label={opt.label}
            tint={withDot ? opt.tint : undefined}
            active={value === opt.id}
            onClick={() => onSelect(value === opt.id ? null : opt.id)}
          />
        ))}
      </div>
      <div className="hidden shrink-0 gap-1.5 md:flex">
        <ArrowButton dir="left" onClick={() => scroll(-1)} />
        <ArrowButton dir="right" onClick={() => scroll(1)} />
      </div>
    </div>
  );
}

export function YearInput({
  value,
  onPick,
  full = false,
}: {
  value: number | null;
  onPick: (year: number | null) => void;
  full?: boolean;
}) {
  const [text, setText] = useState(value != null ? String(value) : "");
  const [focus, setFocus] = useState(false);

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value != null) setText(String(value));
    else if (text.length === 4) setText("");
  }

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setText(raw);
    onPick(raw.length === 4 ? parseInt(raw, 10) : null);
  };
  const has = text.length > 0;

  return (
    <div
      className={cn(
        "inline-flex h-[34px] items-center gap-2.5 border bg-card pr-2.5 pl-3 transition-colors",
        full ? "w-full" : "w-[200px]",
        focus ? "border-marquee" : has ? "border-white/20" : "border-border",
      )}
    >
      <Calendar size={13} className="shrink-0 text-muted-foreground" />
      <input
        value={text}
        onChange={handle}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        inputMode="numeric"
        placeholder="Any year — e.g. 2024"
        className="h-full min-w-0 flex-1 bg-transparent text-[12.5px] font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
      />
      {has && (
        <button
          type="button"
          onClick={() => {
            setText("");
            onPick(null);
          }}
          aria-label="Clear year"
          className="inline-flex shrink-0 text-muted-foreground/70 transition-colors hover:text-foreground"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
