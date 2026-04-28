import type { Media } from '@/payload-types'
import Image from 'next/image'

type Props = {
  label: string
  image?: Media | string | null
  className?: string
  style?: React.CSSProperties
  aspectRatio?: string
  sizes?: string
}

export function Placeholder({ label, image, className, style, aspectRatio, sizes }: Props) {
  const url =
    typeof image === 'object' && image && 'url' in image && image.url ? image.url : null
  const alt = typeof image === 'object' && image && image.alt ? image.alt : label

  if (url) {
    return (
      <div
        className={className}
        style={{
          position: 'relative',
          aspectRatio,
          borderRadius: 6,
          overflow: 'hidden',
          ...style,
        }}
      >
        <Image
          src={url}
          alt={alt}
          fill
          sizes={sizes ?? '(max-width: 900px) 100vw, 50vw'}
          style={{ objectFit: 'cover' }}
        />
      </div>
    )
  }

  return (
    <div
      className={`ph ${className ?? ''}`}
      data-label={label}
      style={{ aspectRatio, ...style }}
    />
  )
}
