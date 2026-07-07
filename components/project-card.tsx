import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "./ui/card"
import LinkButton from "./link-button"
import { Badge } from "./ui/badge"

interface ProjectCardProps {
  name: string
  description?: string
  content: string
  link: string
  live?: string
  category?: string[]
  imageSrc?: string
  imageAlt?: string
  reverse?: boolean
  minHeight?: number
  imageProportion?: "1/2" | "1/3" | "1/4"
}

export default function ProjectCard({
  name,
  description,
  content,
  link,
  live,
  category,
  imageSrc,
  imageAlt,
  reverse = false,
}: ProjectCardProps) {
  return (
    <Card
      className={cn(
        "flex min-h-0 flex-col-reverse overflow-hidden",
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      )}
    >
      {imageSrc && imageAlt ? (
        <div className="relative w-1/3">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
        </div>
      ) : null}

      <div className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-4">
          <p>{content}</p>
          <div className="space-y-2 space-x-2">
            {category?.map((label, index) => (
              <Badge variant="secondary" key={index}>
                {label}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="space-x-8">
          <CardAction>
            <LinkButton label="Learn more" link={link} icon={ArrowUpRight} />
          </CardAction>
          {live ? (
            <CardAction>
              <LinkButton label="View live" link={live} icon={ArrowUpRight} />
            </CardAction>
          ) : null}
        </CardFooter>
      </div>
    </Card>
  )
}
