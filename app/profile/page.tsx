"use client"

import type React from "react"

import { useState, useEffect } from "react"
import NavBar from "@/components/nav-bar"
import BottomNav from "@/components/bottom-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const [walletInfo, setWalletInfo] = useState<{
    type: string
    address: string
    balance: string
  } | null>(null)

  const [username, setUsername] = useState("defimastercap")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [newUsername, setNewUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("/cartoon-monkey-glasses.png")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Загружаем информацию о кошельке при монтировании компонента
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWallet = localStorage.getItem("connected_wallet")
      if (savedWallet) {
        try {
          const wallet = JSON.parse(savedWallet)
          setWalletInfo(wallet)
        } catch (e) {
          console.error("Ошибка при чтении данных кошелька", e)
        }
      }
    }
  }, [])

  // Загружаем данные профиля при монтировании компонента
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("user_profile")
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile)
          if (profile.username) setUsername(profile.username)
          if (profile.avatarUrl) setAvatarUrl(profile.avatarUrl)
        } catch (e) {
          console.error("Ошибка при чтении данных профиля", e)
        }
      }
    }
  }, [])

  // Функция для копирования адреса кошелька
  const copyWalletAddress = () => {
    if (!walletInfo?.address) return

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(walletInfo.address)
      toast({
        title: "Адрес скопирован",
        description: "Адрес кошелька скопирован в буфер обмена",
      })
    }
  }

  // Функция для форматирования адреса кошелька (сокращение для отображения)
  const formatAddress = (address: string) => {
    if (!address) return ""
    if (address.length <= 16) return address
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`
  }

  // Получаем название кошелька для отображения
  const getWalletName = (type: string) => {
    switch (type) {
      case "ton":
        return "TON Keeper"
      case "telegram":
        return "Telegram Wallet"
      case "phantom":
        return "Phantom Wallet"
      default:
        return "Wallet"
    }
  }

  // Обработчик выбора файла аватарки
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Создаем URL для предпросмотра
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Функция сохранения профиля
  const saveProfile = () => {
    // Если имя пользователя не пустое, сохраняем его
    if (newUsername.trim()) {
      setUsername(newUsername)
    }

    // Если выбран новый файл аватарки, сохраняем его URL
    if (previewUrl) {
      setAvatarUrl(previewUrl)
    }

    // Сохраняем в localStorage
    const profileData = {
      username: newUsername.trim() ? newUsername : username,
      avatarUrl: previewUrl || avatarUrl,
    }
    localStorage.setItem("user_profile", JSON.stringify(profileData))

    // Закрываем режим редактирования
    setIsEditingProfile(false)
    setSelectedFile(null)
    setPreviewUrl(null)

    toast({
      title: "Профиль обновлен",
      description: "Ваши изменения успешно сохранены",
    })
  }

  return (
    <main className="flex min-h-screen flex-col">
      <NavBar />

      <div className="flex-1 p-4 pb-20">
        <div className="bg-secondary rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <div className="relative">
              <Avatar className="h-14 w-14 mr-4">
                <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile" />
                <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-amber-500 text-black hover:bg-amber-600"
                onClick={() => {
                  setIsEditingProfile(true)
                  setNewUsername(username)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                </svg>
              </Button>
            </div>
            <div>
              <div className="flex items-center">
                <div className="font-bold text-lg">{username}</div>
                <CheckCircle className="h-5 w-5 text-green-500 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Информация о кошельке */}
        <div className="bg-secondary rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold mb-3">Wallet</h2>

          {walletInfo ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{getWalletName(walletInfo.type)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Balance:</span>
                <div className="flex items-center">
                  <Image
                    src="/images/gold-logo.jpg"
                    alt="Gold coin"
                    width={16}
                    height={16}
                    className="mr-2 rounded-full"
                  />
                  <span className="font-medium">{walletInfo.balance} $GOLD</span>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">Address:</span>
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm" onClick={copyWalletAddress} className="h-6 p-0 mr-1">
                      <Copy className="h-4 w-4 text-amber-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 p-0"
                      onClick={() => {
                        // Открываем адрес в обозревателе блокчейна в зависимости от типа кошелька
                        let explorerUrl = ""
                        if (walletInfo.type === "phantom") {
                          explorerUrl = `https://explorer.solana.com/address/${walletInfo.address}`
                        } else if (walletInfo.type === "ton") {
                          explorerUrl = `https://tonscan.org/address/${walletInfo.address}`
                        } else {
                          explorerUrl = `https://tonscan.org/address/${walletInfo.address}`
                        }
                        window.open(explorerUrl, "_blank")
                      }}
                    >
                      <ExternalLink className="h-4 w-4 text-amber-500" />
                    </Button>
                  </div>
                </div>
                <div className="bg-black p-2 rounded text-xs break-all font-mono">{walletInfo.address}</div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 border-amber-500 text-amber-500 hover:bg-amber-500/10"
                onClick={() => {
                  localStorage.removeItem("connected_wallet")
                  setWalletInfo(null)
                  toast({
                    title: "Кошелек отключен",
                    description: "Вы успешно отключили кошелек",
                  })
                }}
              >
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-3">Wallet not connected</p>
              <Button
                className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400"
                onClick={() => {
                  // Открываем диалог подключения кошелька
                  const connectButton = document.querySelector("[data-wallet-connect-button]")
                  if (connectButton instanceof HTMLElement) {
                    connectButton.click()
                  }
                }}
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </div>

        <div className="bg-secondary rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Image src="/images/gold-logo.jpg" alt="Gold coin" width={40} height={40} className="mr-4 rounded-full" />
            <div className="text-3xl font-bold">9 354 276 $GOLD</div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Your NFTs</h2>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, index) => (
              <Link href={`/nft/${index}`} key={index}>
                <Image
                  src="/images/nft-image.gif"
                  alt={`NFT ${index}`}
                  width={100}
                  height={100}
                  className="rounded-lg aspect-square object-cover"
                />
              </Link>
            ))}
          </div>
          <div className="mt-2 text-center">
            <Button variant="link" className="text-green-500">
              View NFT
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2">58</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Модальное окно редактирования профиля */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-secondary rounded-lg p-4 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Редактирование профиля</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Аватар</label>
              <div className="flex items-center">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={previewUrl || avatarUrl} alt="Preview" />
                  <AvatarFallback>
                    {newUsername.substring(0, 2).toUpperCase() || username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-black py-2 px-4 rounded-md">
                  Выбрать файл
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Имя пользователя</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full p-2 bg-black rounded-md border border-gray-700 focus:border-amber-500 focus:outline-none"
                placeholder="Введите имя пользователя"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditingProfile(false)
                  setSelectedFile(null)
                  setPreviewUrl(null)
                }}
              >
                Отмена
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-black" onClick={saveProfile}>
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activeTab="home" />
    </main>
  )
}
