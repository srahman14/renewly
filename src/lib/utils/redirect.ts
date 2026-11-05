// Redirect targets come from the URL (?redirect=, ?next=), so anyone can
// craft a link with their own value. Only allow same-site paths: must
// start with a single "/" and not "//" or "/\" (both of which browsers
// treat as another host). Anything else falls back to the default.
export function safeRedirectPath(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback
  return value
}
