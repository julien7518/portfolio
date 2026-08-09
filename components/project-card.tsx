import { ArrowUpRight } from "lucide-react"
import Image from "next/image"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "./ui/card"
import LinkButton from "./ui/link-button"
import { Badge } from "./ui/badge"
import { GitHub } from "./logos"
import { ProjectType } from "@/app/projects/project"

export type ProjectCardProps = Pick<
  ProjectType,
  | "name"
  | "subtitle"
  | "description"
  | "link"
  | "live"
  | "github"
  | "categories"
  | "imageSrc"
  | "imageAlt"
  | "reverse"
  | "minHeight"
  | "imageProportion"
>

export default function ProjectCard({
  name,
  subtitle,
  description,
  link,
  live,
  github,
  categories,
  imageSrc,
  imageAlt,
}: ProjectCardProps) {
  return (
    <Card className="h-full min-h-0">
      {imageSrc && imageAlt ? (
        <div className="relative w-1/3">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
        </div>
      ) : null}

      <div className="flex h-full w-full flex-col">
        <CardHeader className="shrink-0">
          <CardTitle>{name}</CardTitle>
          {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
        </CardHeader>

        <CardContent className="min-h-0 flex-1 space-y-4">
          <p>{description}</p>
          <div className="space-y-2 space-x-2">
            {categories?.map((label, index) => (
              <Badge variant="secondary" key={index}>
                {label}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="w-full shrink-0 flex-wrap gap-x-6">
          {link ? (
            <CardAction>
              <LinkButton
                labelFull="Learn more"
                labelShort="More"
                link={link}
              />
            </CardAction>
          ) : null}
          {live ? (
            <CardAction>
              <LinkButton
                labelFull="View live"
                labelShort="Live"
                link={live}
                target="_blank"
                iconPosition="start"
                icon={ArrowUpRight}
              />
            </CardAction>
          ) : null}
          {github ? (
            <CardAction>
              <LinkButton
                labelFull="GitHub repository"
                labelShort="GitHub"
                link={github}
                target="_blank"
                icon={GitHub}
                iconPosition="start"
              />
            </CardAction>
          ) : null}
        </CardFooter>
      </div>
    </Card>
  )
}
