import { useEffect, useState, useCallback } from "react"
import { Bell, BellOff, Trash2, CalendarDays, Clock, Tag, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"

const LS_KEY = "govassist_reminders"

// ── Fallback data so page never crashes even if API fails ──────────────────
const FALLBACK = [
  { id:"1",  name:"PM Kisan Samman Nidhi",           category:"Agriculture",   deadline:"2025-07-31", daysLeft:0, apply_url:"https://pmkisan.gov.in/" },
  { id:"11", name:"PM Fasal Bima Yojana",             category:"Agriculture",   deadline:"2025-07-15", daysLeft:0, apply_url:"https://pmfby.gov.in/" },
  { id:"4",  name:"Beti Bachao Beti Padhao",          category:"Education",     deadline:"2025-08-15", daysLeft:0, apply_url:"https://www.india.gov.in/" },
  { id:"15", name:"PM SVANidhi",                      category:"Business",      deadline:"2025-08-31", daysLeft:0, apply_url:"https://pmsvanidhi.mohua.gov.in/" },
  { id:"13", name:"PM Kaushal Vikas Yojana",          category:"Education",     deadline:"2025-09-30", daysLeft:0, apply_url:"https://www.pmkvyofficial.org/" },
  { id:"2",  name:"PM Awas Yojana (Urban)",           category:"Housing",       deadline:"2025-09-30", daysLeft:0, apply_url:"https://pmaymis.gov.in/" },
  { id:"6",  name:"PM Scholarship Scheme",            category:"Education",     deadline:"2025-10-15", daysLeft:0, apply_url:"https://ksb.gov.in/" },
  { id:"5",  name:"Ayushman Bharat PM-JAY",           category:"Health",        deadline:"2025-10-31", daysLeft:0, apply_url:"https://pmjay.gov.in/" },
  { id:"10", name:"National Scholarship Portal",      category:"Education",     deadline:"2025-10-31", daysLeft:0, apply_url:"https://scholarships.gov.in/" },
  { id:"7",  name:"PM Ujjwala Yojana",                category:"Health",        deadline:"2025-11-30", daysLeft:0, apply_url:"https://pmuy.gov.in/" },
  { id:"16", name:"Jal Jeevan Mission",               category:"Housing",       deadline:"2025-11-30", daysLeft:0, apply_url:"https://jaljeevanmission.gov.in/" },
  { id:"3",  name:"Pradhan Mantri Mudra Yojana",      category:"Business",      deadline:"2025-12-31", daysLeft:0, apply_url:"https://www.mudra.org.in/" },
  { id:"8",  name:"Atal Pension Yojana",              category:"Business",      deadline:"2025-12-31", daysLeft:0, apply_url:"https://npscra.nsdl.co.in/" },
  { id:"9",  name:"PM Jan Dhan Yojana",               category:"Business",      deadline:"2025-12-31", daysLeft:0, apply_url:"https://pmjdy.gov.in/" },
  { id:"12", name:"Startup India Initiative",         category:"Business",      deadline:"2025-12-31", daysLeft:0, apply_url:"https://www.startupindia.gov.in/" },
  { id:"14", name:"E-Shram Card Scheme",              category:"Business",      deadline:"2025-12-31", daysLeft:0, apply_url:"https://eshram.gov.in/" },
  { id:"18", name:"PM Matru Vandana Yojana",          category:"Women & Child", deadline:"2025-12-31", daysLeft:0, apply_url:"https://wcd.nic.in/" },
  { id:"22", name:"Poshan Abhiyaan",                  category:"Women & Child", deadline:"2025-12-31", daysLeft:0, apply_url:"https://poshanabhiyaan.gov.in/" },
  { id:"23", name:"Stand Up India",                   category:"Finance",       deadline:"2025-12-31", daysLeft:0, apply_url:"https://www.standupmitra.in/" },
  { id:"17", name:"PM Suraksha Bima Yojana",          category:"Health",        deadline:"2025-05-31", daysLeft:0, apply_url:"https://jansuraksha.gov.in/" },
  { id:"20", name:"PM Jeevan Jyoti Bima Yojana",      category:"Finance",       deadline:"2025-05-31", daysLeft:0, apply_url:"https://jansuraksha.gov.in/" },
  { id:"21", name:"Kisan Credit Card (KCC)",          category:"Finance",       deadline:"2025-06-30", daysLeft:0, apply_url:"https://www.nabard.org/" },
  { id:"19", name:"Sukanya Samriddhi Yojana",         category:"Women & Child", deadline:"2025-03-31", daysLeft:0, apply_url:"https://www.nsiindia.gov.in/" },
]

function computeDaysLeft(list) {
  const today = new Date()
  today.setHours(0,0,0,0)
  return list.map(s => {
    const dl = new Date(s.deadline + "T00:00:00")
    return { ...s, daysLeft: Math.ceil((dl - today) / 86400000) }
  }).sort((a,b) => a.daysLeft - b.daysLeft)
}

function loadReminders() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]") } catch { return [] }
}
function saveReminders(list) { localStorage.setItem(LS_KEY, JSON.stringify(list)) }

async function requestNotif() {
  if (!("Notification" in window)) return false
  if (Notification.permission === "granted") return true
  return (await Notification.requestPermission()) === "granted"
}

function DaysBadge({ days }) {
  if (days < 0)   return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">Expired</span>
  if (days === 0) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">Today!</span>
  if (days <= 7)  return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">{days}d left</span>
  if (days <= 30) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{days}d left</span>
  return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{days}d left</span>
}

const CAT = {
  Agriculture:"bg-green-100 text-green-700", Housing:"bg-blue-100 text-blue-700",
  Business:"bg-purple-100 text-purple-700",  Education:"bg-yellow-100 text-yellow-700",
  Health:"bg-red-100 text-red-700",          Finance:"bg-indigo-100 text-indigo-700",
  "Women & Child":"bg-pink-100 text-pink-700",
}

function RemindBtn({ scheme, reminders, onToggle }) {
  const isSet = reminders.some(r => r.id === scheme.id)
  return (
    <button onClick={() => onToggle(scheme)}
      className={"flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shrink-0 " +
        (isSet ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600"
               : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100")}>
      {isSet ? <><CheckCircle2 size={12}/> Reminder Set</> : <><Bell size={12}/> Remind Me</>}
    </button>
  )
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]
const WDAYS  = ["Su","Mo","Tu","We","Th","Fr","Sa"]

function MiniCalendar({ deadlineDates, selected, onSelect }) {
  const [ym, setYm] = useState(() => { const n=new Date(); return {y:n.getFullYear(),m:n.getMonth()} })
  const prev = () => setYm(v => v.m===0 ? {y:v.y-1,m:11} : {y:v.y,m:v.m-1})
  const next = () => setYm(v => v.m===11 ? {y:v.y+1,m:0} : {y:v.y,m:v.m+1})
  const firstDay = new Date(ym.y, ym.m, 1).getDay()
  const total    = new Date(ym.y, ym.m+1, 0).getDate()
  const todayIso = new Date().toISOString().slice(0,10)
  const cells = Array(firstDay).fill(null).concat(Array.from({length:total},(_,i)=>i+1))
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronLeft size={15}/></button>
        <span className="text-sm font-bold text-gray-800">{MONTHS[ym.m]} {ym.y}</span>
        <button onClick={next} className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronRight size={15}/></button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {WDAYS.map(d=><div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day,i) => {
          if (!day) return <div key={"_"+i}/>
          const iso = `${ym.y}-${String(ym.m+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`
          const hasDl = deadlineDates.includes(iso)
          const isSel = iso === selected
          const isToday = iso === todayIso
          return (
            <button key={iso} onClick={()=>onSelect(iso)}
              className={"relative flex flex-col items-center justify-center h-9 rounded-lg text-xs font-medium transition-all " +
                (isSel ? "bg-indigo-600 text-white" : isToday ? "bg-indigo-100 text-indigo-700 font-bold" : "hover:bg-gray-100 text-gray-700")}>
              {day}
              {hasDl && <span className={"absolute bottom-0.5 w-1 h-1 rounded-full "+(isSel?"bg-white":"bg-indigo-500")}/>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Deadlines() {
  const [schemes, setSchemes] = useState(() => computeDaysLeft(FALLBACK))
  const [reminders, setReminders] = useState(loadReminders)
  const [selected, setSelected] = useState(() => new Date().toISOString().slice(0,10))

  useEffect(() => {
    // Try to load from API, fall back to hardcoded data silently
    fetch("/api/deadlines")
      .then(r => r.ok ? r.json() : null)
      .then(json => { if (json && json.data) setSchemes(json.data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const today = new Date().toISOString().slice(0,10)
    loadReminders().forEach(r => {
      if (r.deadline === today && Notification.permission === "granted")
        new Notification("GovAssist Reminder", { body: "Deadline today: " + r.name })
    })
  }, [])

  const toggleReminder = useCallback(async scheme => {
    const existing = loadReminders()
    const has = existing.some(r => r.id === scheme.id)
    let updated
    if (has) {
      updated = existing.filter(r => r.id !== scheme.id)
    } else {
      if ("Notification" in window && Notification.permission !== "granted")
        await Notification.requestPermission()
      updated = [...existing, { id:scheme.id, name:scheme.name, deadline:scheme.deadline, category:scheme.category }]
    }
    saveReminders(updated)
    setReminders(updated)
  }, [])

  const deadlineDates = schemes.map(s => s.deadline)
  const selSchemes    = schemes.filter(s => s.deadline === selected)
  const upcoming      = schemes.filter(s => s.daysLeft >= 0)
  const expired       = schemes.filter(s => s.daysLeft < 0)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
            <CalendarDays size={18} className="text-indigo-600"/>
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
          <MiniCalendar deadlineDates={deadlineDates} selected={selected} onSelect={setSelected}/>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            {new Date(selected+"T00:00:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
          </p>
          {selSchemes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <CalendarDays size={36} className="text-gray-200 mb-3"/>
              <p className="text-gray-400 text-sm">No deadlines on this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selSchemes.map(s => (
                <div key={s.id} className="flex items-start justify-between gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{s.name}</p>
                    <span className={"text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block "+(CAT[s.category]||"bg-gray-100 text-gray-600")}>{s.category}</span>
                  </div>
                  <RemindBtn scheme={s} reminders={reminders} onToggle={toggleReminder}/>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={16} className="text-indigo-600"/>
          <h2 className="text-base font-bold text-gray-900">Upcoming Deadlines</h2>
          <span className="ml-auto text-xs text-gray-400">{upcoming.length} active</span>
        </div>
        <div className="space-y-2">
          {upcoming.length === 0
            ? <p className="text-gray-400 text-sm text-center py-6">No upcoming deadlines</p>
            : upcoming.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                    <span className={"text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 "+(CAT[s.category]||"bg-gray-100 text-gray-600")}>{s.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(s.deadline+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                  </p>
                </div>
                <DaysBadge days={s.daysLeft}/>
                <RemindBtn scheme={s} reminders={reminders} onToggle={toggleReminder}/>
              </div>
            ))
          }
        </div>
      </div>

      {/* My Reminders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={16} className="text-indigo-600"/>
          <h2 className="text-base font-bold text-gray-900">My Reminders</h2>
          <span className="ml-auto text-xs text-gray-400">{reminders.length} set</span>
        </div>
        {reminders.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <BellOff size={32} className="text-gray-200 mb-2"/>
            <p className="text-gray-400 text-sm">No reminders set yet</p>
            <p className="text-gray-300 text-xs mt-1">Click "Remind Me" on any scheme above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map(r => {
              const daysLeft = Math.ceil((new Date(r.deadline+"T00:00:00") - new Date().setHours(0,0,0,0)) / 86400000)
              return (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(r.deadline+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                    </p>
                  </div>
                  <DaysBadge days={daysLeft}/>
                  <button onClick={() => { const u=reminders.filter(x=>x.id!==r.id); saveReminders(u); setReminders(u) }}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14}/>
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
            <Tag size={15} className="text-gray-400"/>
            <h2 className="text-sm font-bold text-gray-500">Past Deadlines</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {expired.map(s => (
              <div key={s.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className={"text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 "+(CAT[s.category]||"bg-gray-100 text-gray-600")}>{s.category}</span>
                <p className="text-xs text-gray-500 truncate">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}