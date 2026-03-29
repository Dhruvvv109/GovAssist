import { useEffect, useState, useCallback } from "react"
import { Bell, BellOff, Trash2, CalendarDays, Clock, Tag, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { getDeadlines } from "../utils/api"

const LS_KEY = "govassist_reminders"

function loadReminders() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]") } catch { return [] }
}
function saveReminders(list) { localStorage.setItem(LS_KEY, JSON.stringify(list)) }

async function requestNotif() {
  if (!("Notification" in window)) return false
  if (Notification.permission === "granted") return true
  return (await Notification.requestPermission()) === "granted"
}

function checkTodayReminders() {
  const today = new Date().toISOString().slice(0, 10)
  loadReminders().forEach(r => {
    if (r.deadline === today && Notification.permission === "granted")
      new Notification("GovAssist Reminder", { body: "Deadline today: " + r.name })
  })
}

function DaysBadge({ days }) {
  if (days < 0)   return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">Expired</span>
  if (days === 0) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">Today!</span>
  if (days <= 7)  return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">{days}d left</span>
  if (days <= 30) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{days}d left</span>
  return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{days}d left</span>
}

const CAT_COLORS = {
  Agriculture: "bg-green-100 text-green-700",
  Housing: "bg-blue-100 text-blue-700",
  Business: "bg-purple-100 text-purple-700",
  Education: "bg-yellow-100 text-yellow-700",
  Health: "bg-red-100 text-red-700",
  Finance: "bg-indigo-100 text-indigo-700",
  "Women & Child": "bg-pink-100 text-pink-700",
}

function RemindBtn({ scheme, reminders, onToggle }) {
  const isSet = reminders.some(r => r.id === scheme.id)
  return (
    <button
      onClick={() => onToggle(scheme)}
      className={"flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shrink-0 " +
        (isSet ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
               : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100")}
    >
      {isSet ? <><CheckCircle2 size={13} />&#8203; Reminder Set</> : <><Bell size={13} />&#8203; Remind Me</>}
    </button>
  )
}

// ── Lightweight custom calendar ────────────────────────────────────────────
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

function MiniCalendar({ deadlineDates, onSelectDate, selectedDate }) {
  const [view, setView] = useState(() => {
    const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() }
  })

  const prev = () => setView(v => v.month === 0 ? { year: v.year-1, month: 11 } : { year: v.year, month: v.month-1 })
  const next = () => setView(v => v.month === 11 ? { year: v.year+1, month: 0 } : { year: v.year, month: v.month+1 })

  const firstDay = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month+1, 0).getDate()
  const todayIso = new Date().toISOString().slice(0, 10)

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><ChevronLeft size={16} /></button>
        <span className="text-sm font-bold text-gray-800">{MONTHS[view.month]} {view.year}</span>
        <button onClick={next} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={"e"+i} />
          const iso = `${view.year}-${String(view.month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`
          const hasDeadline = deadlineDates.includes(iso)
          const isToday = iso === todayIso
          const isSelected = iso === selectedDate
          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={
                "relative flex flex-col items-center justify-center h-9 w-full rounded-lg text-xs font-medium transition-all " +
                (isSelected ? "bg-indigo-600 text-white" :
                 isToday    ? "bg-indigo-100 text-indigo-700 font-bold" :
                              "hover:bg-gray-100 text-gray-700")
              }
            >
              {day}
              {hasDeadline && (
                <span className={"absolute bottom-1 w-1 h-1 rounded-full " + (isSelected ? "bg-white" : "bg-indigo-500")} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function Deadlines() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reminders, setReminders] = useState(loadReminders)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    getDeadlines()
      .then(d => { setSchemes(d); setLoading(false) })
      .catch(e => { setError(e?.message || "Failed to load"); setLoading(false) })
  }, [])

  useEffect(() => { checkTodayReminders() }, [])

  const toggleReminder = useCallback(async scheme => {
    const existing = loadReminders()
    const idx = existing.findIndex(r => r.id === scheme.id)
    let updated
    if (idx >= 0) {
      updated = existing.filter(r => r.id !== scheme.id)
    } else {
      const ok = await requestNotif()
      if (!ok) alert("Enable browser notifications to receive deadline reminders.")
      updated = [...existing, { id: scheme.id, name: scheme.name, deadline: scheme.deadline, category: scheme.category }]
    }
    saveReminders(updated)
    setReminders(updated)
  }, [])

  const deadlineDates = schemes.map(s => s.deadline)
  const selectedSchemes = schemes.filter(s => s.deadline === selectedDate)
  const upcoming = schemes.filter(s => s.daysLeft >= 0)
  const expired  = schemes.filter(s => s.daysLeft < 0)

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-3">
      <CalendarDays size={40} className="text-gray-300" />
      <p className="text-gray-500 text-sm">Could not load deadlines: {error}</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
            <CalendarDays size={18} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Scheme Deadlines</h1>
        </div>
        <p className="text-gray-500 text-sm ml-12">Track application deadlines and set reminders</p>
      </div>

      {/* Calendar + Selected day */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            Click a date to see deadlines
            <span className="ml-2 text-xs text-indigo-400 font-normal">● = has deadline</span>
          </p>
          <MiniCalendar deadlineDates={deadlineDates} onSelectDate={setSelectedDate} selectedDate={selectedDate} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          {selectedSchemes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <CalendarDays size={36} className="text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">No deadlines on this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedSchemes.map(s => (
                <div key={s.id} className="flex items-start justify-between gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{s.name}</p>
                    <span className={"text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block " + (CAT_COLORS[s.category] || "bg-gray-100 text-gray-600")}>
                      {s.category}
                    </span>
                  </div>
                  <RemindBtn scheme={s} reminders={reminders} onToggle={toggleReminder} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={16} className="text-indigo-600" />
          <h2 className="text-base font-bold text-gray-900">Upcoming Deadlines</h2>
          <span className="ml-auto text-xs text-gray-400">{upcoming.length} active</span>
        </div>
        <div className="space-y-2">
          {upcoming.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                  <span className={"text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 " + (CAT_COLORS[s.category] || "bg-gray-100 text-gray-600")}>
                    {s.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(s.deadline + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <DaysBadge days={s.daysLeft} />
              <RemindBtn scheme={s} reminders={reminders} onToggle={toggleReminder} />
            </div>
          ))}
          {upcoming.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No upcoming deadlines</p>}
        </div>
      </div>

      {/* My Reminders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={16} className="text-indigo-600" />
          <h2 className="text-base font-bold text-gray-900">My Reminders</h2>
          <span className="ml-auto text-xs text-gray-400">{reminders.length} set</span>
        </div>
        {reminders.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <BellOff size={32} className="text-gray-200 mb-2" />
            <p className="text-gray-400 text-sm">No reminders set yet</p>
            <p className="text-gray-300 text-xs mt-1">Click "Remind Me" on any scheme above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map(r => {
              const daysLeft = Math.ceil((new Date(r.deadline + "T00:00:00") - new Date().setHours(0,0,0,0)) / 86400000)
              return (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(r.deadline + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <DaysBadge days={daysLeft} />
                  <button
                    onClick={() => { const u = reminders.filter(x => x.id !== r.id); saveReminders(u); setReminders(u) }}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Past */}
      {expired.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={15} className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-500">Past Deadlines</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {expired.map(s => (
              <div key={s.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className={"text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 " + (CAT_COLORS[s.category] || "bg-gray-100 text-gray-600")}>
                  {s.category}
                </span>
                <p className="text-xs text-gray-500 truncate">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}