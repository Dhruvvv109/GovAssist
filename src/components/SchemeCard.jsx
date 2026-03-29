import { useNavigate } from 'react-router-dom'
import { ArrowRight, Tag } from 'lucide-react'

const categoryColors = {
  Agriculture:     'bg-green-100 text-green-700',
  Housing:         'bg-blue-100 text-blue-700',
  Business:        'bg-purple-100 text-purple-700',
  Education:       'bg-yellow-100 text-yellow-700',
  Health:          'bg-red-100 text-red-700',
  Finance:         'bg-indigo-100 text-indigo-700',
  'Women & Child': 'bg-pink-100 text-pink-700',
}

export default function SchemeCard({ scheme }) {
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
      <div className="flex items-center justify-between">
        <span className={"inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full " + (categoryColors[scheme.category] || 'bg-gray-100 text-gray-600')}>
          <Tag size={10} />{scheme.category}
        </span>
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">{scheme.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{scheme.description}</p>
      </div>
      <div className="border-t border-gray-50 pt-3 mt-auto">
        <button onClick={() => navigate("/scheme/" + scheme.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white text-sm font-semibold rounded-xl transition-all duration-200 group">
          Check Eligibility
          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}