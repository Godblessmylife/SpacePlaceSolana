"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Loader2, Smartphone, ExternalLink, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import MobileWalletAdapter from "@/components/mobile-wallet-adapter"

export default function MobileConnectPage() {
  const { publicKey, connected, connecting, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Функция для определения мобильного устройства
  const isMobileDevice = () => {
    if (typeof window === "undefined") return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // Функция для копирования адреса кошелька
  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // Функция для отключения кошелька
  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet disconnected",
      description: "You have successfully disconnected your wallet",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mobile Wallet Connection Test</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Device Information</h2>
          <p className="mb-2">
            <span className="font-medium">Device type:</span>{" "}
            <span className="text-amber-500">{isMobileDevice() ? "Mobile" : "Desktop"}</span>
          </p>
          <p className="mb-4">
            <span className="font-medium">User Agent:</span>{" "}
            <span className="text-xs break-all">{typeof navigator !== "undefined" ? navigator.userAgent : ""}</span>
          </p>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Connect via Mobile Browser</h3>
            <p className="text-sm text-gray-400 mb-4">
              This method allows you to connect your Phantom wallet through your mobile browser. The app will open and
              return to this browser after connection.
            </p>

            <MobileWalletAdapter />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>

          {connected && publicKey ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-900/30 rounded-lg border border-green-500">
                <p className="text-green-400 font-medium">Wallet Connected</p>
                <div className="flex items-center mt-2">
                  <p className="text-sm text-gray-300 break-all mr-2">{publicKey.toString()}</p>
                  <button onClick={copyAddress} className="text-amber-500 hover:text-amber-400">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button onClick={handleDisconnect} variant="destructive" className="w-full">
                Disconnect Wallet
              </Button>

              <div className="text-center">
                <a
                  href={`https://explorer.solana.com/address/${publicKey.toString()}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-500 flex items-center justify-center gap-1 hover:underline"
                >
                  View on Solana Explorer <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ) : connecting ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-4" />
              <p className="text-gray-400">Connecting to wallet...</p>
            </div>
          ) : (
            <div className="text-center p-8">
              <Smartphone className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400 mb-4">No wallet connected</p>
              <p className="text-xs text-gray-500">Connect your wallet using the button on the left</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500">
            <h3 className="font-medium text-blue-400 mb-2">How it works</h3>
            <ol className="text-sm text-gray-300 list-decimal pl-4 space-y-2">
              <li>Click "Connect via Mobile Browser" button</li>
              <li>Phantom app will open automatically</li>
              <li>Approve the connection in Phantom</li>
              <li>You'll be redirected back to this browser</li>
              <li>Your wallet will be connected and ready to use</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
