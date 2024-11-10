import { cn } from "@/lib/utils"

export default function GridPattern({ squares = [], className }) {
  return (
    <div 
      className={cn("absolute inset-0 grid", className)}
      style={{
        gridTemplateColumns: 'repeat(20, 1fr)',
        gridTemplateRows: 'repeat(20, 1fr)',
      }}
    >
      {squares.map(([x, y], i) => (
        <div
          key={i}
          className="bg-neutral-200/20 dark:bg-neutral-800/20"
          style={{
            gridColumn: x,
            gridRow: y,
          }}
        />
      ))}
    </div>
  )
}
