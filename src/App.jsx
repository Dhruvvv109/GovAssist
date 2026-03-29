import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import Landing from './pages/Landing'
import ProfileSetup from './pages/ProfileSetup'
import Dashboard from './pages/Dashboard'
import Schemes from './pages/Schemes'
import SchemeDetails from './pages/SchemeDetails'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/scheme/:id" element={<SchemeDetails />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  )
}
