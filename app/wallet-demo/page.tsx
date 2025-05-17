"use client"

import { useState, useEffect } from "react"
import NavBar from "@/components/nav-bar"
import BottomNav from "@/components/bottom-nav"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, ArrowRight, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WalletDemoPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletInfo, setWalletInfo] = useState<{
    type: string
    address: string
    balance: string
  } | null>(null)
  const { toast } = useToast()

  // Проверяем состояние подключения при загрузке страницы
  useEffect(() => {
    // Здесь в реальном приложении мы бы проверяли состояние подключения кошелька
    const checkConnection = () => {
      // Для демонстрации просто проверяем localStorage
      const savedWallet = localStorage.getItem("connected_wallet")
      if (savedWallet) {
        try {
          const wallet = JSON.parse(savedWallet)
          setIsConnected(true)
          setWalletInfo(wallet)
        } catch (e) {
          console.error("Ошибка при чтении данных кошелька", e)
        }
      }
    }

    checkConnection()
  }, [])

  // Имитация копирования адреса в буфер обмена
  const copyAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address)
      toast({
        title: "Адрес скопирован",
        description: "Адрес кошелька скопирован в буфер обмена",
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <NavBar showBack={true} />

      <div className="flex-1 p-4 pb-20">
        <h1 className="text-2xl font-bold text-center mb-6">Демонстрация подключения кошелька</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Статус подключения</CardTitle>
            <CardDescription>
              {isConnected
                ? "Ваш кошелек успешно подключен к приложению"
                : "Нажмите на кнопку 'Подключить кошелек' в верхнем правом углу"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected && walletInfo ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Тип кошелька:</span>
                  <span className="font-medium">{walletInfo.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Баланс:</span>
                  <span className="font-medium">{walletInfo.balance} TON</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Адрес:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs truncate max-w-[150px]">{walletInfo.address}</span>
                    <Button variant="ghost" size="icon" onClick={copyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Кошелек не подключен</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {isConnected ? (
              <div className="w-full space-y-4">
                <Button className="w-full" variant="outline">
                  Открыть в {walletInfo?.type}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-black">
                  Перейти к NFT
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground w-full text-center">
                Для использования всех функций приложения необходимо подключить кошелек
              </p>
            )}
          </CardFooter>
        </Card>

        <Tabs defaultValue="ton" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ton">TON Keeper</TabsTrigger>
            <TabsTrigger value="telegram">Telegram Wallet</TabsTrigger>
          </TabsList>
          <TabsContent value="ton" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="font-medium">Как подключить TON Keeper:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>Нажмите на кнопку "Подключить кошелек" в верхнем правом углу</li>
                <li>Выберите "TON Keeper" из списка доступных кошельков</li>
                <li>Подтвердите подключение в приложении TON Keeper</li>
                <li>Готово! Теперь вы можете использовать все функции приложения</li>
              </ol>
            </div>
          </TabsContent>
          <TabsContent value="telegram" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="font-medium">Как подключить Telegram Wallet:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>Нажмите на кнопку "Подключить кошелек" в верхнем правом углу</li>
                <li>Выберите "Telegram Wallet" из списка доступных кошельков</li>
                <li>Подтвердите подключение в Telegram</li>
                <li>Готово! Теперь вы можете использовать все функции приложения</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </main>
  )
}
