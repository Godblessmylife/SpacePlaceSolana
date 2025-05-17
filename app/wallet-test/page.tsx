"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import WalletInfo from "@/components/wallet-info"
import { useToast } from "@/hooks/use-toast"

export default function WalletTestPage() {
  const { publicKey, sendTransaction, connected } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Функция для определения типа устройства
  const isMobileDevice = () => {
    if (typeof window === "undefined") return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // Функция для отправки тестовой транзакции
  const sendTestTransaction = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Ошибка",
        description: "Кошелек не подключен",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Здесь должен быть код для создания и отправки транзакции
      // Для демонстрации просто имитируем задержку
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Успех",
        description: "Тестовая транзакция успешно отправлена",
      })
    } catch (error) {
      console.error("Ошибка при отправке транзакции:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось отправить транзакцию",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Тестирование подключения к кошельку</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Информация об устройстве</h2>
            <p className="mb-2">
              <span className="font-medium">Тип устройства:</span>{" "}
              <span className="text-amber-500">{isMobileDevice() ? "Мобильное" : "Десктоп"}</span>
            </p>
            <p className="mb-2">
              <span className="font-medium">User Agent:</span>{" "}
              <span className="text-xs break-all">{typeof navigator !== "undefined" ? navigator.userAgent : ""}</span>
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Подключение кошелька</h2>
            <div className="flex flex-col gap-4">
              <div>
                <p className="mb-2">Стандартная кнопка Wallet Adapter:</p>
                <WalletMultiButton />
              </div>

              <div>
                <p className="mb-2">Кастомная кнопка:</p>
                <Button
                  onClick={sendTestTransaction}
                  disabled={!connected || isLoading}
                  className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black"
                >
                  {isLoading ? "Отправка..." : "Отправить тестовую транзакцию"}
                </Button>
              </div>

              <div className="text-sm text-gray-400 mt-2">
                <p>
                  Статус подключения:{" "}
                  <span className={connected ? "text-green-500" : "text-red-500"}>
                    {connected ? "Подключено" : "Не подключено"}
                  </span>
                </p>
                {publicKey && (
                  <p>
                    Публичный ключ: <span className="text-amber-500">{publicKey.toString()}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <WalletInfo />

          <div className="bg-gray-800 p-6 rounded-lg mt-6">
            <h2 className="text-xl font-semibold mb-4">Инструкции для мобильных устройств</h2>
            <div className="space-y-4 text-sm">
              <p>
                <span className="font-medium text-amber-500">Вариант 1:</span> Откройте эту страницу в браузере
                приложения Phantom, выбрав "Открыть в браузере" в меню приложения.
              </p>
              <p>
                <span className="font-medium text-amber-500">Вариант 2:</span> Используйте мобильный браузер и нажмите
                кнопку подключения. Вы будете перенаправлены в приложение Phantom для подтверждения.
              </p>
              <p>
                <span className="font-medium text-amber-500">Вариант 3:</span> Если у вас нет приложения Phantom,
                установите его из{" "}
                <a
                  href="https://phantom.app/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 underline"
                >
                  официального источника
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
