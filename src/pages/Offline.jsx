import { WifiOff, RefreshCw } from 'lucide-react'

export default function Offline() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff size={36} className="text-gray-400" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">You're offline</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          No internet connection. Previously visited pages are still available — browse them while you wait.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    </div>
  )
}
