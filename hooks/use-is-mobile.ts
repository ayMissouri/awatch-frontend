import * as React from "react"

export function useIsMobile(maxWidth = 767): boolean {
  const query = `(max-width: ${maxWidth}px)`
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  )

  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return isMobile
}
