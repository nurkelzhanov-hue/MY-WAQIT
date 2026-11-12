// Public files (src/../public) live under the site's base path (e.g. /MY-WAQIT/ on GitHub Pages).
// Use this helper instead of hardcoding '/img/...'.
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
