"use client"
import { useState, useEffect } from "react"
import { Home, Building2, Receipt, BarChart3, Menu as MenuIcon, Pencil, Check, X, ExternalLink, Eye } from "lucide-react"

const COLORS = {
  navy: "#0A1B3D",
  navyDark: "#061029",
  navyLight: "#1e3a5f",
  fluorescentGreen: "#39FF14",
  red: "#EF4444",
  greenPaid: "#10b981"
}

const DollarLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
    <defs>
      <linearGradient id="logoGradient" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="49%" stopColor={COLORS.fluorescentGreen} />
        <stop offset="51%" stopColor={COLORS.red} />
      </linearGradient>
    </defs>
    <text x="50" y="70" fontSize="70" fontWeight="900" fill="url(#logoGradient)" textAnchor="middle" fontFamily="Arial, sans-serif">$</text>
  </svg>
)

// DEMO + LOGIN SCREEN
const AuthScreen = ({ onLogin, onDemo }: { onLogin: () => void, onDemo: () => void }) => {
  const [checked, setChecked] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: COLORS.navy, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '20px', maxWidth: '500px',
        padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', justifyContent: 'center' }}>
          <DollarLogo size={48} />
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: COLORS.navy, margin: 0 }}>TaxSavvy</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', accentColor: COLORS.navy }}
          />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '15px', color: '#334155', margin: '0 0 8px 0', lineHeight: '1.5' }}>
              I agree to the{' '}
              <button
                onClick={() => setShowTerms(true)}
                style={{
                  color: COLORS.navy, fontWeight: '700', textDecoration: 'underline',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '15px'
                }}
              >
                Terms & Conditions <ExternalLink size={14} style={{ display: 'inline', marginLeft: '2px' }} />
              </button>
            </p>
          </div>
        </div>

        <button
          onClick={onLogin}
          disabled={!checked}
          style={{
            width: '100%', backgroundColor: checked? COLORS.navy : '#cbd5e1',
            color: 'white', fontWeight: 'bold', padding: '16px', borderRadius: '12px',
            border: 'none', fontSize: '16px', cursor: checked? 'pointer' : 'not-allowed',
            boxShadow: checked? `0 4px 12px ${COLORS.navy}40` : 'none', marginBottom: '12px'
          }}
        >
          Login to My Account
        </button>

        <button
          onClick={onDemo}
          disabled={!checked}
          style={{
            width: '100%', backgroundColor: checked? 'white' : '#f1f5f9',
            color: checked? COLORS.navy : '#94a3b8', fontWeight: 'bold', padding: '16px', borderRadius: '12px',
            border: `2px solid ${checked? COLORS.navy : '#cbd5e1'}`, fontSize: '16px',
            cursor: checked? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <Eye size={20} /> View Demo
        </button>

        <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '16px' }}>
          Demo uses sample data. Nothing is saved.
        </p>
      </div>

      {showTerms && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setShowTerms(false)}>
          <div style={{
            backgroundColor: 'white', borderRadius: '20px', maxWidth: '600px',
            maxHeight: '80vh', overflow: 'auto', padding: '32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: COLORS.navy, margin: 0 }}>Terms & Conditions</h2>
              <button onClick={() => setShowTerms(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={24} color="#64748b" />
              </button>
            </div>
            <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              <p><strong>1. NOT A CPA OR LEGAL ADVICE.</strong> TaxSavvy is a tracking tool only. We are not accountants, CPAs, attorneys, or financial advisors. Nothing in this app constitutes professional tax, legal, or financial advice.</p>
              <p><strong>2. YOUR DATA - YOUR RESPONSIBILITY.</strong> You are solely responsible for backing up your own data. We are NOT responsible for any lost data. Export your data regularly.</p>
              <p><strong>3. NO WARRANTY.</strong> This app is provided "as is" without warranty of any kind.</p>
              <p><strong>4. DEMO MODE.</strong> Demo data is sample only and is not saved.</p>
              <p><strong>5. ACCEPTANCE.</strong> By using this app, you agree to these Terms.</p>
            </div>
            <button onClick={() => setShowTerms(false)} style={{
              width: '100%', marginTop: '24px', backgroundColor: COLORS.navy, color: 'white',
              fontWeight: 'bold', padding: '14px', borderRadius: '12px', border: 'none',
              fontSize: '15px', cursor: 'pointer'
            }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

type PaymentMethod = "PayPal" | "Check" | "Cash" | "Zelle" | "Venmo" | "Cash App" | "ACH" | "HUD/Arbor Housing" | "Catholic Charities" | "Arbor Housing" | "Other"
type PropertyStatus = "Rented" | "Vacant" | "Owner Occupied" | "Eviction"

interface Payment {
  id: string
  amount: number
  payer: string
  method: PaymentMethod
  otherMethod?: string
  date: string
  month: string
  year: number
}

interface Property {
  id: string
  name: string
  address: string
  owner: string
  displayOwner: string
  status: PropertyStatus
  yearPurchased: number
  tenantName: string
  tenantPhone: string
  monthlyRent: number
  headerColor: string
  bodyColor: string
  leaseUrl?: string
  payments: Payment[]
  showMultiplePayments: boolean
  viewingMonth: string
  viewingYear: number
  editingRent: boolean
  editingPaymentId: string | null
}

// YOUR REAL DATA
const REAL_PROPERTIES: Property[] = [
  {
    id: "daffodil", name: "118 Daffodil Drive", address: "Horseheads, NY",
    owner: "Mark & Tammi Cronin", displayOwner: "Personal", status: "Owner Occupied",
    yearPurchased: 2018, tenantName: "N/A - Owner Occupied", tenantPhone: "N/A",
    monthlyRent: 0, headerColor: COLORS.navy, bodyColor: COLORS.navyLight,
    payments: [], showMultiplePayments: false, viewingMonth: "JUNE", viewingYear: 2026,
    editingRent: false, editingPaymentId: null
  },
  {
    id: "orchard", name: "114 Orchard St", address: "Horseheads, NY",
    owner: "Cronin NY Property Management LLC", displayOwner: "Cronin NY Property Management LLC",
    status: "Rented", yearPurchased: 2020, tenantName: "John Smith", tenantPhone: "(607) 555-0198",
    monthlyRent: 1405, headerColor: COLORS.navy, bodyColor: COLORS.navyLight,
    leaseUrl: "/leases/orchard-lease.pdf", showMultiplePayments: true,
    viewingMonth: "JUNE", viewingYear: 2026,
    payments: [
      { id: "p1", amount: 935, payer: "Arbor Housing - HUD", method: "HUD/Arbor Housing", date: "2026-06-01", month: "JUNE", year: 2026 },
      { id: "p2", amount: 270, payer: "John Smith", method: "PayPal", date: "2026-06-28", month: "JULY", year: 2026 }
    ],
    editingRent: false, editingPaymentId: null
  },
  {
    id: "elmwood-a", name: "220 Elmwood Ave - Unit A", address: "Elmira, NY",
    owner: "Cronin NY Property Management LLC", displayOwner: "Cronin NY Property Management LLC",
    status: "Rented", yearPurchased: 2019, tenantName: "Sarah Jones", tenantPhone: "(607) 555-0142",
    monthlyRent: 1400, headerColor: COLORS.navy, bodyColor: COLORS.navyLight,
    viewingMonth: "JUNE", viewingYear: 2026,
    payments: [
      { id: "p1", amount: 600, payer: "Sarah Jones", method: "PayPal", date: "2026-06-01", month: "JUNE", year: 2026 }
    ],
    showMultiplePayments: false, editingRent: false, editingPaymentId: null
  },
  {
    id: "elmwood-b", name: "220 Elmwood Ave - Unit B", address: "Elmira, NY",
    owner: "Cronin NY Property Management LLC", displayOwner: "Cronin NY Property Management LLC",
    status: "Rented", yearPurchased: 2019, tenantName: "Mike Davis", tenantPhone: "(607) 555-0177",
    monthlyRent: 1100, headerColor: COLORS.navy, bodyColor: COLORS.navyLight,
    viewingMonth: "JUNE", viewingYear: 2026,
    payments: [
      { id: "p1", amount: 1200, payer: "Mike Davis", method: "PayPal", date: "2026-06-01", month: "JUNE", year: 2026 }
    ],
    showMultiplePayments: false, editingRent: false, editingPaymentId: null
  },
  {
    id: "fourth", name: "146 W Fourth St", address: "Elmira, NY",
    owner: "Mark & Tammi Cronin", displayOwner: "Mark & Tammi Cronin",
    status: "Rented", yearPurchased: 2021, tenantName: "Lisa Chen", tenantPhone: "(607) 555-0134",
    monthlyRent: 1700, headerColor: COLORS.navy, bodyColor: COLORS.navyLight,
    viewingMonth: "JUNE", viewingYear: 2026,
    payments: [
      { id: "p1", amount: 1100, payer: "Lisa Chen", method: "PayPal", date: "2026-06-01", month: "JUNE", year: 2026 }
    ],
    showMultiplePayments: false, editingRent: false, editingPaymentId: null
  },
]

// DEMO SAMPLE DATA - Friends see this
const DEMO_PROPERTIES: Property[] = [
  {
    id: "demo1", name: "Sample Property 1", address: "Anytown, USA",
    owner: "Demo LLC", displayOwner: "Demo Company", status: "Rented",
    yearPurchased: 2020, tenantName: "John Demo", tenantPhone: "(555) 123-4567",
    monthlyRent: 1200, headerColor: COLORS.navy, bodyColor: COLORS.navyLight,
    viewingMonth: "JUNE", viewingYear: 2026,
    payments: [
      { id: "d1", amount: 1200, payer: "John Demo", method: "PayPal", date: "2026-06-01", month: "JUNE", year: 2026 }
    ],
    showMultiplePayments: false, editingRent: false, editingPaymentId: null
  },
  {
    id: "demo2", name: "Sample Property 2", address: "Demo City, USA",
    owner: "Demo LLC", displayOwner: "Demo Company", status: "Rented",
    yearPurchased: 2021, tenantName: "Jane Sample", tenantPhone: "(555) 987-6543",
    monthlyRent: 1500, headerColor: COLORS.navy, bodyColor: COLORS.navyLight,
    viewingMonth: "JUNE", viewingYear: 2026,
    payments: [
      { id: "d2", amount: 800, payer: "Jane Sample", method: "Cash", date: "2026-06-01", month: "JUNE", year: 2026 }
    ],
    showMultiplePayments: true, editingRent: false, editingPaymentId: null
  },
]

export default function TaxSavvyApp() {
  const [activeTab, setActiveTab] = useState("properties")
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const demo = localStorage.getItem('taxsavvy_demo_mode')
    const auth = localStorage.getItem('taxsavvy_auth')
    if (demo === 'true') setIsDemoMode(true)
    if (auth === 'true') setIsAuthenticated(true)
  }, [])

  const handleLogin = () => {
    localStorage.setItem('taxsavvy_auth', 'true')
    localStorage.removeItem('taxsavvy_demo_mode')
    setIsAuthenticated(true)
    setIsDemoMode(false)
  }

  const handleDemo = () => {
    localStorage.setItem('taxsavvy_demo_mode', 'true')
    localStorage.removeItem('taxsavvy_auth')
    setIsDemoMode(true)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated &&!isDemoMode) {
    return <AuthScreen onLogin={handleLogin} onDemo={handleDemo} />
  }

  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]

  const [properties, setProperties] = useState<Property[]>(isDemoMode? DEMO_PROPERTIES : REAL_PROPERTIES)
  const paymentMethods: PaymentMethod[] = ["PayPal", "Check", "Cash", "Zelle", "Venmo", "Cash App", "ACH", "HUD/Arbor Housing", "Catholic Charities", "Arbor Housing", "Other"]

  const changeMonth = (propertyId: string, direction: "prev" | "next") => {
    setProperties(prev => prev.map(p => {
      if (p.id!== propertyId) return p
      const currentIdx = months.indexOf(p.viewingMonth)
      let newIdx = direction === "next"? currentIdx + 1 : currentIdx - 1
      let newYear = p.viewingYear
      if (newIdx > 11) { newIdx = 0; newYear += 1 }
      if (newIdx < 0) { newIdx = 11; newYear -= 1 }
      return {...p, viewingMonth: months[newIdx], viewingYear: newYear }
    }))
  }

  const toggleEditRent = (propertyId: string) => {
    setProperties(prev => prev.map(p => p.id === propertyId? {...p, editingRent:!p.editingRent } : p))
  }

  const updateRent = (propertyId: string, value: number) => {
    setProperties(prev => prev.map(p => p.id === propertyId? {...p, monthlyRent: value, editingRent: false } : p))
  }

  const addPayment = (propertyId: string) => {
    const prop = properties.find(p => p.id === propertyId)!
    const newPayment: Payment = {
      id: `p${Date.now()}`, amount: 0, payer: "", method: "PayPal",
      date: new Date().toISOString().split('T')[0],
      month: prop.viewingMonth, year: prop.viewingYear
    }
    setProperties(prev => prev.map(p =>
      p.id === propertyId? {...p, payments: [...p.payments, newPayment], editingPaymentId: newPayment.id } : p
    ))
  }

  const toggleEditPayment = (propertyId: string, paymentId: string | null) => {
    setProperties(prev => prev.map(p => p.id === propertyId? {...p, editingPaymentId: paymentId } : p))
  }

  const updatePayment = (propertyId: string, paymentId: string, field: keyof Payment, value: any) => {
    setProperties(prev => prev.map(p =>
      p.id === propertyId? {...p, payments: p.payments.map(pay => pay.id === paymentId? {...pay, [field]: value } : pay) } : p
    ))
  }

  const deletePayment = (propertyId: string, paymentId: string) => {
    setProperties(prev => prev.map(p =>
      p.id === propertyId? {...p, payments: p.payments.filter(pay => pay.id!== paymentId) } : p
    ))
  }

  const toggleMultiplePayments = (propertyId: string) => {
    setProperties(prev => prev.map(p =>
      p.id === propertyId? {...p, showMultiplePayments:!p.showMultiplePayments } : p
    ))
  }

  const getPaymentTotals = (prop: Property) => {
    const monthPayments = prop.payments.filter(p => p.month === prop.viewingMonth && p.year === prop.viewingYear)
    const totalPaid = monthPayments.reduce((sum, p) => sum + p.amount, 0)
    const balance = prop.monthlyRent - totalPaid
    let status: "Paid" | "Partial" | "Unpaid" = "Unpaid"
    if (totalPaid >= prop.monthlyRent && prop.monthlyRent > 0) status = "Paid"
    else if (totalPaid > 0) status = "Partial"
    return { totalPaid, balance, status, monthPayments }
  }

  const navItems = [
    { id: "properties", label: "Properties", icon: Home },
    { id: "businesses", label: "Businesses", icon: Building2 },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "menu", label: "Menu", icon: MenuIcon },
  ]

  const getStatusColor = (status: string) => {
    if (status === "Paid") return COLORS.greenPaid
    if (status === "Partial") return "#f59e0b"
    return COLORS.red
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <aside style={{
        display: 'none', width: '260px', backgroundColor: 'white', borderRight: '1px solid #e2e8f0',
        padding: '24px', flexDirection: 'column', position: 'fixed', height: '100vh'
      }} className="lg:flex">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <DollarLogo size={40} />
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: COLORS.navy, margin: 0 }}>TaxSavvy</h1>
        </div>
        {isDemoMode && (
          <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '12px', marginBottom: '16px', border: '2px solid #f59e0b' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', margin: 0, textAlign: 'center' }}>DEMO MODE - Sample Data Only</p>
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px', textAlign: 'left',
                fontWeight: '600', marginBottom: '8px', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px',
                backgroundColor: activeTab === item.id? COLORS.navy : 'transparent',
                color: activeTab === item.id? 'white' : '#334155'
              }}
            >
              <Icon size={20} />
              {item.label}
            </button>
          )
        })}
      </aside>

      <div style={{ flex: 1, marginLeft: 0, paddingBottom: '100px' }} className="lg:ml-[260px]">
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }} className="lg:hidden">
            <DollarLogo size={36} />
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: COLORS.navy, margin: 0 }}>TaxSavvy</h1>
          </div>

          {isDemoMode && (
            <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '12px', marginBottom: '16px', border: '2px solid #f59e0b' }} className="lg:hidden">
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', margin: 0, textAlign: 'center' }}>DEMO MODE - Sample Data Only</p>
            </div>
          )}

          {activeTab === "properties" && (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Properties</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {properties.map((prop) => {
                  const { totalPaid, balance, status, monthPayments } = getPaymentTotals(prop)
                  return (
                    <div key={prop.id} style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', backgroundColor: prop.bodyColor }}>
                      <div style={{ backgroundColor: prop.headerColor, padding: '18px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedProperty(expandedProperty === prop.id? null : prop.id)}>
                            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>{prop.name}</h3>
                            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.95)', fontWeight: '600', margin: 0 }}>{prop.displayOwner}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button onClick={() => changeMonth(prop.id, "prev")} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>←</button>
                            <div style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '14px', fontWeight: '800', padding: '6px 14px', borderRadius: '10px', minWidth: '80px', textAlign: 'center' }}>{prop.viewingMonth}</div>
                            <button onClick={() => changeMonth(prop.id, "next")} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>→</button>
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <div>
                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0 }}>{prop.address} • {prop.status}</p>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '4px 0 0 0' }}>+ Utilities paid by tenant</p>
                          </div>
                          {prop.monthlyRent > 0 && (
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                {prop.editingRent? (
                                  <>
                                    <input type="number" defaultValue={prop.monthlyRent} id={`rent-${prop.id}`}
                                      style={{ width: '100px', fontSize: '24px', fontWeight: '800', color: COLORS.navy, padding: '4px 8px', borderRadius: '8px', border: 'none', textAlign: 'right' }}
                                    />
                                    <button onClick={() => updateRent(prop.id, Number((document.getElementById(`rent-${prop.id}`) as HTMLInputElement).value))} style={{ backgroundColor: COLORS.fluorescentGreen, border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}><Check size={18} color={COLORS.navy} /></button>
                                    <button onClick={() => toggleEditRent(prop.id)} style={{ backgroundColor: 'rgba(239,68,68,0.4)', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}><X size={18} color="white" /></button>
                                  </>
                                ) : (
                                  <>
                                    <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.fluorescentGreen, lineHeight: 1 }}>${prop.monthlyRent}</div>
                                    <button onClick={() => toggleEditRent(prop.id)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}><Pencil size={16} color="white" /></button>
                                  </>
                                )}
                              </div>
                              <div style={{ display: 'inline-block', backgroundColor: getStatusColor(status), color: 'white', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px', marginTop: '4px' }}>
                                {status} {status!== "Paid" && balance > 0 && `• $${balance} Due`}
                              </div>
                            </div>
                          )}
                        </div>

                        {monthPayments.length > 0 && (
                          <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
                            {monthPayments.map((payment, idx) => (
                              <div key={payment.id}>
                                {prop.editingPaymentId === payment.id? (
                                  <div style={{ padding: '12px 0' }}>
                                    <div style={{ display: 'grid', gap: '10px' }}>
                                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <div>
                                          <label style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>Amount</label>
                                          <input type="number" value={payment.amount} onChange={(e) => updatePayment(prop.id, payment.id, "amount", Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', fontSize: '15px', marginTop: '4px' }} />
                                        </div>
                                        <div>
                                          <label style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>Date</label>
                                          <input type="date" value={payment.date} onChange={(e) => updatePayment(prop.id, payment.id, "date", e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', fontSize: '15px', marginTop: '4px' }} />
                                        </div>
                                      </div>
                                      <div>
                                        <label style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>Paid By / Source</label>
                                        <input type="text" value={payment.payer} onChange={(e) => updatePayment(prop.id, payment.id, "payer", e.target.value)} placeholder="Arbor Housing - HUD" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', fontSize: '15px', marginTop: '4px' }} />
                                      </div>
                                      <div>
                                        <label style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>Method</label>
                                        <select value={payment.method} onChange={(e) => updatePayment(prop.id, payment.id, "method", e.target.value as PaymentMethod)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', fontSize: '15px', marginTop: '4px' }}>
                                          {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                      </div>
                                      {payment.method === "Other" && (
                                        <div>
                                          <label style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>Specify Other</label>
                                          <input type="text" value={payment.otherMethod || ""} onChange={(e) => updatePayment(prop.id, payment.id, "otherMethod", e.target.value)} placeholder="Catholic Charities, etc." style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', fontSize: '15px', marginTop: '4px' }} />
                                        </div>
                                      )}
                                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                        <button onClick={() => toggleEditPayment(prop.id, null)} style={{ flex: 1, backgroundColor: COLORS.fluorescentGreen, color: COLORS.navy, fontWeight: 'bold', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}><Check size={18} /> Save</button>
                                        <button onClick={() => deletePayment(prop.id, payment.id)} style={{ backgroundColor: 'rgba(239,68,68,0.4)', color: 'white', fontWeight: 'bold', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: idx < monthPayments.length - 1? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
                                    <div style={{ color: 'white', fontSize: '14px' }}>
                                      <strong style={{ color: COLORS.fluorescentGreen }}>${payment.amount}</strong> • {payment.payer} • {payment.method === "Other"? payment.otherMethod : payment.method} • {payment.date}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                      <button onClick={() => toggleEditPayment(prop.id, payment.id)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}><Pencil size={14} /></button>
                                      <button onClick={() => deletePayment(prop.id, payment.id)} style={{ background: 'rgba(239,68,68,0.3)', border: 'none', color: 'white', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}><X size={14} /></button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div
