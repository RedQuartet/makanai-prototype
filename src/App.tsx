import { useEffect, useMemo, useState, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { Routes, Route, Link, NavLink, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, Check, ChevronRight, Clock3, Coins, ExternalLink, HandHelping, Heart, Home, Leaf, LocateFixed, Map, MapPin, Navigation, RotateCcw, Search, Sparkles, Star, Store, UserRound, UsersRound, UtensilsCrossed, X } from 'lucide-react'
import { photoCredit } from './credits'
import { areas, categories, demoUser as user, helpKinds, makanaiItems, statusLabels } from './data'
import { DemoProvider, useDemo } from './demo'
import { dayLabel, durationLabel, endTime, fromDateKey, ingredientList, jobDate, jobWhen, kg, rescuedPerPerson, toDateKey, totalKg, wageOf, yen } from './format'
import { OwnerApplicants, OwnerHome, OwnerNewJob } from './owner'
import { storage } from './storage'
import { KindIcon, Logo, Photo } from './ui'
import type { Again, Application, ApplicationStatus, Category, HelpKind, MakanaiItem } from './types'

const payLine = (item: MakanaiItem) => `給与 ${yen(wageOf(item.help))} ＋ まかない無料`

function AppHeader({ back, title }: { back?: boolean; title?: string }) {
  const navigate = useNavigate()
  return <header className="app-header">
    {back ? <button className="icon-button" onClick={() => navigate(-1)} aria-label="戻る"><ArrowLeft /></button> : <Logo compact />}
    {title && <strong>{title}</strong>}
    <Link to="/mypage" className="avatar-mini" aria-label="マイページ">{user.initial}</Link>
  </header>
}

function BottomNav() {
  return <nav className="bottom-nav" aria-label="メインナビゲーション">
    <NavLink to="/home"><Home /><span>見つける</span></NavLink>
    <NavLink to="/favorites"><Heart /><span>お気に入り</span></NavLink>
    <NavLink to="/mypage"><UserRound /><span>マイページ</span></NavLink>
  </nav>
}

function Shell({ children, back, title }: { children: ReactNode; back?: boolean; title?: string }) {
  return <div className="app-shell"><AppHeader back={back} title={title} /><main>{children}</main><BottomNav /></div>
}

function Welcome() {
  const navigate = useNavigate()
  const start = () => { storage.markVisited(); navigate('/home', { replace: true }) }
  return <div className="welcome">
    <div className="welcome-bg" aria-hidden="true"><Photo src={makanaiItems[0].dishImage} alt="特製からあげ定食" /></div>
    <div className="welcome-brand">
      <span className="welcome-mark"><UtensilsCrossed /></span>
      <h1>MAKANAI</h1>
      <p>まかないから探す求人サービス</p>
      <ul className="welcome-steps"><li><Search />探す</li><li><HandHelping />手伝う</li><li><Coins />給与＋まかない</li></ul>
    </div>
    <div className="welcome-actions">
      <button className="primary-button wide" onClick={start}>はじめる <ArrowRight /></button>
      <button className="text-button" onClick={start}>まずはのぞいてみる</button>
      <Link className="owner-link" to="/owner"><Store /> お店の方はこちら</Link>
    </div>
  </div>
}

function FavoriteButton({ id, light = false }: { id: string; light?: boolean }) {
  const { favorites, toggleFavorite } = useDemo()
  const active = favorites.includes(id)
  return <button className={`favorite-button ${active ? 'active' : ''} ${light ? 'light' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(id) }} aria-label={active ? 'お気に入りから削除' : 'お気に入りに追加'}><Heart fill={active ? 'currentColor' : 'none'} /></button>
}

function DishCard({ item }: { item: MakanaiItem }) {
  const { visitedStores } = useDemo()
  const first = item.ingredients[0]
  return <article className="dish-card">
    <Link to={`/makanai/${item.id}`} className="dish-photo-wrap">
      <Photo src={item.dishImage} alt={item.dishName} className="dish-photo" />
      <span className="category-pill">{item.category}</span>{!visitedStores.has(item.storeName) && <span className="first-pill"><Sparkles /> はじめてのお店</span>}<FavoriteButton id={item.id} light />
    </Link>
    <div className="dish-card-body">
      <div className="card-meta"><div className="card-location"><MapPin />{item.area}</div><div className="access-time"><Navigation />現在地から {item.access.route}</div></div><h2><Link to={`/makanai/${item.id}`}>{item.dishName}</Link></h2><div className="store-rating"><p className="store-name">{item.storeName}</p><span><Star fill="currentColor" />{item.rating.toFixed(1)} <small>({item.reviewCount}件)</small></span></div>
      <div className="job-chips"><span className="kind"><KindIcon kind={item.help.kind} />{item.help.kind}</span><span><CalendarDays />{jobWhen(item)}</span><span className="pay"><Coins />{payLine(item)}</span></div>
      {first && <p className="rescue-line"><Leaf />使う食材：期限間近の{first.name} {kg(first.kg)}{item.ingredients.length > 1 ? ' ほか' : ''}</p>}
      <p className="dish-description">{item.shortDescription}</p>
      <div className="tag-row">{item.tags.map(tag => <span key={tag}>#{tag}</span>)}</div>
      <Link className="card-link" to={`/store/${item.id}`}><span><HandHelping />お手伝いをする</span><ChevronRight /></Link>
    </div>
  </article>
}

/** 今日食べられるまかないから、好み・新着・はじめてのお店を重視して 1 つ選ぶ（もう応募した求人は除く） */
function pickToday(items: MakanaiItem[], liked: Set<Category>, visited: Set<string>, applied: Set<string>) {
  const open = items.filter(x => x.help.remaining > 0 && !applied.has(x.id))
  const today = open.filter(x => x.help.dayOffset === 0)
  const score = (x: MakanaiItem) => x.rating * 10 - x.access.minutes / 5 + (liked.has(x.category) ? 15 : 0) + (x.fresh ? 6 : 0) + (visited.has(x.storeName) ? 0 : 5)
  const item = [...(today.length ? today : open)].sort((a, b) => score(b) - score(a))[0]
  if (!item) return null
  const reason = liked.has(item.category) ? (item.category === 'その他' ? 'あなたの好みに近い一皿' : `${item.category}が好きなあなたに`)
    : item.fresh ? '今日出たばかりのまかない'
    : !visited.has(item.storeName) ? 'まだ行ったことのないお店'
    : `${item.access.route}で行けるお店`
  return { item, reason }
}

function TodayPick({ item, reason }: { item: MakanaiItem; reason: string }) {
  return <section className="today-pick" aria-label="今日のおすすめまかない">
    <Link to={`/makanai/${item.id}`} className="today-card">
      <Photo src={item.dishImage} alt={item.dishName} />
      <span className="today-label"><Sparkles /> 今日のおすすめまかない</span>
      <div className="today-body">
        <span className="today-reason">{reason}</span>
        <h2>{item.dishName}</h2>
        <p>{item.storeName}・{item.access.route}</p>
        <div className="today-job"><b>{jobWhen(item)}</b><span>{durationLabel(item.help.minutes)}の{item.help.kind}のお手伝いで、{payLine(item)}</span></div>
      </div>
    </Link>
    <p className="rescue-line"><Leaf />期限間近の{ingredientList(item)}を使い切ります</p>
  </section>
}

type Point = { x: number; y: number }

function pointInPolygon(point: Point, polygon: Point[]) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j]
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside
  }
  return inside
}

function AreaDrawModal({ onClose, onApply }: { onClose: () => void; onApply: (ids: string[]) => void }) {
  const { items } = useDemo()
  const [points, setPoints] = useState<Point[]>([])
  const [drawing, setDrawing] = useState(false)
  const selected = points.length > 2 ? items.filter(item => pointInPolygon(item.mapPoint, points)) : []
  const getPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: (event.clientX - rect.left) * 360 / rect.width, y: (event.clientY - rect.top) * 280 / rect.height }
  }
  const start = (event: ReactPointerEvent<SVGSVGElement>) => { event.currentTarget.setPointerCapture(event.pointerId); setPoints([getPoint(event)]); setDrawing(true) }
  const move = (event: ReactPointerEvent<SVGSVGElement>) => { if (drawing) setPoints(prev => [...prev, getPoint(event)]) }
  const end = () => setDrawing(false)
  const preset = (name: 'tokyo' | 'south') => setPoints(name === 'tokyo'
    ? [{x:52,y:82},{x:230,y:73},{x:252,y:192},{x:120,y:211},{x:47,y:165}]
    : [{x:119,y:137},{x:251,y:131},{x:249,y:271},{x:111,y:270}])
  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')
  return <div className="map-modal-backdrop" role="presentation"><section className="map-modal" role="dialog" aria-modal="true" aria-label="地図を囲ってエリア検索">
    <header><div><span className="eyebrow">DRAW ON MAP</span><h2>地図を囲って検索</h2></div><button onClick={onClose} aria-label="閉じる"><X /></button></header>
    <p className="map-guide">探したいエリアを、地図の上で指でぐるっと囲んでください。</p>
    <div className="preset-row"><button onClick={() => preset('tokyo')}>東京周辺</button><button onClick={() => preset('south')}>城南〜横浜</button></div>
    <div className="draw-map-wrap">
      <svg className="draw-map" viewBox="0 0 360 280" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        <rect width="360" height="280" fill="#eaf2e6" />
        <path d="M0 201 C65 181 94 200 128 214 C176 235 212 205 246 218 C286 234 311 219 360 212 L360 280 L0 280Z" fill="#d9edf1" />
        <path d="M42 78 L91 42 L155 55 L208 29 L269 56 L332 92 L316 163 L260 184 L225 235 L151 242 L108 205 L44 184Z" fill="#fff9f0" stroke="#d8c8b7" strokeWidth="2" />
        <g className="map-lines"><path d="M58 144 L318 117"/><path d="M176 43 L167 225"/><path d="M86 93 L265 188"/><path d="M225 75 L117 205"/></g>
        <g className="map-labels"><text x="176" y="102">東京</text><text x="139" y="173">世田谷</text><text x="182" y="195">目黒</text><text x="273" y="150">市川</text><text x="154" y="260">横浜</text><text x="175" y="31">さいたま</text></g>
        {points.length > 1 && <polygon points={polygonPoints} fill="rgba(237,141,131,.28)" stroke="#d96f67" strokeWidth="4" strokeLinejoin="round" />}
        {items.map(item => <g className={`shop-pin ${selected.some(x => x.id === item.id) ? 'selected' : ''}`} key={item.id} transform={`translate(${item.mapPoint.x} ${item.mapPoint.y})`}><circle r="10"/><text y="4">●</text></g>)}
      </svg>
      <span className="map-current"><LocateFixed /> 現在地</span>
    </div>
    <div className="map-selection"><span>{points.length > 2 ? `${selected.length}件のまかないが範囲内にあります` : '地図を囲むと店舗が選ばれます'}</span>{points.length > 0 && <button onClick={() => setPoints([])}><RotateCcw /> 描き直す</button>}</div>
    <button className="primary-button wide" disabled={selected.length === 0} onClick={() => onApply(selected.map(x => x.id))}>このエリアのまかないを見る <ArrowRight /></button>
  </section></div>
}

function HomePage() {
  const { items, applications, likedCategories, visitedStores } = useDemo()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('すべて')
  const [kind, setKind] = useState<HelpKind | 'すべて'>('すべて')
  const [area, setArea] = useState('すべてのエリア')
  const [sort, setSort] = useState<'recommend' | 'rating' | 'distance'>('recommend')
  const [mapOpen, setMapOpen] = useState(false)
  const [drawnIds, setDrawnIds] = useState<string[] | null>(null)
  const todayKey = toDateKey(new Date())
  const pick = pickToday(items, likedCategories, visitedStores, new Set(applications.filter(a => a.status < 4 || (a.jobDate ?? '') >= todayKey).map(a => a.makanaiId)))
  const results = items.filter(item => {
    const query = search.trim().toLowerCase()
    const matchesQuery = !query || [item.dishName, item.storeName, item.shortDescription, item.help.role, item.help.kind, ...item.tags, ...item.ingredients.map(x => x.name)].join(' ').toLowerCase().includes(query)
    const matchesCategory = category === 'すべて' || item.category === category
    const matchesKind = kind === 'すべて' || item.help.kind === kind
    const matchesArea = area === 'すべてのエリア' || item.area.startsWith(area)
    const matchesDrawing = !drawnIds || drawnIds.includes(item.id)
    return matchesQuery && matchesCategory && matchesKind && matchesArea && matchesDrawing
  }).sort((a, b) => sort === 'rating' ? b.rating - a.rating || b.reviewCount - a.reviewCount : sort === 'distance' ? a.access.minutes - b.access.minutes : a.help.dayOffset - b.help.dayOffset || (b.rating * 10 - b.access.minutes / 5) - (a.rating * 10 - a.access.minutes / 5))
  const reset = () => { setSearch(''); setCategory('すべて'); setKind('すべて'); setArea('すべてのエリア'); setDrawnIds(null) }
  const kinds = helpKinds.filter(k => items.some(x => x.help.kind === k))
  return <Shell>
    <section className="home-intro"><div><span className="hello">こんにちは、{user.name.split(' ')[1]}さん</span><h1>今日は何が<br /><em>食べたい？</em></h1></div></section>
    {pick && <TodayPick item={pick.item} reason={pick.reason} />}
    <section className="finder" aria-label="まかないを探す">
      <label className="search-box"><Search /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="料理や食材で検索" aria-label="料理・お店・食材・お手伝いで検索" /></label>
      <label className="area-select"><MapPin /><select value={area} onChange={e => setArea(e.target.value)} aria-label="エリア">{areas.map(a => <option key={a} value={a}>{a === 'すべてのエリア' ? '全エリア' : a}</option>)}</select></label>
      <button className={`map-button ${drawnIds ? 'active' : ''}`} onClick={() => setMapOpen(true)} aria-label="地図を囲ってエリア検索"><Map />{drawnIds && <b>{drawnIds.length}</b>}</button>
    </section>
    {drawnIds && <div className="drawn-chip"><span>地図で囲ったエリア：{drawnIds.length}件</span><button onClick={() => setDrawnIds(null)}>解除</button></div>}
    <div className="category-scroll" role="group" aria-label="料理のカテゴリー">{categories.map(c => <button key={c} className={category === c ? 'active' : ''} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>
    <div className="kind-scroll" role="group" aria-label="お手伝いの種類"><span className="kind-scroll-label">お手伝い</span><button className={kind === 'すべて' ? 'active' : ''} aria-pressed={kind === 'すべて'} onClick={() => setKind('すべて')}>すべて</button>{kinds.map(k => <button key={k} className={kind === k ? 'active' : ''} aria-pressed={kind === k} onClick={() => setKind(k)}><KindIcon kind={k} />{k}</button>)}</div>
    <section className="list-section"><div className="section-heading"><div><span className="eyebrow">NEAR YOU</span><h2>{drawnIds ? '囲ったエリアのまかない' : area === 'すべてのエリア' ? '現在地からのおすすめ' : `${area}のまかない`}</h2><p className="near-note"><LocateFixed />三軒茶屋駅付近（デモの現在地）</p></div><span>{results.length}品</span></div>
      <div className="sort-row"><span>並び替え</span><div>{([['recommend','おすすめ順'],['rating','評価が高い順'],['distance','距離が近い順']] as const).map(([value,label]) => <button key={value} className={sort === value ? 'active' : ''} onClick={() => setSort(value)}>{label}</button>)}</div></div>
      <div className="dish-grid">{results.map(item => <DishCard key={item.id} item={item} />)}</div>
      {!results.length && <div className="empty-state"><span>🍚</span><h2>ぴったりのまかないが見つかりませんでした</h2><p>検索や絞り込みを変えてみてください。</p><button className="secondary-button" onClick={reset}>条件をリセット</button></div>}
    </section>
    {mapOpen && <AreaDrawModal onClose={() => setMapOpen(false)} onApply={(ids) => { setDrawnIds(ids); setArea('すべてのエリア'); setMapOpen(false) }} />}
  </Shell>
}

function NotFound() { return <Shell back title="見つかりません"><div className="empty-state tall"><span>🍽️</span><h1>お探しのまかないが<br />見つかりませんでした</h1><Link className="primary-button" to="/home">ホームへ戻る</Link></div></Shell> }

function useItem() {
  const { id } = useParams()
  const { items } = useDemo()
  return items.find(x => x.id === id)
}

function MakanaiDetail() {
  const { visitedStores } = useDemo()
  const item = useItem()
  if (!item) return <NotFound />
  return <Shell back>
    <section className="hero-photo"><Photo src={item.dishImage} alt={item.dishName} /><FavoriteButton id={item.id} light /><span className="hero-category">{item.category}</span></section>
    <article className="detail-content overlap">
      <div className="card-location"><MapPin />{item.area}</div><h1>{item.dishName}</h1><p className="detail-store"><Store />{item.storeName}{!visitedStores.has(item.storeName) && <span className="first-tag">はじめてのお店</span>}</p><p className="lead">{item.description}</p>
      <section className="rescue-box">
        <span className="mini-title"><Leaf /> このまかないで救う食材</span>
        {item.ingredients.map(x => <div className="rescue-row" key={x.name}><b>{x.name}</b><span>{kg(x.kg)}</span><em className={x.daysLeft <= 1 ? 'urgent' : ''}>期限まであと{x.daysLeft}日</em></div>)}
        <p>合計 {kg(totalKg(item))}（{item.help.slots}人分）。使い切れずに捨てられるはずだった食材を、お手伝いのあとのまかないにします。</p>
      </section>
      <section className="recommend-box"><span className="mini-title"><Sparkles /> おすすめポイント</span>{item.recommendation.map((point, i) => <div className="recommend-row" key={point}><b>0{i + 1}</b><span>{point}</span></div>)}</section>
      <section className="condition-box"><h2>このまかないの提供条件</h2><div><Clock3 /><span><small>タイミング</small>お手伝いのあと</span></div><div><UtensilsCrossed /><span><small>提供方法</small>{item.help.mealCondition}</span></div><div><Coins /><span><small>料金</small>無料（給与とは別にもらえます）</span></div></section>
      <div className="story-nudge"><span>まずは料理から。<br />気になったら、お店とお手伝いの中身を見てみよう。</span></div>
      <Link to={`/store/${item.id}`} className="primary-button wide sticky-cta">このまかないがつく求人を見る <ArrowRight /></Link>
    </article>
  </Shell>
}

/** お手伝いの画面。何をするか → 当日の流れ → 条件 → お店、の順に見せる */
function StoreDetail() {
  const item = useItem()
  if (!item) return <NotFound />
  const { help } = item
  const steps = [
    { icon: <MapPin />, title: `${dayLabel(jobDate(item))} ${help.start} にお店へ`, text: `${help.location}。開始10分前が目安です。` },
    { icon: <KindIcon kind={help.kind} />, title: help.role, text: `${help.start}〜${endTime(help.start, help.minutes)}（${durationLabel(help.minutes)}）。${help.detail ?? ''}` },
    { icon: <UtensilsCrossed />, title: `まかない「${item.dishName}」を食べる`, text: `無料。${help.mealCondition}。`, meal: true },
    { icon: <Coins />, title: `給与 ${yen(wageOf(help))} を受け取る`, text: 'お手伝いのあと、MAKANAI がお店に代わって振り込みます。' },
  ]
  const rows = [
    [CalendarDays, '日時', jobWhen(item)], [MapPin, '勤務場所', help.location], [Navigation, '現在地からのアクセス', `${item.access.route}（約${item.access.distance}）`], [UsersRound, '募集人数', `あと${help.remaining}名（全${help.slots}名）`]
  ] as const
  return <Shell back title="お手伝いの内容">
    <section className="help-hero"><Photo src={item.storeImage} alt={item.storeName} /><div className="help-hero-label"><span className="kind-badge"><KindIcon kind={help.kind} />{help.kind ?? 'その他'}のお手伝い</span><h1>{help.role}</h1><p><Store />{item.storeName}</p></div></section>
    <article className="detail-content">
      <section className="flow-section"><span className="eyebrow">HELP & EAT</span><h2>当日の流れ</h2><ol className="flow-list">{steps.map((step, i) => <li key={i} className={step.meal ? 'meal' : ''}><span>{step.icon}</span><div><b>{step.title}</b><small>{step.text}</small></div></li>)}</ol></section>
      <section className="help-section"><h2>募集の条件</h2><div className="info-list">{rows.map(([Icon, label, value]) => <div className="info-row" key={label}><span className="info-icon"><Icon /></span><div><small>{label}</small><b>{value}</b></div></div>)}</div></section>
      <section className="reward-card">
        <div><span>給与</span><strong className="reward-big">{yen(wageOf(help))}</strong><small>時給 {yen(help.hourlyWage)} × {durationLabel(help.minutes)}（地域の最低賃金以上）</small></div>
        <div className="reward-sub"><span>交通費</span><strong>{help.transport}</strong></div>
        <hr />
        <div><span>まかない（無料）</span><strong>{item.dishName}</strong><small>{help.mealCondition}</small></div>
      </section>
      <section className="requirements"><h3>応募条件</h3><ul>{help.requirements.map(x => <li key={x}><Check />{x}</li>)}</ul></section>
      <section className="store-intro bottom"><span className="eyebrow">ABOUT THE SHOP</span><h2>{item.storeName}について</h2><p className="lead">{item.storeDescription}</p><div className="atmosphere"><span>お店の雰囲気</span><p>{item.atmosphere}</p></div></section>
      <p className="legal-note">※ お店・給与・日時は体験用の仮データです。給与は地域の最低賃金以上で、まかないは給与とは別に無料で出ます。雇用契約はお店と結び、給与は MAKANAI がお店に代わって支払います。</p>
      <Link to={`/apply/${item.id}`} className="primary-button wide sticky-cta">この求人に応募する <ArrowRight /></Link>
    </article>
  </Shell>
}

function ApplyConfirm() {
  const { applications, apply } = useDemo()
  const navigate = useNavigate()
  const item = useItem()
  if (!item) return <NotFound />
  const { help } = item
  const active = applications.find(x => x.makanaiId === item.id && x.status < 4)
  const submit = () => { const applicationId = apply(item.id); navigate(`/application/${applicationId}`, { replace: true }) }
  return <Shell back title="応募内容の確認"><article className="detail-content confirm-page">
    <div className="confirm-dish"><Photo src={item.dishImage} alt={item.dishName} /><div><small>お手伝いのあとのまかない</small><strong>{item.dishName}</strong><span>{item.storeName}</span></div></div>
    <h1>応募内容を確認</h1><div className="confirm-list">
      <div><span>お手伝い</span><b>{help.role}</b></div>
      <div><span>日時</span><b>{jobWhen(item)}</b></div>
      <div><span>時間</span><b>{durationLabel(help.minutes)}</b></div>
      <div><span>給与</span><b>{yen(wageOf(help))}（時給 {yen(help.hourlyWage)} × {durationLabel(help.minutes)}）</b></div>
      <div><span>交通費</span><b>{help.transport}</b></div>
      <div><span>まかない</span><b>無料（{help.mealCondition}）</b></div>
      <div><span>雇用契約</span><b>{item.storeName}と結びます</b></div>
      <div><span>給与の受け取り</span><b>お手伝いのあと、MAKANAI がお店に代わって振り込みます</b></div>
    </div>
    <div className="notice-box"><strong>応募前にご確認ください</strong><ul><li>これは体験用プロトタイプで、実際の店舗へ通知されません。</li><li>当日は開始10分前を目安にお越しください。</li><li>体調がすぐれないときは無理をせず、お店へ連絡しましょう。</li><li>無料のまかないは、税金の計算では給与の一部として扱われます。</li></ul></div>
    {active ? <Link className="primary-button wide" to={`/application/${active.id}`}>応募状況を見る <ArrowRight /></Link> : <button className="primary-button wide" onClick={submit}>内容を確認して応募する <ArrowRight /></button>}
    <p className="agreement">ボタンを押すことで、上記の内容に同意したものとします。</p>
  </article></Shell>
}

function Progress({ status }: { status: ApplicationStatus }) {
  return <div className="progress-list">{statusLabels.map((label, i) => <div className={`progress-step ${i <= status ? 'done' : ''} ${i === status ? 'current' : ''}`} key={label}><span>{i < status || status === 4 ? <Check /> : i + 1}</span><div><b>{label}</b>{i === status && <small>{i === 4 ? 'おつかれさまでした。おいしい時間を！' : '現在のステータス'}</small>}</div></div>)}</div>
}

const againLabels: Record<Again, string> = { visit: 'また行きたい', help: 'また手伝いたい' }

function ReviewForm({ applicationId, placeholder }: { applicationId: string; placeholder: string }) {
  const { saveReview } = useDemo()
  const [again, setAgain] = useState<Again[]>([])
  const [comment, setComment] = useState('')
  const toggle = (value: Again) => setAgain(prev => prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value])
  const submit = (event: FormEvent) => { event.preventDefault(); saveReview(applicationId, { again, comment: comment.trim(), createdAt: new Date().toISOString() }) }
  return <form className="review-form" onSubmit={submit}>
    <h2>ひと言レビュー</h2>
    <p>お店の画面に届きます。お店の励みになります。</p>
    <div className="again-row">{(['visit', 'help'] as const).map(value => <button type="button" key={value} className={again.includes(value) ? 'on' : ''} aria-pressed={again.includes(value)} onClick={() => toggle(value)}>{value === 'visit' ? <Store /> : <HandHelping />}{againLabels[value]}</button>)}</div>
    <label className="review-input"><span className="sr-only">ひと言</span><input id="review-comment" value={comment} maxLength={60} onChange={e => setComment(e.target.value)} placeholder={placeholder} /></label>
    <button className="primary-button wide" disabled={!again.length && !comment.trim()}>レビューを送る</button>
  </form>
}

function ReviewDone({ application }: { application: Application }) {
  const review = application.review!
  return <div className="review-done"><span className="mini-title"><Check /> レビューを送りました</span>{review.again.length > 0 && <div className="again-chips">{review.again.map(x => <span key={x} className="again-chip">{againLabels[x]}</span>)}</div>}{review.comment && <p>「{review.comment}」</p>}</div>
}

function ApplicationPage() {
  const { applicationId } = useParams()
  const { applications, items, setStatus } = useDemo()
  const app = applications.find(x => x.id === applicationId)
  const item = items.find(x => x.id === app?.makanaiId)
  if (!app || !item) return <NotFound />
  const date = app.jobDate ? fromDateKey(app.jobDate) : jobDate(item)
  const when = `${dayLabel(date)} ${item.help.start}〜${endTime(item.help.start, item.help.minutes)}`
  const messages = ['応募が完了しました！', 'お店の確認を待っています', '採用が決まりました！', 'お手伝い、おつかれさまでした！', 'まかないを食べました！']
  const notes = ['お店が内容を確認すると、採用が決まります。', 'お店からのお返事を待っています。', `${when}に、お店へ向かいましょう。開始10分前が目安です。`, `給与 ${yen(wageOf(item.help))} は、MAKANAI がお店に代わって振り込みます。できたてのまかないをどうぞ。`, app.review ? 'レビューはお店に届きました。また会いに行きましょう。' : 'お店との出会いと、おいしい一皿。よかったら、ひと言レビューを送りましょう。']
  return <Shell back title="応募状況"><article className="completion-page">
    <div className={`completion-icon status-${app.status}`}>{app.status === 4 ? '🍽️' : <BadgeCheck />}</div><span className="eyebrow">APPLICATION STATUS</span><h1>{messages[app.status]}</h1><p>{notes[app.status]}</p>
    <div className="application-summary"><Photo src={item.dishImage} alt={item.dishName} /><div><small>{item.storeName}</small><strong>{item.dishName}</strong><span><CalendarDays />{when}</span></div></div>
    {app.status === 4 && <div className="rescue-result"><Leaf /><div><b>{kg(rescuedPerPerson(item))} の食材を救いました</b><span>期限間近の{item.ingredients.map(x => x.name).join('・')}を使ったまかないでした</span></div></div>}
    {app.status === 4 && (app.review ? <ReviewDone application={app} /> : <ReviewForm applicationId={app.id} placeholder={`例：${item.dishName}、最高でした！`} />)}
    <Progress status={app.status} />
    {app.status < 4 && <><button className="primary-button wide" onClick={() => setStatus(app.id, Math.min(app.status + 1, 4) as ApplicationStatus)}>デモ：次のステータスへ <ArrowRight /></button><p className="demo-hint">お店側の画面の「応募者」からも進められます。<Link to="/owner/applicants">お店側の画面へ</Link></p></>}
    {app.status === 4 && <Link to="/mypage" className="primary-button wide">マイページで記録を見る <ArrowRight /></Link>}
    <Link to="/home" className="text-link">ほかのまかないを探す</Link>
  </article></Shell>
}

function FavoritesPage() {
  const { items, favorites } = useDemo()
  const liked = items.filter(x => favorites.includes(x.id))
  return <Shell title="お気に入り"><section className="simple-page"><div className="page-title"><span className="eyebrow">YOUR FAVORITES</span><h1>食べてみたい<br />まかない</h1><p>{liked.length}件のお気に入り</p></div>{liked.length ? <div className="dish-grid">{liked.map(x => <DishCard key={x.id} item={x} />)}</div> : <div className="empty-state"><span>♡</span><h2>まだお気に入りはありません</h2><p>食べてみたいまかないを見つけて、ハートを押してみましょう。</p><Link className="secondary-button" to="/home">まかないを探す</Link></div>}</section></Shell>
}

function MyPage() {
  const { items, favorites, applications, resetDemo } = useDemo()
  const withItem = applications.map(app => ({ app, item: items.find(x => x.id === app.makanaiId) })).filter((x): x is { app: Application; item: MakanaiItem } => !!x.item)
  const active = withItem.filter(x => x.app.status < 4)
  const completed = withItem.filter(x => x.app.status === 4)
  const rescued = completed.reduce((sum, x) => sum + rescuedPerPerson(x.item), 0)
  return <Shell title="マイページ"><section className="mypage">
    <div className="profile-card"><div className="profile-avatar">{user.initial}</div><div><small>こんにちは！</small><h1>{user.name}</h1><span><MapPin />{user.area}</span></div></div>
    <div className="rescue-card"><span className="rescue-icon"><Leaf /></span><div><small>あなたが救った食材</small><strong>{kg(rescued)}</strong><span>まかない {completed.length} 皿分。期限間近の食材を、おいしく使い切りました。</span></div></div>
    <div className="stat-row"><Link to="/favorites"><b>{favorites.length}</b><span>お気に入り</span></Link><div><b>{active.length}</b><span>応募中</span></div><div><b>{completed.length}</b><span>食べた</span></div></div>
    <section className="mypage-section"><div className="section-heading"><h2>応募状況</h2></div>{active.length ? <div className="application-list">{active.map(({ app, item }) => <Link to={`/application/${app.id}`} className="application-card" key={app.id}><Photo src={item.dishImage} alt={item.dishName} /><div><span className={`status-chip status-${app.status}`}>{statusLabels[app.status]}</span><h3>{item.dishName}</h3><p>{item.storeName}</p></div><ChevronRight /></Link>)}</div> : <div className="small-empty"><p>応募中のお手伝いはありません。</p><Link to="/home">食べたいまかないを探す</Link></div>}</section>
    <section className="mypage-section"><div className="section-heading"><h2>食べたまかない</h2><span>{completed.length}皿</span></div>{completed.length ? <div className="eaten-grid">{completed.map(({ app, item }) => <Link to={`/application/${app.id}`} key={app.id}><Photo src={item.dishImage} alt={item.dishName} />{app.review?.again.includes('visit') && <em>また行きたい</em>}<span>{item.dishName}</span></Link>)}</div> : <div className="small-empty"><span className="bowl">🍚</span><p>お手伝いのあとに食べたまかないが、ここに並びます。</p></div>}</section>
    <section className="mypage-section demo-tools"><Link to="/owner" className="secondary-button wide"><Store /> お店側の画面を見る（デモ）</Link><button className="text-button" onClick={resetDemo}>デモのデータを最初に戻す</button><Link to="/credits" className="text-link">写真のクレジット</Link></section>
  </section></Shell>
}

/** 写真の出典。ウィキメディア・コモンズの写真は、撮影者とライセンスの表示が条件 */
function CreditsPage() {
  const photos = makanaiItems.flatMap(item => [[item.dishImage, item.dishName], [item.storeImage, item.storeName]] as const)
  return <Shell back title="写真のクレジット"><section className="simple-page credits-page">
    <div className="page-title"><span className="eyebrow">PHOTO CREDITS</span><h1>写真のクレジット</h1><p>料理とお店の写真は、ウィキメディア・コモンズと Unsplash で公開されている写真を使っています。お店の名前やメニューは架空のもので、写真に写っているお店とは関係ありません。</p></div>
    <ul className="credit-list">{photos.map(([src, label]) => { const credit = photoCredit(src); return <li key={src}><Photo src={src} alt={label} /><div><b>{label}</b>{credit.page ? <a href={credit.page} target="_blank" rel="noreferrer">{credit.title}<ExternalLink /></a> : <span>{credit.title}</span>}<small>{credit.artist}・{credit.licenseUrl ? <a href={credit.licenseUrl} target="_blank" rel="noreferrer">{credit.license}</a> : credit.license}</small></div></li> })}</ul>
  </section></Shell>
}

function ScrollToTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo({ top: 0 }) }, [pathname]); return null }

function AppRoutes() {
  const startPath = useMemo(() => storage.hasVisited() ? '/home' : '/welcome', [])
  return <Routes>
    <Route path="/" element={<Navigate to={startPath} replace />} /><Route path="/welcome" element={<Welcome />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/makanai/:id" element={<MakanaiDetail />} />
    <Route path="/store/:id" element={<StoreDetail />} /><Route path="/apply/:id" element={<ApplyConfirm />} />
    <Route path="/application/:applicationId" element={<ApplicationPage />} />
    <Route path="/favorites" element={<FavoritesPage />} />
    <Route path="/mypage" element={<MyPage />} />
    <Route path="/credits" element={<CreditsPage />} />
    <Route path="/owner" element={<OwnerHome />} /><Route path="/owner/new" element={<OwnerNewJob />} /><Route path="/owner/applicants" element={<OwnerApplicants />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
}

export default function App() {
  return <DemoProvider><ScrollToTop /><AppRoutes /></DemoProvider>
}
