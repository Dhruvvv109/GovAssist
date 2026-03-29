import { useNavigate } from 'react-router-dom'
import { ArrowRight, Tag, Bell, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'

const LS_KEY = 'govassist_reminders'

const categoryColors = {
  Agriculture:     'bg-green-100 text-green-700',
  Housing:         'bg-blue-100 text-blue-700',
  Business:        'bg-purple-100 text-purple-700',
  Education:       'bg-yellow-100 text-yellow-700',
  Health:          'bg-red-100 text-red-700',
  Finance:         'bg-indigo-100 text-indigo-700',
  'Women & Child': 'bg-pink-100 text-pink-700',
}

function isReminderSet(id) {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]').some(r => r.id === id)
  } catch { return false }
}

async function toggleReminder(scheme, setSet) {
  const existing = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  const idx = existing.findIndex(r => r.id === scheme.id)
  if (idx >= 0) {
    const updated = existing.filter(r => r.id !== scheme.id)
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
    setSet(false)
  } else {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission()
    }
    const updated = [...existing, { id: scheme.id, name: scheme.name, deadline: scheme.deadline, category: scheme.category }]
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
    setSet(true)
  }
}

export default function SchemeCard({ scheme }) {
  const navigate = useNavigate()
  const [reminderSet, setReminderSet] = useState(() => isReminderSet(scheme.id))

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
      {/* Category + Deadline */}
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[scheme.category] || 'bg-gray-100 text-gray-600'}`}>
          <Tag size={10} />
          {scheme.category}
        </span>
        {scheme.deadline && (
          <span className="text-xs text-gray-400 shrink-0">
            Due {new Date(scheme.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>

      {/* Name + Description */}
      <div>
        <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">{scheme.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{scheme.description}</p>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-50 pt-3 mt-auto flex gap-2">
        <button
          onClick={() => navigate(`/scheme/${scheme.id}`)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white text-sm font-semibold rounded-xl transition-all duration-200 group"
        >
          Check Eligibility
          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
        {scheme.deadline && (
          <button
            onClick={() => toggleReminder(scheme, setReminderSet)}
            title={reminderSet ? 'Remove reminder' : 'Set reminder'}
            className={`flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              reminderSet
                ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-700'
            }`}
          >
            {reminderSet ? <CheckCircle2 size={14} /> : <Bell size={14} />}
          </button>
        )}
      </div>
    </div>
  )
}
