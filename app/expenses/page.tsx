'use client'
import { useState } from 'react'

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState<number | null>(null)
  const [expenses, setExpenses] = useState<{[key: number]: any[]}>({})

  const businesses = [
    {
      id: 1,
      name: 'Cronin NY Property Management LLC',
      type: 'LLC',
      headerColor: '#1e40af', // dark blue
      bodyColor: '#dbeafe', // light blue
      properties: ['114 Orchard St', '220 Elmwood Ave'],
    },
    {
      id: 2,
      name: 'MCMC PROPERTIES INC',
      type: 'Corporation',
      headerColor: '#166534', // dark green
      bodyColor: '#dcfce7', // light green
      properties: [],
    },
    {
      id: 3,
      name: 'Mark & Tammi Cronin',
      type: 'Personal - Rental',
      headerColor: '#b91c1c', // dark red
      bodyColor: '#fee2e2', // light red
      properties: ['146 W Fourth St'],
    },
    {
      id: 4,
      name: 'Basketball Officiating',
      type: '1099 Income',
      headerColor: '#92400e', // dark amber
      bodyColor: '#fef3c7', // light amber
      properties: [],
    }
  ]

  const getTotal = (id: number) => {
    return expenses[id]?.reduce((sum, exp) => sum + exp.amount, 0) || 0
  }

  const addExpense = (bizId: number, e: any) => {
    e.preventDefault()
    const form = e.target
    const newExpense = {
      id: Date.now(),
      desc: form.desc.value,
      amount: parseFloat(form.amount.value),
      date: form.date.value
    }
    setExpenses({
    ...expenses,
      [bizId]: [...(expenses[bizId] || []), newExpense]
    })
    setShowForm(null)
    form.reset()
  }

  const deleteExpense = (bizId: number, expenseId: number) => {
    setExpenses({
    ...expenses,
      [bizId]: expenses[bizId].filter(exp => exp.id!== expenseId)
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', marginBottom: '32px' }}>
          Business Expenses
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {businesses.map((biz) => (
            <div key={biz.id} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}>
              {/* Dark header bar - 2-3 shades darker */}
              <div style={{
                backgroundColor: biz.headerColor,
                padding: '24px',
                borderBottom: '4px solid rgba(0,0,0,0.15)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  {biz.name}
                </h2>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginTop: '4px', fontWeight: '500' }}>
                  {biz.type}
                </p>
              </div>

              {/* Lighter body color */}
              <div style={{ backgroundColor: biz.bodyColor, padding: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '36px', fontWeight: '800', color: '#111827', margin: 0 }}>
                    ${getTotal(biz.id).toFixed(2)}
                  </p>
                  <p style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>Total Expenses YTD</p>
                  {biz.properties.length > 0 && (
                    <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '12px' }}>
                      <strong>Properties:</strong> {biz.properties.join(', ')}
                    </p>
                  )}
                </div>

                {showForm === biz.id? (
                  <form onSubmit={(e) => addExpense(biz.id, e)} style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    marginTop: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <input name="desc" placeholder="What did you buy?" required
                      style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }} />
                    <input name="amount" type="number" step="0.01" placeholder="Amount" required
                      style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }} />
                    <input name="date" type="date" required
                      style={{ width: '100%', padding: '12px', marginBottom: '16px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }} />
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" style={{
                        backgroundColor: '#111827', color: 'white', padding: '12px 24px',
                        border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '16px'
                      }}>Save Expense</button>
                      <button type="button" onClick={() => setShowForm(null)} style={{
                        backgroundColor: '#e5e7eb', padding: '12px 24px',
                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px'
                      }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setShowForm(biz.id)} style={{
                    backgroundColor: '#111827', color: 'white', fontWeight: '700',
                    padding: '12px 24px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px'
                  }}>
                    + Add Expense
                  </button>
                )}

                {expenses[biz.id]?.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    {expenses[biz.id].map((exp) => (
                      <div key={exp.id} style={{
                        backgroundColor: 'white', padding: '16px', borderRadius: '8px',
                        marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#111827' }}>{exp.desc}</div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>{exp.date}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <strong style={{ fontSize: '18px' }}>${exp.amount.toFixed(2)}</strong>
                          <button onClick={() => deleteExpense(biz.id, exp.id)} style={{
                            backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none',
                            padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
                          }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
