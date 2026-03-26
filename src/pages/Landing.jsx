import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Users, CheckCircle } from 'lucide-react'

const stats = [
  { label: 'Active Schemes', value: '500+' },
  { label: 'Citizens Helped', value: '2M+' },
  { label: 'States & UTs', value: '36' },
]

const features = [
  { icon: Zap, title: 'Instant Matching', desc: 'AI matches you with relevant schemes in seconds based on your profile.' },
  { icon: Shield, title: 'Trusted & Secure', desc: 'All scheme data is sourced directly from official government portals.' },
  { icon: Users, title: 'For Every Indian', desc: 'From farmers to students, we cover schemes across all categories.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-[10%] w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-[5%] w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 border border-white/20 px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            🇮🇳 100% Free Government Resource
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5 tracking-tight">
            Discover Government Schemes
            <span className="block text-primary-200">Made For You</span>
          </h1>
          <p className="text-base sm:text-lg text-primary-100 max-w-xl mx-auto mb-8 leading-relaxed">
            Stop missing out on benefits you deserve. Tell us about yourself and we'll find every scheme, subsidy, and benefit you're eligible for.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/setup')}
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg text-sm"
            >
              Check Your Eligibility <ArrowRight size={17} />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
            >
              Browse All Schemes
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-3 divide-x divide-gray-100">
          {stats.map(s => (
            <div key={s.label} className="text-center px-4">
              <div className="text-2xl font-extrabold text-primary-600">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why GovAssist?</h2>
            <p className="text-gray-500 mt-2 text-base">Simplifying government for every Indian citizen</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
          <CheckCircle size={32} className="text-primary-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to find your schemes?</h2>
          <p className="text-gray-500 text-sm mb-5">Takes less than 2 minutes. No sign-up required.</p>
          <button
            onClick={() => navigate('/setup')}
            className="px-7 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors text-sm shadow-md"
          >
            Get Started — It's Free
          </button>
        </div>
      </section>
    </div>
  )
}
