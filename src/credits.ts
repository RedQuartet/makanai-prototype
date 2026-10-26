export interface Credit {
  title: string
  artist: string
  license: string
  licenseUrl?: string
  page?: string
}

/** public/photos の写真の出典（ウィキメディア・コモンズ） */
const commons: Record<string, Credit> = {
  'karaage-yamada-dish.jpg': { title: 'Karaage-teishoku of Yoshinoya.jpg', artist: '毒島みるく', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', page: 'https://commons.wikimedia.org/wiki/File:Karaage-teishoku_of_Yoshinoya.jpg' },
  'karaage-yamada-store.jpg': { title: 'Interieur van restaurant Ogawa Shokudō in Ube, -18 mei 2016 11：59.jpg', artist: 'Dime Gontar', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0', page: 'https://commons.wikimedia.org/wiki/File:Interieur_van_restaurant_Ogawa_Shokud%C5%8D_in_Ube,_-18_mei_2016_11%EF%BC%9A59.jpg' },
  'ramen-koharu-dish.jpg': { title: 'Miso ramen of Aji-no-tokedai.jpg', artist: '毒島みるく', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', page: 'https://commons.wikimedia.org/wiki/File:Miso_ramen_of_Aji-no-tokedai.jpg' },
  'ramen-koharu-store.jpg': { title: 'ラーメン店 カウンター トイレ (30872517235).jpg', artist: 'Norio NAKAYAMA', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0', page: 'https://commons.wikimedia.org/wiki/File:%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%E5%BA%97_%E3%82%AB%E3%82%A6%E3%83%B3%E3%82%BF%E3%83%BC_%E3%83%88%E3%82%A4%E3%83%AC_(30872517235).jpg' },
  'omelette-hinata-dish.jpg': { title: 'Omurice with Demi-glace Sause in Osaka, Japan.jpg', artist: '高砂の浦', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', page: 'https://commons.wikimedia.org/wiki/File:Omurice_with_Demi-glace_Sause_in_Osaka,_Japan.jpg' },
  'omelette-hinata-store.jpg': { title: 'Trattoria Da Antonio, Warsaw Ochota 03.jpg', artist: 'Kgbo', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', page: 'https://commons.wikimedia.org/wiki/File:Trattoria_Da_Antonio,_Warsaw_Ochota_03.jpg' },
  'curry-komorebi-dish.jpg': { title: 'CURRY-SHOP-C-and-C---Steamed-Vegetable-Curry---2025.jpg', artist: 'RuinDig/Yuki Uchida', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0', page: 'https://commons.wikimedia.org/wiki/File:CURRY-SHOP-C-and-C---Steamed-Vegetable-Curry---2025.jpg' },
  'fish-nagi-dish.jpg': { title: 'サバの文化干し（焼き魚）定食.jpg', artist: 'Kyu3', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', page: 'https://commons.wikimedia.org/wiki/File:%E3%82%B5%E3%83%90%E3%81%AE%E6%96%87%E5%8C%96%E5%B9%B2%E3%81%97%EF%BC%88%E7%84%BC%E3%81%8D%E9%AD%9A%EF%BC%89%E5%AE%9A%E9%A3%9F.jpg' },
  'fish-nagi-store.jpg': { title: 'SHEF エルモア (16026674295).jpg', artist: '極地狐', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0', page: 'https://commons.wikimedia.org/wiki/File:SHEF_%E3%82%A8%E3%83%AB%E3%83%A2%E3%82%A2_(16026674295).jpg' },
  'pasta-sora-dish.jpg': { title: 'Spaghetti Bolognese Lokal K.jpg', artist: 'Superbass', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', page: 'https://commons.wikimedia.org/wiki/File:Spaghetti_Bolognese_Lokal_K.jpg' },
  'pasta-sora-store.jpg': { title: 'Trattoria Da Antonio, Warsaw Ochota 05.jpg', artist: 'Kgbo', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', page: 'https://commons.wikimedia.org/wiki/File:Trattoria_Da_Antonio,_Warsaw_Ochota_05.jpg' },
  'ginger-mugi-dish.jpg': { title: 'Shogayaki 003.jpg', artist: 'Ocdp', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', page: 'https://commons.wikimedia.org/wiki/File:Shogayaki_003.jpg' },
  'ginger-mugi-store.jpg': { title: '橘田いずみのザ・餃子 2015 (25888961012).jpg', artist: 'inazakira', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0', page: 'https://commons.wikimedia.org/wiki/File:%E6%A9%98%E7%94%B0%E3%81%84%E3%81%9A%E3%81%BF%E3%81%AE%E3%82%B6%E3%83%BB%E9%A4%83%E5%AD%90_2015_(25888961012).jpg' },
  'gyoza-marufuku-dish.jpg': { title: 'Miyoshino-Sapporo.GyozaTeishokuL.JPG', artist: 'RJD', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0', page: 'https://commons.wikimedia.org/wiki/File:Miyoshino-Sapporo.GyozaTeishokuL.JPG' },
  'gyoza-marufuku-store.jpg': { title: 'メニューの垂直ではない見せ方 (2637735816).jpg', artist: 'Ryuta Ishimoto', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0', page: 'https://commons.wikimedia.org/wiki/File:%E3%83%A1%E3%83%8B%E3%83%A5%E3%83%BC%E3%81%AE%E5%9E%82%E7%9B%B4%E3%81%A7%E3%81%AF%E3%81%AA%E3%81%84%E8%A6%8B%E3%81%9B%E6%96%B9_(2637735816).jpg' },
  'yakisoba-matsuri-dish.jpg': { title: 'Ota Yakisoba 002.jpg', artist: 'Ocdp', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', page: 'https://commons.wikimedia.org/wiki/File:Ota_Yakisoba_002.jpg' },
  'yakisoba-matsuri-store.jpg': { title: 'Yadokari Festival 2019.jpg', artist: 'Miyuki Meinaka', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', page: 'https://commons.wikimedia.org/wiki/File:Yadokari_Festival_2019.jpg' },
  'frenchtoast-hitsuji-dish.jpg': { title: 'French toast 001.jpg', artist: 'Ocdp', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', page: 'https://commons.wikimedia.org/wiki/File:French_toast_001.jpg' },
  'frenchtoast-hitsuji-store.jpg': { title: 'Japanese Bakery (6136180790).jpg', artist: 'mhiguera', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0', page: 'https://commons.wikimedia.org/wiki/File:Japanese_Bakery_(6136180790).jpg' },
  'oyakodon-kotori-dish.jpg': { title: 'Oyakodon 005.jpg', artist: 'Ocdp', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', page: 'https://commons.wikimedia.org/wiki/File:Oyakodon_005.jpg' },
  'oyakodon-kotori-store.jpg': { title: 'Sasanoyuki-3.jpg', artist: '江戸村のとくぞう', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', page: 'https://commons.wikimedia.org/wiki/File:Sasanoyuki-3.jpg' },
  'okonomi-teppei-dish.jpg': { title: 'Okonomiyaki 001.jpg', artist: 'ume-y', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0', page: 'https://commons.wikimedia.org/wiki/File:Okonomiyaki_001.jpg' },
  'okonomi-teppei-store.jpg': { title: 'DOHTONBORI Okonomiyaki cooking 26 January 2025 Philippines2.jpg', artist: 'Valenzuela400', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', page: 'https://commons.wikimedia.org/wiki/File:DOHTONBORI_Okonomiyaki_cooking_26_January_2025_Philippines2.jpg' },
}

const unsplash: Credit = { title: 'Unsplash の写真', artist: 'Unsplash', license: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' }

export function photoCredit(src: string): Credit {
  if (src.includes('images.unsplash.com')) return unsplash
  return commons[src.split('/').pop() ?? ''] ?? { title: '写真', artist: '不明', license: '' }
}
