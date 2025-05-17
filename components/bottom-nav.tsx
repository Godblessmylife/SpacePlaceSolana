"use client"

import Link from "next/link"
import { Home, Rocket, Wallet, Users, ImageIcon, Trophy } from "lucide-react"
import { useState } from "react"

export default function BottomNav({ activeTab = "home" }: { activeTab?: string }) {
  const [pressedTab, setPressedTab] = useState<string | null>(null)

  const tabs = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "airdrop", label: "AirDrop", icon: Rocket, href: "/airdrop" },
    { id: "earns", label: "Earns", icon: Wallet, href: "/earns" },
    { id: "quests", label: "Quests", icon: Trophy, href: "/quests" },
    { id: "friends", label: "Friends", icon: Users, href: "/friends" },
    { id: "nft", label: "NFT", icon: ImageIcon, href: "/nft-collection" },
  ]

  // Изменяем код, добавляя проверку для space-shooter
  const currentPath = typeof window !== "undefined" ? window.location.pathname : ""
  const isSpaceShooter = currentPath.includes("space-shooter")
  const activeTabId = isSpaceShooter ? "home" : activeTab

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 py-2 z-50">
      <div className="grid grid-cols-6 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTabId === tab.id
          const isPressed = pressedTab === tab.id

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`
                flex flex-col items-center justify-center py-1 px-1 relative
                transition-all duration-300 ease-in-out
                ${isActive ? "text-white" : "text-gray-500"}
                ${isActive ? "nav-item-active" : ""}
                ${isPressed ? "scale-110" : ""}
                cursor-pointer
              `}
              onMouseDown={() => setPressedTab(tab.id)}
              onMouseUp={() => setPressedTab(null)}
              onMouseLeave={() => setPressedTab(null)}
              onTouchStart={() => setPressedTab(tab.id)}
              onTouchEnd={() => setPressedTab(null)}
            >
              <div
                className={`
                  absolute inset-0 rounded-lg opacity-0
                  ${isActive ? "nav-glow opacity-100" : ""}
                  ${isPressed ? "nav-glow-pressed opacity-100" : ""}
                `}
              ></div>
              <Icon className={`h-4 w-4 z-10 ${isActive ? "text-amber-400" : "text-gray-500"}`} />
              <span className={`text-[10px] mt-1 z-10 ${isActive ? "text-amber-400" : "text-gray-500"}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
