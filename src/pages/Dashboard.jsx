import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts'
import { LayoutDashboard, TrendingUp, Map, Users, Layers, Calendar, IndianRupee } from 'lucide-react'
import { getAnalytics } from '../utils/api'
import { useTranslation } from 'react-i18next'


// ── Color palettes ─────────────────────────────────────────────────────────
const PIE_COLORS  = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4']
const BAR_COLOR   = '#22c55e'
const AREA_COLOR  = '#6366f1'

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-white text-2xl font-extrabold mt-0.5">{value}</p>
        {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ── Custom pie label ───────────────────────────────────────────────────────
function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null
  const R2D = Math.PI / 180
  const x = cx + (innerRadius + (outerRadius - innerRadius) / 2) * Math.cos(-midAngle * R2D)
  const y = cy + (innerRadius + (outerRadius - innerRadius) / 2) * Math.sin(-midAngle * R2D)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// ── State intensity helper (color scale) ──────────────────────────────────
function getIntensity(count) {
  if (count >= 17) return { bg: 'bg-green-500',  text: 'text-green-400',  label: 'Very High' }
  if (count >= 14) return { bg: 'bg-emerald-600', text: 'text-emerald-400', label: 'High' }
  if (count >= 11) return { bg: 'bg-yellow-500',  text: 'text-yellow-400', label: 'Medium' }
  return               { bg: 'bg-gray-600',      text: 'text-gray-400',   label: 'Low' }
}

// ── Custom tooltip ─────────────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 shadow-2xl text-sm">
      {label && <p className="text-gray-400 mb-1 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill || PIE_COLORS[i] }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString('en-IN') : p.value}
        </p>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePie, setActivePie] = useState(null)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setLoading(true)
    getAnalytics()
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [i18n.language])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{t('analytics.loading')}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">{t('analytics.failed')}</p>
      </div>
    )
  }

  const { summary, byCategory, topSchemes, stateCoverage, trend } = data

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center">
              <LayoutDashboard size={18} className="text-green-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">{t('analytics.title')}</h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">{t('analytics.subtitle', { count: data?.summary?.totalSchemes || 52 })}</p>
        </div>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard icon={Layers}          label={t('analytics.totalSchemes')}    value={summary.totalSchemes}       sub={t('analytics.totalSchemesSub')}    color="bg-green-500/20"  />
          <StatCard icon={LayoutDashboard} label={t('analytics.categories')}      value={summary.totalCategories}    sub={t('analytics.categoriesSub')}      color="bg-blue-500/20"   />
          <StatCard icon={Map}             label={t('analytics.statesUTs')}       value={summary.statesCovered}      sub={t('analytics.statesUTsSub')}       color="bg-purple-500/20" />
          <StatCard icon={Calendar}        label={t('analytics.activeDeadlines')} value={summary.activeDeadlines}    sub={t('analytics.activeDeadlinesSub')} color="bg-orange-500/20" />
          <StatCard icon={Users}           label={t('analytics.beneficiaries')}   value={summary.totalBeneficiaries} sub={t('analytics.beneficiariesSub')}   color="bg-cyan-500/20"   />
          <StatCard icon={IndianRupee}     label={t('analytics.totalFunding')}    value={summary.totalFunding}       sub={t('analytics.totalFundingSub')}    color="bg-rose-500/20"   />
        </div>

        {/* ── Row 1: Pie + Bar ───────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">

          {/* Pie Chart */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-white font-bold text-base mb-1">{t('analytics.schemesByCategory')}</h2>
            <p className="text-gray-500 text-xs mb-5">{t('analytics.schemesByCategorySub')}</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={byCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={PieLabel}
                  activeIndex={activePie}
                  onMouseEnter={(_, index) => setActivePie(index)}
                  onMouseLeave={() => setActivePie(null)}
                >
                  {byCategory.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      opacity={activePie === null || activePie === index ? 1 : 0.5}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-gray-300 text-xs">{value}</span>}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart — Top 5 schemes */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-white font-bold text-base mb-1">{t('analytics.top5')}</h2>
            <p className="text-gray-500 text-xs mb-5">{t('analytics.top5Sub')}</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topSchemes} layout="vertical" margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={v => `${(v / 1e6).toFixed(1)}M`}
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#d1d5db', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  content={<DarkTooltip />}
                  formatter={v => [`${(v / 1e6).toFixed(2)}M applications`]}
                />
                <Bar dataKey="applied" name={t('analytics.applications')} fill={BAR_COLOR} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Row 2: Trend line ──────────────────────────────────────────── */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-bold text-base mb-1">{t('analytics.monthlyTrend')}</h2>
              <p className="text-gray-500 text-xs">{t('analytics.monthlyTrendSub')}</p>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
              <TrendingUp size={13} className="text-green-400" />
              <span className="text-green-400 text-xs font-semibold">{t('analytics.growth')}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trend} margin={{ top: 5, right: 10, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={AREA_COLOR} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={AREA_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={v => `${(v / 1e6).toFixed(1)}M`}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<DarkTooltip />}
                formatter={v => [`${(v / 1e6).toFixed(2)}M`]}
              />
              <Area
                type="monotone"
                dataKey="applications"
                name={t('analytics.applications')}
                stroke={AREA_COLOR}
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                dot={{ fill: AREA_COLOR, r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: AREA_COLOR, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Row 3: State Coverage Grid ─────────────────────────────────── */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-white font-bold text-base mb-1">{t('analytics.stateCoverage')}</h2>
              <p className="text-gray-500 text-xs">{t('analytics.stateCoverageSub')}</p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap">
              {[
                { label: t('analytics.veryHigh'), color: 'bg-green-500' },
                { label: t('analytics.high'),     color: 'bg-emerald-600' },
                { label: t('analytics.medium'),   color: 'bg-yellow-500' },
                { label: t('analytics.low'),      color: 'bg-gray-600' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded ${l.color}`} />
                  <span className="text-gray-400 text-xs">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2.5">
            {stateCoverage.map(({ state, schemes, beneficiaries }) => {
              const { bg, text } = getIntensity(schemes)
              return (
                <div
                  key={state}
                  className="bg-gray-900 rounded-xl p-3 border border-gray-700 hover:border-gray-500 transition-colors group cursor-default"
                >
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white mb-2 ${bg}`}>
                    {schemes}
                  </div>
                  <p className="text-gray-200 text-xs font-semibold leading-tight">{state}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{beneficiaries}</p>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
