"use client"

export default function Expenses() {
  const businesses = [
    { 
      name: "Cronin NY Property Management LLC", 
      color: "#00A86B", 
      type: "LLC",
      properties: ["114 Orchard St", "220 Elmwood Ave", "146 W Fourth St"]
    },
    { 
      name: "MCMC PROPERTIES INC", 
      color: "#166534", 
      type: "Corporation",
      properties: []
    },
    { 
      name: "Basketball Officiating", 
      color: "#F97316", 
      type: "1099 Income",
      properties: []
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#1E3A8A] mb-6">Business Expenses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((biz) => (
          <div 
            key={biz.name}
            className="rounded-xl p-6 text-white shadow-lg"
            style={{ backgroundColor: biz.color }}
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold leading-tight">{biz.name}</h2>
              <p className="text-white/70 text-sm">{biz.type}</p>
            </div>
            <p className="text-white/90 text-2xl font-bold mb-1">$0.00</p>
            <p className="text-white/60 text-xs mb-3">Total Expenses YTD</p>
            {biz.properties.length > 0 && (
              <p className="text-white/50 text-xs mb-4">
                Includes: {biz.properties.join(", ")}
              </p>
            )}
            <button className="w-full bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md text-sm font-medium">
              + Add Expense
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
