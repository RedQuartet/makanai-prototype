import { addDays, toDateKey } from './format'
import type { Application, MakanaiItem, OwnerApplicant, StockItem } from './types'

export const demoUser = { name: '佐藤 みのり', initial: 'み', area: '東京都世田谷区', profile: '大学3年・世田谷区在住' }

/** 東京都の最低賃金。毎年秋に改定され、都道府県ごとに違う */
export const minimumWage = { area: '東京都', amount: 1280, since: '2026年10月1日' }

export const makanaiItems: MakanaiItem[] = [
  {
    id: 'karaage-yamada', dishName: '特製からあげ定食', storeName: 'まかない食堂 やまだ', category: 'お肉', area: '東京都世田谷区', access: { minutes: 8, distance: '650m', route: '徒歩8分' }, rating: 4.8, reviewCount: 126, mapPoint: { x: 166, y: 157 },
    shortDescription: '揚げたてのからあげに、炊きたてご飯！',
    description: '店主秘伝の生姜だれに一晩漬けた、外はカリッと中はふっくらのからあげ。小鉢と具だくさんのお味噌汁も一緒にどうぞ。',
    recommendation: ['注文後に揚げる熱々のからあげ', '農家直送のお米をふっくら炊飯', '日替わり小鉢とお味噌汁つき'],
    dishImage: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=88',
    storeImage: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85', tags: ['がっつり', '揚げたて', '学生応援'],
    atmosphere: '家に帰ってきたようにほっとできる、12席の小さな食堂。常連さんとの会話もあたたかいお店です。',
    storeDescription: '旬の食材と、毎日食べても飽きない家庭料理を大切にしている町の食堂です。',
    ingredients: [{ name: '鶏もも肉', kg: 1.5, daysLeft: 1 }, { name: 'キャベツ', kg: 2, daysLeft: 2 }],
    help: { role: 'ゴミ出し・店先の簡単な清掃', dayOffset: 0, start: '15:30', minutes: 45, location: '世田谷区太子堂（駅から徒歩4分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: 'お手伝い終了後、店内で提供', slots: 3, remaining: 2, requirements: ['18歳以上', '特別な経験は不要', '汚れてもよい服装'] }
  },
  {
    id: 'ramen-koharu', dishName: '濃厚味噌ラーメン', storeName: 'らぁめん こはる', category: '麺類', area: '東京都杉並区', access: { minutes: 31, distance: '11km', route: '電車＋徒歩31分' }, rating: 4.6, reviewCount: 89, mapPoint: { x: 130, y: 115 },
    shortDescription: 'じっくり炊いたスープと香ばしい味噌。', description: '鶏と野菜の旨みを重ねたスープに、三種の味噌をブレンド。自家製の香味油がふわりと香ります。',
    recommendation: ['三種の味噌を独自ブレンド', 'もちもちの中太ちぢれ麺', '炙りチャーシューをたっぷり'],
    dishImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85', tags: ['濃厚', 'あったか', '地域創生'],
    atmosphere: '木のカウンター越しに湯気と活気が広がる、気さくなラーメン店です。', storeDescription: '一杯ずつ丁寧に。地域の人のお腹と心を満たすラーメンを作っています。',
    ingredients: [{ name: 'もやし', kg: 1, daysLeft: 1 }, { name: '豚肩ロース', kg: 0.8, daysLeft: 2 }],
    help: { role: '飲料ケースの荷物持ち・棚への移動', dayOffset: 1, start: '15:00', minutes: 60, location: '杉並区高円寺北（駅から徒歩3分）', hourlyWage: 1350, transport: '実費支給（上限 500 円）', mealCondition: '荷物の移動終了後に提供', slots: 2, remaining: 1, requirements: ['18歳以上', '10kg程度の荷物を持てる方', '店舗経験は不要'] }
  },
  {
    id: 'omelette-hinata', dishName: 'ふわとろオムライス', storeName: '洋食キッチン ひなた', category: 'その他', area: '東京都武蔵野市', access: { minutes: 38, distance: '16km', route: '電車＋徒歩38分' }, rating: 4.9, reviewCount: 203, mapPoint: { x: 82, y: 112 },
    shortDescription: 'とろける卵とじっくり煮込んだデミグラス。', description: '半熟卵を割ると、バターの香りがふわり。牛すじを煮込んだ自家製デミグラスソースで味わう人気の一皿です。',
    recommendation: ['ふわとろ半熟の三層卵', '二日かけたデミグラス', 'ケチャップライスは少し大人味'],
    dishImage: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85', tags: ['ふわとろ', '洋食', '学生応援'],
    atmosphere: '陽の入る窓辺とレトロな照明。ゆったりした時間が流れる洋食店です。', storeDescription: '懐かしい洋食に少しだけ今の気分を添えて。手作りを大切にする家族経営のお店です。',
    ingredients: [{ name: '卵', kg: 1.2, daysLeft: 3 }, { name: 'マッシュルーム', kg: 0.4, daysLeft: 1 }],
    help: { role: '店先の花壇の草むしり・水やり', dayOffset: 2, start: '14:00', minutes: 60, location: '武蔵野市吉祥寺南町（駅から徒歩6分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: '作業終了後に提供', slots: 2, remaining: 2, requirements: ['18歳以上', '園芸経験は不要', '軍手はお店が用意します'] }
  },
  {
    id: 'curry-komorebi', dishName: '季節野菜のカレー', storeName: 'カフェ こもれび', category: 'カレー', area: '東京都目黒区', access: { minutes: 18, distance: '4.2km', route: 'バス＋徒歩18分' }, rating: 4.7, reviewCount: 164, mapPoint: { x: 185, y: 178 },
    shortDescription: '彩り野菜とスパイスの、やさしいごほうび。', description: '季節の野菜をじっくりローストし、玉ねぎの甘みと12種のスパイスを合わせた香り豊かなカレーです。',
    recommendation: ['旬の野菜をたっぷり使用', '辛さ控えめで香り豊か', '自家製ラッシーつき'],
    dishImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85', tags: ['野菜たっぷり', 'スパイス', 'フードロス削減'],
    atmosphere: '植物と木漏れ日に囲まれた、静かな路地裏カフェ。スタッフ同士の距離も近いです。', storeDescription: 'からだがほっとする季節のごはんと、丁寧に淹れたコーヒーを届けています。',
    ingredients: [{ name: 'なす', kg: 1.5, daysLeft: 1 }, { name: 'かぼちゃ', kg: 2, daysLeft: 2 }],
    help: { role: '新メニューの試食モニター・簡単なアンケート', dayOffset: 0, start: '16:00', minutes: 45, location: '目黒区上目黒（駅から徒歩8分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: '試食メニューとして提供', slots: 4, remaining: 3, requirements: ['18歳以上', '食物アレルギーを事前に申告できる方', '率直な感想を伝えられる方'] }
  },
  {
    id: 'fish-nagi', dishName: '焼き魚の和定食', storeName: '海の台所 なぎ', category: '魚', area: '神奈川県横浜市', access: { minutes: 52, distance: '28km', route: '電車＋徒歩52分' }, rating: 4.8, reviewCount: 97, mapPoint: { x: 178, y: 245 },
    shortDescription: '市場直送の魚を、炭火でふっくら。', description: 'その日の朝に届いた魚を炭火で香ばしく焼き上げます。出汁巻き卵、漬物、あら汁と一緒にどうぞ。',
    recommendation: ['市場直送の日替わり鮮魚', '炭火で皮はパリッと身はふっくら', '魚の旨みが溶けたあら汁'],
    dishImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1516211697506-8360dbcfe9a4?auto=format&fit=crop&w=1200&q=85', tags: ['炭火焼き', '和食', '地域創生'],
    atmosphere: '港町らしい元気な声が飛び交う、活気ある和食屋です。', storeDescription: '毎朝市場で選ぶ魚を、いちばんおいしい食べ方で届ける海鮮食堂です。',
    ingredients: [{ name: '真あじ', kg: 1.8, daysLeft: 1 }, { name: '大根', kg: 1.5, daysLeft: 3 }],
    help: { role: 'テイクアウト袋のシール貼り・仕分け', dayOffset: 3, start: '15:30', minutes: 60, location: '横浜市中区（駅から徒歩5分）', hourlyWage: 1350, transport: '実費支給（上限 500 円）', mealCondition: '作業終了後に提供', slots: 3, remaining: 2, requirements: ['18歳以上', '座ってできる簡単な作業です', '店舗経験は不要'] }
  },
  {
    id: 'pasta-sora', dishName: '自家製ミートソースパスタ', storeName: 'パスタ食堂 ソラ', category: '麺類', area: '埼玉県さいたま市', access: { minutes: 58, distance: '35km', route: '電車＋徒歩58分' }, rating: 4.5, reviewCount: 71, mapPoint: { x: 195, y: 42 },
    shortDescription: 'ごろごろお肉の、ちょっと贅沢な定番。', description: '香味野菜と粗挽き肉を赤ワインでことこと煮込んだ自家製ソース。もちっとした生パスタによく絡みます。',
    recommendation: ['6時間煮込んだ濃厚ソース', '店内製麺のもちもち生パスタ', '削りたてチーズを好きなだけ'],
    dishImage: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85', tags: ['もちもち', '手作り', '学生応援'],
    atmosphere: '青い扉が目印の、明るくカジュアルなパスタ食堂です。', storeDescription: '手打ちパスタと、地元野菜のおいしさを気軽に楽しめる食堂です。',
    ingredients: [{ name: 'トマト', kg: 2, daysLeft: 2 }, { name: '合いびき肉', kg: 1, daysLeft: 1 }],
    help: { role: '新作パスタの試食モニター・写真撮影', dayOffset: 4, start: '10:30', minutes: 60, location: 'さいたま市大宮区（駅から徒歩7分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: '試食メニューとして提供', slots: 4, remaining: 3, requirements: ['18歳以上', 'スマートフォンで簡単な写真を撮れる方', '食物アレルギーは事前申告'] }
  },
  {
    id: 'ginger-mugi', dishName: '豚のしょうが焼き定食', storeName: 'ごはん処 むぎ', category: '定食', area: '千葉県市川市', access: { minutes: 49, distance: '27km', route: '電車＋徒歩49分' }, rating: 4.4, reviewCount: 58, mapPoint: { x: 285, y: 130 },
    shortDescription: '甘辛だれと生姜の香りで、ご飯がすすむ。', description: '国産豚を玉ねぎたっぷりの特製だれで香ばしく。山盛りキャベツと炊きたて麦ごはんの元気定食です。',
    recommendation: ['すりたて生姜の特製だれ', 'おかわりしたくなる麦ごはん', '野菜たっぷりの副菜'],
    dishImage: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=85', tags: ['ごはんがすすむ', '定番', '地域交流'],
    atmosphere: '大きな木のテーブルを囲む、にぎやかで親しみやすい定食屋です。', storeDescription: '忙しい毎日に、ちゃんとしたごはんを。地元野菜を使った定食を作っています。',
    ingredients: [{ name: '豚こま肉', kg: 1.2, daysLeft: 1 }, { name: '玉ねぎ', kg: 2, daysLeft: 3 }],
    help: { role: '閉店後の食器洗い・片付け', dayOffset: 1, start: '16:30', minutes: 45, location: '市川市市川（駅から徒歩5分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: 'お手伝い終了後、店内で提供', slots: 3, remaining: 2, requirements: ['18歳以上', '特別な経験は不要', '水仕事ができる服装'] }
  }
]

export const categories = ['すべて', 'お肉', '魚', '麺類', '定食', 'カレー', 'その他'] as const
export const areas = ['すべてのエリア', '東京都', '神奈川県', '埼玉県', '千葉県'] as const
export const statusLabels = ['応募済み', 'お店の確認待ち', '採用決定', 'お手伝い完了', 'まかないを食べた！'] as const

/** デモの利用者が、これまでに手伝って食べたまかない */
export function demoHistory(today = new Date()): Application[] {
  const at = (days: number) => addDays(today, days)
  return [
    { id: 'app-demo-ramen', makanaiId: 'ramen-koharu', status: 4, appliedAt: at(-8).toISOString(), jobDate: toDateKey(at(-6)), review: { again: ['visit', 'help'], comment: 'スープが絶品。店長さんとの話も楽しかった！', createdAt: at(-6).toISOString() } },
    { id: 'app-demo-fish', makanaiId: 'fish-nagi', status: 4, appliedAt: at(-15).toISOString(), jobDate: toDateKey(at(-13)), review: { again: ['visit'], comment: '朝どれのあじ、ふっくらでおいしかった。', createdAt: at(-13).toISOString() } }
  ]
}

/* ---- お店側の画面（デモの店舗：まかない食堂 やまだ） ---- */

export const ownerStoreId = 'karaage-yamada'

export const ownerStock: StockItem[] = [
  { id: 'stock-pork', name: '豚バラ肉', kg: 0.9, daysLeft: 1 },
  { id: 'stock-tofu', name: '木綿豆腐', kg: 1.2, daysLeft: 1 },
  { id: 'stock-cabbage', name: 'キャベツ', kg: 1, daysLeft: 2 },
  { id: 'stock-negi', name: '長ねぎ', kg: 0.8, daysLeft: 3 },
  { id: 'stock-egg', name: '卵', kg: 1, daysLeft: 4 }
]

export const ownerApplicantsSeed: OwnerApplicant[] = [
  { id: 'owner-tanaka', name: '田中 ゆうと', profile: '大学2年・三軒茶屋在住', makanaiId: 'karaage-yamada', status: 0 },
  { id: 'owner-suzuki', name: '鈴木 さき', profile: '大学1年・池尻大橋在住', makanaiId: 'karaage-yamada', status: 2 }
]

export const ownerPastReviews = [
  { key: 'past-yamamoto', name: '山本 りく', again: ['visit', 'help'] as const, comment: '店主さんが優しくて、片付けのあとのからあげが最高でした。' },
  { key: 'past-kobayashi', name: '小林 はな', again: ['visit'] as const, comment: '近所なのに知らなかったお店。今度は友だちと食べに来ます。' }
]

/** 今月これまでの実績（デモの数値）。アプリで完了したお手伝いは、この上に足される */
export const ownerMonthBase = { visitors: 14, rescuedKg: 18.6, reviews: 13, againVisit: 11, wages: 13650, fees: 4095 }

export const rolePresets = ['閉店後の片付け・食器洗い', 'ゴミ出し・店先の清掃', '仕込みの手伝い（野菜を切る）', '荷物の受け取り・運搬']
export const transportOptions = ['実費支給（上限 500 円）', 'なし（近所の方向け）']
