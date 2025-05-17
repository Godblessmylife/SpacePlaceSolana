"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { isWalletStandardSupported, getAvailableWallets, createPhantomConnectDeepLink } from "@/lib/wallet-standard"

export default function DebugWalletPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [walletStandardSupported, setWalletStandardSupported] = useState(false)
  const [availableWallets, setAvailableWallets] = useState<string[]>([])
  const [connectedWallet, setConnectedWallet] = useState<any>(null)
  const [deepLink, setDeepLink] = useState("")

  useEffect(() => {
    // Проверяем, мобильное ли устройство
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

    // Проверяем поддержку Wallet Standard
    setWalletStandardSupported(isWalletStandardSupported())

    // Получаем список доступных кошельков
    setAvailableWallets(getAvailableWallets())

    // Проверяем подключенный кошелек
    const savedWallet = localStorage.getItem("connected_wallet")
    if (savedWallet) {
      try {
        setConnectedWallet(JSON.parse(savedWallet))
      } catch (e) {
        console.error("Ошибка при чтении данных кошелька", e)
      }
    }

    // Создаем deeplink для Phantom
    const appUrl = typeof window !== "undefined" ? window.location.origin : "https://v0-bullish-treusary.vercel.app"

    const link = createPhantomConnectDeepLink("Monkey NFT", appUrl)
    setDeepLink(link)
  }, [])

  const handleConnectPhantom = () => {
    if (typeof window === "undefined") return

    // Открываем приложение Phantom
    window.location.href = deepLink
  }

  const handleClearStorage = () => {
    localStorage.removeItem("connected_wallet")
    localStorage.removeItem("phantom_session_id")
    setConnectedWallet(null)
    window.location.reload()
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Отладка подключения кошелька</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Информация об устройстве</h2>
        <p>
          <strong>Тип устройства:</strong> {isMobile ? "Мобильное" : "Десктоп"}
        </p>
        <p>
          <strong>User Agent:</strong> {navigator.userAgent}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Wallet Standard</h2>
        <p>
          <strong>Поддержка:</strong> {walletStandardSupported ? "Да" : "Нет"}
        </p>
        <p>
          <strong>Доступные кошельки:</strong> {availableWallets.length > 0 ? availableWallets.join(", ") : "Нет"}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Подключенный кошелек</h2>
        {connectedWallet ? (
          <div>
            <p>
              <strong>Тип:</strong> {connectedWallet.type}
            </p>
            <p>
              <strong>Адрес:</strong> {connectedWallet.address}
            </p>
            <p>
              <strong>Баланс:</strong> {connectedWallet.balance}
            </p>
          </div>
        ) : (
          <p>Нет подключенного кошелька</p>
        )}
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Deeplink для Phantom</h2>
        <p className="break-all mb-2">{deepLink}</p>
        <Button onClick={handleConnectPhantom} className="mb-2">
          Открыть Phantom
        </Button>
        <p className="text-xs text-gray-500">Нажмите кнопку выше, чтобы открыть приложение Phantom с deeplink</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Действия</h2>
        <Button onClick={handleClearStorage} variant="destructive">
          Очистить данные кошелька
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Нажмите кнопку выше, чтобы очистить данные кошелька из localStorage
        </p>
      </div>
    </div>
  )
}
