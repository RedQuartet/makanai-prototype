import type { MakanaiItem } from './types'

const WEEK = ['日', '月', '火', '水', '木', '金', '土']

/** システム利用料の割合（お手伝いが成立したときだけ、給与にかける） */
export const FEE_RATE = 0.3

export function addDays(base: Date, days: number) {
  const date = new Date(base)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return date
}

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function fromDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function monthDay(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日（${WEEK[date.getDay()]}）`
}

/** 今日・明日・あさって・昨日は言葉で、それ以外は日付で */
export function dayLabel(date: Date, today = new Date()) {
  const diff = Math.round((addDays(date, 0).getTime() - addDays(today, 0).getTime()) / 86400000)
  if (diff === 0) return '今日'
  if (diff === 1) return '明日'
  if (diff === 2) return 'あさって'
  if (diff === -1) return '昨日'
  return monthDay(date)
}

export function endTime(start: string, minutes: number) {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + minutes
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

export function durationLabel(minutes: number) {
  if (minutes < 60) return `${minutes}分`
  return minutes % 60 === 0 ? `${minutes / 60}時間` : `${Math.floor(minutes / 60)}時間${minutes % 60}分`
}

export const jobDate = (item: MakanaiItem) => addDays(new Date(), item.help.dayOffset)

/** 例：「今日 15:30〜16:15」 */
export function jobWhen(item: MakanaiItem, date = jobDate(item)) {
  return `${dayLabel(date)} ${item.help.start}〜${endTime(item.help.start, item.help.minutes)}`
}

export const wageOf = (help: MakanaiItem['help']) => Math.ceil(help.hourlyWage * help.minutes / 60)
export const feeOf = (wage: number) => Math.round(wage * FEE_RATE)

export const yen = (amount: number) => `${amount.toLocaleString('ja-JP')}円`
export const kg = (amount: number) => `${(Math.round(amount * 10) / 10).toLocaleString('ja-JP')}kg`

export const totalKg = (item: MakanaiItem) => item.ingredients.reduce((sum, x) => sum + x.kg, 0)
/** 1人が救う食材の量（全員分の食材を、募集人数で割る） */
export const rescuedPerPerson = (item: MakanaiItem) => totalKg(item) / item.help.slots

/** 例：「鶏もも肉 1.5kg・キャベツ 2kg」 */
export const ingredientList = (item: MakanaiItem) => item.ingredients.map(x => `${x.name} ${kg(x.kg)}`).join('・')
