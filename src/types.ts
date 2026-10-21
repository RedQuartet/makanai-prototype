export type Category = 'お肉' | '魚' | '麺類' | '定食' | 'カレー' | 'その他'

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
  help: {
    role: string
    duration: string
    date: string
    location: string
    reward: string
    mealCondition: string
    capacity: string
    requirements: string[]
  }
}

export type ApplicationStatus = 0 | 1 | 2 | 3 | 4

export interface Application {
  id: string
  makanaiId: string
  status: ApplicationStatus
  appliedAt: string
}
