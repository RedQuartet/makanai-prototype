import type { MakanaiItem } from './types'

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
    help: { role: 'ゴミ出し・店先の簡単な清掃', duration: '45分', date: '10月20日 15:30〜16:15', location: '世田谷区太子堂（駅から徒歩4分）', reward: '1,200円（交通費込み・デモ上の仮条件）', mealCondition: 'お手伝い終了後、店内で提供', capacity: 'あと2名', requirements: ['18歳以上', '特別な経験は不要', '汚れてもよい服装'] }
  },
  {
    id: 'ramen-koharu', dishName: '濃厚味噌ラーメン', storeName: 'らぁめん こはる', category: '麺類', area: '東京都杉並区', access: { minutes: 31, distance: '11km', route: '電車＋徒歩31分' }, rating: 4.6, reviewCount: 89, mapPoint: { x: 130, y: 115 },
    shortDescription: 'じっくり炊いたスープと香ばしい味噌。', description: '鶏と野菜の旨みを重ねたスープに、三種の味噌をブレンド。自家製の香味油がふわりと香ります。',
    recommendation: ['三種の味噌を独自ブレンド', 'もちもちの中太ちぢれ麺', '炙りチャーシューをたっぷり'],
    dishImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85', tags: ['濃厚', 'あったか', '地域創生'],
    atmosphere: '木のカウンター越しに湯気と活気が広がる、気さくなラーメン店です。', storeDescription: '一杯ずつ丁寧に。地域の人のお腹と心を満たすラーメンを作っています。',
    help: { role: '飲料ケースの荷物持ち・棚への移動', duration: '1時間', date: '10月22日 15:00〜16:00', location: '杉並区高円寺北（駅から徒歩3分）', reward: '1,400円（交通費込み・デモ上の仮条件）', mealCondition: '荷物の移動終了後に提供', capacity: 'あと1名', requirements: ['18歳以上', '10kg程度の荷物を持てる方', '店舗経験は不要'] }
  },
  {
    id: 'omelette-hinata', dishName: 'ふわとろオムライス', storeName: '洋食キッチン ひなた', category: 'その他', area: '東京都武蔵野市', access: { minutes: 38, distance: '16km', route: '電車＋徒歩38分' }, rating: 4.9, reviewCount: 203, mapPoint: { x: 82, y: 112 },
    shortDescription: 'とろける卵とじっくり煮込んだデミグラス。', description: '半熟卵を割ると、バターの香りがふわり。牛すじを煮込んだ自家製デミグラスソースで味わう人気の一皿です。',
    recommendation: ['ふわとろ半熟の三層卵', '二日かけたデミグラス', 'ケチャップライスは少し大人味'],
    dishImage: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85', tags: ['ふわとろ', '洋食', '学生応援'],
    atmosphere: '陽の入る窓辺とレトロな照明。ゆったりした時間が流れる洋食店です。', storeDescription: '懐かしい洋食に少しだけ今の気分を添えて。手作りを大切にする家族経営のお店です。',
    help: { role: '店先の花壇の草むしり・水やり', duration: '1時間', date: '10月24日 14:00〜15:00', location: '武蔵野市吉祥寺南町（駅から徒歩6分）', reward: '1,300円（交通費込み・デモ上の仮条件）', mealCondition: '作業終了後に提供', capacity: 'あと2名', requirements: ['18歳以上', '園芸経験は不要', '軍手はお店が用意します'] }
  },
  {
    id: 'curry-komorebi', dishName: '季節野菜のカレー', storeName: 'カフェ こもれび', category: 'カレー', area: '東京都目黒区', access: { minutes: 18, distance: '4.2km', route: 'バス＋徒歩18分' }, rating: 4.7, reviewCount: 164, mapPoint: { x: 185, y: 178 },
    shortDescription: '彩り野菜とスパイスの、やさしいごほうび。', description: '季節の野菜をじっくりローストし、玉ねぎの甘みと12種のスパイスを合わせた香り豊かなカレーです。',
    recommendation: ['旬の野菜をたっぷり使用', '辛さ控えめで香り豊か', '自家製ラッシーつき'],
    dishImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85', tags: ['野菜たっぷり', 'スパイス', 'フードロス削減'],
    atmosphere: '植物と木漏れ日に囲まれた、静かな路地裏カフェ。スタッフ同士の距離も近いです。', storeDescription: 'からだがほっとする季節のごはんと、丁寧に淹れたコーヒーを届けています。',
    help: { role: '新メニューの試食モニター・簡単なアンケート', duration: '45分', date: '10月25日 16:00〜16:45', location: '目黒区上目黒（駅から徒歩8分）', reward: '1,200円（交通費込み・デモ上の仮条件）', mealCondition: '試食メニューとして提供', capacity: 'あと3名', requirements: ['18歳以上', '食物アレルギーを事前に申告できる方', '率直な感想を伝えられる方'] }
  },
  {
    id: 'fish-nagi', dishName: '焼き魚の和定食', storeName: '海の台所 なぎ', category: '魚', area: '神奈川県横浜市', access: { minutes: 52, distance: '28km', route: '電車＋徒歩52分' }, rating: 4.8, reviewCount: 97, mapPoint: { x: 178, y: 245 },
    shortDescription: '市場直送の魚を、炭火でふっくら。', description: 'その日の朝に届いた魚を炭火で香ばしく焼き上げます。出汁巻き卵、漬物、あら汁と一緒にどうぞ。',
    recommendation: ['市場直送の日替わり鮮魚', '炭火で皮はパリッと身はふっくら', '魚の旨みが溶けたあら汁'],
    dishImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1516211697506-8360dbcfe9a4?auto=format&fit=crop&w=1200&q=85', tags: ['炭火焼き', '和食', '地域創生'],
    atmosphere: '港町らしい元気な声が飛び交う、活気ある和食屋です。', storeDescription: '毎朝市場で選ぶ魚を、いちばんおいしい食べ方で届ける海鮮食堂です。',
    help: { role: 'テイクアウト袋のシール貼り・仕分け', duration: '1時間', date: '10月26日 15:30〜16:30', location: '横浜市中区（駅から徒歩5分）', reward: '1,300円（交通費込み・デモ上の仮条件）', mealCondition: '作業終了後に提供', capacity: 'あと2名', requirements: ['18歳以上', '座ってできる簡単な作業です', '店舗経験は不要'] }
  },
  {
    id: 'pasta-sora', dishName: '自家製ミートソースパスタ', storeName: 'パスタ食堂 ソラ', category: '麺類', area: '埼玉県さいたま市', access: { minutes: 58, distance: '35km', route: '電車＋徒歩58分' }, rating: 4.5, reviewCount: 71, mapPoint: { x: 195, y: 42 },
    shortDescription: 'ごろごろお肉の、ちょっと贅沢な定番。', description: '香味野菜と粗挽き肉を赤ワインでことこと煮込んだ自家製ソース。もちっとした生パスタによく絡みます。',
    recommendation: ['6時間煮込んだ濃厚ソース', '店内製麺のもちもち生パスタ', '削りたてチーズを好きなだけ'],
    dishImage: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85', tags: ['もちもち', '手作り', '学生応援'],
    atmosphere: '青い扉が目印の、明るくカジュアルなパスタ食堂です。', storeDescription: '手打ちパスタと、地元野菜のおいしさを気軽に楽しめる食堂です。',
    help: { role: '新作パスタの試食モニター・写真撮影', duration: '1時間', date: '10月28日 10:30〜11:30', location: 'さいたま市大宮区（駅から徒歩7分）', reward: '1,300円（交通費込み・デモ上の仮条件）', mealCondition: '試食メニューとして提供', capacity: 'あと3名', requirements: ['18歳以上', 'スマートフォンで簡単な写真を撮れる方', '食物アレルギーは事前申告'] }
  },
  {
    id: 'ginger-mugi', dishName: '豚のしょうが焼き定食', storeName: 'ごはん処 むぎ', category: '定食', area: '千葉県市川市', access: { minutes: 49, distance: '27km', route: '電車＋徒歩49分' }, rating: 4.4, reviewCount: 58, mapPoint: { x: 285, y: 130 },
    shortDescription: '甘辛だれと生姜の香りで、ご飯がすすむ。', description: '国産豚を玉ねぎたっぷりの特製だれで香ばしく。山盛りキャベツと炊きたて麦ごはんの元気定食です。',
    recommendation: ['すりたて生姜の特製だれ', 'おかわりしたくなる麦ごはん', '野菜たっぷりの副菜'],
    dishImage: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=1200&q=88', storeImage: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=85', tags: ['ごはんがすすむ', '定番', '地域交流'],
    atmosphere: '大きな木のテーブルを囲む、にぎやかで親しみやすい定食屋です。', storeDescription: '忙しい毎日に、ちゃんとしたごはんを。地元野菜を使った定食を作っています。',
    help: { role: '試食とGoogleレビュー投稿（投稿は任意）', duration: '45分', date: '10月30日 16:30〜17:15', location: '市川市市川（駅から徒歩5分）', reward: '1,200円（試食アンケートへの謝礼・レビュー投稿の有無や評価内容には左右されません）', mealCondition: '試食メニューとして提供', capacity: 'あと2名', requirements: ['18歳以上', 'Googleレビューは任意・評価指定なし', '感じたことを率直に回答できる方'] }
  }
]

export const categories = ['すべて', 'お肉', '魚', '麺類', '定食', 'カレー', 'その他'] as const
export const areas = ['すべてのエリア', '東京都', '神奈川県', '埼玉県', '千葉県'] as const
export const statusLabels = ['応募済み', 'お店の承認待ち', 'お手伝い確定', 'お手伝い完了', 'まかないを食べた！'] as const
