import { useState, useEffect, useRef } from 'react'
import { Button, IconButton } from '@matusgallo/mysabds'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'

// --- Constants ---

const DAY_NAMES_SHORT = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne']

const MONTH_NAMES = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
]

const MONTH_SHORT = [
  'led', 'úno', 'bře', 'dub', 'kvě', 'čer',
  'črc', 'srp', 'zář', 'říj', 'lis', 'pro',
]

const HOUR_HEIGHT = 96
const START_HOUR = 0
const END_HOUR = 24
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i)
const TOTAL_GRID_HEIGHT = HOURS.length * HOUR_HEIGHT

// --- Types ---

type EventColor = 'gray' | 'purple' | 'blue' | 'indigo' | 'pink' | 'orange' | 'green' | 'yellow'

interface MonthEvent {
  id: number
  title: string
  color: EventColor
}

interface WeekEvent {
  id: number
  title: string
  start: number
  end: number
  color: EventColor
}

// --- Color styles ---

const COLOR_STYLES: Record<EventColor, { bg: string; text: string; border: string; timeColor: string; dot?: string }> = {
  gray:   { bg: '#FAFAFA', text: '#414651', border: '#E9EAEB', timeColor: '#717680' },
  purple: { bg: '#F4F3FF', text: '#5925DC', border: '#D9D6FE', timeColor: '#6938EF' },
  blue:   { bg: '#EFF8FF', text: '#175CD3', border: '#B2DDFF', timeColor: '#1570EF' },
  indigo: { bg: '#EEF4FF', text: '#3538CD', border: '#C7D7FE', timeColor: '#444CE7' },
  pink:   { bg: '#FDF2FA', text: '#C11574', border: '#FCCEEE', timeColor: '#DD2590' },
  orange: { bg: '#FEF6EE', text: '#B93815', border: '#F9DBAF', timeColor: '#EC6726' },
  green:  { bg: '#ECFDF3', text: '#067647', border: '#ABEFC6', timeColor: '#17B26A', dot: '#17B26A' },
  yellow: { bg: '#FEFBE8', text: '#A15C07', border: '#FEEE95', timeColor: '#CA8504' },
}

// --- Mock data ---

const MONTH_MOCK_EVENTS: Record<string, MonthEvent[]> = {
  '2025-01-01': [{ id: 1, title: 'Nový rok', color: 'green' }],
  '2025-01-06': [
    { id: 2, title: 'Schůzka s klientem', color: 'blue' },
    { id: 3, title: 'Prezentace nabídky', color: 'purple' },
  ],
  '2025-01-07': [{ id: 4, title: 'Podpis smlouvy', color: 'green' }],
  '2025-01-08': [
    { id: 5, title: 'Prohlídka nemovitosti', color: 'orange' },
    { id: 6, title: 'Telefonát s bankou', color: 'blue' },
    { id: 7, title: 'Schůzka tým', color: 'indigo' },
    { id: 8, title: 'Odhad nemovitosti', color: 'gray' },
  ],
  '2025-01-09': [
    { id: 27, title: 'Konzultace hypo', color: 'blue' },
    { id: 28, title: 'Prohlídka – Žižkov', color: 'orange' },
    { id: 29, title: 'Podpis SOO', color: 'pink' },
    { id: 35, title: 'Rezervační smlouva', color: 'green' },
  ],
  '2025-01-13': [
    { id: 9, title: 'Prohlídka – Brno', color: 'orange' },
    { id: 10, title: 'Smlouva o smlouvě', color: 'purple' },
  ],
  '2025-01-14': [{ id: 11, title: 'Konference', color: 'indigo' }],
  '2025-01-15': [
    { id: 12, title: 'Obhlídka bytu', color: 'blue' },
    { id: 13, title: 'Schůzka – Praha 2', color: 'pink' },
  ],
  '2025-01-16': [
    { id: 31, title: 'Odhad tržní ceny', color: 'gray' },
    { id: 32, title: 'Meeting s právníkem', color: 'indigo' },
    { id: 33, title: 'Prohlídka – Dejvice', color: 'orange' },
    { id: 34, title: 'Konzultace klient', color: 'blue' },
  ],
  '2025-01-17': [{ id: 30, title: 'Seminář hypotéky', color: 'indigo' }],
  '2025-01-20': [{ id: 14, title: 'Porada pobočka', color: 'indigo' }],
  '2025-01-21': [
    { id: 15, title: 'Prohlídka rodinný dům', color: 'orange' },
    { id: 16, title: 'Rezervační smlouva', color: 'green' },
    { id: 17, title: 'Hypoteční poradna', color: 'blue' },
  ],
  '2025-01-22': [
    { id: 18, title: 'Prohlídka – Vinohrady', color: 'purple' },
    { id: 19, title: 'Meeting s právníkem', color: 'gray' },
  ],
  '2025-01-27': [
    { id: 20, title: 'Konec lhůty vkladu', color: 'pink' },
    { id: 21, title: 'Schůzka klient Novák', color: 'blue' },
  ],
  '2025-01-28': [
    { id: 22, title: 'Předání klíčů', color: 'green' },
    { id: 23, title: 'Zápis do katastru', color: 'indigo' },
    { id: 24, title: 'Kontrola dokumentů', color: 'gray' },
    { id: 25, title: 'Odhad nemovitosti', color: 'orange' },
  ],
  '2025-01-31': [{ id: 26, title: 'Měsíční report', color: 'purple' }],
}

const WEEK_MOCK_EVENTS: Record<string, WeekEvent[]> = {
  // Pon 6. 1.
  '2025-01-06': [
    { id: 101, title: 'Ranní standup', start: 9, end: 9.5, color: 'gray' },
    { id: 102, title: 'Plánování obsahu', start: 11, end: 12, color: 'blue' },
  ],
  // Út 7. 1.
  '2025-01-07': [
    { id: 103, title: 'One-on-one s Evou', start: 10, end: 11, color: 'pink' },
    { id: 104, title: 'Catch-up s Alexem', start: 15.5, end: 17, color: 'purple' },
  ],
  // St 8. 1.
  '2025-01-08': [
    { id: 105, title: 'Deep work', start: 9, end: 10.5, color: 'blue' },
    { id: 106, title: 'Design sync', start: 10.5, end: 11.5, color: 'indigo' },
    { id: 107, title: 'SEO plánování', start: 13.5, end: 14.5, color: 'indigo' },
    { id: 108, title: 'Meetup událost', start: 15, end: 17, color: 'yellow' },
  ],
  // Čt 9. 1.
  '2025-01-09': [
    { id: 109, title: 'Konzultace – hypo', start: 9.5, end: 10.5, color: 'orange' },
    { id: 110, title: 'Podpis smlouvy', start: 13, end: 14, color: 'green' },
    { id: 111, title: 'Telefonát s bankou', start: 15, end: 15.5, color: 'blue' },
  ],
  // Pá 10. 1.
  '2025-01-10': [
    { id: 112, title: 'Prohlídka bytu', start: 9, end: 10, color: 'blue' },
    { id: 113, title: 'Schůzka pobočka', start: 11, end: 12, color: 'indigo' },
    { id: 114, title: 'Rezervační smlouva', start: 14, end: 15, color: 'green' },
    { id: 115, title: 'Konec lhůty', start: 16, end: 16.5, color: 'pink' },
  ],
  // So 11. 1.
  '2025-01-11': [
    { id: 116, title: 'Prohlídka – Brno', start: 10, end: 11.5, color: 'orange' },
  ],
  // Ne 12. 1.
  '2025-01-12': [
    { id: 117, title: 'Příprava prezentace', start: 15, end: 16.5, color: 'purple' },
  ],
}

// --- Helpers ---

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getWeekMonday(date: Date): Date {
  const d = new Date(date)
  const diff = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function buildMonthDays(year: number, month: number) {
  const today = new Date()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7
  const endOffset = (lastDay.getDay() + 6) % 7
  const endFill = endOffset === 6 ? 0 : 6 - endOffset

  const start = new Date(firstDay)
  start.setDate(start.getDate() - startOffset)
  const end = new Date(lastDay)
  end.setDate(end.getDate() + endFill)

  const days: { date: Date; inMonth: boolean; isToday: boolean; events: MonthEvent[] }[] = []
  const cur = new Date(start)
  while (cur <= end) {
    days.push({
      date: new Date(cur),
      inMonth: cur.getMonth() === month,
      isToday: cur.toDateString() === today.toDateString(),
      events: MONTH_MOCK_EVENTS[dateKey(cur)] ?? [],
    })
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

function buildWeekDays(weekStart: Date) {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return {
      date: d,
      isToday: d.toDateString() === today.toDateString(),
      events: WEEK_MOCK_EVENTS[dateKey(d)] ?? [],
    }
  })
}

function formatHourLabel(h: number): string {
  return `${String(h).padStart(2, '0')}:00`
}

function formatEventTime(decimalHour: number): string {
  const h = Math.floor(decimalHour)
  const m = Math.round((decimalHour - h) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const MAX_VISIBLE = 3

// Grid line pattern: 1px border at every 48px
const GRID_BG = 'repeating-linear-gradient(to bottom, transparent 0px, transparent 47px, #E9EAEB 47px, #E9EAEB 48px)'

const DAY_NAMES_FULL = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle']

type CalendarView = 'month' | 'week' | 'day'

export default function KalendarPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const [view, setView] = useState<CalendarView>('month')
  const [year, setYear] = useState(2025)
  const [month, setMonth] = useState(0)
  const [weekStart, setWeekStart] = useState(() => new Date(2025, 0, 6))
  const [selectedDay, setSelectedDay] = useState(() => new Date(2025, 0, 10))

  const weekBodyRef = useRef<HTMLDivElement>(null)
  const [weekScrollbarW, setWeekScrollbarW] = useState(0)
  useEffect(() => {
    if (view !== 'week') return
    const el = weekBodyRef.current
    if (!el) return
    const update = () => setWeekScrollbarW(el.offsetWidth - el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [view])

  function prevPeriod() {
    if (view === 'month') {
      if (month === 0) { setMonth(11); setYear(y => y - 1) }
      else setMonth(m => m - 1)
    } else if (view === 'week') {
      setWeekStart(prev => {
        const d = new Date(prev)
        d.setDate(d.getDate() - 7)
        return d
      })
    } else {
      setSelectedDay(prev => {
        const d = new Date(prev)
        d.setDate(d.getDate() - 1)
        return d
      })
    }
  }

  function nextPeriod() {
    if (view === 'month') {
      if (month === 11) { setMonth(0); setYear(y => y + 1) }
      else setMonth(m => m + 1)
    } else if (view === 'week') {
      setWeekStart(prev => {
        const d = new Date(prev)
        d.setDate(d.getDate() + 7)
        return d
      })
    } else {
      setSelectedDay(prev => {
        const d = new Date(prev)
        d.setDate(d.getDate() + 1)
        return d
      })
    }
  }

  function switchView(next: CalendarView) {
    if (next === view) return
    if (next === 'week') {
      if (view === 'month') setWeekStart(getWeekMonday(new Date(year, month, 7)))
      else setWeekStart(getWeekMonday(selectedDay))
    } else if (next === 'day') {
      if (view === 'month') setSelectedDay(new Date(year, month, 7))
      else setSelectedDay(new Date(weekStart))
    } else {
      setYear(view === 'week' ? weekStart.getFullYear() : selectedDay.getFullYear())
      setMonth(view === 'week' ? weekStart.getMonth() : selectedDay.getMonth())
    }
    setView(next)
  }

  // Title & subtitle
  let title: string
  let subtitle: string
  if (view === 'month') {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    title = `${MONTH_NAMES[month]} ${year}`
    subtitle = `${firstDay.getDate()}. ${MONTH_SHORT[month]} – ${lastDay.getDate()}. ${MONTH_SHORT[month]} ${year}`
  } else if (view === 'week') {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    title = `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`
    subtitle = `${weekStart.getDate()}. ${MONTH_SHORT[weekStart.getMonth()]} – ${weekEnd.getDate()}. ${MONTH_SHORT[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`
  } else {
    const dow = (selectedDay.getDay() + 6) % 7
    title = `${MONTH_NAMES[selectedDay.getMonth()]} ${selectedDay.getDate()}, ${selectedDay.getFullYear()}`
    subtitle = DAY_NAMES_FULL[dow]
  }

  const monthDays = buildMonthDays(year, month)
  const monthWeeks: (typeof monthDays)[] = []
  for (let i = 0; i < monthDays.length; i += 7) monthWeeks.push(monthDays.slice(i, i + 7))

  const weekDays = buildWeekDays(weekStart)
  const dayEvents = WEEK_MOCK_EVENTS[dateKey(selectedDay)] ?? []

  // Segmented view switcher
  const VIEW_OPTIONS: { key: CalendarView; label: string }[] = [
    { key: 'month', label: 'Měsíc' },
    { key: 'week', label: 'Týden' },
    { key: 'day', label: 'Den' },
  ]

  const viewSwitcher = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      height: 40,
      background: 'var(--t-bgSecondary)',
      borderRadius: 9999,
      padding: 3,
      gap: 2,
    }}>
      {VIEW_OPTIONS.map(opt => (
        <button
          key={opt.key}
          onClick={() => switchView(opt.key)}
          style={{
            height: 32,
            paddingLeft: 12,
            paddingRight: 12,
            borderRadius: 9999,
            border: 'none',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
            fontFamily: 'Inter',
            transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
            background: view === opt.key ? 'var(--t-bgPrimary)' : 'transparent',
            color: view === opt.key ? 'var(--t-textPrimary)' : 'var(--t-textSecondary)',
            boxShadow: view === opt.key ? '0 1px 3px rgba(10,13,18,0.10)' : 'none',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )

  // Shared controls block
  const controls = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <IconButton icon={ChevronLeft} variant="ghost" size="lg" tooltip="Předchozí" onClick={prevPeriod} />
      <IconButton icon={ChevronRight} variant="ghost" size="lg" tooltip="Následující" onClick={nextPeriod} />
      {viewSwitcher}
      <Button label="Nová událost" variant="primary" leadIcon={Plus} />
    </div>
  )

  return (
    <div style={{ margin: '-24px -24px -24px', height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', background: 'var(--t-bgPrimary)', overflow: 'hidden' }}>

      {/* ── Month view ── */}
      {view === 'month' && (
        <>
          {/* Header: title + day names */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--t-borderPrimary)',
            }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--t-textPrimary)', lineHeight: '26px' }}>{title}</div>
                <div style={{ fontSize: 14, color: 'var(--t-textSecondary)', lineHeight: '20px' }}>{subtitle}</div>
              </div>
              {controls}
            </div>

            {/* Day names */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--t-borderPrimary)',
              boxShadow: '0 1px 3px rgba(10,13,18,0.10)',
            }}>
              {DAY_NAMES_SHORT.map((name, i) => (
                <div key={name} style={{
                  flex: 1,
                  height: 40,
                  boxSizing: 'border-box',
                  padding: 8,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRight: i < 6 ? '1px solid var(--t-borderPrimary)' : 'none',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#717680', fontFamily: 'Inter' }}>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {monthWeeks.map((week, wi) => (
              <div key={wi} style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                borderBottom: wi < monthWeeks.length - 1 ? '1px solid var(--t-borderPrimary)' : 'none',
                minHeight: 0,
              }}>
                {week.map((day, di) => {
                  const visible = day.events.slice(0, MAX_VISIBLE)
                  const overflow = day.events.length - MAX_VISIBLE
                  return (
                    <div key={di} style={{
                      padding: '6px 6px 4px',
                      background: day.inMonth ? 'var(--t-bgPrimary)' : '#FDFDFD',
                      borderRight: di < 6 ? '1px solid var(--t-borderPrimary)' : 'none',
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                      minWidth: 0,
                      minHeight: 0,
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <div style={{ opacity: day.inMonth ? 1 : 0.6, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4, flexShrink: 0 }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            fontSize: 12,
                            fontWeight: day.isToday ? 600 : 400,
                            color: day.isToday ? '#fff' : day.inMonth ? 'var(--t-textPrimary)' : 'var(--t-textTertiary)',
                            background: day.isToday ? '#E05524' : 'transparent',
                            lineHeight: 1,
                            flexShrink: 0,
                          }}>
                            {day.date.getDate()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, overflow: 'hidden' }}>
                          {visible.map(ev => {
                            const cs = COLOR_STYLES[ev.color]
                            return (
                              <div key={ev.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3,
                                padding: '2px 5px',
                                borderRadius: 4,
                                background: cs.bg,
                                fontSize: 11,
                                fontWeight: 500,
                                color: cs.text,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                flexShrink: 0,
                              }}>
                                {cs.dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: cs.dot, flexShrink: 0 }} />}
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{ev.title}</span>
                              </div>
                            )
                          })}
                          {overflow > 0 && (
                            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--t-textSecondary)', padding: '2px 5px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                              +{overflow} další
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Week view ── */}
      {view === 'week' && (
        <>
          {/* Header */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--t-borderPrimary)',
            }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--t-textPrimary)', lineHeight: '26px' }}>{title}</div>
                <div style={{ fontSize: 14, color: 'var(--t-textSecondary)', lineHeight: '20px' }}>{subtitle}</div>
              </div>
              {controls}
            </div>
            {/* Day names with dates */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--t-borderPrimary)',
              boxShadow: '0 1px 3px rgba(10,13,18,0.10)',
            }}>
              <div style={{ width: 72, flexShrink: 0, borderRight: '1px solid var(--t-borderPrimary)' }} />
              {weekDays.map((day, i) => (
                <div key={i} style={{
                  flex: 1,
                  padding: 8,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 4,
                  borderRight: i < 6 ? '1px solid var(--t-borderPrimary)' : 'none',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#717680' }}>{DAY_NAMES_SHORT[i]}</span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    fontSize: 12,
                    fontWeight: 600,
                    color: day.isToday ? '#fff' : '#414651',
                    background: day.isToday ? '#E05524' : 'transparent',
                  }}>
                    {day.date.getDate()}
                  </span>
                </div>
              ))}
              {weekScrollbarW > 0 && <div style={{ width: weekScrollbarW, flexShrink: 0 }} />}
            </div>
          </div>

          {/* Scrollable body */}
          <div ref={weekBodyRef} style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <div style={{ display: 'flex' }}>
            {/* Time labels */}
            <div style={{ width: 72, flexShrink: 0, borderRight: '1px solid var(--t-borderPrimary)', background: '#FDFDFD' }}>
              {HOURS.map((h, i) => (
                <div key={h} style={{ height: HOUR_HEIGHT, position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    top: i === 0 ? 4 : -9,
                    right: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#717680',
                    lineHeight: '18px',
                    whiteSpace: 'nowrap',
                  }}>
                    {formatHourLabel(h)}
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day, di) => (
              <div key={di} style={{
                flex: 1,
                position: 'relative',
                height: TOTAL_GRID_HEIGHT,
                borderRight: di < 6 ? '1px solid var(--t-borderPrimary)' : 'none',
                backgroundImage: GRID_BG,
                backgroundSize: '100% 48px',
              }}>
                {day.events.map(ev => {
                  const cs = COLOR_STYLES[ev.color]
                  const top = (ev.start - START_HOUR) * HOUR_HEIGHT
                  const height = (ev.end - ev.start) * HOUR_HEIGHT
                  return (
                    <div key={ev.id} style={{
                      position: 'absolute',
                      top: top + 4,
                      left: 6,
                      right: 6,
                      height: height - 8,
                      zIndex: 1,
                      padding: '6px 8px',
                      background: cs.bg,
                      borderRadius: 6,
                      border: `1px solid ${cs.border}`,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: cs.text, lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ev.title}
                      </div>
                      {height >= 72 && (
                        <div style={{ fontSize: 12, fontWeight: 400, color: cs.timeColor, lineHeight: '18px' }}>
                          {formatEventTime(ev.start)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          </div>
        </>
      )}

      {/* ── Day view ── */}
      {view === 'day' && (
        <>
          {/* Header */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--t-borderPrimary)',
            }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--t-textPrimary)', lineHeight: '26px' }}>{title}</div>
                <div style={{ fontSize: 14, color: 'var(--t-textSecondary)', lineHeight: '20px' }}>{subtitle}</div>
              </div>
              {controls}
            </div>
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <div style={{ display: 'flex' }}>
            {/* Time labels */}
            <div style={{ width: 72, flexShrink: 0, borderRight: '1px solid var(--t-borderPrimary)', background: '#FDFDFD' }}>
              {HOURS.map((h, i) => (
                <div key={h} style={{ height: HOUR_HEIGHT, position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    top: i === 0 ? 4 : -9,
                    right: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#717680',
                    lineHeight: '18px',
                    whiteSpace: 'nowrap',
                  }}>
                    {formatHourLabel(h)}
                  </span>
                </div>
              ))}
            </div>

            {/* Single day column */}
            <div style={{
              flex: 1,
              position: 'relative',
              height: TOTAL_GRID_HEIGHT,
              backgroundImage: GRID_BG,
              backgroundSize: '100% 48px',
            }}>
              {dayEvents.map(ev => {
                const cs = COLOR_STYLES[ev.color]
                const top = (ev.start - START_HOUR) * HOUR_HEIGHT
                const height = (ev.end - ev.start) * HOUR_HEIGHT
                return (
                  <div key={ev.id} style={{
                    position: 'absolute',
                    top: top + 4,
                    left: 6,
                    right: 6,
                    height: height - 8,
                    zIndex: 1,
                    padding: '6px 8px',
                    background: cs.bg,
                    borderRadius: 6,
                    border: `1px solid ${cs.border}`,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: cs.text, lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ev.title}
                    </div>
                    {height >= 72 && (
                      <div style={{ fontSize: 12, fontWeight: 400, color: cs.timeColor, lineHeight: '18px' }}>
                        {formatEventTime(ev.start)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  )
}
