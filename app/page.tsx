"use client"

export default function Properties() {
  const properties = [
    { 
      name: "118 Daffodil Drive", 
      address: "Horseheads, NY", 
      color: "#EF4444", // Red
      owner: "Personal",
      status: "Owner Occupied",
      monthlyRent: 0
    },
    { 
      name: "114 Orchard St", 
      color: "#00A86B", // Kelly Green
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
      monthlyRent: 0
    },
    { 
      name: "220 Elmwood Ave", 
      color: "#3B82F6", // Blue
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
      units: ["Unit A", "Unit B"],
      monthlyRent: 0
    },
    { 
      name: "146 W Fourth St", 
      color: "#7DD3FC", // Light Slate Blue
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
      monthlyRent: 0
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#1E3A8A] mb-6">Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((prop) => (
          <div 
            key={prop.name}
            className="rounded-xl p-6 text-white shadow-lg border-l-8"
            style={{ backgroundColor: prop.color, borderColor: prop.color }}
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold">{prop.name}</h2>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">{prop.owner}</span>
            </div>
            <p className="text-white/80 text-sm">{prop.address || prop.status}</p>
            <div className="mt-4 flex gap-2">
              <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm">Details</button>
              <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm">Expenses</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
