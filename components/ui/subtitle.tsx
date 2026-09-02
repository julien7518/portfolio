export default function SubTitle({
  label,
  number,
}: {
  label: string
  number: number
}) {
  return (
    <div className="md:col-span-2">
      <div className="flex items-baseline justify-between pt-4">
        <h1 className="font-heading text-5xl italic md:text-8xl">{label}</h1>
        <span className="font-mono text-xs text-muted-foreground">
          [{number}]
        </span>
      </div>
      <hr className="bg-muted" />
    </div>
  )
}
