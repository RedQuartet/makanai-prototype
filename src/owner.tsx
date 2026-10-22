import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Bell, CalendarDays, Check, ChevronRight, Home, Leaf, Plus, UserRound, UsersRound, UtensilsCrossed } from 'lucide-react'
import { categories, demoUser, minimumWage, ownerMonthBase, ownerPastReviews, ownerStock, ownerStoreId, rolePresets, statusLabels, transportOptions } from './data'
import { useDemo } from './demo'
import { dayLabel, durationLabel, endTime, feeOf, fromDateKey, jobWhen, kg, monthDay, rescuedPerPerson, wageOf, yen } from './format'
import { Photo } from './ui'
import type { ApplicationStatus, Category, MakanaiItem, Review, StockItem } from './types'

function OwnerShell({ children }: { children: ReactNode }) {
  return <div className="app-shell owner-shell">
    <header className="app-header owner-header">
      <Link to="/owner" className="logo compact" aria-label="お店のホームへ"><span className="logo-mark"><UtensilsCrossed /></span><span>MAKANAI</span><small className="owner-badge">お店用</small></Link>
      <Link to="/home" className="switch-link"><UserRound /> 学生側へ</Link>
    </header>
    <main>{children}</main>
    <nav className="bottom-nav" aria-label="お店のメニュー">
      <NavLink to="/owner" end><Home /><span>ホーム</span></NavLink>
      <NavLink to="/owner/new"><Plus /><span>求人をつくる</span></NavLink>
      <NavLink to="/owner/applicants"><UsersRound /><span>応募者</span></NavLink>
    </nav>
  </div>
}

interface Person { key: string; id: string; mine: boolean; name: string; profile: string; item: MakanaiItem; status: ApplicationStatus; review?: Review; when: string }

/** このお店の求人と、その応募者（デモの利用者＋ほかの学生） */
function useStore() {
  const { items, applications, ownerApplicants } = useDemo()
  const store = items.find(x => x.id === ownerStoreId)!
  const jobs = items.filter(x => x.storeName === store.storeName)
  const people: Person[] = []
  applications.forEach(app => {
    const item = jobs.find(x => x.id === app.makanaiId)
    if (!item) return
    const date = app.jobDate ? fromDateKey(app.jobDate) : undefined
    people.push({ key: app.id, id: app.id, mine: true, name: demoUser.name, profile: demoUser.profile, item, status: app.status, review: app.review, when: date ? `${dayLabel(date)} ${item.help.start}〜${endTime(item.help.start, item.help.minutes)}` : jobWhen(item) })
  })
  ownerApplicants.forEach(applicant => {
    const item = jobs.find(x => x.id === applicant.makanaiId)
    if (item) people.push({ key: applicant.id, id: applicant.id, mine: false, name: applicant.name, profile: applicant.profile, item, status: applicant.status, review: applicant.review, when: jobWhen(item) })
  })
  return { store, jobs, people }
}

const againText = { visit: 'また行きたい', help: 'また手伝いたい' } as const

export function OwnerHome() {
  const { usedStock } = useDemo()
  const { store, jobs, people } = useStore()
  const location = useLocation()
  const created = (location.state as { created?: string } | null)?.created
  const done = people.filter(p => p.status >= 3)
  const reviewed = people.filter(p => p.review)
  const rescued = ownerMonthBase.rescuedKg + done.reduce((sum, p) => sum + rescuedPerPerson(p.item), 0)
  const wages = ownerMonthBase.wages + done.reduce((sum, p) => sum + wageOf(p.item.help), 0)
  const fees = ownerMonthBase.fees + done.reduce((sum, p) => sum + feeOf(wageOf(p.item.help)), 0)
  const reviewCount = ownerMonthBase.reviews + reviewed.length
  const againRate = Math.round((ownerMonthBase.againVisit + reviewed.filter(p => p.review!.again.includes('visit')).length) / reviewCount * 100)
  const waiting = people.filter(p => p.status < 2).length
  const stock = ownerStock.filter(x => !usedStock.includes(x.id))
  const reviews = [...reviewed.map(p => ({ key: p.key, name: p.name, again: p.review!.again, comment: p.review!.comment })), ...ownerPastReviews]
  return <OwnerShell>
    <section className="owner-intro"><span className="hello">{monthDay(new Date())}・今日もおつかれさまです</span><h1>{store.storeName}</h1><p>{store.area}</p></section>
    {created && <div className="owner-toast" role="status"><Check /><span>「{created}」の求人を掲載しました。学生側のホームに表示されます。<Link to="/home">学生側で見る</Link></span></div>}
    {waiting > 0 && <Link to="/owner/applicants" className="owner-alert"><Bell /><span>確認待ちの応募が <b>{waiting}件</b> あります</span><ChevronRight /></Link>}
    <section className="owner-section">
      <div className="section-heading"><div><span className="eyebrow">THIS MONTH</span><h2>今月の実績</h2></div><span>デモの数値</span></div>
      <div className="kpi-grid">
        <div className="kpi leaf"><small>救った食材</small><b>{kg(rescued)}</b><span>まかないで使い切った量</span></div>
        <div className="kpi"><small>来てくれた人</small><b>{ownerMonthBase.visitors + done.length}<i>人</i></b><span>お手伝いが完了した人</span></div>
        <div className="kpi"><small>また行きたい</small><b>{againRate}<i>%</i></b><span>レビュー {reviewCount}件のうち</span></div>
        <div className="kpi"><small>MAKANAI へのお支払い</small><b>{yen(wages + fees)}</b><span>給与 {yen(wages)} ＋ 利用料 {yen(fees)}</span></div>
      </div>
    </section>
    <section className="owner-section">
      <div className="section-heading"><div><span className="eyebrow">USE IT UP</span><h2>期限が近い食材</h2></div><span>{stock.length}品</span></div>
      {stock.length ? <ul className="stock-list">{stock.map(x => <li key={x.id}><b>{x.name}</b><span>{kg(x.kg)}</span><em className={x.daysLeft <= 1 ? 'urgent' : ''}>期限まであと{x.daysLeft}日</em></li>)}</ul> : <p className="owner-empty">期限が近い食材は、すべて求人に使いました。</p>}
      {stock.length > 0 && <Link to="/owner/new" className="primary-button wide"><Plus /> この食材でまかない求人をつくる</Link>}
    </section>
    <section className="owner-section">
      <div className="section-heading"><div><span className="eyebrow">OPEN JOBS</span><h2>掲載中の求人</h2></div><span>{jobs.length}件</span></div>
      <div className="owner-jobs">{jobs.map(job => <Link to={`/makanai/${job.id}`} className="owner-job" key={job.id}><Photo src={job.dishImage} alt={job.dishName} /><div><h3>{job.dishName}{job.fresh && <span className="new-chip">新着</span>}</h3><p>{jobWhen(job)}・{durationLabel(job.help.minutes)}</p><span>応募 {people.filter(p => p.item.id === job.id).length}人／募集 {job.help.slots}人・時給 {yen(job.help.hourlyWage)}</span></div><ChevronRight /></Link>)}</div>
    </section>
    <section className="owner-section">
      <div className="section-heading"><div><span className="eyebrow">VOICES</span><h2>届いたレビュー</h2></div><span>{reviews.length}件</span></div>
      <ul className="review-list">{reviews.map(r => <li key={r.key}><div className="review-head"><b>{r.name}</b>{r.again.map(x => <span key={x} className="again-chip">{againText[x]}</span>)}</div>{r.comment && <p>{r.comment}</p>}</li>)}</ul>
    </section>
  </OwnerShell>
}

const nextAction: Partial<Record<ApplicationStatus, [ApplicationStatus, string]>> = { 0: [2, '採用する'], 1: [2, '採用する'], 2: [3, 'お手伝い完了にする'], 3: [4, 'まかないを出した'] }

export function OwnerApplicants() {
  const { setStatus, setOwnerStatus } = useDemo()
  const { people } = useStore()
  const move = (person: Person, status: ApplicationStatus) => person.mine ? setStatus(person.id, status) : setOwnerStatus(person.id, status)
  const sorted = [...people].sort((a, b) => a.status - b.status)
  return <OwnerShell>
    <section className="owner-section">
      <div className="page-title"><span className="eyebrow">APPLICANTS</span><h1>応募者</h1><p>採用すると、学生の画面の応募状況も進みます。お手伝いが完了したときだけ、給与と利用料がかかります。</p></div>
      {sorted.length ? <div className="applicant-list">{sorted.map(person => { const next = nextAction[person.status]; return <article className="applicant-card" key={person.key}>
        <div className="applicant-head"><span className="applicant-avatar">{person.name[0]}</span><div><h3>{person.name}{person.mine && <small>デモの利用者</small>}</h3><p>{person.profile}</p></div><span className={`status-chip status-${person.status}`}>{statusLabels[person.status]}</span></div>
        <p className="applicant-job"><CalendarDays />{person.item.dishName}・{person.when}</p>
        {person.review && <p className="applicant-review">{person.review.again.map(x => againText[x]).join('・')}{person.review.comment && `「${person.review.comment}」`}</p>}
        {next ? <button className="primary-button wide compact-button" onClick={() => move(person, next[0])}>{next[1]}</button> : <span className="applicant-done"><Check /> まかないまで完了</span>}
      </article> })}</div> : <div className="small-empty"><p>まだ応募はありません。</p><Link to="/owner/new">まかない求人をつくる</Link></div>}
    </section>
  </OwnerShell>
}

/** 選んだ食材から、まかないの名前の候補を出す */
function menuIdeas(chosen: StockItem[]) {
  const has = (name: string) => chosen.some(x => x.name.includes(name))
  const ideas: string[] = []
  if (has('豚バラ') && has('キャベツ')) ideas.push('豚バラとキャベツの味噌炒め定食')
  if (has('豆腐')) ideas.push(has('卵') ? '肉豆腐と卵焼きの定食' : '肉豆腐定食')
  if (has('ねぎ') && has('卵')) ideas.push('ねぎ玉丼とお味噌汁')
  if (has('キャベツ') && !has('豚バラ')) ideas.push('キャベツたっぷりお好み焼き')
  if (!ideas.length && chosen[0]) ideas.push(`${chosen[0].name}のまかない定食`)
  return ideas.slice(0, 3)
}

export function OwnerNewJob() {
  const { items, usedStock, publishJob } = useDemo()
  const navigate = useNavigate()
  const store = items.find(x => x.id === ownerStoreId)!
  const stock = ownerStock.filter(x => !usedStock.includes(x.id))
  const [picked, setPicked] = useState<string[]>(() => stock.filter(x => x.name === '豚バラ肉' || x.name === 'キャベツ').map(x => x.id))
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('定食')
  const [role, setRole] = useState(rolePresets[0])
  const [dayOffset, setDayOffset] = useState(0)
  const [start, setStart] = useState('15:00')
  const [minutes, setMinutes] = useState(60)
  const [slots, setSlots] = useState(2)
  const [hourlyWage, setHourlyWage] = useState(minimumWage.amount)
  const [transport, setTransport] = useState(transportOptions[0])
  const chosen = stock.filter(x => picked.includes(x.id))
  const wage = Math.ceil(hourlyWage * minutes / 60)
  const fee = feeOf(wage)
  const wageError = hourlyWage < minimumWage.amount ? `${minimumWage.area}の最低賃金（${yen(minimumWage.amount)}・${minimumWage.since}から）を下回っています。` : ''
  const ready = chosen.length > 0 && !!name.trim() && !!role.trim() && !!start && !wageError
  const toggle = (id: string) => setPicked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!ready) return
    const names = chosen.map(x => x.name).join('・')
    const item: MakanaiItem = {
      ...store,
      id: `custom-${Date.now()}`, dishName: name.trim(), category, fresh: true, dishImage: '',
      shortDescription: `期限間近の${names}を使った、この日だけのまかない。`,
      description: `使い切れずに残りそうな${names}を、店主がまかないに仕立てます。お手伝いのあと、できたてをどうぞ。`,
      recommendation: ['期限間近の食材を使い切る一皿', 'お手伝いのあとに、できたてを提供', 'ご飯とお味噌汁つき'],
      tags: ['新着', 'フードロス削減', 'できたて'],
      ingredients: chosen.map(x => ({ name: x.name, kg: x.kg, daysLeft: x.daysLeft })),
      help: { role: role.trim(), dayOffset, start, minutes, location: store.help.location, hourlyWage, transport, mealCondition: 'お手伝い終了後、店内で提供', slots, remaining: slots, requirements: ['18歳以上', '特別な経験は不要', '食物アレルギーは事前申告'] }
    }
    publishJob(item, picked)
    navigate('/owner', { state: { created: item.dishName } })
  }
  return <OwnerShell><form className="owner-section owner-form" onSubmit={submit}>
    <div className="page-title"><span className="eyebrow">NEW JOB</span><h1>まかない求人を<br />つくる</h1><p>期限が近い食材から、まかないとお手伝いを決めます。掲載は無料です。</p></div>

    <fieldset className="form-step"><legend><b>1</b>使う食材を選ぶ</legend>
      {stock.length ? <div className="stock-pick">{stock.map(x => <label key={x.id} className={picked.includes(x.id) ? 'on' : ''}><input type="checkbox" checked={picked.includes(x.id)} onChange={() => toggle(x.id)} /><span><b>{x.name}</b><small>{kg(x.kg)}・<em className={x.daysLeft <= 1 ? 'urgent' : ''}>期限まであと{x.daysLeft}日</em></small></span></label>)}</div> : <p className="form-note">期限が近い食材は、すべて求人に使いました。</p>}
    </fieldset>

    <fieldset className="form-step"><legend><b>2</b>まかないを決める</legend>
      <label className="field" htmlFor="job-name"><span>まかないの名前</span><input id="job-name" value={name} maxLength={30} onChange={e => setName(e.target.value)} placeholder="例：豚バラとキャベツの味噌炒め定食" /></label>
      {menuIdeas(chosen).length > 0 && <div className="idea-row"><small>選んだ食材からの候補</small>{menuIdeas(chosen).map(idea => <button type="button" key={idea} className={name === idea ? 'on' : ''} onClick={() => setName(idea)}>{idea}</button>)}</div>}
      <label className="field" htmlFor="job-category"><span>カテゴリ</span><select id="job-category" value={category} onChange={e => setCategory(e.target.value as Category)}>{categories.filter(c => c !== 'すべて').map(c => <option key={c}>{c}</option>)}</select></label>
    </fieldset>

    <fieldset className="form-step"><legend><b>3</b>お手伝いの条件を決める</legend>
      <label className="field" htmlFor="job-role"><span>お手伝いの内容</span><input id="job-role" value={role} maxLength={30} onChange={e => setRole(e.target.value)} /></label>
      <div className="idea-row">{rolePresets.map(preset => <button type="button" key={preset} className={role === preset ? 'on' : ''} onClick={() => setRole(preset)}>{preset}</button>)}</div>
      <div className="field"><span>日にち</span><div className="segmented" role="group" aria-label="日にち">{['今日', '明日', 'あさって'].map((label, i) => <button type="button" key={label} className={dayOffset === i ? 'on' : ''} aria-pressed={dayOffset === i} onClick={() => setDayOffset(i)}>{label}</button>)}</div></div>
      <div className="field-row">
        <label className="field" htmlFor="job-start"><span>開始時刻</span><input id="job-start" type="time" step={900} value={start} onChange={e => setStart(e.target.value)} /></label>
        <label className="field" htmlFor="job-minutes"><span>時間</span><select id="job-minutes" value={minutes} onChange={e => setMinutes(Number(e.target.value))}>{[30, 45, 60, 90, 120].map(m => <option key={m} value={m}>{durationLabel(m)}</option>)}</select></label>
      </div>
      <div className="field-row">
        <label className="field" htmlFor="job-slots"><span>募集人数</span><select id="job-slots" value={slots} onChange={e => setSlots(Number(e.target.value))}>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}人</option>)}</select></label>
        <label className="field" htmlFor="job-wage"><span>時給（円）</span><input id="job-wage" type="number" inputMode="numeric" min={minimumWage.amount} step={10} value={hourlyWage || ''} aria-invalid={!!wageError} aria-describedby="wage-note" onChange={e => setHourlyWage(Number(e.target.value))} /></label>
      </div>
      <p id="wage-note" className={`form-note ${wageError ? 'error' : ''}`}>{wageError || `${minimumWage.area}の最低賃金は ${yen(minimumWage.amount)}（${minimumWage.since}から）。まかないは給与に含めず、無料で出します。`}</p>
      <label className="field" htmlFor="job-transport"><span>交通費</span><select id="job-transport" value={transport} onChange={e => setTransport(e.target.value)}>{transportOptions.map(t => <option key={t}>{t}</option>)}</select></label>
    </fieldset>

    <section className="cost-card" aria-label="お店が払う金額">
      <h2>お店が払う金額（1人あたり）</h2>
      <div><span>給与（時給 {yen(hourlyWage || 0)} × {durationLabel(minutes)}）</span><b>{yen(wage || 0)}</b></div>
      <div><span>システム利用料（給与の30%）</span><b>{yen(fee || 0)}</b></div>
      <div className="total"><span>合計</span><b>{yen((wage + fee) || 0)}</b></div>
      <p>{slots}人なら {yen(((wage + fee) || 0) * slots)}。掲載は無料で、お手伝いが完了したときだけかかります。まかないで {kg(chosen.reduce((sum, x) => sum + x.kg, 0))} の食材を使い切ります。</p>
    </section>

    <button className="primary-button wide" disabled={!ready}>この内容で掲載する <ArrowRight /></button>
    {!ready && !wageError && <p className="form-note center">食材・まかないの名前・お手伝いの内容を入れると掲載できます。</p>}
    <p className="form-note center"><Leaf /> 掲載すると、学生側のホームと一覧にすぐ表示されます。</p>
  </form></OwnerShell>
}
