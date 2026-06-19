'use client'
import React, { useState, useEffect } from 'react'
import { Home, DollarSign, TrendingUp, FileText, Menu, X, Plus, Edit3, Check, Shield } from 'lucide-react'

const TaxSavvy = () => {
  const theme = { navy: '#001F3F', green: '#39FF14', white: '#FFFFFF', gray: '#F3F4F6', red: '#EF4444' }
  
  const isDemo = typeof window!== 'undefined' && window.location.search.includes('demo=true')
  const [demoEmail, setDemoEmail] = useState('')
  const [demoEmailSubmitted, setDemoEmailSubmitted] = useState(false)
  const [adminSettings, setAdminSettings] = useState({ requireDemoEmail: false, captureDemoEmails: [] })
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showMenu, setShowMenu] = useState(false)
  const [tcAccepted, setTcAccepted] = useState(false)
  const [showModal, setShowModal] = useState(null)
  const [showToast, setShowToast] = useState('')
  
  const [entities, setEntities] = useState([
    { id: 1, name: isDemo? 'Sample Property LLC' : 'Cronin NY Property Management LLC', type: 'LLC', active: true },
    { id: 3, name: isDemo? 'Consulting Services' : 'Basketball Officiating', type: 'Sole Prop', active: true }
  ])
  const [activeEntity, setActiveEntity] = useState(1)
  
  const [properties, setProperties] = useState([
    { 
      id: 1, name: isDemo? '123 Sample St' : '114 Orchard St', 
      address: isDemo? '123 Sample St, Demo City, NY 12345' : '114 Orchard St, Horseheads, NY 14845', 
      entityId: 1, status: 'Rented', rent: 1405, balance: 470,
      tenant: isDemo? 'Jane Doe' : 'John Smith', 
      leaseStart: '2026-06-01', leaseEnd: '2027-05-31',
      signedBy: isDemo? 'Jane Doe' : 'John Smith',
      payments: [{date: '2026-06-01', amount: 935, source: 'HUD'}, {date: '2026-06-28', amount: 470, source: 'Tenant'}]
    }
  ])
  
  const [expenses, setExpenses] = useState([])
  const [mileage, setMileage] = useState([])
  
  const [profile, setProfile] = useState({
    name: isDemo? 'Demo User' : 'Mark Cronin', 
    email: isDemo? 'demo@taxsavvy.app' : 'mark@taxsavvy.app', 
    cpaEmail: ''
  })

  useEffect(() => {
    const savedAdmin = localStorage.getItem('taxsavvy-admin')
    if (savedAdmin) setAdminSettings(JSON.parse(savedAdmin))
    
    const tc = localStorage.getItem('taxsavvy-tc')
    if (tc === 'accepted') setTcAccepted(true)
    
    if (isDemo) { 
      setTcAccepted(true)
      const savedDemoEmail = sessionStorage.getItem('demo-email')
      if (savedDemoEmail) { setDemoEmail(savedDemoEmail); setDemoEmailSubmitted(true) }
      return 
    }
    
    const saved = localStorage.getItem('taxsavvy-v19-pro')
    if (saved) {
      const data = JSON.parse(saved)
      setEntities(data.entities || entities)
      setProperties(data.properties || properties)
      setExpenses(data.expenses || [])
      setMileage(data.mileage || [])
      setProfile(data.profile || profile)
    }
  }, [isDemo])

  useEffect(() => {
    if (isDemo) return
    const timer = setTimeout(() => {
      localStorage.setItem('taxsavvy-v19-pro', JSON.stringify({ entities, properties, expenses, mileage, profile }))
      localStorage.setItem('taxsavvy-admin', JSON.stringify(adminSettings))
    }, 2000)
    return () => clearTimeout(timer)
  }, [entities, properties, expenses, mileage, profile, adminSettings, isDemo])

  const showToastMsg = (msg) => { setShowToast(msg); setTimeout(() => setShowToast(''), 3000) }
  const acceptTC = () => { setTcAccepted(true); if (!isDemo) localStorage.setItem('taxsavvy-tc', 'accepted') }
  
  const submitDemoEmail = () => {
    if (!demoEmail ||!demoEmail.includes('@')) { showToastMsg('Enter valid email'); return }
    sessionStorage.setItem('demo-email', demoEmail)
    setDemoEmailSubmitted(true)
    if (!isDemo) {
      const updated = {...adminSettings, captureDemoEmails: [...adminSettings.captureDemoEmails, {email: demoEmail, date: new Date().toISOString()}]}
      setAdminSettings(updated)
      localStorage.setItem('taxsavvy-admin', JSON.stringify(updated))
    }
  }

  const markPaid = (propertyId, amount) => {
    setProperties(properties.map(p => 
      p.id === propertyId 
    ? {...p, balance: 0, payments: [...p.payments, {date: new Date().toISOString().split('T')[0], amount, source: 'Tenant'}]}
        : p
    ))
    showToastMsg(`Posted $${amount} - Paid ✓`)
  }

  const currentEntity = entities.find(e => e.id === activeEntity)
  const entityProperties = properties.filter(p => p.entityId === activeEntity)

  // DEMO EMAIL GATE - NO CHECKBOX
  if (isDemo && adminSettings.requireDemoEmail &&!demoEmailSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: theme.gray}}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-2 font-bold" style={{color: theme.white}}>$</div>
            <h1 className="text-2xl font-bold" style={{color: theme.green}}>TaxSavvy</h1>
          </div>
          <h2 className="text-xl font-semibold mb-2">Try the Demo</h2>
          <p className="text-sm text-gray-600 mb-4">Enter your email to access the full demo instantly.</p>
          <input type="email" value={demoEmail} onChange={e => setDemoEmail(e.target.value)} className="w-full border border-gray-300 rounded p-3 mb-3 text-base" placeholder="your@email.com" />
          <button onClick={submitDemoEmail} className="w-full py-3 rounded-lg font-semibold text-white text-base mb-3" style={{backgroundColor: theme.navy}}>Enter Demo Mode</button>
          <p className="text-xs text-gray-500">By entering your email, you agree to receive occasional promotional emails and discount codes for TaxSavvy. Unsubscribe anytime.</p>
        </div>
      </div>
    )
  }

  // TC GATE - FIXED BUTTON
  if (!tcAccepted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: theme.gray}}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-2 font-bold" style={{color: theme.navy}}>$</div>
            <h1 className="text-2xl font-bold" style={{color: theme.green}}>TaxSavvy {isDemo && <span className="text-sm text-gray-500">DEMO</span>}</h1>
          </div>
          <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
          <p className="text-sm text-gray-600 mb-4">To use TaxSavvy, you must accept our Terms & Conditions. This app tracks expenses and mileage for tax purposes. You are responsible for accuracy. TaxSavvy does not provide tax advice.</p>
          <a href="#" className="text-blue-600 text-sm underline mb-6 block">Read Full Terms & Conditions</a>
          <button onClick={acceptTC} className="w-full py-3 rounded-lg font-semibold text-white text-base" style={{backgroundColor: theme.navy}}>Accept & Continue</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{fontFamily: 'system-ui', backgroundColor: theme.gray}}>
      {isDemo && <div className="bg-yellow-400 text-black text-center py-1 text-sm font-medium">DEMO MODE - Sample Data Only</div>}
      
      {/* FIXED NAVY HEADER - EDGE TO EDGE */}
      <div className="w-full" style={{backgroundColor: theme.navy}}>
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-2" style={{color: theme.white}}>$</div>
            <h1 className="text-xl font-bold" style={{color: theme.green}}>TaxSavvy</h1>
          </div>
          <button onClick={() => setShowMenu(!showMenu)} className="text-white"><Menu size={24} /></button>
        </div>
      </div>

      <div className="bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto max-w-7xl mx-auto">
        {entities.filter(e => e.active).map(e => (
          <button key={e.id} onClick={() => setActiveEntity(e.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${activeEntity === e.id? 'text-white' : 'bg-gray-200 text-gray-700'}`}
            style={activeEntity === e.id? {backgroundColor: theme.navy} : {}}>{e.name.split(' ')[0]}</button>
        ))}
      </div>

      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMenu(false)}>
          <div className="bg-white w-64 h-full p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h2 className="font-bold text-lg">Menu</h2><X size={20} onClick={() => setShowMenu(false)} /></div>
            {['dashboard', 'expenses', 'mileage', 'reports', 'settings'].map(tab => (
              <button key={tab} onClick={() => {setActiveTab(tab); setShowMenu(false)}} className="block w-full text-left py-2 px-3 rounded hover:bg-gray-100 capitalize">{tab}</button>
            ))}
            {!isDemo && <button onClick={() => {setActiveTab('admin'); setShowMenu(false)}} className="block w-full text-left py-2 px-3 rounded hover:bg-gray-100 text-blue-600 mt-4"><Shield size={16} className="inline mr-2" />Admin</button>}
          </div>
        </div>
      )}

      {showToast && <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center"><Check size={18} className="mr-2" />{showToast}</div>}

      <div className="p-4 pb-20 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{currentEntity?.name}</h2>
            </div>
            {entityProperties.map(prop => (
              <div key={prop.id} className="bg-white rounded-lg shadow mb-4 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{prop.name}</h3>
                    <p className="text-xs text-gray-500">{prop.address}</p>
                    <p className="text-xs text-green-600">{prop.status} • ${prop.rent}/mo</p>
                  </div>
                  {prop.balance > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Balance Due: ${prop.balance}</span>}
                </div>
                <div className="text-sm mb-2">
                  <p><span className="font-medium">Signed by:</span> {prop.signedBy}</p>
                  <p><span className="font-medium">Lease:</span> {prop.leaseStart} - {prop.leaseEnd}</p>
                </div>
                <button onClick={() => markPaid(prop.id, prop.balance || prop.rent)} className="w-full py-2 rounded text-white text-sm font-medium" style={{backgroundColor: theme.navy}}>Mark Paid</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'admin' &&!isDemo && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Admin Settings</h2>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-medium mb-3">Demo Settings</h3>
              <label className="flex items-center justify-between mb-4">
                <span className="text-sm">Require Email for Demo Access</span>
                <input type="checkbox" checked={adminSettings.requireDemoEmail} onChange={e => setAdminSettings({...adminSettings, requireDemoEmail: e.target.checked})} className="w-5 h-5" />
              </label>
              <p className="text-xs text-gray-500 mb-4">ON = Users enter email before demo. OFF = Instant access.</p>
              <h4 className="font-medium text-sm mb-2">Captured Emails ({adminSettings.captureDemoEmails.length})</h4>
              <div className="max-h-40 overflow-y-auto text-xs bg-gray-50 p-2 rounded">
                {adminSettings.captureDemoEmails.map((e, i) => <div key={i} className="py-1 border-b border-gray-200">{e.email} • {e.date.slice(0,10)}</div>)}
                {adminSettings.captureDemoEmails.length === 0 && <p className="text-gray-400">No emails captured yet</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        {[{id: 'dashboard', icon: Home, label: 'Dashboard'}, {id: 'expenses', icon: TrendingUp, label: 'Expenses'}, {id: 'reports', icon: FileText, label: 'Reports'}].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center px-3 py-1 ${activeTab === tab.id? 'text-blue-600' : 'text-gray-400'}`}>
            <tab.icon size={20} /><span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaxSavvy
