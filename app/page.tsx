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
            <div style={styles.dollar}>$</div>
            <h1 style={{...styles.brand, margin: 0}}>TaxSavvy</h1>
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
          <div style={styles.logo}>
            <div style={styles.dollar}>$</div>
            <h1 style={{...styles.brand, margin: 0}}>TaxSavvy {isDemo && <span style={{fontSize: '14px', color: theme.white}}>DEMO</span>}</h1>
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
          <div style={styles.logo}>
            <div style={styles.dollar}>$</div>
            <h1 style={{...styles.brand, margin: 0}}>TaxSavvy</h1>
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
