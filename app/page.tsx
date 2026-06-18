"use client"

export default function Properties() {
  const properties = [
    {
      name: "118 Daffodil Drive",
      address: "Horseheads, NY",
      color: "#EF4444",
      headerColor: "#DC2626",
      owner: "Personal",
      status: "Owner Occupied",
    },
    {
      name: "114 Orchard St",
      color: "#10B981",
      headerColor: "#059669",
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
    },
    {
      name: "220 Elmwood Ave",
      color: "#3B82F6",
      headerColor: "#2563EB",
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
      units: ["Unit A", "Unit B"],
    },
    {
      name: "146 W Fourth St",
      color: "#38BDF8",
      headerColor: "#0EA5E9",
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
    },
  ]

  return (
    <div className="p-4 sm:p-8 bg-slate-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Properties</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {properties.map((prop) => (
          <div
            key={prop.name}
            className="rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
          >
            {/* Darker Header Bar */}
            <div
              className="px-6 py-5"
              style={{ backgroundColor: prop.headerColor }}
            >
              <h2 className="text-2xl font-bold text-white">
                {prop.name}
              </h2>
            </div>

            {/* Main Card Body - Bigger */}
            <div
              className="p-6 min-h-[180px] flex flex-col justify-between"
              style={{ backgroundColor: prop.color }}
            >
              <div>
                <p className="text-white/90 text-base font-semibold mb-1">{prop.owner}</p>
                <p className="text-white/80 text-base">{prop.address || prop.status}</p>
              </div>

              {/* Bigger, Nicer Buttons */}
              <div className="mt-6 flex gap-4">
                <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white font-bold px-6 py-3 rounded-2xl transition-all duration-200 border-2 border-white/20 shadow-lg text-base">
                  Details
                </button>
                <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white font-bold px-6 py-3 rounded-2xl transition-all duration-200 border-2 border-white/20 shadow-lg text-base">
                  Expenses
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
