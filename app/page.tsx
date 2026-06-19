'use client'
import React, { useState, useEffect } from 'react'
import { Home, DollarSign, TrendingUp, FileText, Menu, X, Plus, Camera, MapPin, Upload, Download, Mail, Calculator, Users, Edit3, Trash2, Save, Check, ChevronDown, Building, Car, Briefcase, Shield } from 'lucide-react'

// TAX SAVVY v19 PRO - 100% INLINE STYLES - NO TAILWIND - BRAND LOCKED
const TaxSavvy = () => {
  const theme = { navy: '#001F3F', green: '#39FF14', white: '#FFFFFF', black: '#000000' }
  
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
    mileageDefaults: isDemo? { '123 Sample St': 5 } : { '114 Orchard St': 8, 'Horseheads Village': 3, 'Lowe\'s': 4, 'Bank': 2, 'Home Depot': 5 }
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
    name: '', address: '', entityId: 1, rent: '', hud: '', status: 'Vacant',
    tenant: '', leaseStart: '', leaseEnd: '', signedBy: '', occupants: [],
    recurringPayers: [], leaseFile: null
  })

  const [partialPayment, setPartialPayment] = useState({ amount: '', source: 'Tenant' })

  const energyCategories = [
    'Energy Star Windows', 'Energy Star Doors', 'Energy Star Hot Water Heater',
    'Energy Star HVAC / Heat Pump', 'Insulation', 'Solar Panels', 'Roof - Energy Efficient',
    'Electric Vehicle Charger', 'EV Purchase - Business', 'EV Purchase - Personal',
    'Hybrid Vehicle - Business', 'Hybrid Vehicle - Personal', 'Other Energy Credit'
  ]

  const expenseCategories = ['Repairs', 'Maintenance', 'Utilities', 'Insurance', 'Property Tax', 'Capital Improvement', 'Energy Efficient Improvements', 'Legal/Professional', 'Supplies', 'Other']
  const tripPurposes = ['Repairs', 'Maintenance', 'Tenant Meeting', 'Supplies', 'Banking', 'Property Showing', 'Inspection', 'Other']

  // STYLES - REUSABLE INLINE OBJECTS
  const styles = {
    page: { minHeight: '100vh', backgroundColor: theme.navy, color: theme.white, fontFamily: 'system-ui', fontSize: '16px' },
    header: { backgroundColor: theme.navy, borderBottom: `2px solid ${theme.green}`, padding: '12px 16px' },
    logo: { display: 'flex', alignItems: 'center' },
    dollar: { fontSize: '40px', fontWeight: '900', color: theme.white, marginRight: '8px', lineHeight: '1' },
    brand: { fontSize: '28px', fontWeight: '900', color: theme.green, letterSpacing: '-1px' },
    btn: { backgroundColor: theme.green, color: theme.navy, border: 'none', borderRadius: '8px', padding: '12px 20px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
    btnSecondary: { backgroundColor: 'transparent', color: theme.green, border: `2px solid ${theme.green}`, borderRadius: '8px', padding: '10px 18px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
    card: { backgroundColor: '#002855', border: `1px solid ${theme.green}`, borderRadius: '8px', padding: '16px', marginBottom: '16px' },
    input: { width: '100%', backgroundColor: '#001428', border: `1px solid ${theme.green}`, borderRadius: '6px', padding: '12px', color: theme.white, fontSize: '16px', marginBottom: '12px' },
    label: { color: theme.green, fontSize: '14px', fontWeight: '600', marginBottom: '6px', display: 'block' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' },
    modalContent: { backgroundColor: theme.navy, border: `2px solid ${theme.green}`, borderRadius: '12px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' },
    tab: { padding: '12px', textAlign: 'center', cursor: 'pointer', borderTop: `2px solid transparent` },
    tabActive: { borderTop: `2px solid ${theme.green}`, color: theme.green }
  }

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
    const updated = {...adminSettings, captureDemoEmails: [...adminSettings.captureDemoEmails, {email: demoEmail, date: new Date().toISOString()}]}
    setAdminSettings(updated)
    localStorage.setItem('taxsavvy-admin', JSON.stringify(updated))
  }

  const markPaid = (propertyId, amount, source = 'Tenant') => {
    setProperties(properties.map(p => 
      p.id === propertyId 
       ? {...p, balance: Math.max(0, p.balance - amount), payments: [...p.payments, {date: new Date().toISOString().split('T')[0], amount, source}]}
        : p
    ))
    showToastMsg(`Posted $${amount} - Paid ✓`)
    setShowModal(null)
    setPartialPayment({ amount: '', source: 'Tenant' })
  }

  const saveExpense = () => {
    if (!expenseForm.amount ||!expenseForm.category) { showToastMsg('Enter amount and category'); return }
    const isEnergyStar = energyCategories.includes(expenseForm.subcategory)
    const isCapital = ['Capital Improvement',...energyCategories].includes(expenseForm.category) || isEnergyStar
    const newExpense = {
      id: Date.now(),...expenseForm, amount: parseFloat(expenseForm.amount),
      isEnergyStar, isCapital, entityId: parseInt(expenseForm.entityId),
      propertyId: expenseForm.propertyId === 'all'? 'all' : parseInt(expenseForm.propertyId),
      federalCreditAmount: expenseForm.federalCredit? parseFloat(expenseForm.amount) * 0.3 : 0,
      nysRebateAmount: parseFloat(expenseForm.nysRebate || 0)
    }
    if (isCapital) setCapitalImprovements([...capitalImprovements, newExpense])
    else setExpenses([...expenses, newExpense])
    setShowModal(null)
    setExpenseForm({...expenseForm, amount: '', description: '', receipt: null, nysRebate: 0, subcategory: '', federalCredit: false, energyStar: false})
    showToastMsg('Expense saved')
  }

  const saveMileage = () => {
    if (!mileageForm.to) { showToastMsg('Select destination'); return }
    const baseMiles = profile.mileageDefaults[mileageForm.to] || 0
    const stopsMiles = mileageForm.stops.reduce((sum, stop) => sum + parseFloat(stop.miles || 0), 0)
    const totalMiles = (mileageForm.tripType === 'Round Trip'? baseMiles * 2 : baseMiles) + parseFloat(mileageForm.extraMiles || 0) + stopsMiles
    setMileage([...mileage, { id: Date.now(),...mileageForm, miles: totalMiles, entityId: parseInt(mileageForm.entityId) }])
    setShowModal(null)
    setMileageForm({...mileageForm, to: '', extraMiles: 0, stops: []})
    showToastMsg(`${totalMiles} miles logged`)
  }

  const saveProperty = () => {
    if (!propertyForm.name ||!propertyForm.address) { showToastMsg('Enter name and address'); return }
    const newProp = {
      id: editingItem || Date.now(),...propertyForm, entityId: parseInt(propertyForm.entityId),
      rent: parseFloat(propertyForm.rent || 0), hud: parseFloat(propertyForm.hud || 0),
      balance: editingItem? properties.find(p => p.id === editingItem)?.balance || parseFloat(propertyForm.rent || 0) : parseFloat(propertyForm.rent || 0), 
      payments: editingItem? properties.find(p => p.id === editingItem)?.payments || [] : []
    }
    if (editingItem) setProperties(properties.map(p => p.id === editingItem? newProp : p))
    else setProperties([...properties, newProp])
    setShowModal(null)
    setEditingItem(null)
    setPropertyForm({name: '', address: '', entityId: 1, rent: '', hud: '', status: 'Vacant', tenant: '', leaseStart: '', leaseEnd: '', signedBy: '', occupants: [], recurringPayers: [], leaseFile: null})
    showToastMsg('Property saved')
  }

  const deleteExpense = (id, isCapital = false) => {
    if (confirm('Delete this expense?')) {
      if (isCapital) setCapitalImprovements(capitalImprovements.filter(e => e.id!== id))
      else setExpenses(expenses.filter(e => e.id!== id))
      showToastMsg('Expense deleted')
    }
  }

  const deleteMileage = (id) => {
    if (confirm('Delete this mileage entry?')) {
      setMileage(mileage.filter(m => m.id!== id))
      showToastMsg('Mileage deleted')
    }
  }

  const deleteProperty = (id) => {
    if (confirm('Delete this property? This cannot be undone.')) {
      setProperties(properties.filter(p => p.id!== id))
      showToastMsg('Property deleted')
    }
  }

  const exportExcel = () => { showToastMsg('Excel export - Connect API in production') }
  const exportGoogleSheets = () => { showToastMsg('Google Sheets - Connect API in production') }
  const exportQuickBooks = () => { showToastMsg('QuickBooks - Connect API in production') }
  const emailReport = () => { showToastMsg(`Emailed to ${profile.email}`) }
  const emailCPA = () => { 
    if (!profile.cpaEmail) { showToastMsg('Add CPA email in Settings'); return }
    showToastMsg(`Sent to ${profile.cpaEmail}`) 
  }

  const currentEntity = entities.find(e => e.id === activeEntity)
  const entityProperties = properties.filter(p => p.entityId === activeEntity)
  const entityExpenses = expenses.filter(e => e.entityId === activeEntity)
  const entityMileage = mileage.filter(m => m.entityId === activeEntity)
  const entityCapital = capitalImprovements.filter(c => c.entityId === activeEntity)
  const homeOfficePercent = homeOffice.workspaces.reduce((sum, w) => sum + w.sqFt, 0) / homeOffice.totalSqFt * 100

  // DEMO EMAIL GATE
  if (isDemo && adminSettings.requireDemoEmail &&!demoEmailSubmitted) {
    return (
      <div style={{...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'}}>
        <div style={{...styles.card, maxWidth: '400px', width: '100%'}}>
  <div style={styles.logo}>
  <div style={{marginRight:'8px',lineHeight:'1',cursor:'pointer'}} onClick={() => setActiveTab('dashboard')}>
    <svg width="40" height="40" viewBox="0 0 40 40" style={{display:'block'}}>
      <defs>
        <clipPath id="dollarClipA">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="36" fontWeight="900" fontFamily="system-ui">$</text>
        </clipPath>
      </defs>
      <rect width="40" height="40" fill="#39FF14" clipPath="url(#dollarClipA)" />
      <rect width="40" height="40" fill="#EF4444" clipPath="url(#dollarClipA)" transform="rotate(45 20 20) translate(20,-20)" />
    </svg>
  </div>
  <h1 style={{...styles.brand, margin:0}}>TaxSavvy</h1>
</div>
          <h2 style={{fontSize: '20px', fontWeight: '600', color: theme.green, margin: '16px 0'}}>Try the Demo</h2>
          <p style={{fontSize: '14px', color: theme.white, marginBottom: '16px'}}>Enter your email to access the full demo instantly.</p>
          <input type="email" value={demoEmail} onChange={e => setDemoEmail(e.target.value)} style={styles.input} placeholder="your@email.com" />
          <button onClick={submitDemoEmail} style={{...styles.btn, width: '100%', marginBottom: '12px'}}>Enter Demo Mode</button>
          <p style={{fontSize: '12px', color: '#9CA3AF'}}>By entering your email, you agree to receive occasional promotional emails and discount codes for TaxSavvy. Unsubscribe anytime.</p>
        </div>
      </div>
    )
  }

  // TC GATE - NAVY + GREEN
  if (!tcAccepted) {
    return (
      <div style={{...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'}}>
        <div style={{...styles.card, maxWidth: '400px', width: '100%'}}>
  <div onClick={() => setActiveTab('dashboard')} style={{display:'flex',alignItems:'center',cursor:'pointer'}}>
  <div style={{marginRight:'8px',lineHeight:'1'}}>
    <svg width="40" height="40" viewBox="0 0 40 40" style={{display:'block'}}>
      <defs>
        <clipPath id="dollarClipB">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="36" fontWeight="900" fontFamily="system-ui">$</text>
        </clipPath>
      </defs>
      <rect width="40" height="40" fill="#39FF14" clipPath="url(#dollarClipB)" />
      <rect width="40" height="40" fill="#EF4444" clipPath="url(#dollarClipB)" transform="rotate(45 20 20) translate(20,-20)" />
    </svg>
  </div>
  <h1 style={{...styles.brand, margin:0}}>TaxSavvy {isDemo && <span style={{fontSize:'14px', color:theme.white}}>DEMO</span>}</h1>
</div>
          <h2 style={{fontSize: '20px', fontWeight: '600', color: theme.green, margin: '16px 0'}}>Terms & Conditions</h2>
          <p style={{fontSize: '14px', color: theme.white, marginBottom: '16px', lineHeight: '1.5'}}>TaxSavvy tracks expenses and mileage for tax purposes. You are responsible for accuracy. TaxSavvy does not provide tax advice.</p>
          <a href="#" style={{color: theme.green, fontSize: '14px', textDecoration: 'underline', marginBottom: '24px', display: 'block'}}>Read Full Terms & Conditions</a>
          <button onClick={acceptTC} style={{...styles.btn, width: '100%'}}>Accept Full Terms & Conditions</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      {isDemo && <div style={{backgroundColor: '#FBBF24', color: theme.black, textAlign: 'center', padding: '4px', fontSize: '14px', fontWeight: '500'}}>DEMO MODE - Sample Data Only</div>}
      
      <div style={styles.header}>
        <div style={{maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
    <div onClick={() => setActiveTab('dashboard')} style={{display:'flex',alignItems:'center',cursor:'pointer'}}>
  <div style={{marginRight:'8px',lineHeight:'1'}}>
    <svg width="40" height="40" viewBox="0 0 40 40" style={{display:'block'}}>
      <defs>
        <clipPath id="dollarClipC">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="36" fontWeight="900" fontFamily="system-ui">$</text>
        </clipPath>
      </defs>
      <rect width="40" height="40" fill="#39FF14" clipPath="url(#dollarClipC)" />
      <rect width="40" height="40" fill="#EF4444" clipPath="url(#dollarClipC)" transform="rotate(45 20 20) translate(20,-20)" />
    </svg>
  </div>
  <h1 style={{...styles.brand, margin:0}}>TaxSavvy</h1>
</div>
          <button onClick={() => setShowMenu(!showMenu)} style={{background: 'none', border: 'none', color: theme.white, cursor: 'pointer'}}><Menu size={28} /></button>
        </div>
      </div>

      <div style={{backgroundColor: '#002855', borderBottom: `1px solid ${theme.green}`, padding: '8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: '1280px', margin: '0 auto'}}>
        {entities.filter(e => e.active).map(e => (
          <button key={e.id} onClick={() => setActiveEntity(e.id)}
            style={{
              padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
              backgroundColor: activeEntity === e.id? theme.green : '#001428',
              color: activeEntity === e.id? theme.navy : theme.white
            }}>{e.name.split(' ')[0]}</button>
        ))}
      </div>

      {showMenu && (
        <div style={{...styles.modal, justifyContent: 'flex-start'}} onClick={() => setShowMenu(false)}>
          <div style={{...styles.modalContent, maxWidth: '256px', height: '100%', borderRadius: 0}} onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h2 style={{fontWeight: 'bold', fontSize: '18px', color: theme.green}}>Menu</h2>
              <X size={20} onClick={() => setShowMenu(false)} style={{cursor: 'pointer', color: theme.white}} />
            </div>
            {['dashboard', 'income', 'expenses', 'mileage', 'capital-improvements', 'reports', 'property-setup', 'business-setup', 'settings'].map(tab => (
              <button key={tab} onClick={() => {setActiveTab(tab); setShowMenu(false)}} style={{display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '6px', background: 'none', border: 'none', color: theme.white, cursor: 'pointer', textTransform: 'capitalize', fontSize: '16px'}}>{tab.replace('-', ' ')}</button>
            ))}
            {!isDemo && <button onClick={() => {setActiveTab('admin'); setShowMenu(false)}} style={{display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '6px', background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', marginTop: '16px', fontSize: '16px'}}><Shield size={16} style={{display: 'inline', marginRight: '8px'}} />Admin</button>}
          </div>
        </div>
      )}

      {showToast && <div style={{position: 'fixed', top: '80px', right: '16px', backgroundColor: '#059669', color: theme.white, padding: '8px 16px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', zIndex: 50, display: 'flex', alignItems: 'center', fontSize: '16px'}}><Check size={18} style={{marginRight: '8px'}} />{showToast}</div>}

      <div style={{padding: '16px', paddingBottom: '80px', maxWidth: '1280px', margin: '0 auto'}}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{marginBottom: '16px'}}>
              <h2 style={{fontSize: '18px', fontWeight: '600', color: theme.green}}>{currentEntity?.name}</h2>
              <p style={{fontSize: '14px', color: '#9CA3AF'}}>Home Office: {homeOfficePercent.toFixed(1)}% ({homeOffice.workspaces.reduce((s,w)=>s+w.sqFt,0)} / {homeOffice.totalSqFt} sq ft)</p>
            </div>
            {entityProperties.map(prop => (
              <div key={prop.id} style={styles.card}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                  <div>
                    <h3 style={{fontWeight: '600', color: theme.green, fontSize: '18px'}}>{prop.name}</h3>
                    <p style={{fontSize: '12px', color: '#9CA3AF'}}>{prop.address}</p>
                    <p style={{fontSize: '12px', color: theme.green}}>{prop.status} • ${prop.rent}/mo {prop.hud > 0 && `• HUD: $${prop.hud}`}</p>
                  </div>
                  {prop.balance > 0 && <span style={{backgroundColor: '#DC2626', color: theme.white, fontSize: '12px', padding: '4px 8px', borderRadius: '20px'}}>Balance Due: ${prop.balance}</span>}
                </div>
                <div style={{fontSize: '14px', marginBottom: '8px'}}>
                  <p><span style={{fontWeight: '500', color: theme.green}}>Signed by:</span> {prop.signedBy}</p>
                  {prop.occupants?.length > 0 && <p><span style={{fontWeight: '500', color: theme.green}}>Occupants:</span> {prop.occupants.map(o => `${o.name} [${o.relation}]`).join(', ')}</p>}
                  <p><span style={{fontWeight: '500', color: theme.green}}>Lease:</span> {prop.leaseStart} - {prop.leaseEnd}</p>
                  {prop.recurringPayers?.length > 0 && <p><span style={{fontWeight: '500', color: theme.green}}>HUD/Recurring:</span> {prop.recurringPayers.map(r => `${r.name} $${r.amount}`).join(', ')}</p>}
                </div>
                <div style={{display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap'}}>
                  {prop.payments.map((pay, i) => <span key={i} style={{fontSize: '12px', backgroundColor: '#001428', padding: '4px 8px', borderRadius: '4px', color: theme.white}}>${pay.amount} {pay.source} • {pay.date.slice(5)}</span>)}
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button onClick={() => markPaid(prop.id, prop.balance || prop.rent)} style={{...styles.btn, flex: 1}}>Mark Paid</button>
                  <button onClick={() => {setEditingItem(prop.id); setShowModal('partial-payment')}} style={styles.btnSecondary}>Partial</button>
                  <button onClick={() => {setEditingItem(prop.id); setPropertyForm(prop); setShowModal('property')}} style={{...styles.btnSecondary, padding: '12px'}}><Edit3 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'expenses' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h2 style={{fontSize: '18px', fontWeight: '600', color: theme.green}}>Expenses</h2>
              <button onClick={() => setShowModal('expense')} style={styles.btn}><Plus size={16} style={{display: 'inline', marginRight: '4px'}} />Add</button>
            </div>
            <div style={styles.card}>
              <p style={{fontSize: '14px', color: '#9CA3AF'}}>Total This Year</p>
              <p style={{fontSize: '32px', fontWeight: 'bold', color: theme.green}}>${entityExpenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}</p>
            </div>
            {entityExpenses.map(exp => (
              <div key={exp.id} style={styles.card}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                      <span style={{fontSize: '14px'}}>{exp.date} • {exp.category}</span>
                      <span style={{fontWeight: '600', color: theme.green}}>${exp.amount}</span>
                    </div>
                    <p style={{fontSize: '12px', color: '#9CA3AF'}}>{exp.description}</p>
                    {exp.isEnergyStar && <span style={{fontSize: '12px', backgroundColor: '#059669', color: theme.white, padding: '2px 8px', borderRadius: '4px', marginTop: '4px', display: 'inline-block'}}>Energy Star • Federal: ${exp.federalCreditAmount} • NYS: ${exp.nysRebateAmount}</span>}
                  </div>
                  <button onClick={() => deleteExpense(exp.id)} style={{marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer'}}><Trash2 size={16} style={{color: '#DC2626'}} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'mileage' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h2 style={{fontSize: '18px', fontWeight: '600', color: theme.green}}>Mileage Log</h2>
              <button onClick={() => setShowModal('mileage')} style={styles.btn}><Plus size={16} style={{display: 'inline', marginRight: '4px'}} />Add Trip</button>
            </div>
            <div style={styles.card}>
              <p style={{fontSize: '14px', color: '#9CA3AF'}}>Total Miles This Year</p>
              <p style={{fontSize: '32px', fontWeight: 'bold', color: theme.green}}>{entityMileage.reduce((s, m) => s + m.miles, 0)} mi</p>
              <p style={{fontSize: '12px', color: '#9CA3AF'}}>Deduction: ${(entityMileage.reduce((s, m) => s + m.miles, 0) * 0.67).toFixed(2)} @ $0.67/mi</p>
            </div>
            {entityMileage.map(m => (
              <div key={m.id} style={styles.card}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                      <span style={{fontSize: '14px'}}>{m.date} • {m.purpose}</span>
                      <span style={{fontWeight: '600', color: theme.green}}>{m.miles} mi</span>
                    </div>
                    <p style={{fontSize: '12px', color: '#9CA3AF'}}>{m.from} → {m.to}</p>
                    {m.stops?.length > 0 && <p style={{fontSize: '12px', color: '#6B7280'}}>Stops: {m.stops.map(s => s.location).join(', ')}</p>}
                  </div>
                  <button onClick={() => deleteMileage(m.id)} style={{marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer'}}><Trash2 size={16} style={{color: '#DC2626'}} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'capital-improvements' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h2 style={{fontSize: '18px', fontWeight: '600', color: theme.green}}>Capital Improvements</h2>
              <button onClick={() => {setExpenseForm({...expenseForm, category: 'Capital Improvement'}); setShowModal('expense')}} style={styles.btn}><Plus size={16} style={{display: 'inline', marginRight: '4px'}} />Add</button>
            </div>
            <div style={styles.card}>
              <p style={{fontSize: '14px', color: '#9CA3AF'}}>Total Capital Improvements</p>
              <p
              <p style={{fontSize: '32px', fontWeight: 'bold', color: theme.green}}>${entityCapital.reduce((s, c) => s + c.amount, 0).toFixed(2)}</p>
              <p style={{fontSize: '12px', color: '#9CA3AF'}}>Energy Credits: ${entityCapital.reduce((s, c) => s + c.federalCreditAmount + c.nysRebateAmount, 0).toFixed(2)}</p>
            </div>
            {entityCapital.map(cap => (
              <div key={cap.id} style={styles.card}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                      <span style={{fontSize: '14px'}}>{cap.date} • {cap.subcategory || cap.category}</span>
                      <span style={{fontWeight: '600', color: theme.green}}>${cap.amount}</span>
                    </div>
                    <p style={{fontSize: '12px', color: '#9CA3AF'}}>{cap.description}</p>
                    {cap.isEnergyStar && <span style={{fontSize: '12px', backgroundColor: '#059669', color: theme.white, padding: '2px 8px', borderRadius: '4px', marginTop: '4px', display: 'inline-block'}}>Energy Star • Federal: ${cap.federalCreditAmount} • NYS: ${cap.nysRebateAmount}</span>}
                  </div>
                  <button onClick={() => deleteExpense(cap.id, true)} style={{marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer'}}><Trash2 size={16} style={{color: '#DC2626'}} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'income' && (
          <div>
            <h2 style={{fontSize: '18px', fontWeight: '600', color: theme.green, marginBottom: '16px'}}>Income</h2>
            <div style={styles.card}>
              <h3 style={{fontWeight: '500', marginBottom: '8px', color: theme.green}}>This Month</h3>
              <p style={{fontSize: '32px', fontWeight: 'bold', color: theme.green}}>${entityProperties.reduce((sum, p) => sum + p.payments.reduce((s, pay) => s + pay.amount, 0), 0)}</p>
              <p style={{fontSize: '14px', color: '#9CA3AF'}}>Total Collected</p>
            </div>
            {entityProperties.map(prop => (
              <div key={prop.id} style={styles.card}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                  <span>{prop.name}</span>
                  <span style={{fontWeight: '600', color: theme.green}}>${prop.payments.reduce((s, p) => s + p.amount, 0)} / ${prop.rent}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 style={{fontSize: '18px', fontWeight: '600', color: theme.green, marginBottom: '16px'}}>Reports & Export</h2>
            <div style={{display: 'grid', gap: '8px'}}>
              <button onClick={emailReport} style={{...styles.card, textAlign: 'left', display: 'flex', alignItems: 'center', cursor: 'pointer'}}><Mail size={18} style={{marginRight: '8px', color: theme.green}} />Email Me Report</button>
              <button onClick={emailCPA} style={{...styles.card, textAlign: 'left', display: 'flex', alignItems: 'center', cursor: 'pointer'}}><Mail size={18} style={{marginRight: '8px', color: theme.green}} />Send to CPA</button>
              <button onClick={exportExcel} style={{...styles.card, textAlign: 'left', display: 'flex', alignItems: 'center', cursor: 'pointer'}}><Download size={18} style={{marginRight: '8px', color: theme.green}} />Export to Excel</button>
              <button onClick={exportGoogleSheets} style={{...styles.card, textAlign: 'left', display: 'flex', alignItems: 'center', cursor: 'pointer'}}><Download size={18} style={{marginRight: '8px', color: theme.green}} />Export to Google Sheets</button>
              <button onClick={exportQuickBooks} style={{...styles.card, textAlign: 'left', display: 'flex', alignItems: 'center', cursor: 'pointer'}}><Download size={18} style={{marginRight: '8px', color: theme.green}} />Export to QuickBooks</button>
            </div>
            {/* SMALL LOGO ON EVERY REPORT PAGE */}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '32px', opacity: '0.6'}}>
              <svg width="20" height="20" viewBox="0 0 40 40" style={{marginRight: '6px'}}>
                <defs>
                  <clipPath id="reportDollarClip">
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="36" fontWeight="900" fontFamily="system-ui">$</text>
                  </clipPath>
                </defs>
                <rect width="40" height="40" fill="#39FF14" clipPath="url(#reportDollarClip)" />
                <rect width="40" height="40" fill="#EF4444" clipPath="url(#reportDollarClip)" transform="rotate(45 20 20) translate(20, -20)" />
              </svg>
              <span style={{fontSize: '12px', color: theme.green, fontWeight: '600'}}>TaxSavvy</span>
            </div>
          </div>
        )}

        {activeTab === 'property-setup' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h2 style={{fontSize: '18px', fontWeight: '600', color: theme.green}}>Properties</h2>
              <button onClick={() => {setEditingItem(null); setPropertyForm({name: '', address: '', entityId: activeEntity, rent: '', hud: '', status: 'Vacant', tenant: '', leaseStart: '', leaseEnd: '', signedBy: '', occupants: [], recurringPayers: [], leaseFile: null}); setShowModal('property')}} style={styles.btn}><Plus size={16} style={{display: 'inline', marginRight: '4px'}} />Add Property</button>
            </div>
            {properties.map(p => (
              <div key={p.id} style={styles.card}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div>
                    <p style={{fontWeight: '500', color: theme.green}}>{p.name}</p>
                    <p style={{fontSize: '12px', color: '#9CA3AF'}}>{p.address}</p>
                    <p style={{fontSize: '12px', color: theme.green}}>{p.status} • ${p.rent}/mo</p>
                  </div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button onClick={() => {setEditingItem(p.id); setPropertyForm(p); setShowModal('property')}} style={{background: 'none', border: 'none', cursor: 'pointer'}}><Edit3 size={16} style={{color: theme.green}} /></button>
                    <button onClick={() => deleteProperty(p.id)} style={{background: 'none', border: 'none', cursor: 'pointer'}}><Trash2 size={16} style={{color: '#DC2626'}} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'business-setup' && (
          <div>
            <h2 style={{fontSize: '18px', fontWeight: '600', color: theme.green, marginBottom: '16px'}}>Business Entities</h2>
            {entities.map(e => (
              <div key={e.id} style={{...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <p style={{fontWeight: '500', color: theme.green}}>{e.name}</p>
                  <p style={{fontSize: '12px', color: '#9CA3AF'}}>{e.type}</p>
                </div>
                <input type="checkbox" checked={e.active} onChange={() => setEntities(entities.map(ent => ent.id === e.id? {...ent, active:!ent.active} : ent))} style={{width: '20px', height: '20px', accentColor: theme.green}} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 style={{fontSize: '18px', fontWeight: '600', color: theme.green, marginBottom: '16px'}}>Settings</h2>
            <div style={styles.card}>
              <h3 style={{fontWeight: '500', marginBottom: '12px', color: theme.green}}>Profile</h3>
              <label style={styles.label}>Name</label>
              <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} style={styles.input} disabled={isDemo} />
              <label style={styles.label}>Email for Reports</label>
              <input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} style={styles.input} disabled={isDemo} />
              <label style={styles.label}>CPA Email</label>
              <input value={profile.cpaEmail} onChange={e => setProfile({...profile, cpaEmail: e.target.value})} style={styles.input} disabled={isDemo} />
              {isDemo && <p style={{fontSize: '12px', color: '#9CA3AF', marginTop: '8px'}}>Demo mode: Changes not saved</p>}
            </div>
            <div style={styles.card}>
              <h3 style={{fontWeight: '500', marginBottom: '12px', color: theme.green}}>Home Office</h3>
              <p style={{fontSize: '14px', marginBottom: '8px'}}>{homeOffice.address}</p>
              <p style={{fontSize: '14px'}}>Total: {homeOffice.totalSqFt} sq ft | Office: {homeOffice.workspaces.reduce((s,w)=>s+w.sqFt,0)} sq ft ({homeOfficePercent.toFixed(1)}%)</p>
              {homeOffice.workspaces.map((w, i) => (
                <p key={i} style={{fontSize: '12px', color: '#9CA3AF', marginLeft: '8px'}}>• {w.name}: {w.sqFt} sq ft</p>
              ))}
            </div>
            <div style={styles.card}>
              <h3 style={{fontWeight: '500', marginBottom: '12px', color: theme.green}}>Mileage Defaults</h3>
              {Object.entries(profile.mileageDefaults).map(([loc, mi]) => (
                <div key={loc} style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '4px 0'}}><span>{loc}</span><span style={{color: theme.green}}>{mi} mi</span></div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admin' &&!isDemo && (
          <div>
            <h2 style={{fontSize: '18px', fontWeight: '600', color: theme.green, marginBottom: '16px'}}>Admin Settings</h2>
            <div style={styles.card}>
              <h3 style={{fontWeight: '500', marginBottom: '12px', color: theme.green}}>Demo Settings</h3>
              <label style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
                <span style={{fontSize: '14px'}}>Require Email for Demo Access</span>
                <input type="checkbox" checked={adminSettings.requireDemoEmail} onChange={e => setAdminSettings({...adminSettings, requireDemoEmail: e.target.checked})} style={{width: '20px', height: '20px', accentColor: theme.green}} />
              </label>
              <p style={{fontSize: '12px', color: '#9CA3AF', marginBottom: '16px'}}>ON = Users enter email before demo. OFF = Instant access.</p>
              <h4 style={{fontWeight: '500', fontSize: '14px', marginBottom: '8px', color: theme.green}}>Captured Emails ({adminSettings.captureDemoEmails.length})</h4>
              <div style={{maxHeight: '160px', overflowY: 'auto', fontSize: '12px', backgroundColor: '#001428', padding: '8px', borderRadius: '6px'}}>
                {adminSettings.captureDemoEmails.map((e, i) => <div key={i} style={{padding: '4px 0', borderBottom: '1px solid #002855'}}>{e.email} • {e.date.slice(0,10)}</div>)}
                {adminSettings.captureDemoEmails.length === 0 && <p style={{color: '#6B7280'}}>No emails captured yet</p>}
              </div>
              {adminSettings.captureDemoEmails.length > 0 && (
                <button onClick={() => {
                  const csv = 'Email,Date\n' + adminSettings.captureDemoEmails.map(e => `${e.email},${e.date}`).join('\n')
                  const blob = new Blob([csv], {type: 'text/csv'})
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'demo-emails.csv'
                  a.click()
                }} style={{marginTop: '8px', fontSize: '14px', color: '#3B82F6', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer'}}>Download CSV</button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showModal === 'partial-payment' && (
        <div style={styles.modal} onClick={() => setShowModal(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{fontWeight: 'bold', fontSize: '18px', marginBottom: '16px', color: theme.green}}>Partial Payment</h3>
            <label style={styles.label}>Amount</label>
            <input type="number" value={partialPayment.amount} onChange={e => setPartialPayment({...partialPayment, amount: e.target.value})} style={styles.input} placeholder="Amount" />
            <label style={styles.label}>Source</label>
            <select value={partialPayment.source} onChange={e => setPartialPayment({...partialPayment, source: e.target.value})} style={styles.input}>
              <option>Tenant</option>
              <option>HUD</option>
              <option>Other</option>
            </select>
            <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
              <button onClick={() => setShowModal(null)} style={{...styles.btnSecondary, flex: 1}}>Cancel</button>
              <button onClick={() => markPaid(editingItem, parseFloat(partialPayment.amount), partialPayment.source)} style={{...styles.btn, flex: 1}}>Post Payment</button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'property' && (
        <div style={styles.modal} onClick={() => setShowModal(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{fontWeight: 'bold', fontSize: '18px', marginBottom: '16px', color: theme.green}}>{editingItem? 'Edit' : 'Add'} Property</h3>
            <label style={styles.label}>Property Name</label>
            <input value={propertyForm.name} onChange={e => setPropertyForm({...propertyForm, name: e.target.value})} style={styles.input} placeholder="Property Name" />
            <label style={styles.label}>Address</label>
            <input value={propertyForm.address} onChange={e => setPropertyForm({...propertyForm, address: e.target.value})} style={styles.input} placeholder="Address" />
            <label style={styles.label}>Entity</label>
            <select value={propertyForm.entityId} onChange={e => setPropertyForm({...propertyForm, entityId: e.target.value})} style={styles.input}>
              {entities.filter(e => e.active).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
              <div>
                <label style={styles.label}>Rent</label>
                <input type="number" value={propertyForm.rent} onChange={e => setPropertyForm({...propertyForm, rent: e.target.value})} style={styles.input} placeholder="Rent" />
              </div>
              <div>
                <label style={styles.label}>HUD Amount</label>
                <input type="number" value={propertyForm.hud} onChange={e => setPropertyForm({...propertyForm, hud: e.target.value})} style={styles.input} placeholder="HUD" />
              </div>
            </div>
            <label style={styles.label}>Status</label>
            <select value={propertyForm.status} onChange={e => setPropertyForm({...propertyForm, status: e.target.value})} style={styles.input}>
              <option>Vacant</option>
              <option>Rented</option>
              <option>For Sale</option>
            </select>
            <label style={styles.label}>Tenant Name</label>
            <input value={propertyForm.tenant} onChange={e => setPropertyForm({...propertyForm, tenant: e.target.value})} style={styles.input} placeholder="Tenant Name" />
            <label style={styles.label}>Lease Signed By</label>
            <input value={propertyForm.signedBy} onChange={e => setPropertyForm({...propertyForm, signedBy: e.target.value})} style={styles.input} placeholder="Signed By" />
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
              <div>
                <label style={styles.label}>Lease Start</label>
                <input type="date" value={propertyForm.leaseStart} onChange={e => setPropertyForm({...propertyForm, leaseStart: e.target.value})} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Lease End</label>
                <input type="date" value={propertyForm.leaseEnd} onChange={e => setPropertyForm({...propertyForm, leaseEnd: e.target.value})} style={styles.input} />
              </div>
            </div>
            
            <h4 style={{fontWeight: '500', fontSize: '14px', marginTop: '16px', marginBottom: '8px', color: theme.green}}>Occupants</h4>
            {propertyForm.occupants.map((occ, idx) => (
              <div key={idx} style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                <input value={occ.name} onChange={e => {
                  const newOcc = [...propertyForm.occupants]
                  newOcc[idx].name = e.target.value
                  setPropertyForm({...propertyForm, occupants: newOcc})
                }} style={{...styles.input, marginBottom: 0}} placeholder="Name" />
                <select value={occ.relation} onChange={e => {
                  const newOcc = [...propertyForm.occupants]
                  newOcc[idx].relation = e.target.value
                  setPropertyForm({...propertyForm, occupants: newOcc})
                }} style={{...styles.input, marginBottom: 0}}>
                  <option>Spouse</option>
                  <option>Child</option>
                  <option>Parent</option>
                  <option>Sibling</option>
                  <option>Roommate</option>
                  <option>Other</option>
                </select>
                <button onClick={() => setPropertyForm({...propertyForm, occupants: propertyForm.occupants.filter((_, i) => i!== idx)})} style={{background: 'none', border: 'none', cursor: 'pointer'}}><Trash2 size={16} style={{color: '#DC2626'}} /></button>
              </div>
            ))}
            <button onClick={() => setPropertyForm({...propertyForm, occupants: [...propertyForm.occupants, {name: '', relation: 'Other'}]})} style={{fontSize: '14px', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px'}}>+ Add Occupant</button>

            <h4 style={{fontWeight: '500', fontSize: '14px', marginTop: '16px', marginBottom: '8px', color: theme.green}}>Recurring Payers (HUD/Other)</h4>
            {propertyForm.recurringPayers.map((rec, idx) => (
              <div key={idx} style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                <input value={rec.name} onChange={e => {
                  const newRec = [...propertyForm.recurringPayers]
                  newRec[idx].name = e.target.value
                  setPropertyForm({...propertyForm, recurringPayers: newRec})
                }} style={{...styles.input, marginBottom: 0, flex: 1}} placeholder="Payer Name" />
                <input type="number" value={rec.amount} onChange={e => {
                  const newRec = [...propertyForm.recurringPayers]
                  newRec[idx].amount = parseFloat(e.target.value) || ''
                  setPropertyForm({...propertyForm, recurringPayers: newRec})
                }} style={{...styles.input, marginBottom: 0, width: '96px'}} placeholder="Amount" />
                <button onClick={() => setPropertyForm({...propertyForm, recurringPayers: propertyForm.recurringPayers.filter((_, i) => i!== idx)})} style={{background: 'none', border: 'none', cursor: 'pointer'}}><Trash2 size={16} style={{color: '#DC2626'}} /></button>
              </div>
            ))}
            <button onClick={() => setPropertyForm({...propertyForm, recurringPayers: [...propertyForm.recurringPayers, {name: '', amount: ''}]})} style={{fontSize: '14px', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px'}}>+ Add Recurring Payer</button>

            <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
              <button onClick={() => setShowModal(null)} style={{...styles.btnSecondary, flex: 1}}>Cancel</button>
              <button onClick={saveProperty} style={{...styles.btn, flex: 1}}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'expense' && (
        <div style={styles.modal} onClick={() => setShowModal(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{fontWeight: 'bold', fontSize: '18px', marginBottom: '16px', color: theme.green}}>Add Expense</h3>
            <label style={styles.label}>Date</label>
            <input type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} style={styles.input} />
            <label style={styles.label}>Amount</label>
            <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} style={styles.input} placeholder="Amount" />
            <label style={styles.label}>Category</label>
            <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value, subcategory: ''})} style={styles.input}>
              <option value="">Select Category</option>
              {expenseCategories.map(c => <option key={c}>{c}</option>)}
            </select>
            {expenseForm.category === 'Energy Efficient Improvements' && (
              <>
                <label style={styles.label}>Energy Star Item</label>
                <select value={expenseForm.subcategory} onChange={e => setExpenseForm({...expenseForm, subcategory: e.target.value, energyStar: true, federalCredit: true})} style={styles.input}>
                  <option value="">Select Energy Star Item</option>
                  {energyCategories.map(c => <option key={c}>{c}</option>)}
                </select>
              </>
            )}
            <label style={styles.label}>Property</label>
            <select value={expenseForm.propertyId} onChange={e => setExpenseForm({...expenseForm, propertyId: e.target.value})} style={styles.input}>
              <option value="all">All Properties</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <label style={styles.label}>Entity</label>
            <select value={expenseForm.entityId} onChange={e => setExpenseForm({...expenseForm, entityId: e.target.value})} style={styles.input}>
              {entities.filter(e => e.active).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <label style={styles.label}>Description</label>
            <textarea value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} style={{...styles.input, height: '80px'}} placeholder="Description" />
            {expenseForm.energyStar && (
              <div style={{backgroundColor: '#059669', padding: '12px', borderRadius: '6px', marginBottom: '12px'}}>
                <label style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                  <input type="checkbox" checked={expenseForm.federalCredit} onChange={e => setExpenseForm({...expenseForm, federalCredit: e.target.checked})} style={{marginRight: '8px', width: '16px', height: '16px', accentColor: theme.green}} />
                  <span style={{fontSize: '14px'}}>30% Federal Tax Credit (${(parseFloat(expenseForm.amount || 0) * 0.3).toFixed(2)})</span>
                </label>
                <label style={styles.label}>NYS Rebate Amount</label>
                <input type="number" value={expenseForm.nysRebate} onChange={e => setExpenseForm({...expenseForm, nysRebate: e.target.value})} style={styles.input} placeholder="NYS Rebate" />
              </div>
            )}
            <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
              <button onClick={() => setShowModal(null)} style={{...styles.btnSecondary, flex: 1}}>Cancel</button>
              <button onClick={saveExpense} style={{...styles.btn, flex: 1}}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'mileage' && (
        <div style={styles.modal} onClick={() => setShowModal(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{fontWeight: 'bold', fontSize: '18px', marginBottom: '16px', color: theme.green}}>Log Mileage</h3>
            <label style={styles.label}>Date</label>
            <input type="date" value={mileageForm.date} onChange={e => setMileageForm({...mileageForm, date: e.target.value})} style={styles.input} />
            <label style={styles.label}>From</label>
            <input value={mileageForm.from} onChange={e => setMileageForm({...mileageForm, from: e.target.value})} style={styles.input} placeholder="From" />
            <label style={styles.label}>To</label>
            <select value={mileageForm.to} onChange={e => setMileageForm({...mileageForm, to: e.target.value})} style={styles.input}>
              <option value="">Select Destination</option>
              {Object.keys(profile.mileageDefaults).map(loc => <option key={loc} value={loc}>{loc} ({profile.mileageDefaults[loc]} mi)</option>)}
            </select>
            <label style={styles.label}>Purpose</label>
            <select value={mileageForm.purpose} onChange={e => setMileageForm({...mileageForm, purpose: e.target.value})} style={styles.input}>
              {tripPurposes.map(p => <option key={p}>{p}</option>)}
            </select>
            <label style={styles.label}>Trip Type</label>
            <select value={mileageForm.tripType} onChange={e => setMileageForm({...mileageForm, tripType: e.target.value})} style={styles.input}>
              <option>Round Trip</option>
              <option>One Way</option>
            </select>
            <label style={styles.label}>Extra Miles</label>
            <input type="number" value={mileageForm.extraMiles} onChange={e => setMileageForm({...mileageForm, extraMiles: e.target.value})} style={styles.input} placeholder="Extra Miles" />
            
            <h4 style={{fontWeight: '500', fontSize: '14px', marginTop: '16px', marginBottom: '8px', color: theme.green}}>Additional Stops</h4>
            {mileageForm.stops.map((stop, idx) => (
              <div key={idx} style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                <input value={stop.location} onChange={e => {
                  const newStops = [...mileageForm.stops]
                  newStops[idx].location = e.target.value
                  setMileageForm({...mileageForm, stops: newStops})
                }} style={{...styles.input, marginBottom: 0, flex: 1}} placeholder="Location" />
                <input type="number" value={stop.miles} onChange={e => {
                  const newStops = [...mileageForm.stops]
                  newStops[idx].miles = e.target.value
                  setMileageForm({...mileageForm, stops: newStops})
                }} style={{...styles.input, marginBottom: 0, width: '80px'}} placeholder="Miles" />
                <button onClick={() => setMileageForm({...mileageForm, stops: mileageForm.stops.filter((_, i) => i!== idx)})} style={{background: 'none', border: 'none', cursor: 'pointer'}}><Trash2 size={16} style={{color: '#DC2626'}} /></button>
              </div>
            ))}
            <button onClick={() => setMileageForm({...mileageForm, stops: [...mileageForm.stops, {location: '', miles: ''}]})} style={{fontSize: '14px', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px'}}>+ Add Stop</button>

            <label style={styles.label}>Entity</label>
            <select value={mileageForm.entityId} onChange={e => setMileageForm({...mileageForm, entityId: e.target.value})} style={styles.input}>
              {entities.filter(e => e.active).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            
            <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
              <button onClick={() => setShowModal(null)} style={{...styles.btnSecondary, flex: 1}}>Cancel</button>
              <button onClick={saveMileage} style={{...styles.btn, flex: 1}}>Save Trip</button>
            </div>
          </div>
        </div>
      )}

      <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: theme.navy, borderTop: `2px solid ${theme.green}`, display: 'flex', justifyContent: 'space-around', padding: '8px 0'}}>
        {[{id: 'dashboard', icon: Home, label: 'Dashboard'}, {id: 'expenses', icon: TrendingUp, label: 'Expenses'}, {id: 'mileage', icon: Car, label: 'Mileage'}, {id: 'reports', icon: FileText, label: 'Reports'}].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 12px', background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === tab.id? theme.green : theme.white
          }}>
            <tab.icon size={20} />
            <span style={{fontSize: '12px', marginTop: '4px'}}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaxSavvy
          <button onClick={saveExpense} style={{...styles.btn, flex: 1}}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'mileage' && (
        <div style={styles.modal} onClick={() => setShowModal(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{fontWeight: 'bold', fontSize: '18px', marginBottom: '16px', color: theme.green}}>Log Mileage</h3>
            <label style={styles.label}>Date</label>
            <input type="date" value={mileageForm.date} onChange={e => setMileageForm({...mileageForm, date: e.target.value})} style={styles.input} />
            <label style={styles.label}>From</label>
            <input value={mileageForm.from} onChange={e => setMileageForm({...mileageForm, from: e.target.value})} style={styles.input} placeholder="From" />
            <label style={styles.label}>To</label>
            <select value={mileageForm.to} onChange={e => setMileageForm({...mileageForm, to: e.target.value})} style={styles.input}>
              <option value="">Select Destination</option>
              {Object.keys(profile.mileageDefaults).map(loc => <option key={loc} value={loc}>{loc} ({profile.mileageDefaults[loc]} mi)</option>)}
            </select>
            <label style={styles.label}>Purpose</label>
            <select value={mileageForm.purpose} onChange={e => setMileageForm({...mileageForm, purpose: e.target.value})} style={styles.input}>
              {tripPurposes.map(p => <option key={p}>{p}</option>)}
            </select>
            <label style={styles.label}>Trip Type</label>
            <select value={mileageForm.tripType} onChange={e => setMileageForm({...mileageForm, tripType: e.target.value})} style={styles.input}>
              <option>Round Trip</option>
              <option>One Way</option>
            </select>
            <label style={styles.label}>Extra Miles</label>
            <input type="number" value={mileageForm.extraMiles} onChange={e => setMileageForm({...mileageForm, extraMiles: e.target.value})} style={styles.input} placeholder="Extra Miles" />
            
            <h4 style={{fontWeight: '500', fontSize: '14px', marginTop: '16px', marginBottom: '8px', color: theme.green}}>Additional Stops</h4>
            {mileageForm.stops.map((stop, idx) => (
              <div key={idx} style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                <input value={stop.location} onChange={e => {
                  const newStops = [...mileageForm.stops]
                  newStops[idx].location = e.target.value
                  setMileageForm({...mileageForm, stops: newStops})
                }} style={{...styles.input, marginBottom: 0, flex: 1}} placeholder="Location" />
                <input type="number" value={stop.miles} onChange={e => {
                  const newStops = [...mileageForm.stops]
                  newStops[idx].miles = e.target.value
                  setMileageForm({...mileageForm, stops: newStops})
                }} style={{...styles.input, marginBottom: 0, width: '80px'}} placeholder="Miles" />
                <button onClick={() => setMileageForm({...mileageForm, stops: mileageForm.stops.filter((_, i) => i!== idx)})} style={{background: 'none', border: 'none', cursor: 'pointer'}}><Trash2 size={16} style={{color: '#DC2626'}} /></button>
              </div>
            ))}
            <button onClick={() => setMileageForm({...mileageForm, stops: [...mileageForm.stops, {location: '', miles: ''}]})} style={{fontSize: '14px', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px'}}>+ Add Stop</button>

            <label style={styles.label}>Entity</label>
            <select value={mileageForm.entityId} onChange={e => setMileageForm({...mileageForm, entityId: e.target.value})} style={styles.input}>
              {entities.filter(e => e.active).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            
            <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
              <button onClick={() => setShowModal(null)} style={{...styles.btnSecondary, flex: 1}}>Cancel</button>
              <button onClick={saveMileage} style={{...styles.btn, flex: 1}}>Save Trip</button>
            </div>
          </div>
        </div>
      )}

      <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: theme.navy, borderTop: `2px solid ${theme.green}`, display: 'flex', justifyContent: 'space-around', padding: '8px 0'}}>
        {[{id: 'dashboard', icon: Home, label: 'Dashboard'}, {id: 'expenses', icon: TrendingUp, label: 'Expenses'}, {id: 'mileage', icon: Car, label: 'Mileage'}, {id: 'reports', icon: FileText, label: 'Reports'}].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 12px', background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === tab.id? theme.green : theme.white
          }}>
            <tab.icon size={20} />
            <span style={{fontSize: '12px', marginTop: '4px'}}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaxSavvy
              <div key={idx} style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                <input value={stop.location} onChange={e => {
                  const newStops = [...mileageForm.stops]
                  newStops[idx].location = e.target.value
                  setMileageForm({...mileageForm, stops: newStops})
                }} style={{...styles.input, marginBottom: 0, flex: 1}} placeholder="Location" />
                <input type="number" value={stop.miles} onChange={e => {
                  const newStops = [...mileageForm.stops]
                  newStops[idx].miles = e.target.value
                  setMileageForm({...mileageForm, stops: newStops})
                }} style={{...styles.input, marginBottom: 0, width: '80px'}} placeholder="Miles" />
                <button onClick={() => setMileageForm({...mileageForm, stops: mileageForm.stops.filter((_, i) => i!== idx)})} style={{background: 'none', border: 'none', cursor: 'pointer'}}><Trash2 size={16} style={{color: '#DC2626'}} /></button>
              </div>
            ))}
            <button onClick={() => setMileageForm({...mileageForm, stops: [...mileageForm.stops, {location: '', miles: ''}]})} style={{fontSize: '14px', color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px'}}>+ Add Stop</button>

            <label style={styles.label}>Entity</label>
            <select value={mileageForm.entityId} onChange={e => setMileageForm({...mileageForm, entityId: e.target.value})} style={styles.input}>
              {entities.filter(e => e.active).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            
            <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
              <button onClick={() => setShowModal(null)} style={{...styles.btnSecondary, flex: 1}}>Cancel</button>
              <button onClick={saveMileage} style={{...styles.btn, flex: 1}}>Save Trip</button>
            </div>
          </div>
        </div>
      )}

      <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: theme.navy, borderTop: `2px solid ${theme.green}`, display: 'flex', justifyContent: 'space-around', padding: '8px 0'}}>
        {[{id: 'dashboard', icon: Home, label: 'Dashboard'}, {id: 'expenses', icon: TrendingUp, label: 'Expenses'}, {id: 'mileage', icon: Car, label: 'Mileage'}, {id: 'reports', icon: FileText, label: 'Reports'}].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 12px', background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === tab.id? theme.green : theme.white
          }}>
            <tab.icon size={20} />
            <span style={{fontSize: '12px', marginTop: '4px'}}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaxSavvy
