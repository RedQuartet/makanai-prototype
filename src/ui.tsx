import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, ChefHat, ClipboardCheck, ConciergeBell, Droplets, Package, PartyPopper, PenLine, ShoppingBasket, Sprout, Tags, Trash2, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import type { HelpKind } from './types'

export function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return failed || !src
    ? <div className={`photo-fallback ${className}`} role="img" aria-label={`${alt}のイメージ`}><UtensilsCrossed /><span>{alt}</span></div>
    : <img className={className} src={src} alt={alt} onError={() => setFailed(true)} />
}

export function Logo({ compact = false, to = '/home' }: { compact?: boolean; to?: string }) {
  return <Link to={to} className={`logo ${compact ? 'compact' : ''}`} aria-label="MAKANAI ホームへ"><span className="logo-mark"><UtensilsCrossed /></span><span>MAKANAI</span></Link>
}

const kindIcons: Record<HelpKind, LucideIcon> = {
  片付け: Droplets, 清掃: Trash2, 仕込み: ChefHat, 接客: ConciergeBell, 運ぶ: Package, 品出し: ShoppingBasket,
  軽作業: Tags, 試食: ClipboardCheck, '写真・SNS': Camera, メニューづくり: PenLine, '花壇・庭': Sprout, イベント: PartyPopper,
}

/** お手伝いの種類（前に保存した求人で種類がないときは、ふつうの食器アイコン） */
export function KindIcon({ kind }: { kind?: HelpKind }) {
  const Icon = (kind && kindIcons[kind]) || UtensilsCrossed
  return <Icon />
}
