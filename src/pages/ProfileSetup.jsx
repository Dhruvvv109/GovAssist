import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, User, IndianRupee, MapPin, Tags, Briefcase } from 'lucide-react'

const STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Odisha','Punjab','Rajasthan','Tamil Nadu',
  'Telangana','Uttar Pradesh','Uttarakhand','West Bengal',
]

const CATEGORIES = ['General','OBC','SC','ST','EWS','Minority','Differently Abled']
const OCCUPATIONS = ['Farmer','Student','Entrepreneur','Government Employee','Private Employee','Self-employed','Homemaker','Unemployed','Any']

const steps = [
  { id: 1, title: 'Basic Info',   icon: User,         field: 'age',        label: 'Your Age', type: 'number', placeholder: 'e.g. 28' },
  { id: 2, title: 'Income',      icon: IndianRupee,   field: 'income',     label: 'Annual Family Income (₹)', type: 'number', placeholder: 'e.g. 250000' },
  { id: 3, title: 'Location',    icon: MapPin,        field: 'state',      label: 'Your State', type: 'select', options: STATES },
  { id: 4, title: 'Category',   icon: Tags,          field: 'category',   label: 'Social Category', type: 'select', options: CATEGORIES },
  { id: 5, title: 'Occupation',  icon: Briefcase,     field: 'occupation', label: 'Primary Occupation', type: 'select', options: OCCUPATIONS },
]

export default function ProfileSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({ age: '', income: '', state: '', category: '', occupation: '' })
  const [loading, setLoading] = useState(false)

  const current = steps[step]
  const progress = ((step + 1) / steps.length) * 100

  const handleSubmit = async () => {
    setLoading(true)
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

  const canProceed = profile[current.field] !== ''

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step indicators */}
          <div className="flex justify-between mt-3">
            {steps.map((s, i) => (
              <div key={s.id} className={`flex flex-col items-center gap-1 ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${i < step ? 'bg-primary-600' : i === step ? 'bg-primary-100 border-2 border-primary-600' : 'bg-gray-100'}`}>
                  <s.icon size={13} className={i <= step ? i < step ? 'text-white' : 'text-primary-700' : 'text-gray-400'} />
                </div>
                <span className="text-[10px] text-gray-400 hidden sm:block">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{current.label}</h2>
          <p className="text-sm text-gray-400 mb-6">Help us find the best schemes for you</p>

          {current.type === 'number' ? (
            <input
              type="number"
              value={profile[current.field]}
              onChange={e => setProfile({ ...profile, [current.field]: e.target.value })}
              placeholder={current.placeholder}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              min={0}
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {current.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => setProfile({ ...profile, [current.field]: opt })}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium text-left transition-all border ${
                    profile[current.field] === opt
                      ? 'bg-primary-50 border-primary-400 text-primary-700 font-semibold'
                      : 'bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <button
              disabled={!canProceed || loading}
              onClick={step < steps.length - 1 ? () => setStep(s => s + 1) : handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              {loading ? 'Finding schemes...' : step < steps.length - 1 ? (
                <><span>Continue</span><ChevronRight size={16} /></>
              ) : (
                'Show My Schemes 🎉'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
