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
      headerColor: '#15803d', // dark green
      bodyColor: '#dcfce7', // light green
      properties: ['114 Orchard St', '220 Elmwood Ave'],
    },
    {
      id: 2,
      name: 'MCMC PROPERTIES INC',
      type: 'Corporation',
      headerColor: '#166534', // darker green
      bodyColor: '#bbf7d0', // lighter green
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
      headerColor: '#c2410c', // dark orange
      bodyColor: '#ffedd5', // light orange
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '16px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '32px' }}>
          Business Expenses
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {businesses.map((biz) => (
            <div key={biz.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {/* Dark header bar */}
              <div style={{
                backgroundColor: biz.headerColor,
                padding: '20px 24px',
                borderBottom: '4px solid rgba(0,0,0,0.2)'
              }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  {biz.name}
                </h2>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginTop: '4px' }}>
                  {biz.type}
                </p>
              </div>

              {/* Light body */}
              <div style={{ backgroundColor: biz.bodyColor, padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                      ${getTotal(biz.id).toFixed(2)}
                    </p>
                    <p style={{ fontSize: '14px', color: '#4b5563' }}>Total Expenses YTD</p>
                    {biz.properties.length > 0 && (
                      <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '8px' }}>
                        <strong>Properties:</strong> {biz.properties.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                {showForm === biz.id? (
                  <form onSubmit={(e) => addExpense(biz.id, e)} style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    marginTop: '16px'
                  }}>
                    <input name="desc" placeholder="Expense description" required
                      style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    <input name="amount" type="number" step="0.01" placeholder="Amount" required
                      style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    <input name="date" type="date" required
                      style={{ width: '100%', padding: '8px', marginBottom: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" style={{
                        backgroundColor: '#111827', color: 'white', padding: '8px 16px',
                        border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer'
                      }}>Save</button>
                      <button type="button" onClick={() => setShowForm(null)} style={{
                        backgroundColor: '#e5e7eb', padding: '8px 16px',
                        border: 'none', borderRadius: '6px', cursor: 'pointer'
                      }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setShowForm(biz.id)} style={{
                    backgroundColor: '#111827', color: 'white', fontWeight: '600',
                    padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer'
                  }}>
                    + Add Expense
                  </button>
                )}

                {expenses[biz.id]?.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    {expenses[biz.id].map((exp, i) => (
                      <div key={i} style={{
                        backgroundColor: 'white', padding: '12px', borderRadius: '6px',
                        marginBottom: '8px', display: 'flex', justifyContent: 'space-between'
                      }}>
                        <span>{exp.desc} - {exp.date}</span>
                        <strong>${exp.amount.toFixed(2)}</strong>
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
