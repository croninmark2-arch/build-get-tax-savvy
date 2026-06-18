"use client"
import { useState } from "react"

export default function TaxSavvyApp() {
  const [activeTab, setActiveTab] = useState("properties")
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null)

  const properties = [
    {
      id: "daffodil",
      name: "118 Daffodil Drive",
      address: "Horseheads, NY",
      owner: "Personal",
      status: "Owner Occupied",
      yearPurchased: 2018,
      tenantName: "N/A - Owner Occupied",
      tenantPhone: "N/A",
      monthlyRent: 0,
      headerColor: "#15803D",
      bodyColor: "#22C55E",
    },
    {
      id: "orchard",
      name: "114 Orchard St",
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
      yearPurchased: 2020,
      tenantName: "John Smith",
      tenantPhone: "(607) 555-0198",
      monthlyRent: 1200,
      headerColor: "#0F766E",
      bodyColor: "#14B8A6",
    },
    {
      id: "elmwood",
      name: "220 Elmwood Ave",
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
      yearPurchased: 2019,
      tenantName: "Unit A: Sarah Jones | Unit B: Mike Davis",
      tenantPhone: "Unit A: (607) 555-0142 | Unit B: (607) 555-0177",
      monthlyRent: 2400,
      headerColor: "#0E7490",
      bodyColor: "#06B6D4",
    },
    {
      id: "fourth",
      name: "146 W Fourth St",
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
      yearPurchased: 2021,
      tenantName: "Lisa Chen",
      tenantPhone: "(607) 555-0134",
      monthlyRent: 1100,
      headerColor: "#1D4ED8",
      bodyColor: "#3B82F6",
    },
  ]

  const navItems = [
    { id: "properties", label: "Properties" },
    { id: "businesses", label: "Businesses" },
    { id: "expenses", label: "Expenses" },
    { id: "reports", label: "Reports" },
    { id: "menu", label: "Menu" },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '32px' }}>
          TaxSavvy
        </h1>
        {navItems.map((item) => (
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
              backgroundColor: activeTab === item.id? '#2563eb' : 'transparent',
              color: activeTab === item.id? 'white' : '#334155'
            }}
          >
            {item.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 0, paddingBottom: '90px' }} className="lg:ml-[260px]">
        <div style={{ padding: '24px' }}>
          {/* ONLY ONE TaxSavvy header now */}
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }} className="lg:hidden">
            TaxSavvy
          </h1>

          {/* Properties View */}
          {activeTab === "properties" && (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
                Properties
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {properties.map((prop) => (
                  <div
                    key={prop.id}
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      backgroundColor: prop.bodyColor,
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onClick={() => setExpandedProperty(expandedProperty === prop.id? null : prop.id)}
                  >
                    {/* Header */}
                    <div style={{ backgroundColor: prop.headerColor, padding: '18px 24px' }}>
                      <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                        {prop.name}
                      </h3>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '20px 24px' }}>
                      <p style={{ color: 'white', fontSize: '17px', fontWeight: '600', marginBottom: '4px' }}>
                        {prop.owner}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '16px' }}>
                        {prop.address || prop.status}
                      </p>

                      {/* Expanded Details - Shows when clicked */}
                      {expandedProperty === prop.id && (
                        <div style={{
                          backgroundColor: 'rgba(0,0,0,0.15)',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '16px'
                        }}>
                          <div style={{ color: 'white', fontSize: '15px', lineHeight: '1.8' }}>
                            <p><strong>Year Purchased:</strong> {prop.yearPurchased}</p>
                            <p><strong>Tenant:</strong> {prop.tenantName}</p>
                            <p><strong>Phone:</strong> {prop.tenantPhone}</p>
                            <p><strong>Monthly Rent:</strong> ${prop.monthlyRent}</p>
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveTab("details")
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.25)',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '14px',
                            borderRadius: '14px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            fontSize: '16px',
                            cursor: 'pointer'
                          }}>
                          Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveTab("expenses")
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.25)',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '14px',
                            borderRadius: '14px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            fontSize: '16px',
                            cursor: 'pointer'
                          }}>
                          Expenses
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Other Tabs - Placeholder for now */}
          {activeTab === "expenses" && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
                Expenses
              </h2>
              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <p style={{ color: '#64748b' }}>Expenses tracking coming next. We'll connect this to each property.</p>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
                Reports
              </h2>
              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <p style={{ color: '#64748b' }}>Tax reports and P&L coming next.</p>
              </div>
            </div>
          )}

          {activeTab === "businesses" && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
                Businesses
              </h2>
              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <p style={{ color: '#64748b' }}>Cronin NY Property Management LLC dashboard coming next.</p>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
                Property Details
              </h2>
              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <p style={{ color: '#64748b' }}>Full property detail view coming next. This will show leases, docs, maintenance history.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Nav - STAYS ON SCREEN */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '1px solid #e2e8f0',
        padding: '8px',
        zIndex: 50
      }} className="lg:hidden">
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: activeTab === item.id? '#2563eb' : '#64748b',
                fontWeight: activeTab === item.id? '700' : '600',
                fontSize: '12px'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
