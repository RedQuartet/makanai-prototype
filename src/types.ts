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

export interface Application {
  id: string
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
