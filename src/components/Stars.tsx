type Props = {
  value?: number
  size?: number
}

export function Stars({ value = 5, size = 13 }: Props) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  const arr: string[] = []
  for (let i = 0; i < 5; i++) {
    if (i < full) arr.push('★')
    else if (i === full && half) arr.push('★')
    else arr.push('☆')
  }
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${value} out of 5`}>
      {arr.map((c, i) => (
        <span key={i} className={i >= full && !(i === full && half) ? 'empty' : ''}>
          {c}
        </span>
      ))}
    </span>
  )
}
