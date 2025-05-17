"use client"

import { useState, useEffect } from "react"
import NavBar from "@/components/nav-bar"
import BottomNav from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Gift, Calendar, Trophy, Users, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export default function AirdropPage() {
  const { toast } = useToast()
  const [dailyClaimAvailable, setDailyClaimAvailable] = useState(false)
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState("")
  const [claimProgress, setClaimProgress] = useState(0)
  const [streakDays, setStreakDays] = useState(0)
  const [referralCount, setReferralCount] = useState(0)
  const [isClaimAnimating, setIsClaimAnimating] = useState(false)
  const [claimReward, setClaimReward] = useState(0)

  // Загрузка данных из localStorage при первом рендере
  useEffect(() => {
    const savedData = localStorage.getItem("airdrop_data")
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setStreakDays(data.streakDays || 0)
        setReferralCount(data.referralCount || 0)

        // Проверяем, доступен ли ежедневный клейм
        const lastClaimTime = data.lastClaimTime
        if (lastClaimTime) {
          const now = new Date()
          const lastClaim = new Date(lastClaimTime)
          const nextClaimTime = new Date(lastClaim)
          nextClaimTime.setHours(nextClaimTime.getHours() + 24)

          if (now >= nextClaimTime) {
            setDailyClaimAvailable(true)
          } else {
            setDailyClaimAvailable(false)
            updateCountdown(nextClaimTime)
          }
        } else {
          setDailyClaimAvailable(true)
        }
      } catch (e) {
        console.error("Ошибка при загрузке данных аирдропа:", e)
        setDailyClaimAvailable(true)
      }
    } else {
      setDailyClaimAvailable(true)
    }

    // Устанавливаем прогресс для визуализации
    setClaimProgress(Math.min((streakDays / 7) * 100, 100))
  }, [streakDays])

  // Обновление обратного отсчета
  useEffect(() => {
    if (!dailyClaimAvailable) {
      const savedData = localStorage.getItem("airdrop_data")
      if (savedData) {
        try {
          const data = JSON.parse(savedData)
          const lastClaimTime = data.lastClaimTime
          if (lastClaimTime) {
            const lastClaim = new Date(lastClaimTime)
            const nextClaimTime = new Date(lastClaim)
            nextClaimTime.setHours(nextClaimTime.getHours() + 24)

            const interval = setInterval(() => {
              updateCountdown(nextClaimTime)
            }, 1000)

            return () => clearInterval(interval)
          }
        } catch (e) {
          console.error("Ошибка при обновлении обратного отсчета:", e)
        }
      }
    }
  }, [dailyClaimAvailable])

  // Функция обновления обратного отсчета
  const updateCountdown = (nextClaimTime: Date) => {
    const now = new Date()
    const diff = nextClaimTime.getTime() - now.getTime()

    if (diff <= 0) {
      setDailyClaimAvailable(true)
      setTimeUntilNextClaim("")
      return
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeUntilNextClaim(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    )
  }

  // Функция для получения аирдропа
  const claimAirdrop = () => {
    if (!dailyClaimAvailable) return

    setIsClaimAnimating(true)

    // Расчет награды на основе стрика
    const baseReward = 5 // Базовая награда 5 Gold
    const streakBonus = Math.min(streakDays, 7) // Бонус за стрик (максимум 7)
    const reward = baseReward + streakBonus
    setClaimReward(reward)

    setTimeout(() => {
      // Обновляем данные
      const newStreakDays = streakDays + 1
      setStreakDays(newStreakDays)
      setDailyClaimAvailable(false)
      setClaimProgress(Math.min((newStreakDays / 7) * 100, 100))

      // Обновляем баланс золота
      const savedMinerData = localStorage.getItem("miner_data")
      if (savedMinerData) {
        try {
          const minerData = JSON.parse(savedMinerData)
          minerData.goldBalance = (minerData.goldBalance || 0) + reward
          localStorage.setItem("miner_data", JSON.stringify(minerData))
        } catch (e) {
          console.error("Ошибка при обновлении баланса золота:", e)
        }
      }

      // Сохраняем данные аирдропа
      const now = new Date()
      localStorage.setItem(
        "airdrop_data",
        JSON.stringify({
          streakDays: newStreakDays,
          referralCount,
          lastClaimTime: now.toISOString(),
        }),
      )

      // Показываем уведомление
      toast({
        title: "Аирдроп получен!",
        description: `Вы получили ${reward} Gold! Приходите завтра за новой наградой.`,
      })

      // Обновляем время до следующего клейма
      const nextClaimTime = new Date(now)
      nextClaimTime.setHours(nextClaimTime.getHours() + 24)
      updateCountdown(nextClaimTime)

      setTimeout(() => {
        setIsClaimAnimating(false)
      }, 2000)
    }, 2000)
  }

  // Функция для копирования реферальной ссылки
  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=user123`
    navigator.clipboard.writeText(link)
    toast({
      title: "Ссылка скопирована",
      description: "Реферальная ссылка скопирована в буфер обмена",
    })
  }

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
          <h1 className="text-3xl font-bold text-center mb-2">AirDrop</h1>
          <p className="text-center text-muted-foreground mb-6">Claim daily rewards and invite friends!</p>

          {/* Секция ежедневного клейма */}
          <Card className="bg-black bg-opacity-80 border border-amber-500/30 mb-6 overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 ${isClaimAnimating ? "animate-pulse" : ""}`}
            ></div>
            <CardHeader className="pb-2 relative">
              <CardTitle className="flex items-center">
                <Gift className="h-5 w-5 mr-2 text-amber-500" />
                <span>Daily Reward</span>
              </CardTitle>
              <CardDescription>
                {dailyClaimAvailable
                  ? "Your daily reward is ready to claim!"
                  : `Next reward available in: ${timeUntilNextClaim}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex justify-center mb-4">
                <div
                  className={`w-32 h-32 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 flex items-center justify-center ${isClaimAnimating ? "animate-spin-slow" : ""}`}
                >
                  <div className="w-28 h-28 rounded-full bg-black flex items-center justify-center">
                    {isClaimAnimating ? (
                      <div className="text-2xl font-bold text-amber-500">+{claimReward}</div>
                    ) : (
                      <Image src="/images/gold-logo.jpg" alt="Gold" width={80} height={80} className="rounded-full" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Streak:</span>
                  </div>
                  <div className="flex items-center font-medium">
                    <span>{streakDays} days</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly progress:</span>
                    <span className="text-sm font-medium">{streakDays % 7}/7 days</span>
                  </div>
                  <Progress value={claimProgress} className="h-2 bg-gray-700" />
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-8 rounded flex items-center justify-center text-xs font-medium ${
                        index < (streakDays % 7)
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative">
              <Button
                onClick={claimAirdrop}
                disabled={!dailyClaimAvailable || isClaimAnimating}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold"
              >
                {isClaimAnimating ? (
                  <span className="flex items-center">
                    <span className="animate-pulse">Claiming...</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    CLAIM REWARD
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Секция реферальной программы */}
          <Card className="bg-black bg-opacity-80 border border-amber-500/30 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-amber-500" />
                <span>Referral Program</span>
              </CardTitle>
              <CardDescription>Invite friends and earn rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Your referrals:</span>
                </div>
                <div className="flex items-center font-medium">
                  <span>{referralCount} friends</span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Earn 10 Gold for each friend who joins using your referral link
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={copyReferralLink} className="w-full bg-blue-600 hover:bg-blue-700">
                Copy Referral Link
              </Button>
            </CardFooter>
          </Card>

          {/* Информационная секция */}
          <Card className="bg-black bg-opacity-80 border border-amber-500/30">
            <CardHeader>
              <CardTitle>Rewards Info</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Claim daily rewards every 24 hours</li>
                <li>• Maintain your streak for bigger rewards</li>
                <li>• Complete a 7-day streak for a special bonus</li>
                <li>• Invite friends to earn additional Gold</li>
                <li>• Use your Gold to upgrade your miner</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav activeTab="airdrop" />
    </main>
  )
}
