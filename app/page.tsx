"use client"

export default function Properties() {
  const properties = [
    {
      name: "118 Daffodil Drive",
      address: "Horseheads, NY",
      headerColor: "#B91C1C", // Dark red
      bodyColor: "#EF4444",   // Lighter red
      owner: "Personal",
      status: "Owner Occupied",
    },
    {
      name: "114 Orchard St",
      headerColor: "#047857", // Dark green
      bodyColor: "#10B981",   // Lighter green
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
    },
    {
      name: "220 Elmwood Ave",
      headerColor: "#1D4ED8", // Dark blue
      bodyColor: "#3B82F6",   // Lighter blue
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
      units: ["Unit A", "Unit B"],
    },
    {
      name: "146 W Fourth St",
      headerColor: "#0284C7", // Dark cyan
      bodyColor: "#38BDF8",   // Lighter cyan
      owner: "Cronin NY Property Management LLC",
      status: "Rented",
    },
  ]

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Properties</h1>
      <div className="space-y-6">
        {properties.map((prop) => (
          <div
            key={prop.name}
            className="rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            {/* Darker Header - No gap below */}
            <div
              className="px-6 py-4"
              style={{ backgroundColor: prop.headerColor }}
            >
              <h2 className="text-2xl font-bold text-white">
                {prop.name}
              </h2>
            </div>

            {/* Lighter Body - Connected, no white strip */}
            <div
              className="px-6 py-6"
              style={{ backgroundColor: prop.bodyColor }}
            >
              <div className="mb-6">
                <p className="text-white text-lg font-semibold mb-1">{prop.owner}</p>
                <p className="text-white/90 text-base">{prop.address || prop.status}</p>
              </div>

              {/* Big Modern Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-black/20 hover:bg-black/30 backdrop-blur-lg text-white font-bold px-6 py-4 rounded-xl transition-all duration-200 border border-white/20 text-lg shadow-md">
                  Details
                </button>
                <button className="flex-1 bg-black/20 hover:bg-black/30 backdrop-blur-lg text-white font-bold px-6 py-4 rounded-xl transition-all duration-200 border border-white/20 text-lg shadow-md">
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
