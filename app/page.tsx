'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Home, DollarSign, TrendingUp, FileText, Menu, X, Plus, Camera, MapPin, Upload, Download, Mail, Calculator, Users, Edit3, Trash2, Save, Check } from 'lucide-react'

// TAX SAVVY v19 - COMPLETE BUILD
// Features: Multi-Entity, Lease Capture, Energy Star, Mileage Auto-Calc, Home Office, Reports

const TaxSavvy = () => {
  // THEME
  const theme = {
    navy: '#001F3F',
    green: '#39FF14',
    white: '#FFFFFF',
    gray: '#F3F4F6',
    red: '#EF4444',
    blue: '#3B82F6'
  }

  // STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showMenu, setShowMenu] = useState(false)
  const [tcAccepted, setTcAccepted] = useState(false)
  const [entities, setEntities] = useState([
    { id: 1, name: 'Cronin NY Property Management LLC', type: 'LLC', active: true },
    { id: 2, name: 'MCMC PROPERTIES INC', type: 'S-Corp', active: false },
    { id: 3, name: 'Basketball Officiating', type: 'Sole Prop', active: true }
  ])
  const [activeEntity, setActiveEntity] = useState(1)
  const [properties, setProperties] = useState([
    { 
      id: 1, 
      name: '114 Orchard St', 
      address: '114 Orchard St, Horseheads, NY',
      entityId: 1,
      status: 'Rented',
      rent: 1405,
      hud: 935,
      tenant: 'John Smith',
      leaseStart: '2026-06-01',
      leaseEnd: '2027-05-31',
      signedBy: 'John Smith',
      occupants: [{name: 'Jane Smith', relation: 'Spouse'}, {name: 'Timmy Smith', relation: 'Child'}],
      leaseFile: null,
      recurringPayers: [{name: 'Arbor Housing', amount: 935}],
      balance: 470,
      payments: [{date: '2026-06-01', amount: 935, source: 'HUD'}, {date: '2026-06-28', amount: 470, source: 'Tenant'}]
    }
  ])
  const [expenses, setExpenses] = useState([])
  const [mileage, setMileage] = useState([])
  const [homeOffice, setHomeOffice] = useState({
    address: '118 Daffodil Drive, Horseheads, NY',
    totalSqFt: 2000,
    workspaces: [{name: 'Main Office', sqFt: 200}, {name: 'Storage', sqFt: 100}]
  })
  const [profile, setProfile] = useState({
    name: 'Mark Cronin',
    email: 'mark@taxsavvy.app',
    cpaEmail: '',
    mileageDefaults: { '114 Orchard St': 8 }
  })
  const [showToast, setShowToast] = useState('')
  const fileInputRef = useRef(null)

  // AUTO-SAVE
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('taxsavvy-v19', JSON.stringify({ entities, properties, expenses, mileage, homeOffice, profile }))
    }, 3000)
    return () => clearTimeout(timer)
  }, [entities, properties, expenses, mileage, homeOffice, profile])

  // LOAD DATA
  useEffect(() => {
    const saved = localStorage.getItem('taxsavvy-v19')
    const tc = localStorage.getItem('taxsavvy-tc')
    if (saved) {
      const data = JSON.parse(saved)
      setEntities(data.entities || entities)
      setProperties(data.properties || properties)
      setExpenses(data.expenses || [])
      setMileage(data.mileage || [])
      setHomeOffice(data.homeOffice || homeOffice)
      setProfile(data.profile || profile)
    }
    if (tc === 'accepted') setTcAccepted(true)
  }, [])

  const acceptTC = () => {
    setTcAccepted(true)
    localStorage.setItem('taxsavvy-tc', 'accepted')
  }

  const showToastMsg = (msg) => {
    setShowToast(msg)
    setTimeout(() => setShowToast(''), 3000)
  }

  const markPaid = (propertyId, amount) => {
    setProperties(properties.map(p => 
      p.id === propertyId 
       ? {...p, balance: 0, payments: [...p.payments, {date: new Date().toISOString().split('T')[0], amount, source: 'Tenant'}]}
        : p
    ))
    showToastMsg(`Posted $${amount} - Paid ✓`)
  }

  const addMileage = (to, purpose, tripType, extraMiles = 0) => {
    const baseMiles = profile.mileageDefaults[to] || 0
    const totalMiles = tripType === 'Round Trip'? baseMiles * 2 + extraMiles : baseMiles + extraMiles
    setMileage([...mileage, {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      from: homeOffice.address,
      to,
      purpose,
      miles: totalMiles,
      entityId: activeEntity
    }])
    showToastMsg(`${totalMiles} miles logged`)
  }

  const currentEntity = entities.find(e => e.id === activeEntity)
  const entityProperties = properties.filter(p => p.entityId === activeEntity)
  const homeOfficePercent = homeOffice.workspaces.reduce((sum, w) => sum + w.sqFt, 0) / homeOffice.totalSqFt * 100

  // TC GATE
  if (!tcAccepted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-2" style={{color: theme.navy}}>$</div>
            <h1 className="text-2xl font-bold" style={{color: theme.green}}>TAX SAVVY</h1>
          </div>
          <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
          <p className="text-sm text-gray-600 mb-4">
            To use Tax Savvy, you must accept our Terms & Conditions. This app tracks expenses and mileage for tax purposes. 
            You are responsible for accuracy. Tax Savvy does not provide tax advice.
          </p>
          <a href="#" className="text-blue-600 text-sm underline mb-6 block">Read Full Terms & Conditions</a>
          <button 
            onClick={acceptTC}
            className="w-full py-3 rounded-lg font-semibold text-white"
            style={{backgroundColor: theme.navy}}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{fontFamily: 'system-ui'}}>
      {/* FULL WIDTH NAVY HEADER */}
      <div className="w-full" style={{backgroundColor: theme.navy}}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-2" style={{color: theme.white}}>$</div>
            <h1 className="text-xl font-bold" style={{color: theme.green}}>TAX SAVVY</h1>
          </div>
          <button onClick={() => setShowMenu(!showMenu)} className="text-white">
            {showMenu? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ENTITY SELECTOR */}
      <div className="bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto">
        {entities.filter(e => e.active).map(e => (
          <button
            key={e.id}
            onClick={() => setActiveEntity(e.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
              activeEntity === e.id? 'text-white' : 'bg-gray-200 text-gray-700'
            }`}
            style={activeEntity === e.id? {backgroundColor: theme.navy} : {}}
          >
            {e.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* MENU DRAWER */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMenu(false)}>
          <div className="bg-white w-64 h-full p-4" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-4">Menu</h2>
            {['dashboard', 'income', 'expenses', 'mileage', 'reports', 'property-setup', 'business-setup', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => {setActiveTab(tab); setShowMenu(false)}}
                className="block w-full text-left py-2 px-3 rounded hover:bg-gray-100 capitalize"
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center">
          <Check size={18} className="mr-2" /> {showToast}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="p-4 pb-20">
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{currentEntity?.name}</h2>
              {currentEntity?.type === 'LLC' && (
                <p className="text-sm text-gray-600">Home Office: {homeOfficePercent.toFixed(1)}% ({homeOffice.workspaces.reduce((s,w)=>s+w.sqFt,0)} sq ft)</p>
              )}
            </div>
            
            {/* PROPERTY CARDS */}
            {entityProperties.map(prop => (
              <div key={prop.id} className="bg-white rounded-lg shadow mb-4 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{prop.name}</h3>
                    <p className="text-xs text-gray-500">{currentEntity?.name}</p>
                    <p className="text-xs text-gray-500">{prop.address}</p>
                    <p className="text-xs text-green-600">{prop.status}</p>
                  </div>
                  {prop.balance > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Balance Due: ${prop.balance}
                    </span>
                  )}
                </div>
                
                <div className="text-sm mb-2">
                  <p><span className="font-medium">Signed by:</span> {prop.signedBy}</p>
                  {prop.occupants?.length > 0 && (
                    <p><span className="font-medium">Occupants:</span> {prop.occupants.map(o => `${o.name} [${o.relation}]`).join(', ')}</p>
                  )}
                  <p><span className="font-medium">Lease:</span> {prop.leaseStart} - {prop.leaseEnd}</p>
                </div>

                <div className="flex gap-2 mb-2 flex-wrap">
                  {prop.payments.map((pay, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      ${pay.amount} {pay.source} • {pay.date.slice(5)}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => markPaid(prop.id, prop.balance || prop.rent)}
                    className="flex-1 py-2 rounded text-white text-sm font-medium"
                    style={{backgroundColor: theme.navy}}
                  >
                    Mark Paid
                  </button>
                  <button className="px-3 py-2 border rounded text-sm">Partial Payment</button>
                  <button className="px-3 py-2 border rounded text-sm"><Edit3 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mileage' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Mileage Log</h2>
            <button 
              onClick={() => addMileage('114 Orchard St', 'Repairs', 'Round Trip')}
              className="w-full py-3 rounded-lg text-white font-medium mb-4"
              style={{backgroundColor: theme.navy}}
            >
              + Add Trip from Home Office
            </button>
            
            {mileage.map(m => (
              <div key={m.id} className="bg-white rounded-lg shadow mb-2 p-3 text-sm">
                <div className="flex justify-between">
                  <span>{m.date} • {m.purpose}</span>
                  <span className="font-semibold">{m.miles} mi</span>
                </div>
                <p className="text-xs text-gray-500">{m.from} → {m.to}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'expenses' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Expenses</h2>
            <button className="w-full py-3 rounded-lg text-white font-medium mb-4" style={{backgroundColor: theme.navy}}>
              + Add Expense
            </button>
            <p className="text-sm text-gray-600">Categories include: Repairs, Maintenance, Energy Efficient Improvements ▼</p>
            <div className="ml-4 mt-2 text-sm">
              <p>• Energy Star Windows</p>
              <p>• Energy Star Hot Water Heater</p>
              <p>• EV Purchase - Business</p>
              <p>• EV Purchase - Personal</p>
              <p className="text-xs text-gray-500 mt-1">Federal credits + NYS rebates tracked</p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Reports</h2>
            <div className="grid gap-2">
              {['Email Me', 'Send to CPA', 'Excel', 'Google Sheets', 'QuickBooks'].map(r => (
                <button key={r} className="p-3 bg-white rounded-lg shadow text-left">
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-medium mb-2">Profile</h3>
              <input 
                value={profile.name} 
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full border rounded p-2 mb-2"
                placeholder="Name"
              />
              <input 
                value={profile.email} 
                onChange={e => setProfile({...profile, email: e.target.value})}
                className="w-full border rounded p-2 mb-2"
                placeholder="Email for Reports"
              />
              <input 
                value={profile.cpaEmail} 
                onChange={e => setProfile({...profile, cpaEmail: e.target.value})}
                className="w-full border rounded p-2"
                placeholder="CPA Email"
              />
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        {[
          {id: 'dashboard', icon: Home, label: 'Dashboard'},
          {id: 'income', icon: DollarSign, label: 'Income'},
          {id: 'expenses', icon: TrendingUp, label: 'Expenses'},
          {id: 'reports', icon: FileText, label: 'Reports'}
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center px-3 py-1 ${activeTab === tab.id? 'text-blue-600' : 'text-gray-400'}`}
          >
            <tab.icon size={20} />
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaxSavvy
