/**
 * The app is mounted under `/portfolio` on the production domain.
 * Override with NEXT_PUBLIC_BASE_PATH at build time if the mount path changes.
 */
function normalizeBasePath(value: string | undefined) {
  if (!value || value === "/") return ""

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`
  return withLeadingSlash.replace(/\/+$/, "")
}

export const BASE_PATH = normalizeBasePath(
  process.env.NEXT_PUBLIC_BASE_PATH ?? "/portfolio"
)

/**
 * Prefix a path served from `public/` so it resolves under the base path.
 * `next/link` and `next/router` do this automatically, but raw asset URLs do not.
 */
export function publicPath(path: string) {
  if (!BASE_PATH || !path.startsWith("/") || path.startsWith("//")) return path
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path

  return `${BASE_PATH}${path}`
}

/** Build a metadata base URL that already includes the deployment base path. */
export function siteBaseUrl(siteUrl: string) {
  return new URL(BASE_PATH || "/", siteUrl)
}
