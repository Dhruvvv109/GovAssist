import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, SlidersHorizontal, LayoutGrid } from 'lucide-react'
import SchemeCard from '../components/SchemeCard'
import { getSchemes } from '../utils/api'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const location = useLocation()
  const passedSchemes = location.state?.schemes
  const profile = location.state?.profile
  const { t, i18n } = useTranslation()

  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const CATEGORIES = [
    { key: 'All', label: t('dashboard.categories.all') },
    { key: 'Agriculture', label: t('dashboard.categories.agriculture') },
    { key: 'Housing', label: t('dashboard.categories.housing') },
    { key: 'Business', label: t('dashboard.categories.business') },
    { key: 'Education', label: t('dashboard.categories.education') },
    { key: 'Health', label: t('dashboard.categories.health') },
  ]

  useEffect(() => {
    if (passedSchemes) {
      setSchemes(passedSchemes)
      setLoading(false)
    } else {
      setLoading(true)
      getSchemes().then(data => {
        setSchemes(data)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [i18n.language])

  const filtered = schemes.filter(s => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {profile ? t('dashboard.title') : t('dashboard.titleAll')}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading
            ? 'Loading...'
            : t('dashboard.schemesFound', { count: filtered.length })
          }
          {profile?.state ? ` â€¢ ${profile.state}` : ''}
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('dashboard.searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-50"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 overflow-x-auto">
          <SlidersHorizontal size={14} className="ml-1 text-gray-400 shrink-0" />
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.key
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-48 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <LayoutGrid size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">{t('dashboard.noSchemes')}</p>
          <p className="text-gray-400 text-sm mt-1">{t('dashboard.noSchemesHint')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(scheme => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  )
}
