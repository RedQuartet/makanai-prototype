import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { makanaiItems } from './data'
import { addDays, toDateKey } from './format'
import { storage } from './storage'
import type { Application, ApplicationStatus, Category, MakanaiItem, OwnerApplicant, Review } from './types'

/** 学生側とお店側の画面で共有する、デモのデータ */
interface Demo {
  items: MakanaiItem[]
  favorites: string[]
  toggleFavorite: (id: string) => void
  applications: Application[]
  apply: (makanaiId: string) => string
  setStatus: (applicationId: string, status: ApplicationStatus) => void
  saveReview: (applicationId: string, review: Review) => void
  ownerApplicants: OwnerApplicant[]
  setOwnerStatus: (applicantId: string, status: ApplicationStatus) => void
  usedStock: string[]
  publishJob: (item: MakanaiItem, stockIds: string[]) => void
  /** まかないを食べたお店の名前 */
  visitedStores: Set<string>
  /** お気に入りや、また行きたいお店から分かる好み */
  likedCategories: Set<Category>
  resetDemo: () => void
}

const DemoContext = createContext<Demo | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(storage.getFavorites)
  const [applications, setApplications] = useState<Application[]>(storage.getApplications)
  const [customItems, setCustomItems] = useState<MakanaiItem[]>(storage.getCustomItems)
  const [ownerApplicants, setOwnerApplicants] = useState<OwnerApplicant[]>(storage.getOwnerApplicants)
  const [usedStock, setUsedStock] = useState<string[]>(storage.getUsedStock)
  const items = useMemo(() => [...customItems, ...makanaiItems], [customItems])

  const updateApplications = (update: (prev: Application[]) => Application[]) => setApplications(prev => { const next = update(prev); storage.setApplications(next); return next })

  const visitedStores = useMemo(() => new Set(applications.filter(a => a.status === 4).map(a => items.find(x => x.id === a.makanaiId)?.storeName).filter((name): name is string => !!name)), [applications, items])
  const likedCategories = useMemo(() => {
    const liked = new Set<Category>()
    favorites.forEach(id => { const item = items.find(x => x.id === id); if (item) liked.add(item.category) })
    applications.filter(a => a.review?.again.includes('visit')).forEach(a => { const item = items.find(x => x.id === a.makanaiId); if (item) liked.add(item.category) })
    return liked
  }, [favorites, applications, items])

  const value: Demo = {
    items, favorites, applications, ownerApplicants, usedStock, visitedStores, likedCategories,
    toggleFavorite: (id) => setFavorites(prev => { const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]; storage.setFavorites(next); return next }),
    apply: (makanaiId) => {
      const active = applications.find(x => x.makanaiId === makanaiId && x.status < 4)
      if (active) return active.id
      const item = items.find(x => x.id === makanaiId)
      const application: Application = { id: `app-${Date.now()}`, makanaiId, status: 0, appliedAt: new Date().toISOString(), jobDate: toDateKey(addDays(new Date(), item?.help.dayOffset ?? 0)) }
      updateApplications(prev => [application, ...prev])
      return application.id
    },
    setStatus: (applicationId, status) => updateApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status } : a)),
    saveReview: (applicationId, review) => updateApplications(prev => prev.map(a => a.id === applicationId ? { ...a, review } : a)),
    setOwnerStatus: (applicantId, status) => setOwnerApplicants(prev => { const next = prev.map(a => a.id === applicantId ? { ...a, status } : a); storage.setOwnerApplicants(next); return next }),
    publishJob: (item, stockIds) => {
      setCustomItems(prev => { const next = [item, ...prev]; storage.setCustomItems(next); return next })
      setUsedStock(prev => { const next = [...prev, ...stockIds]; storage.setUsedStock(next); return next })
    },
    resetDemo: () => {
      if (!window.confirm('お気に入り・応募・お店側でつくった求人を消して、デモを最初の状態に戻しますか？')) return
      storage.reset()
      window.location.hash = '#/welcome'
      window.location.reload()
    },
  }
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const demo = useContext(DemoContext)
  if (!demo) throw new Error('DemoProvider の内側で使ってください')
  return demo
}
