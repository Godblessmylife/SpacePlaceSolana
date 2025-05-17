"use client"

import { useState, useEffect } from "react"
import NavBar from "@/components/nav-bar"
import BottomNav from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Search,
  Gift,
  Award,
  Crown,
  Star,
  Heart,
  Send,
  Trash2,
  Share2,
  UserPlus,
  MessageSquare,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Типы данных
interface Friend {
  id: string
  name: string
  avatar: string
  level: number
  gold: number
  online: boolean
  lastActive: string
  isFavorite: boolean
}

interface GiftItem {
  id: string
  name: string
  icon: string
  value: number
  cooldown: number
  lastSent: string | null
}

export default function FriendsPage() {
  const { toast } = useToast()
  const [friends, setFriends] = useState<Friend[]>([])
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [showGiftModal, setShowGiftModal] = useState(false)
  const [gifts, setGifts] = useState<GiftItem[]>([])
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState<"level" | "gold" | "name">("level")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [origin, setOrigin] = useState("")

  // Загрузка данных при первом рендере
  useEffect(() => {
    // Имитация загрузки данных с сервера
    setIsLoading(true)
    setTimeout(() => {
      // Демо-данные для друзей
      const demoFriends: Friend[] = [
        {
          id: "1",
          name: "CryptoKing",
          avatar: "/diverse-group-avatars.png",
          level: 8,
          gold: 1245,
          online: true,
          lastActive: "now",
          isFavorite: true,
        },
        {
          id: "2",
          name: "GoldMiner99",
          avatar: "/pandora-ocean-scene.png",
          level: 6,
          gold: 890,
          online: false,
          lastActive: "2h ago",
          isFavorite: false,
        },
        {
          id: "3",
          name: "BlockchainBaron",
          avatar: "/diverse-group-futuristic-setting.png",
          level: 10,
          gold: 2100,
          online: true,
          lastActive: "now",
          isFavorite: true,
        },
        {
          id: "4",
          name: "TokenTrader",
          avatar: "/diverse-group-futuristic-avatars.png",
          level: 5,
          gold: 450,
          online: false,
          lastActive: "1d ago",
          isFavorite: false,
        },
        {
          id: "5",
          name: "NFTCollector",
          avatar: "/diverse-futuristic-avatars.png",
          level: 7,
          gold: 980,
          online: false,
          lastActive: "3h ago",
          isFavorite: false,
        },
      ]

      // Демо-данные для запросов в друзья
      const demoPendingRequests: Friend[] = [
        {
          id: "6",
          name: "CryptoNewbie",
          avatar: "/diverse-group-avatars.png",
          level: 3,
          gold: 120,
          online: true,
          lastActive: "now",
          isFavorite: false,
        },
        {
          id: "7",
          name: "GoldHunter",
          avatar: "/diverse-group-futuristic-avatars.png",
          level: 4,
          gold: 230,
          online: false,
          lastActive: "5h ago",
          isFavorite: false,
        },
      ]

      // Демо-данные для подарков
      const demoGifts: GiftItem[] = [
        {
          id: "gift1",
          name: "Lucky Coin",
          icon: "🪙",
          value: 5,
          cooldown: 24, // часов
          lastSent: null,
        },
        {
          id: "gift2",
          name: "Gold Nugget",
          icon: "💰",
          value: 10,
          cooldown: 48,
          lastSent: null,
        },
        {
          id: "gift3",
          name: "Treasure Chest",
          icon: "🧰",
          value: 25,
          cooldown: 72,
          lastSent: null,
        },
      ]

      setFriends(demoFriends)
      setPendingRequests(demoPendingRequests)
      setGifts(demoGifts)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Безопасный доступ к window.location.origin
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  // Сортировка друзей
  const sortedFriends = [...friends].sort((a, b) => {
    if (sortBy === "level") {
      return sortDirection === "desc" ? b.level - a.level : a.level - b.level
    } else if (sortBy === "gold") {
      return sortDirection === "desc" ? b.gold - a.gold : a.gold - b.gold
    } else {
      return sortDirection === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    }
  })

  // Фильтрация друзей по поиску
  const filteredFriends = sortedFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Обработчик изменения сортировки
  const handleSortChange = (newSortBy: "level" | "gold" | "name") => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSortBy)
      setSortDirection("desc")
    }
  }

  // Обработчик добавления друга
  const handleAcceptFriend = (friend: Friend) => {
    setPendingRequests((prev) => prev.filter((req) => req.id !== friend.id))
    setFriends((prev) => [...prev, friend])
    toast({
      title: "Запрос принят",
      description: `${friend.name} добавлен в список друзей!`,
    })
  }

  // Обработчик отклонения запроса в друзья
  const handleRejectFriend = (friend: Friend) => {
    setPendingRequests((prev) => prev.filter((req) => req.id !== friend.id))
    toast({
      title: "Запрос отклонен",
      description: `Запрос от ${friend.name} отклонен.`,
    })
  }

  // Обработчик удаления друга
  const handleRemoveFriend = (friend: Friend) => {
    setFriends((prev) => prev.filter((f) => f.id !== friend.id))
    if (selectedFriend?.id === friend.id) {
      setSelectedFriend(null)
    }
    toast({
      title: "Друг удален",
      description: `${friend.name} удален из списка друзей.`,
    })
  }

  // Обработчик отправки подарка
  const handleSendGift = () => {
    if (!selectedFriend || !selectedGift) return

    // Обновляем время последней отправки подарка
    setGifts((prev) =>
      prev.map((gift) => (gift.id === selectedGift.id ? { ...gift, lastSent: new Date().toISOString() } : gift)),
    )

    // Закрываем модальное окно
    setShowGiftModal(false)
    setSelectedGift(null)

    // Показываем уведомление
    toast({
      title: "Подарок отправлен!",
      description: `Вы отправили ${selectedGift.name} пользователю ${selectedFriend.name}!`,
    })
  }

  // Обработчик добавления в избранное
  const handleToggleFavorite = (friend: Friend) => {
    setFriends((prev) => prev.map((f) => (f.id === friend.id ? { ...f, isFavorite: !f.isFavorite } : f)))

    if (selectedFriend?.id === friend.id) {
      setSelectedFriend({ ...selectedFriend, isFavorite: !selectedFriend.isFavorite })
    }

    toast({
      title: friend.isFavorite ? "Удалено из избранного" : "Добавлено в избранное",
      description: `${friend.name} ${friend.isFavorite ? "удален из" : "добавлен в"} избранное.`,
    })
  }

  // Обработчик копирования реферальной ссылки
  const handleCopyReferralLink = () => {
    const link = `${origin}?ref=user123`
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link)
      toast({
        title: "Ссылка скопирована",
        description: "Реферальная ссылка скопирована в буфер обмена",
      })
    }
  }

  // Проверка доступности подарка (кулдаун)
  const isGiftAvailable = (gift: GiftItem) => {
    if (!gift.lastSent) return true

    const lastSent = new Date(gift.lastSent)
    const now = new Date()
    const diffHours = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60)

    return diffHours >= gift.cooldown
  }

  // Расчет оставшегося времени кулдауна
  const getRemainingCooldown = (gift: GiftItem) => {
    if (!gift.lastSent) return "0h 0m"

    const lastSent = new Date(gift.lastSent)
    const now = new Date()
    const diffHours = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60)
    const remainingHours = Math.max(0, gift.cooldown - diffHours)

    const hours = Math.floor(remainingHours)
    const minutes = Math.floor((remainingHours - hours) * 60)

    return `${hours}h ${minutes}m`
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
          <h1 className="text-3xl font-bold text-center mb-2">Friends</h1>
          <p className="text-center text-muted-foreground mb-6">Play together, earn more!</p>

          <Tabs defaultValue="friends" className="mb-6">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="friends">
                <Users className="h-4 w-4 mr-2" />
                Friends
              </TabsTrigger>
              <TabsTrigger value="requests">
                <UserPlus className="h-4 w-4 mr-2" />
                Requests
                {pendingRequests.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">{pendingRequests.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="invite">
                <Share2 className="h-4 w-4 mr-2" />
                Invite
              </TabsTrigger>
            </TabsList>

            {/* Вкладка со списком друзей */}
            <TabsContent value="friends" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search friends..."
                  className="pl-10 bg-black bg-opacity-50 border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Сортировка */}
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Sort by:</span>
                <div className="flex space-x-2">
                  <button
                    className={`flex items-center ${sortBy === "level" ? "text-amber-500" : ""}`}
                    onClick={() => handleSortChange("level")}
                  >
                    Level
                    {sortBy === "level" &&
                      (sortDirection === "desc" ? (
                        <ArrowDown className="h-3 w-3 ml-1" />
                      ) : (
                        <ArrowUp className="h-3 w-3 ml-1" />
                      ))}
                  </button>
                  <button
                    className={`flex items-center ${sortBy === "gold" ? "text-amber-500" : ""}`}
                    onClick={() => handleSortChange("gold")}
                  >
                    Gold
                    {sortBy === "gold" &&
                      (sortDirection === "desc" ? (
                        <ArrowDown className="h-3 w-3 ml-1" />
                      ) : (
                        <ArrowUp className="h-3 w-3 ml-1" />
                      ))}
                  </button>
                  <button
                    className={`flex items-center ${sortBy === "name" ? "text-amber-500" : ""}`}
                    onClick={() => handleSortChange("name")}
                  >
                    Name
                    {sortBy === "name" &&
                      (sortDirection === "desc" ? (
                        <ArrowDown className="h-3 w-3 ml-1" />
                      ) : (
                        <ArrowUp className="h-3 w-3 ml-1" />
                      ))}
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-amber-500 rounded-full border-t-transparent"></div>
                </div>
              ) : filteredFriends.length > 0 ? (
                <div className="space-y-3">
                  {filteredFriends.map((friend) => (
                    <Card
                      key={friend.id}
                      className={`bg-black bg-opacity-80 border ${
                        friend.isFavorite ? "border-amber-500" : "border-gray-700"
                      } hover:border-amber-500 transition-all cursor-pointer`}
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center">
                          <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-gray-700">
                              <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                              <AvatarFallback>{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {friend.online && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border border-black"></div>
                            )}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center">
                              <h3 className="font-medium">{friend.name}</h3>
                              {friend.isFavorite && <Star className="h-3 w-3 ml-1 text-amber-500 fill-amber-500" />}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="mr-2">Lvl {friend.level}</span>
                              <span className="flex items-center">
                                <Image
                                  src="/images/gold-logo.jpg"
                                  alt="Gold"
                                  width={12}
                                  height={12}
                                  className="rounded-full mr-1"
                                />
                                {friend.gold}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {friend.online ? (
                              <span className="text-green-500">Online</span>
                            ) : (
                              <span>{friend.lastActive}</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  {searchQuery ? "No friends match your search" : "You have no friends yet"}
                </div>
              )}
            </TabsContent>

            {/* Вкладка с запросами в друзья */}
            <TabsContent value="requests" className="space-y-4">
              {pendingRequests.length > 0 ? (
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <Card key={request.id} className="bg-black bg-opacity-80 border border-gray-700">
                      <CardContent className="p-3">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 border-2 border-gray-700">
                            <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                            <AvatarFallback>{request.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-1">
                            <h3 className="font-medium">{request.name}</h3>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="mr-2">Lvl {request.level}</span>
                              <span className="flex items-center">
                                <Image
                                  src="/images/gold-logo.jpg"
                                  alt="Gold"
                                  width={12}
                                  height={12}
                                  className="rounded-full mr-1"
                                />
                                {request.gold}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-black h-8 px-3"
                              onClick={() => handleAcceptFriend(request)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3"
                              onClick={() => handleRejectFriend(request)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">No pending friend requests</div>
              )}
            </TabsContent>

            {/* Вкладка с приглашением друзей */}
            <TabsContent value="invite" className="space-y-4">
              <Card className="bg-black bg-opacity-80 border border-amber-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-amber-500" />
                    <span>Invite Friends & Earn Rewards</span>
                  </CardTitle>
                  <CardDescription>Invite your friends and earn 10 Gold for each friend who joins!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-800 p-3 rounded-md text-sm">
                    <p className="mb-2">Your referral link:</p>
                    <div className="flex items-center">
                      <div className="bg-black p-2 rounded flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
                        {origin}?ref=user123
                      </div>
                      <Button className="ml-2 bg-blue-600 hover:bg-blue-700" onClick={handleCopyReferralLink}>
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Rewards:</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="bg-amber-500 text-black rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                          1
                        </div>
                        <div>Invite a friend using your referral link</div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-amber-500 text-black rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                          2
                        </div>
                        <div>Friend creates an account and connects wallet</div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-amber-500 text-black rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                          3
                        </div>
                        <div>You both receive 10 Gold as a reward!</div>
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-black"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.share) {
                          navigator
                            .share({
                              title: "Join me on Bullish Treasury NFT",
                              text: "Join me on Bullish Treasury NFT and get free Gold!",
                              url: `${origin}?ref=user123`,
                            })
                            .catch((err) => {
                              handleCopyReferralLink()
                            })
                        } else {
                          handleCopyReferralLink()
                        }
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black bg-opacity-80 border border-amber-500/30">
                <CardHeader>
                  <CardTitle>Invite Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total invites:</span>
                    <span className="font-medium">{friends.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Gold earned from invites:</span>
                    <span className="font-medium">{friends.length * 10}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Next milestone:</span>
                    <span className="font-medium">10 friends</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>{friends.length}/10 friends</span>
                      <span>Bonus: 50 Gold</span>
                    </div>
                    <Progress value={(friends.length / 10) * 100} className="h-2 bg-gray-700" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Модальное окно с информацией о друге */}
          {selectedFriend && (
            <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md bg-black border border-amber-500/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{selectedFriend.name}</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSelectedFriend(null)}>
                      ✕
                    </Button>
                  </div>
                  <CardDescription>
                    {selectedFriend.online ? "Online now" : `Last seen ${selectedFriend.lastActive}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-amber-500/30">
                        <AvatarImage src={selectedFriend.avatar || "/placeholder.svg"} alt={selectedFriend.name} />
                        <AvatarFallback>{selectedFriend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {selectedFriend.level >= 10 && (
                        <div className="absolute -top-2 -right-2">
                          <Crown className="h-6 w-6 text-amber-500 fill-amber-500" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-3 rounded-md">
                      <div className="text-xs text-muted-foreground mb-1">Level</div>
                      <div className="text-xl font-bold">{selectedFriend.level}</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-md">
                      <div className="text-xs text-muted-foreground mb-1">Gold</div>
                      <div className="text-xl font-bold flex items-center">
                        <Image
                          src="/images/gold-logo.jpg"
                          alt="Gold"
                          width={16}
                          height={16}
                          className="rounded-full mr-1"
                        />
                        {selectedFriend.gold}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Friendship Level</h3>
                    <div className="space-y-1">
                      <Progress value={65} className="h-2 bg-gray-700" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Level 3</span>
                        <span>650/1000 XP</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Achievements</h3>
                    <div className="flex space-x-2">
                      <div
                        className="bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center"
                        title="Early Adopter"
                      >
                        🚀
                      </div>
                      <div
                        className="bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center"
                        title="Gold Miner"
                      >
                        ⛏️
                      </div>
                      <div
                        className="bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center"
                        title="NFT Collector"
                      >
                        🖼️
                      </div>
                      <div
                        className="bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center opacity-50"
                        title="Coming Soon"
                      >
                        🔒
                      </div>
                      <div
                        className="bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center opacity-50"
                        title="Coming Soon"
                      >
                        🔒
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`h-9 ${selectedFriend.isFavorite ? "text-amber-500 border-amber-500" : ""}`}
                      onClick={() => handleToggleFavorite(selectedFriend)}
                    >
                      <Heart
                        className={`h-4 w-4 mr-1 ${selectedFriend.isFavorite ? "fill-amber-500 text-amber-500" : ""}`}
                      />
                      {selectedFriend.isFavorite ? "Favorited" : "Favorite"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 text-red-500"
                      onClick={() => {
                        handleRemoveFriend(selectedFriend)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={() => {
                        toast({
                          title: "Message sent",
                          description: `Your message has been sent to ${selectedFriend.name}.`,
                        })
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button
                      size="sm"
                      className="h-9 bg-amber-500 hover:bg-amber-600 text-black"
                      onClick={() => setShowGiftModal(true)}
                    >
                      <Gift className="h-4 w-4 mr-1" />
                      Gift
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Модальное окно отправки подарка */}
          {showGiftModal && selectedFriend && (
            <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md bg-black border border-amber-500/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>Send Gift to {selectedFriend.name}</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowGiftModal(false)}>
                      ✕
                    </Button>
                  </div>
                  <CardDescription>Choose a gift to send to your friend</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {gifts.map((gift) => {
                      const isAvailable = isGiftAvailable(gift)
                      return (
                        <div
                          key={gift.id}
                          className={`
                            border rounded-md p-3 text-center cursor-pointer transition-all
                            ${selectedGift?.id === gift.id ? "border-amber-500 bg-amber-500/10" : "border-gray-700"}
                            ${!isAvailable ? "opacity-50" : "hover:border-amber-500/50"}
                          `}
                          onClick={() => isAvailable && setSelectedGift(gift)}
                        >
                          <div className="text-3xl mb-2">{gift.icon}</div>
                          <div className="font-medium text-sm">{gift.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center justify-center mt-1">
                            <Image
                              src="/images/gold-logo.jpg"
                              alt="Gold"
                              width={12}
                              height={12}
                              className="rounded-full mr-1"
                            />
                            {gift.value}
                          </div>
                          {!isAvailable && (
                            <div className="text-xs text-red-500 mt-1">Cooldown: {getRemainingCooldown(gift)}</div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {selectedGift && (
                    <div className="bg-gray-800 p-3 rounded-md">
                      <div className="text-sm mb-2">Gift details:</div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Value:</span>
                        <span className="font-medium flex items-center">
                          <Image
                            src="/images/gold-logo.jpg"
                            alt="Gold"
                            width={12}
                            height={12}
                            className="rounded-full mr-1"
                          />
                          {selectedGift.value}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Cooldown:</span>
                        <span className="font-medium">{selectedGift.cooldown} hours</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                    disabled={!selectedGift}
                    onClick={handleSendGift}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Gift
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>

      <BottomNav activeTab="friends" />
    </main>
  )
}
