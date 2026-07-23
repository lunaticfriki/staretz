interface PixelIconProps {
  bitmap: string[]
  class?: string
}

export function PixelIcon({ bitmap, class: className }: PixelIconProps) {
  const size = bitmap.length

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="1em"
      height="1em"
      shape-rendering="crispEdges"
      class={className}
      fill="currentColor"
    >
      {bitmap.flatMap((row, y) =>
        [...row].map((cell, x) => (cell === '1' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)),
      )}
    </svg>
  )
}
