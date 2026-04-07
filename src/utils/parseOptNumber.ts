/** Parses optional positive number from form text; empty → undefined. */
export function parseOptNumber(s: string): number | undefined {
  const t = s.trim()
  if (t === '') return undefined
  const n = Number(t)
  return Number.isFinite(n) ? n : undefined
}
