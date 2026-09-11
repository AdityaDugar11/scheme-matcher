import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Shield, CheckCircle, Info, ArrowRight } from 'lucide-react'

export default function App() {
  const [view, setView] = useState('landing')
  const [email, setEmail] = useState('')
  const [matches, setMatches] = useState([])
  const [partners, setPartners] = useState([])

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase.from('partners').select('*')
      setPartners(data || [])
    }
    fetchPartners()
  }, [])

  const handleRecommend = async (e) => {
    e.preventDefault()
    setView('results')
    // In a real dev environment, this calls /api/recommend
    setMatches([
      { scheme_name: 'Micro Finance Scheme', match_score: 94, eligible: true },
      { scheme_name: 'Term Loan Scheme', match_score: 68, eligible: false }
    ])
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] p-4 font-sans text-[#141b2b]">
      <header className="max-w-2xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-[#1D4ED8] font-bold text-xl">
          <Shield /> <span>Scheme Matcher</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {view === 'landing' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold mb-4">Check your eligibility</h1>
            <input 
              type="email" placeholder="email@example.com" 
              className="w-full h-14 border-2 border-gray-300 rounded-xl px-4 mb-4"
              value={email} onChange={e => setEmail(e.target.value)}
            />
            <button onClick={() => setView('form')} className="w-full bg-[#1D4ED8] text-white h-14 rounded-xl font-bold">Start</button>
          </div>
        )}

        {view === 'form' && (
          <form onSubmit={handleRecommend} className="space-y-6 bg-white p-8 rounded-2xl">
            <h2 className="font-bold text-xl">Quick Details</h2>
            <input name="income" type="number" placeholder="Annual Income" className="w-full h-12 border rounded-lg px-4" />
            <select name="type" className="w-full h-12 border rounded-lg px-4">
              <option value="small-business">Small Business</option>
              <option value="education">Education</option>
            </select>
            <button type="submit" className="w-full bg-[#1D4ED8] text-white h-14 rounded-xl font-bold">Find Matches</button>
          </form>
        )}

        {view === 'results' && (
          <div className="space-y-4">
            {matches.map((m, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-gray-200">
                <div className="flex justify-between font-bold">
                  <span>{m.scheme_name}</span>
                  <span className="text-[#006d30]">{m.match_score}% Match</span>
                </div>
                <button onClick={() => setView('locator')} className="mt-4 text-[#1D4ED8] font-bold">See Partners →</button>
              </div>
            ))}
          </div>
        )}

        {view === 'locator' && (
          <div className="space-y-4">
            <h2 className="font-bold">Authorized Partners</h2>
            {partners.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between">
                <div><h4 className="font-bold">{p.name}</h4><p className="text-sm">{p.city}</p></div>
                <div className="font-bold text-[#006d30]">{p.risk_score}% Fund Health</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
