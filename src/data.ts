import { addDays, toDateKey } from './format'
import type { Application, HelpKind, MakanaiItem, OwnerApplicant, StockItem } from './types'

/** public/photos の写真。出典は credits.ts にまとめている */
const photo = (file: string) => `${import.meta.env.BASE_URL}photos/${file}`

export const demoUser = { name: '佐藤 みのり', initial: 'み', area: '東京都世田谷区', profile: '大学3年・世田谷区在住' }

/** 東京都の最低賃金。毎年秋に改定され、都道府県ごとに違う */
export const minimumWage = { area: '東京都', amount: 1280, since: '2026年10月1日' }

export const makanaiItems: MakanaiItem[] = [
  {
    id: 'karaage-yamada', dishName: '特製からあげ定食', storeName: 'まかない食堂 やまだ', category: 'お肉', area: '東京都世田谷区', access: { minutes: 8, distance: '650m', route: '徒歩8分' }, rating: 4.8, reviewCount: 126, mapPoint: { x: 166, y: 157 },
    shortDescription: '揚げたてのからあげに、炊きたてご飯！',
    description: '店主秘伝の生姜だれに一晩漬けた、外はカリッと中はふっくらのからあげ。千切りキャベツとお味噌汁も一緒にどうぞ。',
    recommendation: ['注文後に揚げる熱々のからあげ', '農家直送のお米をふっくら炊飯', '千切りキャベツとお味噌汁つき'],
    dishImage: photo('karaage-yamada-dish.jpg'), storeImage: photo('karaage-yamada-store.jpg'), tags: ['がっつり', '揚げたて', '学生応援'],
    atmosphere: '家に帰ってきたようにほっとできる、12席の小さな食堂。常連さんとの会話もあたたかいお店です。',
    storeDescription: '旬の食材と、毎日食べても飽きない家庭料理を大切にしている町の食堂です。',
    ingredients: [{ name: '鶏もも肉', kg: 1.5, daysLeft: 1 }, { name: 'キャベツ', kg: 2, daysLeft: 2 }],
    help: { kind: '清掃', role: 'ゴミ出し・店先の簡単な清掃', dayOffset: 0, start: '15:30', minutes: 45, location: '世田谷区太子堂（駅から徒歩4分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: 'お手伝い終了後、店内で提供', slots: 3, remaining: 2, requirements: ['18歳以上', '特別な経験は不要', '汚れてもよい服装'] }
  },
  {
    id: 'ramen-koharu', dishName: '濃厚味噌ラーメン', storeName: 'らぁめん こはる', category: '麺類', area: '東京都杉並区', access: { minutes: 31, distance: '11km', route: '電車＋徒歩31分' }, rating: 4.6, reviewCount: 89, mapPoint: { x: 130, y: 115 },
    shortDescription: 'じっくり炊いたスープと香ばしい味噌。', description: '鶏と野菜の旨みを重ねたスープに、三種の味噌をブレンド。シャキシャキのもやしと、とろけるチャーシューをのせました。',
    recommendation: ['三種の味噌を独自ブレンド', 'もちもちの中太ちぢれ麺', 'もやしと白髪ねぎをたっぷり'],
    dishImage: photo('ramen-koharu-dish.jpg'), storeImage: photo('ramen-koharu-store.jpg'), tags: ['濃厚', 'あったか', '地域創生'],
    atmosphere: '赤い丸椅子が並ぶカウンター越しに、湯気と活気が広がる気さくなラーメン店です。', storeDescription: '一杯ずつ丁寧に。地域の人のお腹と心を満たすラーメンを作っています。',
    ingredients: [{ name: 'もやし', kg: 1, daysLeft: 1 }, { name: '豚肩ロース', kg: 0.8, daysLeft: 2 }],
    help: { kind: '運ぶ', role: '飲料ケースの荷物持ち・棚への移動', dayOffset: 1, start: '15:00', minutes: 60, location: '杉並区高円寺北（駅から徒歩3分）', hourlyWage: 1350, transport: '実費支給（上限 500 円）', mealCondition: '荷物の移動終了後に提供', slots: 2, remaining: 1, requirements: ['18歳以上', '10kg程度の荷物を持てる方', '店舗経験は不要'] }
  },
  {
    id: 'omelette-hinata', dishName: 'デミグラスオムライス', storeName: '洋食キッチン ひなた', category: 'その他', area: '東京都武蔵野市', access: { minutes: 38, distance: '16km', route: '電車＋徒歩38分' }, rating: 4.9, reviewCount: 203, mapPoint: { x: 82, y: 112 },
    shortDescription: 'ふんわり卵に、じっくり煮込んだデミグラス。', description: '卵 3 個でふんわり包んだオムライスに、牛すじを二日煮込んだ自家製デミグラスソースをたっぷりかけました。',
    recommendation: ['卵 3 個でふんわり包む', '二日かけたデミグラス', 'ケチャップライスは少し大人味'],
    dishImage: photo('omelette-hinata-dish.jpg'), storeImage: photo('omelette-hinata-store.jpg'), tags: ['ふんわり卵', '洋食', '学生応援'],
    atmosphere: '陽の入る大きな窓とレトロな照明。ゆったりした時間が流れる洋食店です。', storeDescription: '懐かしい洋食に少しだけ今の気分を添えて。手作りを大切にする家族経営のお店です。',
    ingredients: [{ name: '卵', kg: 1.2, daysLeft: 3 }, { name: 'マッシュルーム', kg: 0.4, daysLeft: 1 }],
    help: { kind: '花壇・庭', role: '店先の花壇の草むしり・水やり', dayOffset: 2, start: '14:00', minutes: 60, location: '武蔵野市吉祥寺南町（駅から徒歩6分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: '作業終了後に提供', slots: 2, remaining: 2, requirements: ['18歳以上', '園芸経験は不要', '軍手はお店が用意します'] }
  },
  {
    id: 'curry-komorebi', dishName: '季節野菜のカレー', storeName: 'カフェ こもれび', category: 'カレー', area: '東京都目黒区', access: { minutes: 18, distance: '4.2km', route: 'バス＋徒歩18分' }, rating: 4.7, reviewCount: 164, mapPoint: { x: 185, y: 178 },
    shortDescription: '彩り野菜とスパイスの、やさしいごほうび。', description: '季節の野菜をじっくりローストし、玉ねぎの甘みと12種のスパイスを合わせた香り豊かなカレーです。',
    recommendation: ['旬の野菜をたっぷり使用', '辛さ控えめで香り豊か', '自家製ラッシーつき'],
    dishImage: photo('curry-komorebi-dish.jpg'), storeImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85', tags: ['野菜たっぷり', 'スパイス', 'フードロス削減'],
    atmosphere: '植物と木漏れ日に囲まれた、静かな路地裏カフェ。スタッフ同士の距離も近いです。', storeDescription: 'からだがほっとする季節のごはんと、丁寧に淹れたコーヒーを届けています。',
    ingredients: [{ name: 'なす', kg: 1.5, daysLeft: 1 }, { name: 'かぼちゃ', kg: 2, daysLeft: 2 }],
    help: { kind: '試食', role: '新メニューの試食モニター・簡単なアンケート', dayOffset: 0, start: '16:00', minutes: 45, location: '目黒区上目黒（駅から徒歩8分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: '試食メニューとして提供', slots: 4, remaining: 3, requirements: ['18歳以上', '食物アレルギーを事前に申告できる方', '率直な感想を伝えられる方'] }
  },
  {
    id: 'fish-nagi', dishName: '焼き魚の和定食', storeName: '海の台所 なぎ', category: '魚', area: '神奈川県横浜市', access: { minutes: 52, distance: '28km', route: '電車＋徒歩52分' }, rating: 4.8, reviewCount: 97, mapPoint: { x: 178, y: 245 },
    shortDescription: '市場直送の魚を、炭火でふっくら。', description: '脂ののった真さばを炭火で香ばしく焼き上げます。大根おろし、ご飯、お味噌汁、小鉢と一緒にどうぞ。',
    recommendation: ['市場直送の日替わり鮮魚', '炭火で皮はパリッと身はふっくら', '具だくさんのお味噌汁つき'],
    dishImage: photo('fish-nagi-dish.jpg'), storeImage: photo('fish-nagi-store.jpg'), tags: ['炭火焼き', '和食', '地域創生'],
    atmosphere: 'のれんの奥にカウンターが続く、港町らしい元気な声が飛び交う和食屋です。', storeDescription: '毎朝市場で選ぶ魚を、いちばんおいしい食べ方で届ける海鮮食堂です。',
    ingredients: [{ name: '真さば', kg: 1.8, daysLeft: 1 }, { name: '大根', kg: 1.5, daysLeft: 3 }],
    help: { kind: '軽作業', role: 'テイクアウト袋のシール貼り・仕分け', dayOffset: 3, start: '15:30', minutes: 60, location: '横浜市中区（駅から徒歩5分）', hourlyWage: 1350, transport: '実費支給（上限 500 円）', mealCondition: '作業終了後に提供', slots: 3, remaining: 2, requirements: ['18歳以上', '座ってできる簡単な作業です', '店舗経験は不要'] }
  },
  {
    id: 'pasta-sora', dishName: '自家製ミートソースパスタ', storeName: 'パスタ食堂 ソラ', category: '麺類', area: '埼玉県さいたま市', access: { minutes: 58, distance: '35km', route: '電車＋徒歩58分' }, rating: 4.5, reviewCount: 71, mapPoint: { x: 195, y: 42 },
    shortDescription: 'ごろごろお肉の、ちょっと贅沢な定番。', description: '香味野菜と粗挽き肉を赤ワインでことこと煮込んだ自家製ソース。もちっとした生パスタによく絡みます。',
    recommendation: ['6時間煮込んだ濃厚ソース', '店内製麺のもちもち生パスタ', '削りたてチーズを好きなだけ'],
    dishImage: photo('pasta-sora-dish.jpg'), storeImage: photo('pasta-sora-store.jpg'), tags: ['もちもち', '手作り', '学生応援'],
    atmosphere: '格子の天井と明るい照明の、カジュアルなパスタ食堂です。', storeDescription: '手打ちパスタと、地元野菜のおいしさを気軽に楽しめる食堂です。',
    ingredients: [{ name: 'トマト', kg: 2, daysLeft: 2 }, { name: '合いびき肉', kg: 1, daysLeft: 1 }],
    help: { kind: '写真・SNS', role: 'お店の SNS に載せる料理写真の撮影', dayOffset: 4, start: '10:30', minutes: 60, location: 'さいたま市大宮区（駅から徒歩7分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: '撮影した料理を、そのまままかないに', slots: 2, remaining: 1, requirements: ['18歳以上', 'スマートフォンで写真を撮れる方', '撮った写真はお店のアカウントで使います'] }
  },
  {
    id: 'ginger-mugi', dishName: '豚のしょうが焼き定食', storeName: 'ごはん処 むぎ', category: '定食', area: '千葉県市川市', access: { minutes: 49, distance: '27km', route: '電車＋徒歩49分' }, rating: 4.4, reviewCount: 58, mapPoint: { x: 285, y: 130 },
    shortDescription: '甘辛だれと生姜の香りで、ご飯がすすむ。', description: '国産豚を玉ねぎたっぷりの特製だれで香ばしく。山盛りキャベツと炊きたてご飯の元気定食です。',
    recommendation: ['すりたて生姜の特製だれ', 'ご飯のおかわり自由', '山盛りの千切りキャベツ'],
    dishImage: photo('ginger-mugi-dish.jpg'), storeImage: photo('ginger-mugi-store.jpg'), tags: ['ごはんがすすむ', '定番', '地域交流'],
    atmosphere: '木の壁に手書きのお品書きが並ぶ、にぎやかで親しみやすい定食屋です。', storeDescription: '忙しい毎日に、ちゃんとしたごはんを。地元野菜を使った定食を作っています。',
    ingredients: [{ name: '豚こま肉', kg: 1.2, daysLeft: 1 }, { name: '玉ねぎ', kg: 2, daysLeft: 3 }],
    help: { kind: '片付け', role: 'ランチ営業後の食器洗い・片付け', dayOffset: 1, start: '14:30', minutes: 45, location: '市川市市川（駅から徒歩5分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: 'お手伝い終了後、店内で提供', slots: 3, remaining: 2, requirements: ['18歳以上', '特別な経験は不要', '水仕事ができる服装'] }
  },
  {
    id: 'gyoza-marufuku', dishName: '手包み焼き餃子定食', storeName: '餃子の店 まるふく', category: '定食', area: '東京都練馬区', access: { minutes: 35, distance: '14km', route: '電車＋徒歩35分' }, rating: 4.6, reviewCount: 112, mapPoint: { x: 118, y: 80 },
    shortDescription: 'パリッと焼いた手包み餃子と、炊きたてご飯。', description: '白菜とにらをたっぷり入れた、皮はパリッと中はジューシーな焼き餃子。ご飯とスープがついた定食です。',
    recommendation: ['毎日手で包む、野菜たっぷりの餃子', '自家製ラー油とお酢でさっぱり', 'ご飯・スープつきの定食'],
    dishImage: photo('gyoza-marufuku-dish.jpg'), storeImage: photo('gyoza-marufuku-store.jpg'), tags: ['手包み', 'ごはんがすすむ', 'フードロス削減'],
    atmosphere: '厨房の湯気と、餃子を焼く音が響く明るい町中華です。', storeDescription: '創業 30 年。毎日手で包む餃子と、町中華の定番を出しています。',
    ingredients: [{ name: '白菜', kg: 2, daysLeft: 2 }, { name: '豚ひき肉', kg: 1, daysLeft: 1 }],
    help: { kind: '仕込み', role: '餃子を包む仕込み（約 200 個）', dayOffset: 0, start: '14:00', minutes: 90, location: '練馬区豊玉北（駅から徒歩3分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: '包んだ餃子を焼いて、作業後に提供', slots: 3, remaining: 2, requirements: ['18歳以上', '包み方はお店が教えます', '髪をまとめ、爪を短くしてお越しください'] }
  },
  {
    id: 'yakisoba-matsuri', dishName: '屋台のソース焼きそば', storeName: 'ひだまり通り商店街 秋まつり', category: '麺類', area: '東京都世田谷区', access: { minutes: 12, distance: '900m', route: '徒歩12分' }, rating: 4.7, reviewCount: 41, mapPoint: { x: 146, y: 150 },
    shortDescription: '鉄板で焼きたて、ソースが香るお祭りの味。', description: '商店街の八百屋さんで余ったキャベツをたっぷり使った、ソースが香ばしい焼きそば。お祭りの屋台で、仲間と一緒にどうぞ。',
    recommendation: ['商店街の八百屋さんのキャベツをたっぷり', '鉄板で焼きたてをその場で', '終わったあとは屋台めぐりも'],
    dishImage: photo('yakisoba-matsuri-dish.jpg'), storeImage: photo('yakisoba-matsuri-store.jpg'), tags: ['お祭り', '地域を盛り上げる', '仲間と参加'],
    atmosphere: '提灯が並ぶ通りに、屋台と人の声があふれる年に一度のお祭りです。', storeDescription: '商店街の振興組合が開く秋まつり。屋台を手伝ってくれる学生を MAKANAI で募集しています。',
    ingredients: [{ name: 'キャベツ', kg: 3, daysLeft: 3 }, { name: '豚こま肉', kg: 1.5, daysLeft: 2 }],
    help: { kind: 'イベント', role: '秋まつりの屋台の手伝い（設営・盛り付け）', dayOffset: 4, start: '10:00', minutes: 180, location: '世田谷区太子堂 ひだまり通り商店街', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: '休憩のときに屋台で提供', slots: 10, remaining: 6, requirements: ['18歳以上', '法被（はっぴ）は商店街が貸し出します', '火や熱い鉄板は扱いません'] }
  },
  {
    id: 'frenchtoast-hitsuji', dishName: '前日のパンでつくるフレンチトースト', storeName: 'パン工房 ひつじ雲', category: 'その他', area: '神奈川県川崎市', access: { minutes: 25, distance: '9km', route: '電車＋徒歩25分' }, rating: 4.7, reviewCount: 88, mapPoint: { x: 168, y: 214 },
    shortDescription: '売れ残りのパンが、とろける朝ごはんに。', description: '前の日に売れ残った食パンを卵液にひと晩ひたし、バターでじっくり焼きました。外はこんがり、中はとろっと。',
    recommendation: ['前日のパンを、ひと晩卵液にひたして', 'バターでじっくり焼くこんがり食感', 'はちみつかメープルを選べます'],
    dishImage: photo('frenchtoast-hitsuji-dish.jpg'), storeImage: photo('frenchtoast-hitsuji-store.jpg'), tags: ['朝ごはん', 'フードロス削減', 'パン好き'],
    atmosphere: '朝 7 時から焼きたての香りが広がる、木の棚が並ぶ小さなパン屋さんです。', storeDescription: '国産小麦のパンを毎朝 40 種類焼いています。売れ残ったパンを減らすのが目標です。',
    ingredients: [{ name: '前日の食パン', kg: 1.5, daysLeft: 1 }, { name: '牛乳', kg: 1, daysLeft: 2 }],
    help: { kind: '品出し', role: '開店前のパンの袋詰め・陳列', dayOffset: 1, start: '7:00', minutes: 60, location: '川崎市中原区（駅から徒歩4分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: '作業のあと、イートインで提供', slots: 2, remaining: 1, requirements: ['18歳以上', '朝 7 時に来られる方', '髪をまとめてお越しください'] }
  },
  {
    id: 'oyakodon-kotori', dishName: 'ふわとろ親子丼', storeName: 'とり料理 ことり', category: 'お肉', area: '埼玉県川口市', access: { minutes: 40, distance: '20km', route: '電車＋徒歩40分' }, rating: 4.6, reviewCount: 132, mapPoint: { x: 205, y: 70 },
    shortDescription: 'ふわとろ卵と、鶏の旨みがしみたご飯。', description: '朝びきの鶏ももを甘めの割下で煮て、半熟の卵でとじました。三つ葉の香りがアクセントです。',
    recommendation: ['朝びきの国産鶏もも', '半熟で仕上げる卵', 'お吸い物と香の物つき'],
    dishImage: photo('oyakodon-kotori-dish.jpg'), storeImage: photo('oyakodon-kotori-store.jpg'), tags: ['ふわとろ', '丼', '学生応援'],
    atmosphere: '格子戸をくぐると、白木のカウンターがある落ち着いたお店です。', storeDescription: '焼き鳥と鶏料理のお店。昼は親子丼と鶏そばのランチをやっています。',
    ingredients: [{ name: '鶏もも肉', kg: 1.2, daysLeft: 1 }, { name: '三つ葉', kg: 0.3, daysLeft: 1 }],
    help: { kind: '接客', role: 'ランチのピーク時の配膳・下げ物', dayOffset: 2, start: '11:30', minutes: 90, location: '川口市栄町（駅から徒歩5分）', hourlyWage: 1350, transport: '実費支給（上限 500 円）', mealCondition: 'ランチ営業のあとに提供', slots: 2, remaining: 2, requirements: ['18歳以上', '明るくあいさつできる方', '飲食店の経験は不要'] }
  },
  {
    id: 'okonomi-teppei', dishName: '豚玉お好み焼き', storeName: 'お好み焼き てっぺい', category: 'その他', area: '千葉県船橋市', access: { minutes: 45, distance: '25km', route: '電車＋徒歩45分' }, rating: 4.5, reviewCount: 76, mapPoint: { x: 312, y: 162 },
    shortDescription: 'ふんわり生地に、カリッと焼いた豚バラ。', description: '長いもを入れた生地はふんわり軽く、豚バラはカリッと。ソースとマヨネーズの定番の一枚です。',
    recommendation: ['長いも入りのふんわり生地', '目の前の鉄板で焼き上げ', '1 枚にキャベツをたっぷり'],
    dishImage: photo('okonomi-teppei-dish.jpg'), storeImage: photo('okonomi-teppei-store.jpg'), tags: ['鉄板焼き', 'ソースの香り', '留学生歓迎'],
    atmosphere: '提灯の下に鉄板のカウンターが並ぶ、海外からのお客さんも多いにぎやかなお店です。', storeDescription: '目の前の鉄板で焼くお好み焼きのお店。英語のメニューを充実させたいと考えています。',
    ingredients: [{ name: 'キャベツ', kg: 2.5, daysLeft: 2 }, { name: '長いも', kg: 0.6, daysLeft: 3 }],
    help: { kind: 'メニューづくり', role: '英語メニュー・黒板 POP づくり', dayOffset: 3, start: '14:30', minutes: 60, location: '船橋市本町（駅から徒歩6分）', hourlyWage: 1300, transport: '実費支給（上限 500 円）', mealCondition: '作業のあと、鉄板で焼いて提供', slots: 2, remaining: 1, requirements: ['18歳以上', 'かんたんな英語の説明が書ける方（留学生歓迎）', '字や絵をかくのが好きな方'] }
  }
]

export const categories = ['すべて', 'お肉', '魚', '麺類', '定食', 'カレー', 'その他'] as const
/** お手伝いの種類。短い時間で終わるもの、座ってできるものから順に */
export const helpKinds: HelpKind[] = ['試食', '軽作業', '花壇・庭', '写真・SNS', 'メニューづくり', '品出し', '運ぶ', '清掃', '片付け', '仕込み', '接客', 'イベント']
export const areas = ['すべてのエリア', '東京都', '神奈川県', '埼玉県', '千葉県'] as const
export const statusLabels = ['応募済み', 'お店の確認待ち', '採用決定', 'お手伝い完了', 'まかないを食べた！'] as const

/** デモの利用者が、これまでに手伝って食べたまかない */
export function demoHistory(today = new Date()): Application[] {
  const at = (days: number) => addDays(today, days)
  return [
    { id: 'app-demo-ramen', makanaiId: 'ramen-koharu', status: 4, appliedAt: at(-8).toISOString(), jobDate: toDateKey(at(-6)), review: { again: ['visit', 'help'], comment: 'スープが絶品。店長さんとの話も楽しかった！', createdAt: at(-6).toISOString() } },
    { id: 'app-demo-fish', makanaiId: 'fish-nagi', status: 4, appliedAt: at(-15).toISOString(), jobDate: toDateKey(at(-13)), review: { again: ['visit'], comment: '炭火のさば、皮がパリッとしておいしかった。', createdAt: at(-13).toISOString() } }
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

export const rolePresets: { kind: HelpKind; role: string }[] = [
  { kind: '片付け', role: '閉店後の片付け・食器洗い' },
  { kind: '清掃', role: 'ゴミ出し・店先の清掃' },
  { kind: '仕込み', role: '仕込みの手伝い（野菜を切る）' },
  { kind: '運ぶ', role: '荷物の受け取り・運搬' },
  { kind: '接客', role: 'ランチの配膳・下げ物' },
  { kind: '試食', role: '新メニューの試食・アンケート' },
  { kind: '写真・SNS', role: 'SNS 用の料理写真の撮影' },
  { kind: 'メニューづくり', role: 'メニュー・黒板 POP づくり' }
]
export const transportOptions = ['実費支給（上限 500 円）', 'なし（近所の方向け）']
