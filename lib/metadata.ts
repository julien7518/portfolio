import type { Metadata } from "next"

import { identity, pageTitle, seo, socialById } from "@/resources"

type PageMetadata = {
  title?: string
  description: string
  path: string
}

/** Projects get their own generated image; other pages share the portfolio card. */
export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadata): Metadata {
  const socialTitle = title ? pageTitle(title) : seo.title
  const image = {
    url: path.startsWith("/projects/")
      ? `${path}/opengraph-image`
      : "/opengraph-image",
    width: 1200,
    height: 630,
    alt: socialTitle,
  }

  return {
    title: title ?? { absolute: seo.title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: identity.name,
      type: "website",
      locale: seo.locale,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      creator: socialById("x")?.handle,
      images: [image],
    },
  }
}
