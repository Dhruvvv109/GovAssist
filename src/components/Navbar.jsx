import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Landmark, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const isHindi = i18n.language === 'hi'

  const toggleLanguage = () => {
    const next = isHindi ? 'en' : 'hi'
    i18n.changeLanguage(next)
    localStorage.setItem('govassist_lang', next)
  }

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.schemes'), to: '/schemes' },
    { label: t('nav.dashboard'), to: '/dashboard' },
    { label: t('nav.setupProfile'), to: '/setup' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors">
              <Landmark size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Gov<span className="text-primary-600">Assist</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={"px-4 py-2 rounded-lg text-sm font-medium transition-colors " +
                  (isActive(link.to) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')}>
                {link.label}
              </Link>
            ))}
            <Link to="/setup" className="ml-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
              {t('nav.checkEligibility')}
            </Link>
            <button onClick={toggleLanguage} title="Switch language"
              className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-700 transition-all">
              <Globe size={14} />
              <span>{isHindi ? 'EN' : 'हिं'}</span>
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50">
              <Globe size={12} />{isHindi ? 'EN' : 'हिं'}
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
                className={"block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors " +
                  (isActive(link.to) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100')}>
                {link.label}
              </Link>
            ))}
            <Link to="/setup" onClick={() => setOpen(false)}
              className="block mx-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg text-center hover:bg-primary-700 transition-colors">
              {t('nav.checkEligibility')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}