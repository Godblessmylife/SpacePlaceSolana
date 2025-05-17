"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { isPhantomInstalled, createPhantomDeepLink } from "@/lib/wallet-utils"

export default function UserAgentTestPage() {
  const [userAgent, setUserAgent] = useState<string>("")
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isPhantom, setIsPhantom] = useState<boolean>(false)
  const [publicKey, setPublicKey] = useState<string>("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserAgent(navigator.userAgent)
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      setIsPhantom(isPhantomInstalled())
    }
  }, [])

  const connectPhantom = async () => {
    if (isMobile) {
      // Для мобильных устройств используем deeplink
      const currentUrl = window.location.href
      const phantomUrl = createPhantomDeepLink(currentUrl)
      window.location.href = phantomUrl
    } else {
      // Для десктопа используем расширение
      if (isPhantom) {
        try {
          const provider = (window as any).phantom?.solana
          const response = await provider.connect()
          setPublicKey(response.publicKey.toString())
        } catch (error) {
          console.error("Ошибка при подключении к Phantom:", error)
        }
      } else {
        alert("Phantom не установлен. Пожалуйста, установите расширение Phantom.")
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Тестирование User-Agent и Phantom</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Информация об устройстве</h2>
        <p className="mb-2">
          <strong>User-Agent:</strong> {userAgent}
        </p>
        <p className="mb-2">
          <strong>Тип устройства:</strong> {isMobile ? "Мобильное" : "Десктоп"}
        </p>
        <p className="mb-2">
          <strong>Phantom установлен:</strong> {isPhantom ? "Да" : "Нет"}
        </p>
        {publicKey && (
          <p className="mb-2">
            <strong>Публичный ключ:</strong> {publicKey}
          </p>
        )}
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Тестирование подключения</h2>
        <Button onClick={connectPhantom} className="mb-2">
          Подключить Phantom
        </Button>

        <h3 className="text-lg font-semibold mt-4 mb-2">Тестирование deeplink</h3>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const currentUrl = window.location.href
              window.location.href = `phantom://browse/${currentUrl}?ref=${encodeURIComponent(currentUrl)}`
            }}
          >
            phantom://browse/
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`
            }}
          >
            https://phantom.app/ul/browse/
          </Button>
        </div>
      </div>
    </div>
  )
}
