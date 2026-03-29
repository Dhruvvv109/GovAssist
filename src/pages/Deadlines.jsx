import { useEffect, useState, useCallback } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { Bell, BellOff, Trash2, CalendarDays, Clock, Tag, CheckCircle2 } from "lucide-react"
import { getDeadlines } from "../utils/api"

const LS_KEY = "govassist_reminders"

function loadReminders() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]") } catch { return [] }
}
function saveReminders(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list))
}

async function requestNotifPermission() {
  if (!("Notification" in window)) return false
  if (Notification.permission === "granted") return true
  const result = await Notification.requestPermission()
  return result === "granted"
}

function fireNotification(name) {
  if (Notification.permission === "granted") {
    new Notification("GovAssist Reminder", {
      body: "Today is the deadline for: " + name,
      icon: "/favicon.ico",
    })
  }
}

function checkTodayReminders(reminders) {
  const today = new Date().toISOString().slice(0, 10)
  reminders.forEach(function(r) {
    if (r.deadline === today) fireNotification(r.name)
  })
}

function DaysBadge({ days }) {
  if (days < 0)  return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">Expired</span>
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
  const isSet = reminders.some(function(r) { return r.id === scheme.id })
  return (
    <button
      onClick={function() { onToggle(scheme) }}
      className={
        "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all " +
        (isSet
          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100")
      }
    >
      {isSet
        ? <><CheckCircle2 size={13} /> Reminder Set</>
        : <><Bell size={13} /> Remind Me</>}
    </button>
  )
}

export default function Deadlines() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [reminders, setReminders] = useState(loadReminders)
  const [calDate, setCalDate] = useState(new Date())

  useEffect(function() {
    getDeadlines()
      .then(function(d) { setSchemes(d); setLoading(false) })
      .catch(function() { setError(true); setLoading(false) })
  }, [])

  useEffect(function() {
    checkTodayReminders(loadReminders())
  }, [])

  const toggleReminder = useCallback(async function(scheme) {
    const existing = loadReminders()
    const idx = existing.findIndex(function(r) { return r.id === scheme.id })
    let updated
    if (idx >= 0) {
      updated = existing.filter(function(r) { return r.id !== scheme.id })
    } else {
      const granted = await requestNotifPermission()
      if (!granted) alert("Enable browser notifications to get deadline reminders.")
      updated = existing.concat([{ id: scheme.id, name: scheme.name, deadline: scheme.deadline, category: scheme.category }])
    }
    saveReminders(updated)
    setReminders(updated)
  }, [])

  const deadlineDates = schemes.map(function(s) { return s.deadline })

  function tileContent({ date, view }) {
    if (view !== "month") return null
    const iso = date.toISOString().slice(0, 10)
    if (!deadlineDates.includes(iso)) return null
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4f46e5", display: "inline-block" }} />
      </div>
    )
  }

  function tileClassName({ date, view }) {
    if (view !== "month") return null
    const iso = date.toISOString().slice(0, 10)
    return deadlineDates.includes(iso) ? "has-deadline" : null
  }

  function handleCalChange(val) {
    if (Array.isArray(val)) {
      setCalDate(val[0] || new Date())
    } else if (val instanceof Date) {
      setCalDate(val)
    }
  }

  const selectedIso = calDate instanceof Date ? calDate.toISOString().slice(0, 10) : ""
  const selectedSchemes = schemes.filter(function(s) { return s.deadline === selectedIso })
  const upcoming = schemes.filter(function(s) { return s.daysLeft >= 0 })
  const expired  = schemes.filter(function(s) { return s.daysLeft < 0 })

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Failed to load deadlines. Please try again.</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <style>{`
        .react-calendar { width: 100%; border: none; font-family: inherit; background: transparent; }
        .react-calendar__tile { border-radius: 8px; padding: 8px 4px; font-size: 13px; }
        .react-calendar__tile--active { background: #4f46e5 !important; color: white !important; }
        .react-calendar__tile--now { background: #eef2ff !important; }
        .react-calendar__tile.has-deadline { font-weight: 700; color: #4f46e5; }
        .react-calendar__navigation button { border-radius: 8px; font-weight: 600; font-size: 14px; }
        .react-calendar__month-view__weekdays { font-size: 11px; color: #6b7280; }
      `}</style>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
            <CalendarDays size={18} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Scheme Deadlines</h1>
        </div>
        <p className="text-gray-500 text-sm ml-12">Track application deadlines and set reminders</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            Click a date to see deadlines
            <span className="ml-2 text-xs text-indigo-500 font-normal">● = has deadline</span>
          </p>
          <Calendar
            onChange={handleCalChange}
            value={calDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            {calDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          {selectedSchemes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <CalendarDays size={36} className="text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">No deadlines on this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedSchemes.map(function(s) {
                return (
                  <div key={s.id} className="flex items-start justify-between gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{s.name}</p>
                      <span className={"text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block " + (CAT_COLORS[s.category] || "bg-gray-100 text-gray-600")}>
                        {s.category}
                      </span>
                    </div>
                    <RemindBtn scheme={s} reminders={reminders} onToggle={toggleReminder} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={16} className="text-indigo-600" />
          <h2 className="text-base font-bold text-gray-900">Upcoming Deadlines</h2>
          <span className="ml-auto text-xs text-gray-400">{upcoming.length} active</span>
        </div>
        <div className="space-y-3">
          {upcoming.map(function(s) {
            return (
              <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                    <span className={"text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 " + (CAT_COLORS[s.category] || "bg-gray-100 text-gray-600")}>
                      {s.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(s.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <DaysBadge days={s.daysLeft} />
                <RemindBtn scheme={s} reminders={reminders} onToggle={toggleReminder} />
              </div>
            )
          })}
          {upcoming.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No upcoming deadlines</p>}
        </div>
      </div>

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
            {reminders.map(function(r) {
              const dl = new Date(r.deadline)
              const daysLeft = Math.ceil((dl - new Date().setHours(0,0,0,0)) / 86400000)
              return (
                <div key={r.id} className="flex items-center gap-4 p-3 rounded-xl bg-green-50 border border-green-100">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {dl.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <DaysBadge days={daysLeft} />
                  <button
                    onClick={function() {
                      const updated = reminders.filter(function(x) { return x.id !== r.id })
                      saveReminders(updated)
                      setReminders(updated)
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove reminder"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {expired.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={15} className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-500">Past Deadlines</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {expired.map(function(s) {
              return (
                <div key={s.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <span className={"text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 " + (CAT_COLORS[s.category] || "bg-gray-100 text-gray-600")}>
                    {s.category}
                  </span>
                  <p className="text-xs text-gray-500 truncate">{s.name}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}