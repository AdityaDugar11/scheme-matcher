import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Shield, Storefront, Landmark, GraduationCap, CheckCircle, Info, ArrowRight, MapPin, Globe, Filter, Search } from 'lucide-react'

export default function App() {
  const [lang, setLang] = useState('en')
  const [view, setView] = useState('dashboard') // dashboard, intake, results, emi, locator, confirm
  const [email, setEmail] = useState('')
  const [matches, setMatches] = useState([])
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [partners, setPartners] = useState([])

  // Dashboard Data
  const [savedMatches, setSavedMatches] = useState([])

  useEffect(() => {
    const fetchPartners = async () => {
      const { data } = await supabase.from('partners').select('*')
      setPartners(data || [])
    }
    fetchPartners()
  }, [])

  const handleLookup = async () => {
    if(!email) return;
    const { data } = await supabase.from('saved_recommendations').select('*').eq('email', email)
    if(data && data.length > 0) {
      setSavedMatches(data)
    } else {
      setView('intake')
    }
  }

  const handleIntakeSubmit = (e) => {
    e.preventDefault()
    // Deterministic Match Simulation
    const results = [
      { id: 1, name: 'NBCFDC Term Loan Scheme', score: 94, reason: 'Family income meets criteria.', docs: ['Aadhaar', 'Income Cert', 'Caste Cert'], eligible: true },
      { id: 2, name: 'PMEGP Programme', score: 68, reason: 'Requires higher contribution.', docs: ['8th Cert', 'Project Report'], eligible: false },
      { id: 3, name: 'Stand-Up India', score: 52, reason: 'Loan size exceeds your cost.', docs: ['Business Plan'], eligible: false }
    ]
    setMatches(results)
    setView('results')
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans text-[#141b2b] pb-10">
      {/* Persistent Header */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[#1D4ED8] font-bold">
          <Shield size={24} /> <span className="text-lg">Scheme Matcher</span>
        </div>
        <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="flex items-center gap-1 bg-[#F1F3FF] px-3 py-1.5 rounded-full text-xs font-bold border border-[#DCE2F7]">
          <Globe size={14} /> {lang === 'en' ? 'English / हिंदी' : 'हिंदी / English'}
        </button>
      </header>

      <main className="max-w-[720px] mx-auto px-4 mt-6">

        {/* SCREEN 1: DASHBOARD (Lookup/Entry) */}
        {view === 'dashboard' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Your Scheme Matches</h1>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600 mb-4">Enter email to find your matches or start fresh.</p>
              <div className="flex gap-2">
                <input 
                  className="flex-1 h-12 border border-gray-300 rounded-lg px-4 focus:border-[#1D4ED8] outline-none"
                  placeholder="name@gmail.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
                <button onClick={handleLookup} className="bg-[#1D4ED8] text-white px-6 rounded-lg font-bold flex items-center gap-2">
                  <Search size={18} /> Lookup
                </button>
              </div>
            </div>

            {savedMatches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 p-2 rounded">
                  <Info size={16}/> Looked up by: <strong>{email}</strong>
                </div>
                {savedMatches.map((m, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between">
                      <span className="bg-green-100 text-[#006d30] px-2 py-1 rounded text-xs font-bold">{m.match_score}% Match</span>
                    </div>
                    <h3 className="font-bold text-lg mt-2">{m.scheme_name}</h3>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 border border-gray-300 h-10 rounded font-bold text-sm">Interested</button>
                      <button className="flex-1 border border-gray-300 h-10 rounded font-bold text-sm">Not Interested</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SCREEN 2: INTAKE FORM */}
        {view === 'intake' && (
          <form onSubmit={handleIntakeSubmit} className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Find the Right Scheme</h1>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded-full font-bold">Step 1 of 5</span>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
              <div>
                <label className="block font-bold mb-1">Annual Family Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 font-bold">₹</span>
                  <input type="number" className="w-full h-12 border border-gray-300 rounded-lg pl-8 pr-4" placeholder="1,50,000" required />
                </div>
                <p className="text-xs text-[#6b3700] mt-1">Must be ₹5,00,000 or below to qualify.</p>
              </div>

              <div>
                <label className="block font-bold mb-3">What is this loan for?</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'small-business', label: 'Small Business', icon: <Storefront /> },
                    { id: 'larger-project', label: 'Larger Project', icon: <Landmark /> },
                    { id: 'education', label: 'Education', icon: <GraduationCap /> }
                  ].map(item => (
                    <label key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-[#1D4ED8]">
                      <input type="radio" name="purpose" value={item.id} className="w-5 h-5" defaultChecked={item.id==='small-business'} />
                      <div className="text-[#1D4ED8]">{item.icon}</div>
                      <span className="font-bold">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Estimated Project Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 font-bold">₹</span>
                  <input type="number" className="w-full h-12 border border-gray-300 rounded-lg pl-8 pr-4" placeholder="2,00,000" required />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-[#1D4ED8] text-white h-14 rounded-lg font-bold text-lg shadow-md">
                Find My Scheme
              </button>
            </div>
          </form>
        )}

        {/* SCREEN 3: RECOMMENDATION RESULTS */}
        {view === 'results' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Ranked Results</h1>
            {matches.map(m => (
              <div key={m.id} className={`bg-white p-6 rounded-lg border-2 ${m.eligible ? 'border-[#006d30]' : 'border-gray-200 opacity-90'}`}>
                <div className="flex justify-between items-start">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${m.eligible ? 'bg-green-100 text-[#006d30]' : 'bg-amber-100 text-[#6b3700]'}`}>
                    {m.eligible ? 'RECOMMENDED' : 'NOT A STRONG MATCH'}
                  </span>
                  <span className="text-2xl font-black text-[#1D4ED8]">{m.score}%</span>
                </div>
                <h2 className="text-xl font-bold mt-2">{m.name}</h2>
                <p className="text-gray-600 text-sm mt-1">{m.reason}</p>
                
                {m.eligible && (
                  <div className="mt-4 border-t pt-4">
                    <p className="font-bold text-sm mb-2">Required Documents:</p>
                    <div className="space-y-1">
                      {m.docs.map(doc => <div key={doc} className="flex items-center gap-2 text-sm"><CheckCircle size={14} className="text-[#006d30]"/> {doc}</div>)}
                    </div>
                    <button onClick={() => { setSelectedScheme(m); setView('emi'); }} className="w-full bg-[#1D4ED8] text-white h-12 rounded-lg font-bold mt-6 flex items-center justify-center gap-2">
                      See EMI Breakdown <ArrowRight size={18}/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SCREEN 4: EMI CALCULATOR */}
        {view === 'emi' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">EMI Breakdown</h1>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div><p className="text-xs text-gray-500">Loan (90%)</p><p className="text-xl font-bold">₹1,80,000</p></div>
                <div><p className="text-xs text-gray-500">Your Share (10%)</p><p className="text-xl font-bold">₹20,000</p></div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full flex overflow-hidden mb-6">
                <div className="h-full bg-[#1D4ED8] w-[90%]"></div>
                <div className="h-full bg-gray-400 w-[10%]"></div>
              </div>
              
              <label className="block font-bold mb-2">Tenure (Months): 36</label>
              <input type="range" min="6" max="60" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1D4ED8] mb-8" />
              
              <div className="text-center bg-[#F1F3FF] p-6 rounded-lg">
                <p className="text-sm font-bold text-gray-600">Estimated Monthly EMI</p>
                <p className="text-4xl font-black text-[#1D4ED8] mt-2">₹ 5,316</p>
                <p className="text-xs text-gray-500 mt-2">At 4.0% interest • 6 Months Moratorium</p>
              </div>

              <button onClick={() => setView('locator')} className="w-full bg-[#1D4ED8] text-white h-14 rounded-lg font-bold mt-6">
                Find Nearest Partner
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: PARTNER LOCATOR */}
        {view === 'locator' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Select a Partner</h1>
            <div className="h-48 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 font-bold border-2 border-white shadow-inner">
               [Map View Placeholder]
            </div>
            <div className="space-y-3">
              {partners.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{p.name}</h3>
                      <span className="bg-gray-100 text-xs px-2 py-0.5 rounded font-bold">{p.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${p.risk_score > 70 ? 'bg-[#006d30]' : 'bg-[#6b3700]'}`}></div>
                      <span className="text-xs font-bold">{p.risk_score > 70 ? 'High' : 'Medium'} Health</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1"><MapPin size={14}/> 2.4 km away</p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button className="h-10 border border-[#1D4ED8] text-[#1D4ED8] rounded font-bold text-sm hover:bg-[#F1F3FF]">Interested</button>
                    <button className="h-10 border border-gray-300 rounded font-bold text-sm">Not Interested</button>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 p-3 bg-blue-50 text-[#1D4ED8] text-xs rounded border border-blue-100">
                <Info size={16}/> Simulated data — production version integrates with official records.
              </div>
              <button onClick={() => setView('confirm')} className="w-full bg-[#1D4ED8] text-white h-14 rounded-lg font-bold mt-4">
                Send My Details
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 6: CONFIRMATION */}
        {view === 'confirm' && (
          <div className="text-center py-10 space-y-6">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={48} className="text-[#006d30]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Referral Submitted!</h1>
              <p className="text-gray-600 mt-2">Check your email (<strong>{email}</strong>) for confirmation.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-left">
              <h3 className="font-bold">NBCFDC Term Loan</h3>
              <p className="text-sm">Partner: Karnataka State DCWD</p>
              <p className="text-sm">Contact: 📞 0836-2245890</p>
              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 accent-[#1D4ED8]" defaultChecked />
                <span className="text-sm font-bold">Email me a reminder</span>
              </label>
            </div>
            <button onClick={() => setView('dashboard')} className="w-full bg-[#1D4ED8] text-white h-14 rounded-lg font-bold">
              View My Dashboard
            </button>
            <button onClick={() => setView('intake')} className="text-[#1D4ED8] font-bold text-sm block mx-auto">
              Start Over for Another Loan
            </button>
          </div>
        )}

      </main>
    </div>
  )
}