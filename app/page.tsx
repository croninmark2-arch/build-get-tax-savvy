'use client'

import { useState } from 'react'

function TaxSavvyLogo({ size = 32 }: { size?: number }) {
  return (
    <div
      aria-label="TaxSavvy"
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: 'linear-gradient(90deg, #16a34a 0%, #16a34a 50%, #dc2626 50%, #dc2626 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: 800,
        fontSize: Math.round(size * 0.62),
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      $
    </div>
  )
}

function HeaderBar({ title }: { title: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 16px',
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 20,
    }}>
      <TaxSavvyLogo size={34} />
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>TaxSavvy</div>
        <div style={{ fontSize: 12, color: '#6b7280', marginTop: -2 }}>{title}</div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #d1d5db',
  fontSize: 14,
  background: '#fff',
  boxSizing: 'border-box',
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 14,
  padding: 16,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  marginBottom: 6,
  display: 'block',
}

export default function Page() {
  const [tab, setTab] = useState<'properties'|'businesses'|'expenses'|'reports'|'menu'>('properties')

  // Properties - preloaded with your 2
  const [properties] = useState([
    {
      id: 1,
      address: '118 Daffodil Drive',
      entity: 'Personal',
      status: 'Owner Occupied',
      city: 'Horseheads, NY',
    },
    {
      id: 2,
      address: '114 Orchard St',
      entity: 'Cronin NY Property Management LLC',
      status: 'Rented $1405',
      city: 'Horseheads, NY',
      tenant: 'John Smith',
      due: 'Partial $470 Due',
    },
  ])

  // Mileage / entity selection
  const [mileage, setMileage] = useState({
    date: '',
    miles: '',
    purpose: '',
    entity: 'Personal',
    start: '',
    end: '',
  })

  const entities = [
    'Personal',
    'Cronin NY Property Management LLC',
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      color: '#111827',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      paddingBottom: 80,
    }}>
      <HeaderBar title={
        tab === 'properties' ? 'Properties' :
        tab === 'businesses' ? 'Businesses' :
        tab === 'expenses' ? 'Expenses' :
        tab === 'reports' ? 'Reports' : 'Menu'
      } />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
        {tab === 'properties' && (
          <div style={{ display: 'grid', gap: 12 }}>
            {properties.map(p => (
              <div key={p.id} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <TaxSavvyLogo size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{p.address}</div>
                    <div style={{ fontSize: 13, color: '#4b5563', marginTop: 2 }}>
                      {p.entity} • {p.status}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{p.city}</div>
                    {p.tenant && (
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                        Tenant: {p.tenant} • {p.due}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div style={cardStyle}>
              <div style={{ fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TaxSavvyLogo size={24} />
                Mileage Tracker
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Date</label>
                    <input type="date" style={inputStyle}
                      value={mileage.date}
                      onChange={e => setMileage({ ...mileage, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Miles</label>
                    <input type="number" placeholder="0.0" style={inputStyle}
                      value={mileage.miles}
                      onChange={e => setMileage({ ...mileage, miles: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Start</label>
                    <input type="text" placeholder="Start location" style={inputStyle}
                      value={mileage.start}
                      onChange={e => setMileage({ ...mileage, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>End</label>
                    <input type="text" placeholder="End location" style={inputStyle}
                      value={mileage.end}
                      onChange={e => setMileage({ ...mileage, end: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Entity</label>
                  <select
                    style={inputStyle}
                    value={mileage.entity}
                    onChange={e => setMileage({ ...mileage, entity: e.target.value })}
                  >
                    {entities.map(en => <option key={en} value={en}>{en}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Purpose</label>
                  <input type="text" placeholder="Business purpose" style={inputStyle}
                    value={mileage.purpose}
                    onChange={e => setMileage({ ...mileage, purpose: e.target.value })}
                  />
                </div>

                <button style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#111827',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}>
                  Save Mileage
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'businesses' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <TaxSavvyLogo size={24} />
              <div style={{ fontWeight: 600 }}>Businesses</div>
            </div>
            <div style={{ fontSize: 14, color: '#4b5563' }}>
              Add your Schedule C / LLC entities here. Entity selector is wired in Mileage.
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>
              • Cronin NY Property Management LLC
            </div>
          </div>
        )}

        {tab === 'expenses' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <TaxSavvyLogo size={24} />
              <div style={{ fontWeight: 600 }}>Expenses</div>
            </div>
            <div style={{ fontSize: 14, color: '#4b5563' }}>
              Expense tracker UI goes here – your v19 PRO expense form slots right in.
            </div>
          </div>
        )}

        {tab === 'reports' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <TaxSavvyLogo size={24} />
              <div style={{ fontWeight: 600 }}>Reports</div>
            </div>
            <div style={{ fontSize: 14, color: '#4b5563' }}>
              Mileage summary, Schedule E prep, expense exports.
            </div>
          </div>
        )}

        {tab === 'menu' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <TaxSavvyLogo size={32} />
              <div>
                <div style={{ fontWeight: 700 }}>TaxSavvy v19 PRO</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Inline styles • No Tailwind</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>
              Properties: 118 Daffodil Drive (Personal), 114 Orchard St (Cronin NY Property Management LLC)<br/>
              Mileage input + entity selection enabled.<br/>
              This build has the green/red $ logo correctly closed in all headers.
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 8px 22px',
        fontSize: 11,
      }}>
        {[
          {k: 'properties', label: 'Properties'},
          {k: 'businesses', label: 'Businesses'},
          {k: 'expenses', label: 'Expenses'},
          {k: 'reports', label: 'Reports'},
          {k: 'menu', label: 'Menu'},
        ].map(item => (
          <button key={item.k}
            onClick={() => setTab(item.k as any)}
            style={{
              background: 'none',
              border: 'none',
              color: tab === item.k ? '#111827' : '#6b7280',
              fontWeight: tab === item.k ? 700 : 500,
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
