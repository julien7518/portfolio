import { ArrowUpRight } from "lucide-react"

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
}

export default function ProjectCard({
  name,
  description,
  content,
  link,
  live,
  category,
}: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{content}</p>
        <div className="space-x-2">
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
    </Card>
  )
}
