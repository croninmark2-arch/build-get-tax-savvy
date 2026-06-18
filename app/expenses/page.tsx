'use client'

export default function ExpensesPage() {
  const businesses = [
    {
      id: 1,
      name: 'Cronin NY Property Management LLC',
      type: 'LLC',
      color: '#16a34a', // green-600
      properties: ['114 Orchard St', '220 Elmwood Ave'],
      total: 0.00
    },
    {
      id: 2,
      name: 'MCMC PROPERTIES INC',
      type: 'Corporation', 
      color: '#15803d', // green-700
      properties: [],
      total: 0.00
    },
    {
      id: 3,
      name: 'Mark & Tammi Cronin',
      type: 'Personal - Rental',
      color: '#dc2626', // red-600
      properties: ['146 W Fourth St'],
      total: 0.00
    },
    {
      id: 4,
      name: 'Basketball Officiating',
      type: '1099 Income',
      color: '#ea580c', // orange-600
      properties: [],
      total: 0.00
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Business Expenses</h1>
        
        <div className="space-y-6">
          {businesses.map((biz) => (
            <div 
              key={biz.id}
              className="bg-white rounded-xl shadow-lg border-l-8 overflow-hidden"
              style={{ borderLeftColor: biz.color }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{biz.name}</h2>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{biz.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">${biz.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Total Expenses YTD</p>
                  </div>
                </div>

                {biz.properties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Properties:</span> {biz.properties.join(', ')}
                    </p>
                  </div>
                )}

                <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2 rounded-lg transition-colors">
                  + Add Expense
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
