'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Home, DollarSign, TrendingUp, FileText, Menu, X, Plus, Camera, MapPin, Upload, Download, Mail, Calculator, Users, Edit3, Trash2, Save, Check, ChevronDown, Building, Car, Briefcase, Shield } from 'lucide-react'

// TAX SAVVY v19 PRO FINAL - No Checkbox Demo Gate
const TaxSavvy = () => {
  const theme = { navy: '#001F3F', green: '#39FF14', white: '#FFFFFF', gray: '#F3F4F6', red: '#EF4444', blue: '#3B82F6' }
  
  const isDemo = typeof window!== 'undefined' && window.location.search.includes('demo=true')
  const [demoEmail, setDemoEmail] = useState('')
  const [demoEmailSubmitted, setDemoEmailSubmitted] = useState(false)
  const [adminSettings, setAdminSettings] = useState({ requireDemoEmail: false, captureDemoEmails: [] })
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showMenu, setShowMenu] = useState(false)
  const [tcAccepted, setTcAccepted] = useState(false)
  const [showModal, setShowModal] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [showToast, setShowToast] = useState('')
  
  const [entities, setEntities] = useState([
    { id: 1, name: isDemo? 'Sample Property LLC' : 'Cronin NY Property Management LLC', type: 'LLC', active: true },
    { id: 2, name: isDemo? 'Demo Holdings Inc' : 'MCMC PROPERTIES INC', type: 'S-Corp', active: false },
    { id: 3, name: isDemo? 'Consulting Services' : 'Basketball Officiating', type: 'Sole Prop', active: true }
  ])
  const [activeEntity, setActiveEntity] = useState(1)
  
  const [properties, setProperties] = useState([
    { 
      id: 1, name: isDemo? '123 Sample St' : '114 Orchard St', 
      address: isDemo? '123 Sample St, Demo City, NY 12345' : '114 Orchard St, Horseheads, NY 14845', 
      entityId: 1, status: 'Rented', rent: 1405, hud: 935, 
      tenant: isDemo? 'Jane Doe' : 'John Smith', 
      leaseStart: '2026-06-01', leaseEnd: '2027-05-31',
      signedBy: isDemo? 'Jane Doe' : 'John Smith', 
      occupants: isDemo? [{name: 'John Doe', relation: 'Spouse'}] : [{name: 'Jane Smith', relation: 'Spouse'}, {name: 'Timmy Smith', relation: 'Child'}],
      leaseFile: null, recurringPayers: [{name: 'Arbor Housing', amount: 935}], balance: 470,
      payments: [{date: '2026-06-01', amount: 935, source: 'HUD'}, {date: '2026-06-28', amount: 470, source: 'Tenant'}]
    }
  ])
  
  const [expenses, setExpenses] = useState([])
  const [mileage, setMileage] = useState([])
  const [capitalImprovements, setCapitalImprovements] = useState([])
  
  const [homeOffice, setHomeOffice] = useState({
    address: isDemo? '100 Demo Drive, Demo City, NY 12345' : '118 Daffodil Drive, Horseheads, NY 14845', 
    totalSqFt: 2000,
    workspaces: [{name: 'Main Office', sqFt: 200}, {name: 'Storage Room', sqFt: 100}]
  })
  
  const [profile, setProfile] = useState({
    name: isDemo? 'Demo User' : 'Mark Cronin', 
    email: isDemo? 'demo@taxsavvy.app' : 'mark@taxsavvy.app', 
    cpaEmail: '',
    mileageDefaults: isDemo? { '123 Sample St': 5 } : { '114 Orchard St': 8, 'Horseheads Village': 3 }
  })

  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0], amount: '', category: '', subcategory: '',
    propertyId: 'all', entityId: 1, description: '', receipt: null,
    federalCredit: false, nysRebate: 0, energyStar: false
  })

  const [mileageForm, setMileageForm] = useState({
    date: new Date().toISOString().split('T')[0], from: homeOffice.address, to: '',
    purpose: 'Repairs', tripType: 'Round Trip', extraMiles: 0, stops: [], entityId: 1
  })

  const [propertyForm, setPropertyForm] = useState({
    name: '', address: '', entityId: 1, rent: '', status: 'Vacant',
    tenant: '', leaseStart: '', leaseEnd: '', signedBy: '', occupants: [],
    recurringPayers: [], leaseFile: null
  })

  const energyCategories = [
    'Energy Star Windows', 'Energy Star Doors', 'Energy Star Hot Water Heater',
    'Energy Star HVAC / Heat Pump', 'Insulation', 'Solar Panels', 'Roof - Energy Efficient',
    'Electric Vehicle Charger', 'EV Purchase - Business', 'EV Purchase - Personal',
    'Hybrid Vehicle - Business', 'Hybrid Vehicle - Personal', 'Other Energy Credit'
  ]

  // LOAD ADMIN + DATA
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
      setCapitalImprovements(data.capitalImprovements || [])
      setHomeOffice(data.homeOffice || homeOffice)
      setProfile(data.profile || profile)
    }
  }, [isDemo])

  // AUTO-SAVE - Skip for demo
  useEffect(() => {
    if (isDemo) return
    const timer = setTimeout(() => {
      localStorage.setItem('taxsavvy-v19-pro', JSON.stringify({ entities, properties, expenses, mileage, capitalImprovements, homeOffice, profile }))
      localStorage.setItem('taxsavvy-admin', JSON.stringify(adminSettings))
      showToastMsg('Auto-saved')
    }, 3000)
    return () => clearTimeout(timer)
  }, [entities, properties, expenses, mileage, capitalImprovements, homeOffice, profile, adminSettings, isDemo])

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

  const markPaid = (propertyId, amount, partial = false) => {
    setProperties(properties.map(p => 
      p.id === propertyId 
    ? {...p, balance: partial? p.balance - amount : 0, 
           payments: [...p.payments, {date: new Date().toISOString().split('T')[0], amount, source: 'Tenant'}]}
        : p
    ))
    showToastMsg(`Posted $${amount} - Paid ✓`)
  }

  const saveExpense = () => {
    const isEnergyStar = energyCategories.includes(expenseForm.subcategory)
    const isCapital = ['Capital Improvement',...energyCategories].includes(expenseForm.category) || isEnergyStar
    const newExpense = {
      id: Date.now(),...expenseForm, amount: parseFloat(expenseForm.amount),
      isEnergyStar, isCapital, entityId: parseInt(expenseForm.entityId),
      propertyId: expenseForm.propertyId === 'all'? 'all' : parseInt(expenseForm.propertyId),
      federalCreditAmount: expenseForm.federalCredit? parseFloat(expenseForm.amount) * 0.3 : 0
    }
    if (isCapital) setCapitalImprovements([...capitalImprovements, newExpense])
    else setExpenses([...expenses, newExpense])
    setShowModal(null)
    setExpenseForm({...expenseForm, amount: '', description: '', receipt: null})
    showToastMsg('Expense saved')
  }

  const saveMileage = () => {
    const baseMiles = profile.mileageDefaults[mileageForm.to] || 0
    const stopsMiles = mileageForm.stops.reduce((sum, stop) => sum + parseFloat(stop.miles || 0), 0)
    const totalMiles = (mileageForm.tripType === 'Round Trip'? baseMiles * 2 : baseMiles) + parseFloat(mileageForm.extraMiles || 0) + stopsMiles
    setMileage([...mileage, { id: Date.now(),...mileageForm, miles: totalMiles, entityId: parseInt(mileageForm.entityId) }])
    setShowModal(null)
    setMileageForm({...mileageForm, to: '', extraMiles: 0, stops: []})
    showToastMsg(`${totalMiles} miles logged`)
  }

  const saveProperty = () => {
    const newProp = {
      id: editingItem || Date.now(),...propertyForm, entityId: parseInt(propertyForm.entityId),
      rent: parseFloat(propertyForm.rent || 0), balance: parseFloat(propertyForm.rent || 0), 
      payments: editingItem? properties.find(p => p.id === editingItem)?.payments || [] : []
    }
    if (editingItem) setProperties(properties.map(p => p.id === editingItem? newProp : p))
    else setProperties([...properties, newProp])
    setShowModal(null)
    setEditingItem(null)
    setPropertyForm({name: '', address: '', entityId: 1, rent: '', status: 'Vacant', tenant: '', leaseStart: '', leaseEnd: '', signedBy: '', occupants: [], recurringPayers: [], leaseFile: null})
    showToastMsg('Property saved')
  }

  const currentEntity = entities.find(e => e.id === activeEntity)
  const entityProperties = properties.filter(p => p.entityId === activeEntity)
  const homeOfficePercent = homeOffice.workspaces.reduce((sum, w) => sum + w.sqFt, 0) / homeOffice.totalSqFt * 100

  // DEMO EMAIL GATE - NO CHECKBOX
  if (isDemo && adminSettings.requireDemoEmail &&!demoEmailSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-2 font-bold" style={{color: theme.navy}}>$</div>
            <h1 className="text-2xl font-bold" style={{color: theme.green}}>TAX SAVVY</h1>
          </div>
          <h2 className="text-xl font-semibold mb-2">Try the Demo</h2>
          <p className="text-sm text-gray-600 mb-4">Enter your email to access the full demo instantly.</p>
          <input type="email" value={demoEmail} onChange={e => setDemoEmail(e.target.value)} className="w-full border rounded p-3 mb-3" placeholder="your@email.com" />
          <button onClick={submitDemoEmail} className="w-full py-3 rounded-lg font-semibold text-white mb-3" style={{backgroundColor: theme.navy}}>Enter Demo Mode</button>
          <p className="text-xs text-gray-500">By entering your email, you agree to receive occasional promotional emails and discount codes for Tax Savvy. Unsubscribe anytime.</p>
        </div>
      </div>
    )
  }

  // TC GATE
  if (!tcAccepted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-2 font-bold" style={{color: theme.navy}}>$</div>
            <h1 className="text-2xl font-bold" style={{color: theme.green}}>TAX SAVVY {isDemo && <span className="text-sm text-gray-500">DEMO</span>}</h1>
          </div>
          <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
          <p className="text-sm text-gray-600 mb-4">To use Tax Savvy, you must accept our Terms & Conditions. This app tracks expenses and mileage for tax purposes. You are responsible for accuracy. Tax Savvy does not provide tax advice.</p>
          <a href="#" className="text-blue-600 text-sm underline mb-6 block">Read Full Terms & Conditions</a>
          <button onClick={acceptTC} className="w-full py-3 rounded-lg font-semibold text-white" style={{backgroundColor: theme.navy}}>Accept & Continue</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{fontFamily: 'system-ui'}}>
      {isDemo && <div className="bg-yellow-400 text-black text-center py-1 text-sm font-medium">DEMO MODE - Sample Data Only</div>}
      
      <div className="w-full" style={{backgroundColor: theme.navy}}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div className="text-2xl font-bold mr-2" style={{color: theme.white}}>$</div>
            <h1 className="text-xl font-bold" style={{color: theme.green}}>TAX SAVVY</h1>
          </div>
          <button onClick={() => setShowMenu(!showMenu)} className="text-white"><Menu size={24} /></button>
        </div>
      </div>

      <div className="bg-white border-b px-4 py-2 flex gap-2 overflow-x-auto">
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
            {['dashboard', 'income', 'expenses', 'mileage', 'capital-improvements', 'reports', 'property-setup', 'business-setup', 'settings'].map(tab => (
              <button key={tab} onClick={() => {setActiveTab(tab); setShowMenu(false)}} className="block w-full text-left py-2 px-3 rounded hover:bg-gray-100 capitalize">{tab.replace('-', ' ')}</button>
            ))}
            {!isDemo && <button onClick={() => {setActiveTab('admin'); setShowMenu(false)}} className="block w-full text-left py-2 px-3 rounded hover:bg-gray-100 text-blue-600 mt-4"><Shield size={16} className="inline mr-2" />Admin</button>}
          </div>
        </div>
      )}

      {showToast && <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center"><Check size={18} className="mr-2" />{showToast}</div>}

      <div className="p-4 pb-20">
        {activeTab === 'dashboard' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{currentEntity?.name}</h2>
              <p className="text-sm text-gray-600">Home Office: {homeOfficePercent.toFixed(1)}% ({homeOffice.workspaces.reduce((s,w)=>s+w.sqFt,0)} / {homeOffice.totalSqFt} sq ft)</p>
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
                  {prop.occupants?.length > 0 && <p><span className="font-medium">Occupants:</span> {prop.occupants.map(o => `${o.name} [${o.relation}]`).join(', ')}</p>}
                  <p><span className="font-medium">Lease:</span> {prop.leaseStart} - {prop.leaseEnd}</p>
                </div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {prop.payments.map((pay, i) => <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">${pay.amount} {pay.source} • {pay.date.slice(5)}</span>)}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => markPaid(prop.id, prop.balance || prop.rent)} className="flex-1 py-2 rounded text-white text-sm font-medium" style={{backgroundColor: theme.navy}}>Mark Paid</button>
                  <button onClick={() => {setEditingItem(prop.id); setShowModal('partial-payment')}} className="px-3 py-2 border rounded text-sm">Partial</button>
                  <button onClick={() => {setEditingItem(prop.id); setPropertyForm(prop); setShowModal('property')}} className="px-3 py-2 border rounded text-sm"><Edit3 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'expenses' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Expenses</h2>
              <button onClick={() => setShowModal('expense')} className="px-4 py-2 rounded text-white text-sm font-medium" style={{backgroundColor: theme.navy}}><Plus size={16} className="inline mr-1" />Add</button>
            </div>
            {expenses.filter(e => e.entityId === activeEntity).map(exp => (
              <div key={exp.id} className="bg-white rounded-lg shadow mb-2 p-3 text-sm">
                <div className="flex justify-between"><span>{exp.date} • {exp.category}</span><span className="font-semibold">${exp.amount}</span></div>
                <p className="text-xs text-gray-500">{exp.description}</p>
                {exp.isEnergyStar && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mt-1 inline-block">Energy Star • Credit: ${exp.federalCreditAmount}</span>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mileage' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Mileage Log</h2>
              <button onClick={() => setShowModal('mileage')} className="px-4 py-2 rounded text-white text-sm font-medium" style={{backgroundColor: theme.navy}}><Plus size={16} className="inline mr-1" />Add Trip</button>
            </div>
            {mileage.filter(m => m.entityId === activeEntity).map(m => (
              <div key={m.id} className="bg-white rounded-lg shadow mb-2 p-3 text-sm">
                <div className="flex justify-between"><span>{m.date} • {m.purpose}</span><span className="font-semibold">{m.miles} mi</span></div>
                <p className="text-xs text-gray-500">{m.from} → {m.to}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'property-setup' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Properties</h2>
              <button onClick={() => {setEditingItem(null); setPropertyForm({name: '', address: '', entityId: activeEntity, rent: '', status: 'Vacant', tenant: '', leaseStart: '', leaseEnd: '', signedBy: '', occupants: [], recurringPayers: [], leaseFile: null}); setShowModal('property')}} className="px-4 py-2 rounded text-white text-sm font-medium" style={{backgroundColor: theme.navy}}><Plus size={16} className="inline mr-1" />Add Property</button>
            </div>
            {properties.map(p => (
              <div key={p.id} className="bg-white rounded-lg shadow mb-2 p-3">
                <div className="flex justify-between items-start">
                  <div><p className="font-medium">{p.name}</p><p className="text-xs text-gray-500">{p.address}</p></div>
                  <button onClick={() => {setEditingItem(p.id); setPropertyForm(p); setShowModal('property')}}><Edit3 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-medium mb-3">Profile</h3>
              <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full border rounded p-2 mb-2" placeholder="Name" disabled={isDemo} />
              <input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full border rounded p-2 mb-2" placeholder="Email for Reports" disabled={isDemo} />
              <input value={profile.cpaEmail} onChange={e => setProfile({...profile, cpaEmail: e.target.value})} className="w-full border rounded p-2" placeholder="CPA Email" disabled={isDemo} />
              {isDemo && <p className="text-xs text-gray-500 mt-2">Demo mode: Changes not saved</p>}
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-medium mb-3">Home Office</h3>
              <p className="text-sm mb-2">{homeOffice.address}</p>
              <p className="text-sm">Total: {homeOffice.totalSqFt} sq ft | Office: {homeOffice.workspaces.reduce((s,w)=>s+w.sqFt,0)} sq ft ({homeOfficePercent.toFixed(1)}%)</p>
            </div>
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
              <p className="text-xs text-gray-500 mb-4">ON = Users enter email before demo. OFF = Instant access. Captured emails saved for marketing.</p>
              <h4 className="font-medium text-sm mb-2">Captured Emails ({adminSettings.captureDemoEmails.length})</h4>
              <div className="max-h-40 overflow-y-auto text-xs bg-gray-50 p-2 rounded">
                {adminSettings.captureDemoEmails.map((e, i) => <div key={i} className="py-1 border-b border-gray-200">{e.email} • {e.date.slice(0,10)}</div>)}
                {adminSettings.captureDemoEmails.length === 0 && <p className="text-gray-400">No emails captured yet</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Reports</h2>
            <div className="grid gap-2">
              {['Email Me', 'Send to CPA', 'Excel', 'Google Sheets', 'QuickBooks'].map(r => (
                <button key={r} onClick={() => showToastMsg(`${r} - ${isDemo? 'Demo' : 'Exported'}`)} className="p-3 bg-white rounded-lg shadow text-left">{r}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal === 'expense' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-xl p-4 max-h- overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Add Expense</h3><X onClick={() => setShowModal(null)} /></div>
            <input type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} className="w-full border rounded p-2 mb-2" />
            <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} className="w-full border rounded p-2 mb-2" placeholder="Amount" />
            <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className="w-full border rounded p-2 mb-2">
              <option value="">Select Category</option>
              <option>Repairs</option><option>Maintenance</option><option>Utilities</option><option>Insurance</option>
              <option>Property Tax</option><option>Capital Improvement</option><option>Energy Efficient Improvements</option><option>Other</option>
            </select>
            {expenseForm.category === 'Energy Efficient Improvements' && (
              <select value={expenseForm.subcategory} onChange={e => setExpenseForm({...expenseForm, subcategory: e.target.value})} className="w-full border rounded p-2 mb-2 bg-green-50">
                <option value="">Select Energy Item</option>
                {energyCategories.map(c => <option key={c}>{c}</option>)}
              </select>
            )}
            {energyCategories.includes(expenseForm.subcategory) && (
              <div className="bg-green-50 p-3 rounded mb-2">
                <label className="flex items-center mb-2"><input type="checkbox" checked={expenseForm.federalCredit} onChange={e => setExpenseForm({...expenseForm, federalCredit: e.target.checked})} className="mr-2" />Federal Credit Eligible? (30%)</label>
                <input type="number" value={expenseForm.nysRebate} onChange={e => setExpenseForm({...expenseForm, nysRebate: e.target.value})} className="w-full border rounded p-2 mb-2" placeholder="NYS Rebate Amount" />
                <label className="flex items-center"><input type="checkbox" checked={expenseForm.energyStar} onChange={e => setExpenseForm({...expenseForm, energyStar: e.target.checked})} className="mr-2" />Energy Star Certified</label>
              </div>
            )}
            <textarea value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} className="w-full border rounded p-2 mb-2" placeholder="Description" rows={2} />
            <select value={expenseForm.propertyId} onChange={e => setExpenseForm({...expenseForm, propertyId: e.target.value})} className="w-full border rounded p-2 mb-4">
              <option value="all">All Properties</option>
              {properties.filter(p => p.entityId === activeEntity).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button onClick={saveExpense} className="w-full py-3 rounded text-white font-medium" style={{backgroundColor: theme.navy}}>Save Expense</button>
          </div>
        </div>
      )}

      {showModal === 'mileage' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-xl p-4 max-h- overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Add Mileage</h3><X onClick={() => setShowModal(null)} /></div>
            <input type="date" value={mileageForm.date} onChange={e => setMileageForm({...mileageForm, date: e.target.value})} className="w-full border rounded p-2 mb-2" />
            <input value={mileageForm.from} readOnly className="w-full border rounded p-2 mb-2 bg-gray-100" />
            <select value={mileageForm.to} onChange={e => setMileageForm({...mileageForm, to: e.target.value})} className="w-full border rounded p-2 mb-2">
              <option value="">Select Destination</option>
              {properties.filter(p => p.entityId === activeEntity).map(p => <option key={p.id} value={p.name}>{p.name} ({profile.mileageDefaults[p.name] || 0} mi)</option>)}
            </select>
            <select value={mileageForm.purpose} onChange={e => setMileageForm({...mileageForm, purpose: e.target.value})} className="w-full border rounded p-2 mb-2">
              <option>Repairs</option><option>Maintenance</option><option>Tenant Meeting</option><option>Supplies</option><option>Banking</option><option>Other</option>
            </select>
            <select value={mileageForm.tripType} onChange={e => setMileageForm({...mileageForm, tripType: e.target.value})} className="w-full border rounded p-2 mb-2">
              <option>Round Trip</option><option>One Way</option>
            </select>
            <input type="number" value={mileageForm.extraMiles} onChange={e => setMileageForm({...mileageForm, extraMiles: e.target.value})} className="w-full border rounded p-2 mb-4" placeholder="Extra miles (detours)" />
            <button onClick={saveMileage} className="w-full py-3 rounded text-white font-medium" style={{backgroundColor: theme.navy}}>Save Mileage</button>
          </div>
        </div>
      )}

      {showModal === 'property' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-xl p-4 max-h- overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg
