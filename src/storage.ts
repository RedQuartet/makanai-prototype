import { demoHistory, makanaiItems, ownerApplicantsSeed } from './data'
import type { Application, MakanaiItem, OwnerApplicant } from './types'

const KEYS = {
  visited: 'makanai:visited',
  favorites: 'makanai:favorites',
  applications: 'makanai:applications',
  seeded: 'makanai:seeded-v2',
  customItems: 'makanai:custom-items',
  ownerApplicants: 'makanai:owner-applicants',
  usedStock: 'makanai:used-stock',
}

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch { return fallback }
}

function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* 保存できなくても画面は動かす */ }
}

/** 前の版で保存した求人を、今のデータの形にそろえる（お手伝いの種類・お店の写真） */
function upgradeCustomItem(item: MakanaiItem): MakanaiItem {
  const store = makanaiItems.find(x => x.storeName === item.storeName)
  return { ...item, storeImage: store?.storeImage ?? item.storeImage, help: { ...item.help, kind: item.help.kind ?? '片付け' } }
}

export const storage = {
  hasVisited: () => read<boolean>(KEYS.visited, false),
  markVisited: () => write(KEYS.visited, true),
  getFavorites: () => read<string[]>(KEYS.favorites, []),
  setFavorites: (ids: string[]) => write(KEYS.favorites, ids),
  /** 初めて開いたときだけ、デモの利用者の「これまでの記録」を足す */
  getApplications: () => {
    const applications = read<Application[]>(KEYS.applications, [])
    if (read<boolean>(KEYS.seeded, false)) return applications
    const seeded = [...applications, ...demoHistory()]
    write(KEYS.applications, seeded)
    write(KEYS.seeded, true)
    return seeded
  },
  setApplications: (applications: Application[]) => write(KEYS.applications, applications),
  getCustomItems: () => read<MakanaiItem[]>(KEYS.customItems, []).map(upgradeCustomItem),
  setCustomItems: (items: MakanaiItem[]) => write(KEYS.customItems, items),
  getOwnerApplicants: () => read<OwnerApplicant[]>(KEYS.ownerApplicants, ownerApplicantsSeed),
  setOwnerApplicants: (applicants: OwnerApplicant[]) => write(KEYS.ownerApplicants, applicants),
  getUsedStock: () => read<string[]>(KEYS.usedStock, []),
  setUsedStock: (ids: string[]) => write(KEYS.usedStock, ids),
  reset: () => { try { Object.values(KEYS).forEach(key => localStorage.removeItem(key)) } catch { /* 何もしない */ } },
}
