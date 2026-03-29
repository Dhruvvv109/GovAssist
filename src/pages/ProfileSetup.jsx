import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, User, IndianRupee, MapPin, Tags, Briefcase, Phone, UserCheck, CheckCircle2 } from 'lucide-react'

const PROFILE_KEY = 'govassist_profile'

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','J&K','Ladakh',
]
const CATEGORIES  = ['General','OBC','SC','ST','EWS','Minority','Differently Abled']
const OCCUPATIONS = ['Farmer','Student','Entrepreneur','Government Employee','Private Employee','Self-employed','Homemaker','Unemployed']
const GENDERS     = ['Male','Female','Other','Prefer not to say']

export default function ProfileSetup() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}')
      return {
        name: saved.name || '', phone: saved.phone || '', gender: saved.gender || '',
        age: saved.age || '', income: saved.income || '', state: saved.state || '',
        category: saved.category || '', occupation: saved.occupation || '',
      }
    } catch { return { name:'', phone:'', gender:'', age:'', income:'', state:'', category:'', occupation:'' } }
  })

  const set = (field, val) => setProfile(p => ({ ...p, [field]: val }))

  const steps = [
    {
      title: 'Personal Details', icon: User,
      fields: ['name','phone','gender'],
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
            <input value={profile.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
            <input value={profile.phone} onChange={e => set('phone', e.target.value)}
              placeholder="e.g. 9876543210" type="tel" maxLength={10}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map(g => (
                <button key={g} onClick={() => set('gender', g)}
                  className={"py-2.5 px-3 rounded-xl text-sm font-medium border transition-all " +
                    (profile.gender === g ? 'bg-primary-50 border-primary-400 text-primary-700 font-semibold' : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300')}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      canProceed: () => profile.name.trim().length >= 2 && profile.gender !== '',
    },
    {
      title: 'Age & Income', icon: IndianRupee,
      fields: ['age','income'],
      render: () => (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Your Age</label>
            <input value={profile.age} onChange={e => set('age', e.target.value)}
              type="number" placeholder="e.g. 28" min={1} max={120}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Annual Family Income (₹)</label>
            <input value={profile.income} onChange={e => set('income', e.target.value)}
              type="number" placeholder="e.g. 250000" min={0}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" />
            {profile.income && (
              <p className="text-xs text-gray-400 mt-1.5">
                ≈ ₹{Math.round(profile.income/12).toLocaleString('en-IN')}/month
              </p>
            )}
          </div>
        </div>
      ),
      canProceed: () => profile.age !== '' && profile.income !== '',
    },
    {
      title: 'Location', icon: MapPin,
      fields: ['state'],
      render: () => (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your State / UT</label>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {STATES.map(s => (
              <button key={s} onClick={() => set('state', s)}
                className={"py-2 px-3 rounded-xl text-sm font-medium border text-left transition-all " +
                  (profile.state === s ? 'bg-primary-50 border-primary-400 text-primary-700 font-semibold' : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300')}>
                {s}
              </button>
            ))}
          </div>
        </div>
      ),
      canProceed: () => profile.state !== '',
    },
    {
      title: 'Category', icon: Tags,
      fields: ['category'],
      render: () => (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Social Category</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => set('category', c)}
                className={"py-2.5 px-3 rounded-xl text-sm font-medium border transition-all " +
                  (profile.category === c ? 'bg-primary-50 border-primary-400 text-primary-700 font-semibold' : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300')}>
                {c}
              </button>
            ))}
          </div>
        </div>
      ),
      canProceed: () => profile.category !== '',
    },
    {
      title: 'Occupation', icon: Briefcase,
      fields: ['occupation'],
      render: () => (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Primary Occupation</label>
          <div className="grid grid-cols-2 gap-2">
            {OCCUPATIONS.map(o => (
              <button key={o} onClick={() => set('occupation', o)}
                className={"py-2.5 px-3 rounded-xl text-sm font-medium border transition-all " +
                  (profile.occupation === o ? 'bg-primary-50 border-primary-400 text-primary-700 font-semibold' : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300')}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ),
      canProceed: () => profile.occupation !== '',
    },
  ]

  const current    = steps[step]
  const progress   = ((step + 1) / steps.length) * 100
  const canProceed = current.canProceed()
  const ICONS      = [User, IndianRupee, MapPin, Tags, Briefcase]

  const handleSubmit = async () => {
    setLoading(true)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    try {
      const res = await fetch('/api/checkEligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      navigate('/schemes', { state: { schemes: data.data, profile } })
    } catch {
      navigate('/schemes', { state: { profile } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-3">
            {steps.map((s, i) => {
              const Icon = ICONS[i]
              return (
                <div key={i} className={"flex flex-col items-center gap-1 " + (i <= step ? 'opacity-100' : 'opacity-30')}>
                  <div className={"w-7 h-7 rounded-full flex items-center justify-center " +
                    (i < step ? 'bg-primary-600' : i === step ? 'bg-primary-100 border-2 border-primary-600' : 'bg-gray-100')}>
                    {i < step
                      ? <CheckCircle2 size={13} className="text-white" />
                      : <Icon size={13} className={i === step ? 'text-primary-700' : 'text-gray-400'} />}
                  </div>
                  <span className="text-[10px] text-gray-400 hidden sm:block">{s.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{current.title}</h2>
          <p className="text-sm text-gray-400 mb-6">Help us find the best schemes for you</p>

          {current.render()}

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <button
              disabled={!canProceed || loading}
              onClick={step < steps.length - 1 ? () => { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); setStep(s => s + 1) } : handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm">
              {loading ? 'Finding schemes...' : step < steps.length - 1
                ? <><span>Continue</span><ChevronRight size={16} /></>
                : 'Show My Schemes 🎉'}
            </button>
          </div>
        </div>

        {/* Saved profile hint */}
        {profile.name && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Saving profile for <span className="font-semibold text-gray-600">{profile.name}</span>
          </p>
        )}
      </div>
    </div>
  )
}