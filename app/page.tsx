"use client"
import { useState, useEffect } from "react"
import { Home, Building2, Receipt, BarChart3, Menu as MenuIcon } from "lucide-react"

// BRAND COLORS - Navy Blue + Fluorescent Green
const COLORS = {
  navy: "#0A1B3D",
  navyDark: "#061029",
  navyLight: "#1e3a5f",
  fluorescentGreen: "#39FF14",
  red: "#EF4444",
  greenPaid: "#10b981"
}

// SPLIT DOLLAR SIGN LOGO - Fluorescent Green / Red Diagonal
const DollarLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="49%" stopColor={COLORS.fluorescentGreen} />
        <stop offset="51%" stopColor={COLORS.red} />
      </linearGradient>
    </defs>
    <text
      x="50"
      y="70"
      fontSize="70"
      fontWeight="900"
      fill="url(#logoGradient)"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
    >
      $
    </text>
  </svg>
)

// TERMS & CONDITIONS MODAL
const TermsModal = ({ onAccept }: { onAccept: () => void }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto',
      padding: '32px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <DollarLogo size={40} />
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: COLORS.navy, margin: 0 }}>
          TaxSavvy Terms & Conditions
        </h2>
      </div>

      <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
        <p><strong>1. NOT A CPA OR LEGAL ADVICE.</strong> TaxSavvy is a tracking tool only. We are not accountants, CPAs, attorneys, or financial advisors. Nothing in this app constitutes professional tax, legal, or financial advice. Consult a licensed professional.</p>

        <p><strong>2. YOUR DATA - YOUR RESPONSIBILITY.</strong> You are solely responsible for backing up your own data. We are NOT responsible or liable for any lost reports, expenses, accounts, leases, or other information entered into this system. Export your data regularly.</p>

        <p><strong>3. NO WARRANTY.</strong> This app is provided "as is" without warranty of any kind. We do not guarantee accuracy, availability, or fitness for any purpose.</p>

        <p><strong>4. LIMITATION OF LIABILITY.</strong> Under no circumstances shall TaxSavvy, its owner, or affiliates be liable for any direct, indirect, incidental, or consequential damages arising from use of this app, including but not limited to lost profits, lost data, or tax penalties.</p>

        <p><strong>5. SUBSCRIPTION & CANCELLATION.</strong> If you enrolled in a paid subscription, you may cancel at any time by emailing support@taxsavvy.app with subject "CANCEL" from your registered email. Cancellations take effect at the end of the current billing period. No refunds for partial months.</p>

        <p><strong>6. USER BACKUPS REQUIRED.</strong> You must maintain your own backups of all data. We recommend weekly exports. System failures, updates, or errors may result in data loss for which we assume no responsibility.</p>

        <p><strong>7. ACCURACY.</strong> You are responsible for the accuracy of all data entered. We do not verify, audit, or guarantee any calculations or reports generated.</p>

        <p><strong>8. ACCEPTANCE.</strong> By clicking "I Accept" below, you acknowledge you have read, understood, and agree to be bound by these Terms & Conditions.</p>
      </div>

      <button
        onClick={onAccept}
        style={{
          width: '100%',
          marginTop: '24px',
          backgroundColor: COLORS.navy,
          color: 'white',
          fontWeight: 'bold',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: `0 4px 12px ${COLORS.navy}40`
        }}
      >
        I Accept the Terms & Conditions
      </button>
    </div>
  </div>
)

type PaymentMethod = "PayPal" | "Check" | "Cash" | "Zelle" | "Venmo" | "ACH" | "HUD/Arbor Housing" | "Other"
type PropertyStatus = "Rented" | "Vacant" | "Owner Occupied" | "Eviction"

interface Payment {
  id: string
  amount: number
  payer: string
  method: PaymentMethod
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
}

export default function TaxSavvyApp() {
  const [activeTab, setActiveTab] = useState("properties")
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null)
  const [showTerms, setShowTerms] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('taxsavvy_terms_accepted')
    if (!accepted) setShowTerms(true)
  }, [])

  const handleAcceptTerms = () => {
    localStorage.setItem('taxsavvy_terms_accepted', 'true')
    setShowTerms(false)
  }

  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
  const currentDate = new Date()
  const currentMonth = months[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear()

  const [properties, setProperties] = useState<Property[]>([
    {
      id: "daffodil",
      name: "118 Daffodil Drive",
      address: "Horseheads, NY",
      owner: "Mark & Tammi Cronin",
      displayOwner: "Personal",
      status: "Owner Occupied",
      yearPurchased: 2018,
      tenantName: "N/A - Owner Occupied",
      tenantPhone: "N/A",
      monthlyRent: 0,
      headerColor: COLORS.navy,
      bodyColor: COLORS.navyLight,
      payments: [],
      showMultiplePayments: false,
      viewingMonth: currentMonth,
      viewingYear: currentYear
    },
    {
      id: "orchard",
      name: "114 Orchard St",
      address: "Horseheads, NY",
      owner: "Cronin NY Property Management LLC",
      displayOwner: "Cronin NY Property Management LLC",
      status: "Rented",
      yearPurchased: 2020,
      tenantName: "John Smith",
      tenantPhone: "(607) 555-0198",
      monthlyRent: 1405,
      headerColor: COLORS.navy,
      bodyColor: COLORS.navyLight,
      leaseUrl: "/leases/orchard-lease.pdf",
      showMultiplePayments: true,
      viewingMonth: currentMonth,
      viewingYear: currentYear,
      payments: [
        {
          id: "p1",
          amount: 935,
          payer: "Arbor Housing - HUD",
          method: "HUD/Arbor Housing",
          date: "2026-06-01",
          month: "JUNE",
          year: 2026
        },
        {
          id: "p2",
          amount: 270,
          payer: "John Smith",
          method: "PayPal",
          date: "2026-06-28",
          month: "JULY",
          year: 2026
        }
      ]
    },
    {
      id: "elmwood-a",
      name: "220 Elmwood Ave - Unit A",
      address: "Elmira, NY",
      owner: "Cronin NY Property Management LLC",
      displayOwner: "Cronin NY Property Management LLC",
      status: "Rented",
      yearPurchased: 2019,
      tenantName: "Sarah Jones",
      tenantPhone: "(607) 555-0142",
      monthlyRent: 1200,
      headerColor: COLORS.navy,
      bodyColor: COLORS.navyLight,
      viewingMonth: currentMonth,
      viewingYear: currentYear,
      payments: [
        { id: "p1", amount: 600, payer: "Sarah Jones", method: "PayPal", date: "2026-06-01", month: "JUNE", year: 2026 }
      ],
      showMultiplePayments: false
    },
    {
      id: "elmwood-b",
      name: "220 Elmwood Ave - Unit B",
      address: "Elmira, NY",
      owner: "Cronin NY Property Management LLC",
      displayOwner: "Cronin NY Property Management LLC",
      status: "Rented",
      yearPurchased: 2019,
      tenantName: "Mike Davis",
      tenantPhone: "(607) 555-0177",
      monthlyRent: 1200,
      headerColor: COLORS.navy,
      bodyColor: COLORS.navyLight,
      viewingMonth: currentMonth,
      viewingYear: currentYear,
      payments: [
        { id: "p1", amount: 1200, payer: "Mike Davis", method: "PayPal", date: "2026-06-01", month: "JUNE", year: 2026 }
      ],
      showMultiplePayments: false
    },
    {
      id: "fourth",
      name: "146 W Fourth St",
      address: "Elmira, NY",
      owner: "Mark & Tammi Cronin",
      displayOwner: "Mark & Tammi Cronin",
      status: "Rented",
      yearPurchased: 2021,
      tenantName: "Lisa Chen",
      tenantPhone: "(607) 555-0134",
      monthlyRent: 1100,
      headerColor: COLORS.navy,
      bodyColor: COLORS.navyLight,
      viewingMonth: currentMonth,
      viewingYear: currentYear,
      payments: [
        { id: "p1", amount: 1100, payer: "Lisa Chen", method: "PayPal", date: "2026-06-01", month: "JUNE", year: 2026 }
      ],
      showMultiplePayments: false
    },
  ])

  const paymentMethods: PaymentMethod[] = ["PayPal", "Check", "Cash", "Zelle", "Venmo", "ACH", "HUD/Arbor Housing", "Other"]

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

  const addPayment = (propertyId: string) => {
    const prop = properties.find(p => p.id === propertyId)!
    const newPayment: Payment = {
      id: `p${Date.now()}`,
      amount: 0,
      payer: "",
      method: "PayPal",
      date: new Date().toISOString().split('T')[0],
      month: prop.viewingMonth,
      year: prop.viewingYear
    }
    setProperties(prev => prev.map(p =>
      p.id === propertyId? {...p, payments: [...p.payments, newPayment] } : p
    ))
  }

  const updatePayment = (propertyId: string, paymentId: string, field: keyof Payment, value: any) => {
    setProperties(prev => prev.map(p =>
      p.id === propertyId
     ? {
       ...p,
          payments: p.payments.map(pay =>
            pay.id === paymentId? {...pay, [field]: value } : pay
          )
        }
        : p
    ))
  }

  const deletePayment = (propertyId: string, paymentId: string) => {
    setProperties(prev => prev.map(p =>
      p.id === propertyId
     ? {...p, payments: p.payments.filter(pay => pay.id!== paymentId) }
        : p
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
      {showTerms && <TermsModal onAccept={handleAcceptTerms} />}

      {/* Desktop Sidebar */}
      <aside style={{
        display: 'none',
        width: '260px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '24px',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh'
      }} className="lg:flex">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <DollarLogo size={40} />
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: COLORS.navy, margin: 0 }}>
            TaxSavvy
          </h1>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                textAlign: 'left',
                fontWeight: '600',
                marginBottom: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
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

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 0, paddingBottom: '100px' }} className="lg:ml-[260px]">
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }} className="lg:hidden">
            <DollarLogo size={36} />
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: COLORS.navy, margin: 0 }}>
              TaxSavvy
            </h1>
          </div>

          {activeTab === "properties" && (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
                Properties
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {properties.map((prop) => {
                  const { totalPaid, balance, status, monthPayments } = getPaymentTotals(prop)

                  return (
                    <div
                      key={prop.id}
                      style={{
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        backgroundColor: prop.bodyColor,
                      }}
                    >
                      {/* Header - MONTH NAVIGATION */}
                      <div style={{ backgroundColor: prop.headerColor, padding: '18px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedProperty(expandedProperty === prop.id? null : prop.id)}>
                            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>
                              {prop.name}
                            </h3>
                            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.95)', fontWeight: '600', margin: 0 }}>
                              {prop.displayOwner}
                            </p>
                          </div>

                          {/* MONTH NAVIGATOR */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={() => changeMonth(prop.id, "prev")}
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                fontSize: '18px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                              }}
                            >
                              ←
                            </button>
                            <div style={{
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '800',
                              padding: '6px 14px',
                              borderRadius: '10px',
                              minWidth: '80px',
                              textAlign: 'center'
                            }}>
                              {prop.viewingMonth}
                            </div>
                            <button
                              onClick={() => changeMonth(prop.id, "next")}
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                fontSize: '18px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                              }}
                            >
                              →
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <div>
                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0 }}>
                              {prop.address} • {prop.status}
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '4px 0 0 0' }}>
                              + Utilities paid by tenant
                            </p>
                          </div>

                          {/* RENT + STATUS */}
                          {prop.monthlyRent > 0 && (
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '28px', fontWeight: '800', color: COLORS.fluorescentGreen, lineHeight: 1 }}>
                                ${prop.monthlyRent}
                              </div>
                              <div style={{
                                display: 'inline-block',
                                backgroundColor: getStatusColor(status),
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '700',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                marginTop: '4px'
                              }}>
                                {status} {status!== "Paid" && balance > 0 && `• $${balance} Due`}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* PAYMENT LIST */}
                        {monthPayments.length > 0 && (
                          <div style={{
                            backgroundColor: 'rgba(0,0,0,0.15)',
                            borderRadius: '12px',
                            padding: '12px',
                            marginBottom: '12px'
                          }}>
                            {monthPayments.map((payment, idx) => (
                              <div key={payment.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 0',
                                borderBottom: idx < monthPayments.length - 1? '1px solid rgba(255,255,255,0.2)' : 'none'
                              }}>
                                <div style={{ color: 'white', fontSize: '14px' }}>
                                  <strong style={{ color: COLORS.fluorescentGreen }}>${payment.amount}</strong> • {payment.payer} • {payment.method} • {payment.date}
                                </div>
                                {prop.showMultiplePayments && (
                                  <button
                                    onClick={() => deletePayment(prop.id, payment.id)}
                                    style={{
                                      background: 'rgba(239,68,68,0.3)',
                                      border: 'none',
                                      color: 'white',
                                      borderRadius: '6px',
                                      padding: '4px 8px',
                                      fontSize: '12px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* EXPANDED DETAILS */}
                        {expandedProperty === prop.id && (
                          <div style={{
                            backgroundColor: 'rgba(0,0,0,0.15)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '16px'
                          }}>
                            <div style={{ color: 'white', fontSize: '15px', lineHeight: '2' }}>
                              <p><strong>Year Purchased:</strong> {prop.yearPurchased}</p>
                              <p><strong>Tenant:</strong> {prop.tenantName}</p>
                              <p><strong>Phone:</strong> {prop.tenantPhone}</p>
                              <p><strong>Utilities:</strong> Tenant pays all. You pay only if Vacant/Eviction.</p>
                              {prop.leaseUrl && (
                                <a href={prop.leaseUrl} target="_blank" style={{
                                  display: 'inline-block',
                                  backgroundColor: COLORS.fluorescentGreen,
                                  color: COLORS.navy,
                                  padding: '8px 16px',
                                  borderRadius: '8px',
                                  textDecoration: 'none',
                                  fontWeight: '700',
                                  marginTop: '8px'
                                }}>
                                  View Full Lease PDF
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* CONTROLS */}
                        {prop.monthlyRent > 0 && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => addPayment(prop.id)}
                              style={{
                                flex: 1,
                                minWidth: '140px',
                                backgroundColor: 'rgba(0,0,0,0.25)',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '14px',
                                borderRadius: '14px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                fontSize: '16px',
                                cursor: 'pointer'
                              }}>
                              + Add Payment
                            </button>

                            <button
                              onClick={() => toggleMultiplePayments(prop.id)}
                              style={{
                                backgroundColor: prop.showMultiplePayments? 'rgba(16,185,129,0.4)' : 'rgba(0,0,0,0.25)',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '14px 20px',
                                borderRadius: '14px',
                                border: '2px solid rgba(255,255,255,0.3)',
                                fontSize: '14px',
                                cursor: 'pointer'
                              }}>
                              {prop.showMultiplePayments? "Multi-Pay ON" : "Multi-Pay OFF"}
                            </button>
                          </div>
                        )}

                        {/* EDIT PAYMENTS */}
                        {prop.showMultiplePayments && monthPayments.map((payment) => (
                          <div key={payment.id} style={{
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginTop: '12px'
                          }}>
                            <div style={{ display: 'grid', gap: '10px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                  <label style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>Amount</label>
                                  <input
                                    type="number"
                                    value={payment.amount}
                                    onChange={(e) => updatePayment(prop.id, payment.id, "amount", Number(e.target.value))}
                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', fontSize: '15px', marginTop: '4px' }}
                                  />
                                </div>
                                <div>
                                  <label style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>Date</label>
                                  <input
                                    type="date"
                                    value={payment.date}
                                    onChange={(e) => updatePayment(prop.id, payment.id, "date", e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', fontSize: '15px', marginTop: '4px' }}
                                  />
                                </div>
                              </div>
                              <div>
                                <label style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>Paid By / Source</label>
                                <input
                                  type="text"
                                  value={payment.payer}
                                  onChange={(e) => updatePayment(prop.id, payment.id, "payer", e.target.value)}
                                  placeholder="Arbor Housing - HUD"
                                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', fontSize: '15px', marginTop: '4px' }}
                                />
                              </div>
                              <div>
                                <label style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>Method</label>
                                <select
                                  value={payment.method}
                                  onChange={(e) => updatePayment(prop.id, payment.id, "method", e.target.value as PaymentMethod)}
                                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: 'none', fontSize: '15px', marginTop: '4px' }}
                                >
                                  {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Other tabs */}
          {activeTab!== "properties" && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
                {navItems.find(n => n.id === activeTab)?.label}
              </h2>
              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <p style={{ color: '#64748b' }}>Coming next.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Nav - GLASSMORPHISM + NAVY/GREEN */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px 16px',
        zIndex: 50
      }} className="lg:hidden">
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '8px',
          boxShadow: '0 8px 32px rgba(10,27,61,0.15), 0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.4)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '10px 16px',
                  border: 'none',
                  background: isActive? `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyDark} 100%)` : 'transparent',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  color: isActive? 'white' : '#64748b',
                  fontWeight: isActive? '700' : '600',
                  fontSize: '11px',
                  transition: 'all 0.2s ease',
                  transform: isActive? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isActive? `0 4px 12px rgba(10,27,61,0.4), 0 0 20px ${COLORS.fluorescentGreen}40` : 'none'
                }}
              >
                <Icon size={22} strokeWidth={isActive? 2.5 : 2} color={isActive? COLORS.fluorescentGreen : undefined} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
