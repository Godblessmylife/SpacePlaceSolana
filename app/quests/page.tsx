"use client"

import { useState, useEffect } from "react"
import NavBar from "@/components/nav-bar"
import BottomNav from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Trophy, Star, Gift, Loader2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

// Типы для заданий
interface Quest {
  id: string
  title: string
  description: string
  reward: number
  type: "daily" | "weekly" | "achievement"
  progress: number
  goal: number
  completed: boolean
  claimed: boolean
  icon: string
  expiresAt?: string // для ежедневных и еженедельных заданий
}

export default function QuestsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "achievements">("daily")
  const [quests, setQuests] = useState<Quest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [claimingQuest, setClaimingQuest] = useState<string | null>(null)

  // Загрузка заданий при первом рендере
  useEffect(() => {
    const loadQuests = () => {
      setIsLoading(true)

      // Проверяем, есть ли сохраненные задания в localStorage
      const savedQuests = localStorage.getItem("quests_data")

      if (savedQuests) {
        try {
          const parsedQuests = JSON.parse(savedQuests)
          setQuests(parsedQuests)
          setIsLoading(false)
          return
        } catch (e) {
          console.error("Ошибка при загрузке заданий:", e)
        }
      }

      // Если нет сохраненных заданий или произошла ошибка, создаем новые
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const nextWeek = new Date(now)
      nextWeek.setDate(nextWeek.getDate() + 7)
      nextWeek.setHours(0, 0, 0, 0)

      // Демо-данные для заданий
      const demoQuests: Quest[] = [
        {
          id: "daily-1",
          title: "Ежедневный вход",
          description: "Войдите в игру",
          reward: 10,
          type: "daily",
          progress: 1,
          goal: 1,
          completed: true,
          claimed: false,
          icon: "🌅",
          expiresAt: tomorrow.toISOString(),
        },
        {
          id: "daily-2",
          title: "Майнинг золота",
          description: "Добудьте 5 золота с помощью майнера",
          reward: 15,
          type: "daily",
          progress: 0,
          goal: 5,
          completed: false,
          claimed: false,
          icon: "⛏️",
          expiresAt: tomorrow.toISOString(),
        },
        {
          id: "daily-3",
          title: "Поделиться с другом",
          description: "Отправьте подарок другу",
          reward: 20,
          type: "daily",
          progress: 0,
          goal: 1,
          completed: false,
          claimed: false,
          icon: "🎁",
          expiresAt: tomorrow.toISOString(),
        },
        {
          id: "weekly-1",
          title: "Коллекционер",
          description: "Соберите 3 NFT из коллекции",
          reward: 50,
          type: "weekly",
          progress: 1,
          goal: 3,
          completed: false,
          claimed: false,
          icon: "🖼️",
          expiresAt: nextWeek.toISOString(),
        },
        {
          id: "weekly-2",
          title: "Социальная активность",
          description: "Добавьте 5 друзей",
          reward: 75,
          type: "weekly",
          progress: 2,
          goal: 5,
          completed: false,
          claimed: false,
          icon: "👥",
          expiresAt: nextWeek.toISOString(),
        },
        {
          id: "weekly-3",
          title: "Торговец",
          description: "Совершите 3 сделки на рынке",
          reward: 100,
          type: "weekly",
          progress: 0,
          goal: 3,
          completed: false,
          claimed: false,
          icon: "💹",
          expiresAt: nextWeek.toISOString(),
        },
        {
          id: "achievement-1",
          title: "Первые шаги",
          description: "Подключите кошелек",
          reward: 30,
          type: "achievement",
          progress: 1,
          goal: 1,
          completed: true,
          claimed: false,
          icon: "🏆",
        },
        {
          id: "achievement-2",
          title: "Золотая лихорадка",
          description: "Накопите 1000 золота",
          reward: 200,
          type: "achievement",
          progress: 354,
          goal: 1000,
          completed: false,
          claimed: false,
          icon: "💰",
        },
        {
          id: "achievement-3",
          title: "Криптоэнтузиаст",
          description: "Создайте свой первый NFT",
          reward: 150,
          type: "achievement",
          progress: 0,
          goal: 1,
          completed: false,
          claimed: false,
          icon: "🚀",
        },
      ]

      setQuests(demoQuests)
      localStorage.setItem("quests_data", JSON.stringify(demoQuests))
      setIsLoading(false)
    }

    loadQuests()
  }, [])

  // Сохранение заданий при их изменении
  useEffect(() => {
    if (quests.length > 0 && !isLoading) {
      localStorage.setItem("quests_data", JSON.stringify(quests))
    }
  }, [quests, isLoading])

  // Функция для получения награды за задание
  const claimReward = async (quest: Quest) => {
    if (quest.completed && !quest.claimed) {
      setClaimingQuest(quest.id)

      try {
        // Имитация задержки сетевого запроса
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Обновляем баланс золота
        const savedMinerData = localStorage.getItem("miner_data")
        if (savedMinerData) {
          try {
            const minerData = JSON.parse(savedMinerData)
            minerData.goldBalance = (minerData.goldBalance || 0) + quest.reward
            localStorage.setItem("miner_data", JSON.stringify(minerData))
          } catch (e) {
            console.error("Ошибка при обновлении баланса золота:", e)
          }
        }

        // Обновляем статус задания
        setQuests((prevQuests) => prevQuests.map((q) => (q.id === quest.id ? { ...q, claimed: true } : q)))

        toast({
          title: "Награда получена!",
          description: `Вы получили ${quest.reward} Gold за выполнение задания "${quest.title}"`,
        })
      } catch (error) {
        console.error("Ошибка при получении награды:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось получить награду. Попробуйте позже.",
          variant: "destructive",
        })
      } finally {
        setClaimingQuest(null)
      }
    }
  }

  // Фильтрация заданий по типу
  const filteredQuests = quests.filter((quest) => {
    if (activeTab === "daily") return quest.type === "daily"
    if (activeTab === "weekly") return quest.type === "weekly"
    return quest.type === "achievement"
  })

  // Расчет времени до истечения срока задания
  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffMs = expiry.getTime() - now.getTime()

    if (diffMs <= 0) return "Истекло"

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${diffHrs}ч ${diffMins}м`
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
          <h1 className="text-3xl font-bold text-center mb-2">Quests</h1>
          <p className="text-center text-muted-foreground mb-6">Complete quests to earn Gold rewards!</p>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="daily">
                <Clock className="h-4 w-4 mr-2" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly">
                <Star className="h-4 w-4 mr-2" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
                </div>
              ) : filteredQuests.length > 0 ? (
                filteredQuests.map((quest) => (
                  <Card
                    key={quest.id}
                    className={`bg-black bg-opacity-80 border ${
                      quest.completed ? (quest.claimed ? "border-gray-700" : "border-amber-500") : "border-gray-700"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{quest.icon}</div>
                          <div>
                            <CardTitle className="text-base">{quest.title}</CardTitle>
                            <CardDescription>{quest.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Image
                            src="/images/gold-logo.jpg"
                            alt="Gold"
                            width={16}
                            height={16}
                            className="rounded-full mr-1"
                          />
                          <span className="font-bold text-amber-500">{quest.reward}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Progress: {quest.progress}/{quest.goal}
                          </span>
                          {quest.expiresAt && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {getTimeRemaining(quest.expiresAt)}
                            </span>
                          )}
                        </div>
                        <Progress
                          value={(quest.progress / quest.goal) * 100}
                          className={`h-2 ${quest.completed ? "bg-amber-900/30" : "bg-gray-800"}`}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={`w-full ${
                          quest.completed && !quest.claimed
                            ? "bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400"
                            : quest.completed && quest.claimed
                              ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                              : "bg-blue-900/30 text-blue-300 cursor-not-allowed"
                        }`}
                        disabled={!quest.completed || quest.claimed || claimingQuest === quest.id}
                        onClick={() => claimReward(quest)}
                      >
                        {claimingQuest === quest.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Claiming...
                          </>
                        ) : quest.completed && quest.claimed ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Claimed
                          </>
                        ) : quest.completed ? (
                          <>
                            <Gift className="h-4 w-4 mr-2" />
                            Claim Reward
                          </>
                        ) : (
                          "In Progress"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">No quests available at the moment</div>
              )}
            </TabsContent>
          </Tabs>

          <Card className="bg-black bg-opacity-80 border border-amber-500/30">
            <CardHeader>
              <CardTitle>Quest Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Daily quests reset every day at midnight</li>
                <li>• Weekly quests reset every Monday</li>
                <li>• Achievement rewards can be claimed only once</li>
                <li>• Complete quests to earn Gold and boost your progress</li>
                <li>• Some quests may require specific actions in the game</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav activeTab="quests" />
    </main>
  )
}
