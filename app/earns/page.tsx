"use client"

import { useState, useEffect, useRef } from "react"
import NavBar from "@/components/nav-bar"
import BottomNav from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUp, Clock, Coins, Download } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

// Константы для майнинга
const GOLD_PER_DAY = 16 // Базовое количество золота в день
const GOLD_PER_SECOND = GOLD_PER_DAY / 86400 // Золото в секунду
const UPGRADE_COSTS = [100, 300, 600, 1000, 2000] // Стоимость улучшений
const UPGRADE_MULTIPLIERS = [1, 1.5, 2, 3, 5, 8] // Множители для каждого уровня
const COLLECTION_THRESHOLD = 10 // Порог для сбора золота

export default function EarnsPage() {
  const { toast } = useToast()
  const [isMining, setIsMining] = useState(false)
  const [goldBalance, setGoldBalance] = useState(0)
  const [minerLevel, setMinerLevel] = useState(0)
  const [nextLevelProgress, setNextLevelProgress] = useState(0)
  const [pendingGold, setPendingGold] = useState(0)
  const [collectionProgress, setCollectionProgress] = useState(0)

  // Используем useRef вместо useState для lastUpdate, чтобы избежать повторных рендеров
  const lastUpdateRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Загрузка данных из localStorage при первом рендере
  useEffect(() => {
    const savedData = localStorage.getItem("miner_data")
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setGoldBalance(data.goldBalance || 0)
        setMinerLevel(data.minerLevel || 0)
        setIsMining(data.isMining || false)
        setPendingGold(data.pendingGold || 0)
        lastUpdateRef.current = data.lastUpdate || null
      } catch (e) {
        console.error("Ошибка при загрузке данных майнера:", e)
      }
    }
  }, [])

  // Обновление localStorage при изменении состояния
  useEffect(() => {
    localStorage.setItem(
      "miner_data",
      JSON.stringify({
        goldBalance,
        minerLevel,
        isMining,
        pendingGold,
        lastUpdate: lastUpdateRef.current,
      }),
    )
  }, [goldBalance, minerLevel, isMining, pendingGold])

  // Функция для расчета накопленного золота
  const calculateMining = () => {
    if (!isMining || !lastUpdateRef.current) return

    const now = Date.now()
    const elapsedSeconds = (now - lastUpdateRef.current) / 1000
    const multiplier = UPGRADE_MULTIPLIERS[minerLevel]
    const newGold = elapsedSeconds * GOLD_PER_SECOND * multiplier

    setPendingGold((prev) => {
      const updated = prev + newGold
      setCollectionProgress((updated / COLLECTION_THRESHOLD) * 100)
      return updated
    })

    lastUpdateRef.current = now
  }

  // Настройка интервала для майнинга
  useEffect(() => {
    // Очищаем предыдущий интервал, если он существует
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Если майнинг активен, устанавливаем новый интервал
    if (isMining) {
      // Если lastUpdate не установлен, устанавливаем его на текущее время
      if (!lastUpdateRef.current) {
        lastUpdateRef.current = Date.now()
      } else {
        // Рассчитываем золото, накопленное за время отсутствия
        calculateMining()
      }

      // Устанавливаем интервал для регулярного обновления
      intervalRef.current = setInterval(calculateMining, 1000)
    }

    // Очистка интервала при размонтировании компонента
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isMining, minerLevel]) // Зависимости только от isMining и minerLevel

  // Обновление прогресса до следующего уровня
  useEffect(() => {
    if (minerLevel < UPGRADE_COSTS.length) {
      const cost = UPGRADE_COSTS[minerLevel]
      setNextLevelProgress(Math.min((goldBalance / cost) * 100, 100))
    } else {
      setNextLevelProgress(100)
    }
  }, [goldBalance, minerLevel])

  // Функция для начала/остановки майнинга
  const toggleMining = () => {
    if (!isMining) {
      setIsMining(true)
      lastUpdateRef.current = Date.now()
      toast({
        title: "Майнинг запущен!",
        description: "Ваш майнер начал добывать золото",
      })
    } else {
      setIsMining(false)
      toast({
        title: "Майнинг остановлен",
        description: "Ваш майнер прекратил добычу золота",
      })
    }
  }

  // Функция для сбора намайненного золота
  const collectGold = () => {
    if (pendingGold > 0) {
      setGoldBalance((prev) => prev + pendingGold)
      setPendingGold(0)
      setCollectionProgress(0)
      toast({
        title: "Золото собрано!",
        description: `Вы собрали ${pendingGold.toFixed(2)} золота`,
      })
    }
  }

  // Функция для улучшения майнера
  const upgradeMiner = () => {
    if (minerLevel >= UPGRADE_COSTS.length) {
      toast({
        title: "Максимальный уровень",
        description: "Ваш майнер уже достиг максимального уровня",
      })
      return
    }

    const cost = UPGRADE_COSTS[minerLevel]
    if (goldBalance >= cost) {
      setGoldBalance((prev) => prev - cost)
      setMinerLevel((prev) => prev + 1)
      toast({
        title: "Майнер улучшен!",
        description: `Ваш майнер теперь уровня ${minerLevel + 1}`,
      })
    } else {
      toast({
        title: "Недостаточно золота",
        description: `Для улучшения требуется ${cost} золота`,
        variant: "destructive",
      })
    }
  }

  // Расчет текущей скорости майнинга
  const currentMiningRate = GOLD_PER_DAY * UPGRADE_MULTIPLIERS[minerLevel]
  const centPerDay = currentMiningRate / 16

  return (
    <main className="flex min-h-screen flex-col">
      <NavBar />

      <div
        className="flex-1 p-4 pb-24 relative"
        style={{
          backgroundImage: "url('/images/background-animation.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Полупрозрачный оверлей для улучшения читаемости */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-center mb-2">Earn Gold</h1>
          <p className="text-center text-muted-foreground mb-6">Mine gold and upgrade your miner!</p>

          <Card className="bg-black bg-opacity-80 border border-amber-500/30 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Your Gold Balance</span>
                <div className="flex items-center">
                  <Image src="/images/gold-logo.jpg" alt="Gold" width={20} height={20} className="rounded-full mr-2" />
                  <span>{goldBalance.toFixed(2)}</span>
                </div>
              </CardTitle>
              <CardDescription>Current value: ${(goldBalance / 1600).toFixed(4)} USD</CardDescription>
            </CardHeader>
          </Card>

          {/* Шкала добычи золота */}
          <Card className="bg-black bg-opacity-80 border border-amber-500/30 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Mining Progress</span>
                <div className="flex items-center">
                  <Image src="/images/gold-logo.jpg" alt="Gold" width={16} height={16} className="rounded-full mr-2" />
                  <span>{pendingGold.toFixed(2)}</span>
                </div>
              </CardTitle>
              <CardDescription>Collect when you reach {COLLECTION_THRESHOLD} gold</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <Progress
                value={collectionProgress}
                showValues={true}
                currentValue={pendingGold}
                maxValue={COLLECTION_THRESHOLD}
                valueSuffix=" Gold"
                className="h-3 bg-gray-800"
              />
            </CardContent>
            <CardFooter>
              <Button
                onClick={collectGold}
                disabled={pendingGold < 0.1}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black"
              >
                <Download className="h-4 w-4 mr-2" />
                Collect Gold
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className={`w-48 h-48 rounded-full bg-amber-500/20 flex items-center justify-center ${isMining ? "animate-pulse" : ""}`}
              >
                <img
                  src="/images/miner.gif"
                  alt="Gold Miner"
                  className="w-40 h-40 object-contain"
                  style={{ filter: isMining ? "brightness(1.2)" : "brightness(0.8)" }}
                />
              </div>
              {isMining && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold rounded-full px-2 py-1">
                  ACTIVE
                </div>
              )}
            </div>
          </div>

          <Card className="bg-black bg-opacity-80 border border-amber-500/30 mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Miner Stats</CardTitle>
              <CardDescription>Level {minerLevel + 1} Miner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Mining Rate:</span>
                </div>
                <div className="flex items-center font-medium">
                  <span>{currentMiningRate.toFixed(2)} Gold/day</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Coins className="h-4 w-4 mr-2 text-green-500" />
                  <span>Value:</span>
                </div>
                <div className="flex items-center font-medium">
                  <span>{centPerDay.toFixed(2)} ¢/day</span>
                </div>
              </div>
              {minerLevel < UPGRADE_COSTS.length && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next Level:</span>
                    <span className="text-sm font-medium">
                      {goldBalance.toFixed(2)} / {UPGRADE_COSTS[minerLevel]} Gold
                    </span>
                  </div>
                  <Progress
                    value={nextLevelProgress}
                    showValues={true}
                    currentValue={goldBalance}
                    maxValue={UPGRADE_COSTS[minerLevel]}
                    valueSuffix=" Gold"
                    className="h-2 bg-gray-700"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Button
                onClick={toggleMining}
                className={
                  isMining ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-black"
                }
              >
                {isMining ? "Stop Mining" : "Start Mining"}
              </Button>
              <Button
                onClick={upgradeMiner}
                disabled={minerLevel >= UPGRADE_COSTS.length || goldBalance < UPGRADE_COSTS[minerLevel]}
                className="bg-amber-500 hover:bg-amber-600 text-black"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade ({minerLevel < UPGRADE_COSTS.length ? UPGRADE_COSTS[minerLevel] : "MAX"})
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-black bg-opacity-80 border border-amber-500/30">
            <CardHeader>
              <CardTitle>Mining Info</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Base mining rate: 16 Gold per day</li>
                <li>• 16 Gold = 1¢ (USD)</li>
                <li>• Upgrade your miner to increase mining speed</li>
                <li>• Mining continues even when you're offline</li>
                <li>• Each level increases mining efficiency</li>
                <li>• Collect your gold when the mining progress is full</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav activeTab="earns" />
    </main>
  )
}
