"use client"

import { Fragment, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { originCrumbs, type Crumb } from "@/lib/breadcrumbs"

const crumbBase = "font-mono text-[10px] tracking-[0.10em] uppercase transition-colors"


export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Breadcrumb">
      {items.map((it, i) => {
        const last = i === items.length - 1
        return (
          <Fragment key={`${it.label}-${i}`}>
            {i > 0 && <ChevronRight size={10} className="text-[color:var(--fg-subtle)]" />}
            {!last && it.href ? (
              <Link href={it.href} className={cn(crumbBase, "text-[color:var(--fg-subtle)] hover:text-foreground")}>
                {it.label}
              </Link>
            ) : !last && it.onClick ? (
              <button type="button" onClick={it.onClick} className={cn(crumbBase, "text-[color:var(--fg-subtle)] hover:text-foreground")}>
                {it.label}
              </button>
            ) : (
              <span className={cn(crumbBase, last ? "text-foreground" : "text-[color:var(--fg-subtle)]")}>
                {it.label}
              </span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}

function DetailCrumbsInner({ current }: { current: string }) {
  const sp = useSearchParams()
  return <Breadcrumbs items={[...originCrumbs(sp), { label: current }]} />
}

export function DetailCrumbs({ current }: { current: string }) {
  return (
    <Suspense fallback={<Breadcrumbs items={[{ label: current }]} />}>
      <DetailCrumbsInner current={current} />
    </Suspense>
  )
}
