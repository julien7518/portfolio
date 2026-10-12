import { identity } from "@/resources"
import { renderOgImage } from "@/lib/og-image"

export const alt = `${identity.name} — Creative technologist`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return renderOgImage()
}
