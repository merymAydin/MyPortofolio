/**
 * Canonical route paths for The Forgotten Archives.
 * Keeping paths in one module prevents drift between the router and navigation.
 */
export const ROUTES = {
  home: '/',
  author: '/archives/the-author',
  laboratory: '/archives/the-laboratory',
  caseFiles: '/archives/case-files',
  caseFilePattern: '/archives/case-files/:slug',
  caseFile: (slug) => `/archives/case-files/${slug}`,
  chronicles: '/archives/the-chronicles',
  correspondence: '/archives/correspondence',
}
