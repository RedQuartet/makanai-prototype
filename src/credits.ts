export interface Credit {
  artist: string
  license: string
  licenseUrl: string
}

/** 写真の撮影者（どれも Unsplash の写真。Unsplash License では表示は任意だが、感謝をこめて載せる） */
const photographers: Record<string, string> = {
  '1569058242253-92a9c755a0ec': 'Unsplash',
  '1693822998952-b8d18c61043b': 'Maximilian Csali',
  '1638866281450-3933540af86a': 'Huyen Bui',
  '1790102563096-64a25de9e9c0': 'Agata Malankiewicz',
  '1743148509702-2198b23ede1c': 'Leo Okuyama',
  '1784871258469-a81549044753': 'Fabio Sasso',
  '1706145779556-f2c642db2699': 'Inna Safa',
  '1554118811-1e0d58224f24': 'Unsplash',
  '1653220329192-ce4d725d352a': 'Takafumi Yamashita',
  '1761393574666-c7b435ef2983': 'ayumi kubo',
  '1622973536968-3ead9e780960': 'Homescreenify',
  '1722587563138-556bf8e966a9': 'Thimotius Timmy',
  '1609183480237-ccbb2d7c5772': 'Tomoyo S',
  '1759643854807-22c0feee6dd7': 'Tsuyoshi Kozu',
  '1738681336104-608b4e7dc3b0': 'Mikey Frost',
  '1768162126008-3caf0710a268': 'Perry Merrity II',
  '1717903623956-080d34a18e58': 'Kouji Tsuru',
  '1790324452976-27d6899f7b13': 'XS Xue',
  '1595044643502-616eeebbdff3': 'Crystal Jo',
  '1738861666945-281c33ffff87': 'wei',
  '1765510295901-3aa756cc1471': 'Kouji Tsuru',
  '1768162125972-724be0bbc063': 'Perry Merrity II',
  '1764520406362-b1673b2213bf': 'Yosuke Ota',
  '1786561210727-ed700e30a0e5': 'Stefan Szankowski',
}

export function photoCredit(src: string): Credit {
  const id = src.match(/photo-([0-9a-f-]+)/)?.[1] ?? ''
  return { artist: photographers[id] ?? 'Unsplash', license: 'Unsplash License', licenseUrl: 'https://unsplash.com/license' }
}
