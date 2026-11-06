/**
 * @typedef {Object} ProjectIndexItem
 * @property {string} slug - URL-safe identifier for the existing case-file route.
 * @property {string} title - Project name supplied for the archive index.
 * @property {string|null} image - Local image path, null until a real image is supplied.
 */

/** @type {ProjectIndexItem[]} */
export const projects = [
  { slug: 'istanbulkart', title: 'IstanbulKart', image: null },
  { slug: 'project-two', title: 'Project Two', image: null },
  { slug: 'project-three', title: 'Project Three', image: null },
]
