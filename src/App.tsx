import { useEffect, useMemo, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { Routes, Route, Link, NavLink, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, Check, ChevronRight, Clock3, Heart, Home, LocateFixed, Map, MapPin, Navigation, RotateCcw, Search, Sparkles, Star, Store, UserRound, UsersRound, UtensilsCrossed, X } from 'lucide-react'
import { areas, categories, makanaiItems, statusLabels } from './data'
import { storage } from './storage'
import type { Application, ApplicationStatus, MakanaiItem } from './types'

const user = { name: '佐藤 みのり', initial: 'み', area: '東京都世田谷区' }

function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return failed
    ? <div className={`photo-fallback ${className}`} role="img" aria-label={`${alt}のイメージ`}><UtensilsCrossed /><span>{alt}</span></div>
    : <img className={className} src={src} alt={alt} onError={() => setFailed(true)} />
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <Link to="/home" className={`logo ${compact ? 'compact' : ''}`} aria-label="MAKANAI ホームへ"><span className="logo-mark"><UtensilsCrossed /></span><span>MAKANAI</span></Link>
}

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
    <div className="welcome-top"><Logo /><p>まかないで、うれしい出会いを</p></div>
    <div className="welcome-visual">
      <div className="sun-dot" /><Photo src={makanaiItems[0].dishImage} alt="特製からあげ定食" />
      <div className="floating-note"><Sparkles /> おいしい出会い、みつけた</div>
    </div>
    <div className="welcome-copy"><span className="eyebrow">食べる・手伝う・つながる</span><h1>今日、何が<br /><em>食べたい？</em></h1><p>気になるまかないを見つけたら、<br />そのお店をちょっとお手伝い。</p></div>
    <button className="primary-button wide" onClick={start}>まかないを探す <ArrowRight /></button>
    <button className="text-button" onClick={start}>まずはのぞいてみる</button>
  </div>
}

function FavoriteButton({ id, favorites, toggle, light = false }: { id: string; favorites: string[]; toggle: (id: string) => void; light?: boolean }) {
  const active = favorites.includes(id)
  return <button className={`favorite-button ${active ? 'active' : ''} ${light ? 'light' : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id) }} aria-label={active ? 'お気に入りから削除' : 'お気に入りに追加'}><Heart fill={active ? 'currentColor' : 'none'} /></button>
}

function DishCard({ item, favorites, toggle, recommended = false }: { item: MakanaiItem; favorites: string[]; toggle: (id: string) => void; recommended?: boolean }) {
  return <article className="dish-card">
    <Link to={`/makanai/${item.id}`} className="dish-photo-wrap">
      <Photo src={item.dishImage} alt={item.dishName} className="dish-photo" />
      <span className="category-pill">{item.category}</span>{recommended && <span className="recommend-pill"><Sparkles /> 近くておすすめ</span>}<FavoriteButton id={item.id} favorites={favorites} toggle={toggle} light />
    </Link>
    <div className="dish-card-body">
      <div className="card-meta"><div className="card-location"><MapPin />{item.area}</div><div className="access-time"><Navigation />現在地から {item.access.route}</div></div><h2>{item.dishName}</h2><div className="store-rating"><p className="store-name">{item.storeName}</p><span><Star fill="currentColor" />{item.rating.toFixed(1)} <small>({item.reviewCount}件)</small></span></div><p className="dish-description">{item.shortDescription}</p>
      <div className="tag-row">{item.tags.map(tag => <span key={tag}>#{tag}</span>)}</div>
      <Link className="card-link" to={`/makanai/${item.id}`}>詳しく見る <ChevronRight /></Link>
    </div>
  </article>
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
  const [points, setPoints] = useState<Point[]>([])
  const [drawing, setDrawing] = useState(false)
  const selected = points.length > 2 ? makanaiItems.filter(item => pointInPolygon(item.mapPoint, points)) : []
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
        {makanaiItems.map(item => <g className={`shop-pin ${selected.some(x => x.id === item.id) ? 'selected' : ''}`} key={item.id} transform={`translate(${item.mapPoint.x} ${item.mapPoint.y})`}><circle r="10"/><text y="4">●</text></g>)}
      </svg>
      <span className="map-current"><LocateFixed /> 現在地</span>
    </div>
    <div className="map-selection"><span>{points.length > 2 ? `${selected.length}件のまかないが範囲内にあります` : '地図を囲むと店舗が選ばれます'}</span>{points.length > 0 && <button onClick={() => setPoints([])}><RotateCcw /> 描き直す</button>}</div>
    <button className="primary-button wide" disabled={selected.length === 0} onClick={() => onApply(selected.map(x => x.id))}>このエリアのまかないを見る <ArrowRight /></button>
  </section></div>
}

function HomePage({ favorites, toggle }: { favorites: string[]; toggle: (id: string) => void }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('すべて')
  const [area, setArea] = useState('すべてのエリア')
  const [sort, setSort] = useState<'recommend' | 'rating' | 'distance'>('recommend')
  const [mapOpen, setMapOpen] = useState(false)
  const [drawnIds, setDrawnIds] = useState<string[] | null>(null)
  const results = makanaiItems.filter(item => {
    const query = search.trim().toLowerCase()
    const matchesQuery = !query || [item.dishName, item.storeName, item.shortDescription, ...item.tags].join(' ').toLowerCase().includes(query)
    const matchesCategory = category === 'すべて' || item.category === category
    const matchesArea = area === 'すべてのエリア' || item.area.startsWith(area)
    const matchesDrawing = !drawnIds || drawnIds.includes(item.id)
    return matchesQuery && matchesCategory && matchesArea && matchesDrawing
  }).sort((a, b) => sort === 'rating' ? b.rating - a.rating || b.reviewCount - a.reviewCount : sort === 'distance' ? a.access.minutes - b.access.minutes : (b.rating * 10 - b.access.minutes / 5) - (a.rating * 10 - a.access.minutes / 5))
  return <Shell>
    <section className="home-intro"><div><span className="hello">こんにちは、{user.name.split(' ')[1]}さん</span><h1>今日は何が<br /><em>食べたい？</em></h1></div></section>
    <section className="location-panel"><span className="location-icon"><LocateFixed /></span><div><small>デモ現在地</small><strong>三軒茶屋駅付近</strong><span>この場所から近い順におすすめしています</span></div><button onClick={() => { setArea('すべてのエリア'); setDrawnIds(null) }}>現在地に戻す</button></section>
    <section className="search-panel">
      <label className="search-box"><Search /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="料理やお店を検索" /></label>
      <label className="area-select"><MapPin /><select value={area} onChange={e => setArea(e.target.value)}>{areas.map(a => <option key={a}>{a}</option>)}</select></label>
    </section>
    <div className="map-search-row"><button className={drawnIds ? 'active' : ''} onClick={() => setMapOpen(true)}><Map />{drawnIds ? `囲ったエリア：${drawnIds.length}件` : '地図を囲ってエリア検索'}<ChevronRight /></button>{drawnIds && <button className="clear-map" onClick={() => setDrawnIds(null)}>解除</button>}</div>
    <div className="category-scroll" aria-label="カテゴリー">{categories.map(c => <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>
    <section className="list-section"><div className="section-heading"><div><span className="eyebrow">NEAR YOU</span><h2>{drawnIds ? '囲ったエリアのまかない' : area === 'すべてのエリア' ? '現在地からのおすすめ' : `${area}のまかない`}</h2></div><span>{results.length}品</span></div>
      <div className="sort-row"><span>並び替え</span><div>{([['recommend','おすすめ順'],['rating','評価が高い順'],['distance','距離が近い順']] as const).map(([value,label]) => <button key={value} className={sort === value ? 'active' : ''} onClick={() => setSort(value)}>{label}</button>)}</div></div>
      <div className="dish-grid">{results.map((item, index) => <DishCard key={item.id} item={item} favorites={favorites} toggle={toggle} recommended={!drawnIds && area === 'すべてのエリア' && sort !== 'rating' && index < 2} />)}</div>
      {!results.length && <div className="empty-state"><span>🍚</span><h2>ぴったりのまかないが見つかりませんでした</h2><p>検索や絞り込みを変えてみてください。</p><button className="secondary-button" onClick={() => { setSearch(''); setCategory('すべて'); setArea('すべてのエリア'); setDrawnIds(null) }}>条件をリセット</button></div>}
    </section>
    {mapOpen && <AreaDrawModal onClose={() => setMapOpen(false)} onApply={(ids) => { setDrawnIds(ids); setArea('すべてのエリア'); setMapOpen(false) }} />}
  </Shell>
}

function NotFound() { return <Shell back title="見つかりません"><div className="empty-state tall"><span>🍽️</span><h1>お探しのまかないが<br />見つかりませんでした</h1><Link className="primary-button" to="/home">ホームへ戻る</Link></div></Shell> }

function MakanaiDetail({ favorites, toggle }: { favorites: string[]; toggle: (id: string) => void }) {
  const { id } = useParams(); const item = makanaiItems.find(x => x.id === id)
  if (!item) return <NotFound />
  return <Shell back>
    <section className="hero-photo"><Photo src={item.dishImage} alt={item.dishName} /><FavoriteButton id={item.id} favorites={favorites} toggle={toggle} light /><span className="hero-category">{item.category}</span></section>
    <article className="detail-content overlap">
      <div className="card-location"><MapPin />{item.area}</div><h1>{item.dishName}</h1><p className="detail-store"><Store />{item.storeName}</p><p className="lead">{item.description}</p>
      <section className="recommend-box"><span className="mini-title"><Sparkles /> おすすめポイント</span>{item.recommendation.map((point, i) => <div className="recommend-row" key={point}><b>0{i + 1}</b><span>{point}</span></div>)}</section>
      <section className="condition-box"><h2>このまかないの提供条件</h2><div><Clock3 /><span><small>タイミング</small>お手伝い終了後</span></div><div><UtensilsCrossed /><span><small>提供方法</small>{item.help.mealCondition}</span></div></section>
      <div className="story-nudge"><span>まずは料理から。<br />気になったら、お店のことを知ってみよう。</span></div>
      <Link to={`/store/${item.id}`} className="primary-button wide sticky-cta">このまかないを食べるには？ <ArrowRight /></Link>
    </article>
  </Shell>
}

function StoreDetail() {
  const { id } = useParams(); const item = makanaiItems.find(x => x.id === id)
  if (!item) return <NotFound />
  const rows = [
    [UtensilsCrossed, 'お手伝い内容', item.help.role], [Clock3, '所要時間', item.help.duration], [CalendarDays, '日時', item.help.date], [MapPin, '勤務場所', item.help.location], [Navigation, '現在地からのアクセス', `${item.access.route}（約${item.access.distance}）`], [UsersRound, '募集人数', item.help.capacity]
  ] as const
  return <Shell back title="お店とお手伝い">
    <section className="store-hero"><Photo src={item.storeImage} alt={item.storeName} /><div className="store-hero-label"><span>このまかないのお店</span><h1>{item.storeName}</h1></div></section>
    <article className="detail-content">
      <section className="store-intro"><span className="eyebrow">ABOUT THE SHOP</span><h2>お店について</h2><p className="lead">{item.storeDescription}</p><div className="atmosphere"><span>お店の雰囲気</span><p>{item.atmosphere}</p></div></section>
      <section className="help-section"><span className="eyebrow">HELP & EAT</span><h2>お手伝いの内容</h2><p className="section-note">条件をよく確認してから応募してください。</p><div className="info-list">{rows.map(([Icon, label, value]) => <div className="info-row" key={label}><span className="info-icon"><Icon /></span><div><small>{label}</small><b>{value}</b></div></div>)}</div></section>
      <section className="reward-card"><div><span>報酬条件</span><strong>{item.help.reward}</strong></div><hr /><div><span>まかない</span><strong>{item.dishName}</strong><small>{item.help.mealCondition}</small></div></section>
      <section className="requirements"><h3>応募条件</h3><ul>{item.help.requirements.map(x => <li key={x}><Check />{x}</li>)}</ul></section>
      <p className="legal-note">※ 表示されている報酬・勤務条件は体験用の仮データです。実際の適法性や労働条件を保証するものではありません。</p>
      <Link to={`/apply/${item.id}`} className="primary-button wide sticky-cta">このお店でお手伝いする <ArrowRight /></Link>
    </article>
  </Shell>
}

function ApplyConfirm({ applications, apply }: { applications: Application[]; apply: (id: string) => string }) {
  const { id } = useParams(); const navigate = useNavigate(); const item = makanaiItems.find(x => x.id === id)
  if (!item) return <NotFound />
  const existing = applications.find(x => x.makanaiId === item.id)
  const submit = () => { const applicationId = apply(item.id); navigate(`/application/${applicationId}`, { replace: true }) }
  return <Shell back title="応募内容の確認"><article className="detail-content confirm-page">
    <div className="confirm-dish"><Photo src={item.dishImage} alt={item.dishName} /><div><small>お手伝いのあとのまかない</small><strong>{item.dishName}</strong><span>{item.storeName}</span></div></div>
    <h1>応募内容を確認</h1><div className="confirm-list"><div><span>お手伝い</span><b>{item.help.role}</b></div><div><span>日時</span><b>{item.help.date}</b></div><div><span>所要時間</span><b>{item.help.duration}</b></div><div><span>報酬</span><b>{item.help.reward}</b></div><div><span>まかない条件</span><b>{item.help.mealCondition}</b></div></div>
    <div className="notice-box"><strong>応募前にご確認ください</strong><ul><li>これは体験用プロトタイプで、実際の店舗へ通知されません。</li><li>当日は開始10分前を目安にお越しください。</li><li>体調不良時は無理をせず、お店へ連絡しましょう。</li></ul></div>
    {existing ? <Link className="primary-button wide" to={`/application/${existing.id}`}>応募状況を見る <ArrowRight /></Link> : <button className="primary-button wide" onClick={submit}>内容を確認して応募する <ArrowRight /></button>}
    <p className="agreement">ボタンを押すことで、上記の内容に同意したものとします。</p>
  </article></Shell>
}

function Progress({ status }: { status: ApplicationStatus }) {
  return <div className="progress-list">{statusLabels.map((label, i) => <div className={`progress-step ${i <= status ? 'done' : ''} ${i === status ? 'current' : ''}`} key={label}><span>{i < status ? <Check /> : i + 1}</span><div><b>{label}</b>{i === status && <small>{i === 4 ? 'おつかれさまでした。おいしい時間を！' : '現在のステータス'}</small>}</div></div>)}</div>
}

function ApplicationPage({ applications, advance }: { applications: Application[]; advance: (id: string) => void }) {
  const { applicationId } = useParams(); const app = applications.find(x => x.id === applicationId); const item = makanaiItems.find(x => x.id === app?.makanaiId)
  if (!app || !item) return <NotFound />
  const messages = ['応募が完了しました！', 'お店からのお返事を待っています', 'お手伝いが確定しました！', 'お手伝い、おつかれさまでした！', 'まかないを食べました！']
  return <Shell back title="応募状況"><article className="completion-page">
    <div className={`completion-icon status-${app.status}`}>{app.status === 4 ? '🍽️' : <BadgeCheck />}</div><span className="eyebrow">APPLICATION STATUS</span><h1>{messages[app.status]}</h1><p>{app.status === 0 ? '応募内容はデモ用として保存されました。' : app.status === 4 ? 'お店との出会いと、おいしい一皿。素敵な体験になりましたね。' : 'デモ操作で次のステータスへ進められます。'}</p>
    <div className="application-summary"><Photo src={item.dishImage} alt={item.dishName} /><div><small>{item.storeName}</small><strong>{item.dishName}</strong><span><CalendarDays />{item.help.date}</span></div></div>
    <Progress status={app.status} />
    {app.status < 4 && <button className="primary-button wide" onClick={() => advance(app.id)}>デモ：次のステータスへ <ArrowRight /></button>}
    {app.status === 4 && <Link to="/mypage" className="primary-button wide">マイページで思い出を見る <ArrowRight /></Link>}
    <Link to="/home" className="text-link">ほかのまかないを探す</Link>
  </article></Shell>
}

function FavoritesPage({ favorites, toggle }: { favorites: string[]; toggle: (id: string) => void }) {
  const items = makanaiItems.filter(x => favorites.includes(x.id))
  return <Shell title="お気に入り"><section className="simple-page"><div className="page-title"><span className="eyebrow">YOUR FAVORITES</span><h1>食べてみたい<br />まかない</h1><p>{items.length}件のお気に入り</p></div>{items.length ? <div className="dish-grid">{items.map(x => <DishCard key={x.id} item={x} favorites={favorites} toggle={toggle} />)}</div> : <div className="empty-state"><span>♡</span><h2>まだお気に入りはありません</h2><p>食べてみたいまかないを見つけて、ハートを押してみましょう。</p><Link className="secondary-button" to="/home">まかないを探す</Link></div>}</section></Shell>
}

function MyPage({ favorites, applications }: { favorites: string[]; applications: Application[] }) {
  const completed = applications.filter(a => a.status === 4)
  return <Shell title="マイページ"><section className="mypage">
    <div className="profile-card"><div className="profile-avatar">{user.initial}</div><div><small>こんにちは！</small><h1>{user.name}</h1><span><MapPin />{user.area}</span></div></div>
    <div className="stat-row"><Link to="/favorites"><b>{favorites.length}</b><span>お気に入り</span></Link><div><b>{applications.length}</b><span>応募した</span></div><div><b>{completed.length}</b><span>食べた</span></div></div>
    <section className="mypage-section"><div className="section-heading"><h2>応募状況</h2></div>{applications.length ? <div className="application-list">{applications.map(app => { const item = makanaiItems.find(x => x.id === app.makanaiId); if (!item) return null; return <Link to={`/application/${app.id}`} className="application-card" key={app.id}><Photo src={item.dishImage} alt={item.dishName} /><div><span className={`status-chip status-${app.status}`}>{statusLabels[app.status]}</span><h3>{item.dishName}</h3><p>{item.storeName}</p></div><ChevronRight /></Link> })}</div> : <div className="small-empty"><p>応募したお手伝いはまだありません。</p><Link to="/home">食べたいまかないを探す</Link></div>}</section>
    <section className="mypage-section"><div className="section-heading"><h2>食べたまかない</h2><span>{completed.length}皿</span></div>{completed.length ? <div className="eaten-grid">{completed.map(app => { const item = makanaiItems.find(x => x.id === app.makanaiId)!; return <Link to={`/makanai/${item.id}`} key={app.id}><Photo src={item.dishImage} alt={item.dishName} /><span>{item.dishName}</span></Link> })}</div> : <div className="small-empty"><span className="bowl">🍚</span><p>お手伝いのあとに食べたまかないが、ここに並びます。</p></div>}</section>
  </section></Shell>
}

function ScrollToTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo({ top: 0 }) }, [pathname]); return null }

export default function App() {
  const [favorites, setFavorites] = useState<string[]>(storage.getFavorites)
  const [applications, setApplications] = useState<Application[]>(storage.getApplications)
  const toggleFavorite = (id: string) => setFavorites(prev => { const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]; storage.setFavorites(next); return next })
  const apply = (makanaiId: string) => {
    const existing = applications.find(x => x.makanaiId === makanaiId)
    if (existing) return existing.id
    const application: Application = { id: `app-${Date.now()}`, makanaiId, status: 0, appliedAt: new Date().toISOString() }
    const next = [application, ...applications]; setApplications(next); storage.setApplications(next); return application.id
  }
  const advance = (id: string) => setApplications(prev => { const next = prev.map(a => a.id === id ? { ...a, status: Math.min(a.status + 1, 4) as ApplicationStatus } : a); storage.setApplications(next); return next })
  const startPath = useMemo(() => storage.hasVisited() ? '/home' : '/welcome', [])
  return <><ScrollToTop /><Routes>
    <Route path="/" element={<Navigate to={startPath} replace />} /><Route path="/welcome" element={<Welcome />} />
    <Route path="/home" element={<HomePage favorites={favorites} toggle={toggleFavorite} />} />
    <Route path="/makanai/:id" element={<MakanaiDetail favorites={favorites} toggle={toggleFavorite} />} />
    <Route path="/store/:id" element={<StoreDetail />} /><Route path="/apply/:id" element={<ApplyConfirm applications={applications} apply={apply} />} />
    <Route path="/application/:applicationId" element={<ApplicationPage applications={applications} advance={advance} />} />
    <Route path="/favorites" element={<FavoritesPage favorites={favorites} toggle={toggleFavorite} />} />
    <Route path="/mypage" element={<MyPage favorites={favorites} applications={applications} />} /><Route path="*" element={<NotFound />} />
  </Routes></>
}
