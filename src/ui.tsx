import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'

export function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return failed || !src
    ? <div className={`photo-fallback ${className}`} role="img" aria-label={`${alt}のイメージ`}><UtensilsCrossed /><span>{alt}</span></div>
    : <img className={className} src={src} alt={alt} onError={() => setFailed(true)} />
}

export function Logo({ compact = false, to = '/home' }: { compact?: boolean; to?: string }) {
  return <Link to={to} className={`logo ${compact ? 'compact' : ''}`} aria-label="MAKANAI ホームへ"><span className="logo-mark"><UtensilsCrossed /></span><span>MAKANAI</span></Link>
}
