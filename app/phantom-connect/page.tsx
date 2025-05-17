"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function PhantomConnectPage() {
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    // Генерируем новый идентификатор сессии
    const newSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setSessionId(newSessionId)

    // Сохраняем идентификатор сессии в localStorage
    localStorage.setItem("phantom_session_id", newSessionId)

    // Пытаемся подключиться к Phantom
    const connectToPhantom = async () => {
      try {
        // Проверяем, доступен ли Phantom в dApp браузере
        if (typeof window !== "undefined" && "phantom" in window) {
          const provider = (window as any).phantom?.solana

          if (provider?.isPhantom) {
            try {
              // Запрашиваем подключение к кошельку
              const response = await provider.connect()
              const publicKey = response.publicKey.toString()

              // Получаем баланс (в реальном приложении здесь был бы запрос к блокчейну)
              // Для демо используем фиксированное значение
              const balance = "5.7"

              // Сохраняем данные кошелька
              const walletData = {
                type: "phantom",
                address: publicKey,
                balance,
              }

              // Сохраняем данные в localStorage
              localStorage.setItem("connected_wallet", JSON.stringify(walletData))

              // Перенаправляем обратно в приложение с параметрами
              const appUrl = window.location.origin
              window.location.href = `${appUrl}?session=${newSessionId}&publicKey=${publicKey}`
            } catch (err) {
              console.error("Ошибка при подключении к Phantom:", err)
              setError("Не удалось подключиться к Phantom. Пожалуйста, попробуйте снова.")
              setIsConnecting(false)
            }
          } else {
            setError("Phantom не обнаружен в dApp браузере.")
            setIsConnecting(false)
          }
        } else {
          setError("Phantom не обнаружен. Пожалуйста, откройте эту страницу в браузере Phantom.")
          setIsConnecting(false)
        }
      } catch (error) {
        console.error("Ошибка при подключении:", error)
        setError("Произошла ошибка при подключении. Пожалуйста, попробуйте снова.")
        setIsConnecting(false)
      }
    }

    // Запускаем подключение с небольшой задержкой
    const timer = setTimeout(() => {
      connectToPhantom()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleRetry = () => {
    setIsConnecting(true)
    setError(null)
    window.location.reload()
  }

  const handleManualReturn = () => {
    // Перенаправляем обратно в приложение с параметрами
    const appUrl = window.location.origin
    window.location.href = `${appUrl}?session=${sessionId}&publicKey=PhantomMobile${Math.random().toString(36).substring(2, 10)}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Подключение к Phantom</h1>

        {isConnecting ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-amber-500 mb-4" />
            <p className="text-center text-gray-600">
              Подключение к Phantom Wallet... Пожалуйста, подтвердите подключение в приложении Phantom.
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center">
            <p className="text-center text-red-500 mb-4">{error}</p>
            <Button onClick={handleRetry} className="mb-2">
              Попробовать снова
            </Button>
            <Button variant="outline" onClick={handleManualReturn}>
              Вернуться в приложение (демо)
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-center text-green-500 mb-4">Подключение успешно! Перенаправление...</p>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Идентификатор сессии: {sessionId}</p>
        </div>
      </div>
    </div>
  )
}
