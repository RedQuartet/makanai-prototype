export type Category = 'お肉' | '魚' | '麺類' | '定食' | 'カレー' | 'その他'

export type HelpKind = '片付け' | '清掃' | '仕込み' | '接客' | '運ぶ' | '品出し' | '軽作業' | '試食' | '写真・SNS' | 'メニューづくり' | '花壇・庭' | 'イベント'

/** まかないに使う、期限が近い食材。kg はこのお手伝い全員分のまかないで使う量 */
export interface Ingredient {
  name: string
  kg: number
  daysLeft: number
}

export interface MakanaiItem {
  id: string
  dishName: string
  storeName: string
  category: Category
  area: string
  access: { minutes: number; distance: string; route: string }
  rating: number
  reviewCount: number
  mapPoint: { x: number; y: number }
  shortDescription: string
  description: string
  recommendation: string[]
  dishImage: string
  storeImage: string
  tags: string[]
  atmosphere: string
  storeDescription: string
  ingredients: Ingredient[]
  /** お店側の画面でつくったばかりの求人 */
  fresh?: boolean
  /** まかないを安く売るとき（手伝わずに食べたい人向け）。売る日はお手伝いと同じ日 */
  sale?: {
    price: number
    from: string
    until: string
    remaining: number
  }
  help: {
    kind: HelpKind
    role: string
    /** 何をするかの説明（1 文） */
    detail?: string
    /** 開いた日から何日後か（0 = 今日） */
    dayOffset: number
    start: string
    minutes: number
    location: string
    hourlyWage: number
    transport: string
    mealCondition: string
    slots: number
    remaining: number
    requirements: string[]
  }
}

export type ApplicationStatus = 0 | 1 | 2 | 3 | 4

export type Again = 'visit' | 'help'

export interface Review {
  again: Again[]
  comment: string
  createdAt: string
}

/** help = 手伝って食べる（応募）、buy = 安く買って食べる（予約） */
export type ApplicationType = 'help' | 'buy'

export interface Application {
  id: string
  /** ない場合は help（前の版で保存した応募） */
  type?: ApplicationType
  makanaiId: string
  status: ApplicationStatus
  appliedAt: string
  /** お手伝いの日（YYYY-MM-DD）。応募したときに決まる */
  jobDate?: string
  review?: Review
}

/** お店側の画面に並ぶ、ほかの学生の応募（デモ用） */
export interface OwnerApplicant {
  id: string
  name: string
  profile: string
  makanaiId: string
  status: ApplicationStatus
  review?: Review
}

export interface StockItem {
  id: string
  name: string
  kg: number
  daysLeft: number
}

/** お店がこれまでに出したまかない。学生の画面で、お店の実績として写真つきで見せる */
export interface PastMakanai {
  name: string
  image: string
  /** 何日前に出したか */
  daysAgo: number
  /** 商店街のイベントなど、日付の代わりに見せる名前 */
  occasion?: string
  /** 手伝って食べた人 */
  helped: number
  /** 安く買って食べた人（売らなかった回は 0） */
  bought: number
  /** 食べた学生のひとこと */
  voice: string
}

export interface StoreHistory {
  /** MAKANAI でまかないを出した回数 */
  times: number
  /** 食べた学生（のべ人数） */
  students: number
  /** 新しい順 */
  past: PastMakanai[]
}
