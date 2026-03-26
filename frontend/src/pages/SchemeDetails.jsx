import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, FileText, ExternalLink, Tag } from 'lucide-react'
import { getSchemes } from '../utils/api'

const categoryColors = {
  Agriculture: 'bg-green-100 text-green-700',
  Housing:     'bg-blue-100 text-blue-700',
  Business:    'bg-purple-100 text-purple-700',
  Education:   'bg-yellow-100 text-yellow-700',
  Health:      'bg-red-100 text-red-700',
}

export default function SchemeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [scheme, setScheme] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSchemes().then(data => {
      const found = data.find(s => s.id === id)
      setScheme(found || null)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100" />)}
      </div>
    )
  }

  if (!scheme) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500 text-lg">Scheme not found.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-primary-600 font-medium">
          ← Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Hero Card */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-7 text-white mb-5 shadow-lg">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${categoryColors[scheme.category] || 'bg-gray-100 text-gray-600'}`}>
          <Tag size={10} /> {scheme.category}
        </span>
        <h1 className="text-2xl font-extrabold leading-tight mb-2">{scheme.name}</h1>
        <p className="text-primary-100 text-sm leading-relaxed">{scheme.description}</p>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 className="font-bold text-gray-900 text-base mb-3">About this Scheme</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{scheme.details}</p>
      </div>

      {/* Eligibility Checklist */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-primary-600" /> Eligibility Checklist
        </h2>
        <ul className="space-y-3">
          {scheme.checklist.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 bg-primary-50 border border-primary-200 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                <CheckCircle2 size={11} className="text-primary-600" />
              </span>
              <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Documents Required */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
          <FileText size={18} className="text-primary-600" /> Documents Required
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {scheme.documents.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
              <span className="text-sm text-gray-700">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <a
        href={scheme.apply_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-base transition-colors shadow-lg hover:shadow-xl"
      >
        Apply on Official Portal <ExternalLink size={17} />
      </a>
      <p className="text-center text-xs text-gray-400 mt-3">
        You'll be redirected to the official government website
      </p>
    </div>
  )
}
