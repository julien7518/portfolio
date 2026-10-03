export {
  contact,
  identity,
  location,
  pageTitle,
  seo,
  social,
  type SocialId,
  type SocialLink,
} from "./site"

import { social, type SocialId } from "./site"

/** Looks a social link up by its id, for components that pick a logo. */
export const socialById = (id: SocialId) =>
  social.find((link) => link.id === id)
