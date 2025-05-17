"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getBalance, getTransactions, isValidSolanaAddress, shortenAddress } from "@/lib/solana"
import { Loader2 } from "lucide-react"

export default function SolanaDemo() {
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<any>(null)
  const { toast } = useToast()

  // Проверяем, есть ли подключенный кошелек
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWallet = localStorage.getItem("connected_wallet")
      if (savedWallet) {
        try {
          const wallet = JSON.parse(savedWallet)
          setConnectedWallet(wallet)
          if (wallet.address && isValidSolanaAddress(wallet.address)) {
            setAddress(wallet.address)
            fetchWalletData(wallet.address)
          }
        } catch (e) {
          console.error("Ошибка при чтении данных кошелька", e)
        }
      }
    }
  }, [])

  // Функция для получения данных кошелька
  const fetchWalletData = async (walletAddress: string) => {
    if (!isValidSolanaAddress(walletAddress)) {
      toast({
        title: "Неверный адрес",
        description: "Пожалуйста, введите действительный адрес Solana",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Получаем баланс
      const walletBalance = await getBalance(walletAddress)
      setBalance(walletBalance)

      // Получаем транзакции
      const walletTransactions = await getTransactions(walletAddress, 5)
      setTransactions(walletTransactions)
    } catch (error) {
      console.error("Ошибка при получении данных кошелька:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось получить данные кошелька",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchWalletData(address)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Solana Web3.js Demo</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Проверка баланса</CardTitle>
            <CardDescription>Введите адрес кошелька Solana для проверки баланса</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="address">Адрес кошелька</Label>
                  <Input
                    id="address"
                    placeholder="Введите адрес Solana"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Проверить
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            {balance !== null && (
              <div className="w-full">
                <p className="font-semibold">Баланс: {balance} SOL</p>
                <p className="text-sm text-muted-foreground">Адрес: {shortenAddress(address, 8)}</p>
              </div>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Последние транзакции</CardTitle>
            <CardDescription>Последние транзакции для указанного адреса</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.map((tx, index) => (
                  <div key={index} className="p-3 bg-muted rounded-md">
                    <p className="font-mono text-xs break-all">{tx.signature}</p>
                    <div className="flex justify-between mt-1 text-xs">
                      <span>{new Date(tx.blockTime * 1000).toLocaleString()}</span>
                      <span className={tx.err ? "text-red-500" : "text-green-500"}>
                        {tx.err ? "Ошибка" : "Успешно"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : balance !== null ? (
              <p className="text-center py-4 text-muted-foreground">Транзакции не найдены</p>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Введите адрес кошелька для просмотра транзакций</p>
            )}
          </CardContent>
        </Card>
      </div>

      {connectedWallet && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Подключенный кошелек</CardTitle>
            <CardDescription>Информация о текущем подключенном кошельке</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="font-semibold">Тип:</span>
                <span>{connectedWallet.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Адрес:</span>
                <span className="font-mono">{shortenAddress(connectedWallet.address, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Баланс:</span>
                <span>{connectedWallet.balance} SOL</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
