"use client"

import Link from "next/link"
import { MoreHorizontal, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import WalletConnect from "@/components/wallet-connect"
import { usePathname } from "next/navigation"

export default function NavBar({ showBack = false }: { showBack?: boolean }) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  return (
    <div className="p-4 flex items-center z-50 relative">
      {!isHomePage &&
        (showBack ? (
          <Link href="/" className="mr-4">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        ) : (
          <Link href="/" className="mr-4">
            <span className="font-bold">Back</span>
          </Link>
        ))}
      <div className="flex-1 text-center">
        <h1
          className="font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 animate-pulse-glow text-2xl"
          style={{
            textShadow:
              "0 0 10px rgba(255, 215, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3)",
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.05em",
            filter: "drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))",
            WebkitTextStroke: "0.5px rgba(255, 215, 0, 0.3)",
          }}
        >
          Space Place Solana
        </h1>
      </div>
      <WalletConnect />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full ml-2">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user-agent-test">User-Agent Test</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="https://t.me/monkey_app" target="_blank">
              Telegram Channel
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
