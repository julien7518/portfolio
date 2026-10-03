/**
 * Everything the site says about its owner, in one place.
 *
 * Anything that appears in more than one file lives here so a change lands
 * everywhere at once: edit a value below and every hero, header, footer, mail
 * link and meta tag follows. Nothing in this file may import React or use
 * client-only APIs — it is read from both server and client components.
 */

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const identity = {
  /** Full name, used in the footer, meta tags and document title. */
  name: "Julien Fernandes",
  /** The monogram in the header. */
  initials: "JF",
  /** One line describing the work, shown in the hero. */
  role: "Creative technologist",
  /** Longer phrasing for meta descriptions. */
  tagline: "Engineering student based in Paris, France",
} as const

export const location = {
  city: "Paris",
  country: "France",
  /** "Paris, France" — the hero's top-left corner. */
  label: "Paris, France",
  /** The line under the contact heading. */
  note: "Based in Paris — open to remote or relocate",
} as const

export const contact = {
  email: "julien.f2004@icloud.com",
  /** The eyebrow above the contact heading. */
  availability: "Available for an internship or a project",
  /** Builds a mailto: href. Use this instead of writing the scheme inline. */
  mailto: (subject?: string) =>
    `mailto:${contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`,
} as const

export type SocialId = "github" | "linkedin" | "instagram" | "x"

export type SocialLink = {
  id: SocialId
  /** Label announced to screen readers and shown in the footer. */
  name: string
  handle: string
  href: string
}

export const social: readonly SocialLink[] = [
  {
    id: "github",
    name: "GitHub",
    handle: "julien7518",
    href: "https://github.com/julien7518",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "in/julien-fernandes",
    href: "https://www.linkedin.com/in/julien-fernandes-61a957370/",
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@julien_75018",
    href: "https://www.instagram.com/julien_75018/",
  },
  {
    id: "x",
    name: "X",
    handle: "@julien_7518",
    href: "https://x.com/julien_7518",
  },
] as const

export const seo = {
  url: rawUrl,
  description:
    "Creative technologist in Paris, France. Web interfaces, native apps, embedded firmware and trained models.",
  keywords: [
    "julien",
    "fernandes",
    "developer",
    "engineer",
    "portfolio",
    "paris",
  ],
  locale: "en_US",
} as const

/** Document title for a page, matching the template in the root layout. */
export const pageTitle = (page: string) => `${page} | ${identity.name}`
