"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Loader2, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MobileWalletAdapter() {
  const { select, wallets, connecting, connected, publicKey } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Функция для определения мобильного устройства
  const isMobileDevice = () => {
    if (typeof window === "undefined") return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // Функция для подключения к Phantom на мобильном устройстве
  const connectPhantomMobile = async () => {
    setIsLoading(true)

    try {
      // Находим адаптер Phantom
      const phantomWallet = wallets.find((wallet) => wallet.adapter.name === "Phantom")

      if (!phantomWallet) {
        toast({
          title: "Wallet not found",
          description: "Phantom wallet adapter not found",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Выбираем адаптер Phantom
      select(phantomWallet.adapter.name)

      // Адаптер автоматически обработает deep linking и редирект
      // Это происходит внутри wallet-adapter

      toast({
        title: "Connecting to Phantom",
        description: "Please confirm the connection in the Phantom app",
      })
    } catch (error) {
      console.error("Error connecting to Phantom:", error)
      toast({
        title: "Connection error",
        description: "Failed to connect to Phantom. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Эффект для отслеживания состояния подключения
  useEffect(() => {
    if (connected && publicKey) {
      setIsLoading(false)
      toast({
        title: "Wallet connected",
        description: `Connected to ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`,
      })
    } else if (!connecting) {
      setIsLoading(false)
    }
  }, [connected, connecting, publicKey, toast])

  // Если не мобильное устройство, не показываем этот компонент
  if (!isMobileDevice()) return null

  return (
    <div className="mt-4">
      <Button
        onClick={connectPhantomMobile}
        disabled={isLoading || connecting || connected}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
      >
        {isLoading || connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : connected ? (
          "Connected to Phantom"
        ) : (
          <>
            <Smartphone className="mr-2 h-4 w-4" />
            Connect via Mobile Browser
          </>
        )}
      </Button>

      {isMobileDevice() && !connected && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          This will open Phantom app and return to this browser after connection
        </p>
      )}
    </div>
  )
}
