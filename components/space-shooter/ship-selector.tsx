"use client"

import type React from "react"

interface ShipSelectorProps {
  onSelectShip: (shipType: string) => void
  currentShip: string
}

const ShipSelector: React.FC<ShipSelectorProps> = ({ onSelectShip, currentShip }) => {
  const ships = [
    { id: "svgRocket", name: "SVG Rocket", image: "/images/space-rocket-svgrepo.png" },
    { id: "rocket", name: "Classic Rocket", image: "/images/space-rocket.png" },
    { id: "airplane", name: "Space Fighter", image: "/images/space-ship-1.png" },
  ]

  return (
    <div className="ship-selector bg-black bg-opacity-50 p-4 rounded-lg border border-gray-700 mb-4">
      <h3 className="text-white text-center mb-3 font-bold">Select Your Ship</h3>
      <div className="flex justify-center gap-4">
        {ships.map((ship) => (
          <div
            key={ship.id}
            className={`ship-option p-2 rounded-lg cursor-pointer transition-all ${
              currentShip === ship.id
                ? "bg-blue-900 border-2 border-blue-400 scale-110"
                : "bg-gray-800 border border-gray-600 hover:bg-gray-700"
            }`}
            onClick={() => onSelectShip(ship.id)}
          >
            <div className="w-16 h-16 flex items-center justify-center mb-1">
              <img
                src={ship.image || "/placeholder.svg"}
                alt={ship.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <p className="text-center text-xs text-white">{ship.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShipSelector
