"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import NavBar from "@/components/nav-bar"
import BottomNav from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, X, ImageIcon, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Attribute {
  id: string
  trait_type: string
  value: string
}

interface WalletInfo {
  type: string
  address: string
  balance: string
}

export default function CreateNFTPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Состояния для формы NFT
  const [nftName, setNftName] = useState("")
  const [nftDescription, setNftDescription] = useState("")
  const [nftImage, setNftImage] = useState<File | null>(null)
  const [nftImagePreview, setNftImagePreview] = useState<string | null>(null)
  const [nftAttributes, setNftAttributes] = useState<Attribute[]>([{ id: "1", trait_type: "", value: "" }])
  const [nftRoyalty, setNftRoyalty] = useState("5")
  const [nftPrice, setNftPrice] = useState("")

  // Проверяем подключение кошелька при загрузке страницы
  useEffect(() => {
    const checkWalletConnection = () => {
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
    }

    checkWalletConnection()
  }, [])

  // Обработчик загрузки изображения
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Проверяем тип файла
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      if (!validTypes.includes(file.type)) {
        setError("Пожалуйста, загрузите изображение в формате JPEG, PNG или GIF")
        return
      }

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Размер файла не должен превышать 5MB")
        return
      }

      setNftImage(file)
      setError(null)

      // Создаем URL для предпросмотра
      const reader = new FileReader()
      reader.onloadend = () => {
        setNftImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Обработчик добавления атрибута
  const addAttribute = () => {
    setNftAttributes([...nftAttributes, { id: Date.now().toString(), trait_type: "", value: "" }])
  }

  // Обработчик удаления атрибута
  const removeAttribute = (id: string) => {
    setNftAttributes(nftAttributes.filter((attr) => attr.id !== id))
  }

  // Обработчик изменения атрибута
  const updateAttribute = (id: string, field: "trait_type" | "value", value: string) => {
    setNftAttributes(nftAttributes.map((attr) => (attr.id === id ? { ...attr, [field]: value } : attr)))
  }

  // Функция для создания NFT
  const createNFT = async () => {
    // Проверяем подключение кошелька
    if (!walletInfo) {
      toast({
        title: "Кошелек не подключен",
        description: "Для создания NFT необходимо подключить кошелек",
        variant: "destructive",
      })
      return
    }

    // Валидация формы
    if (!nftName.trim()) {
      setError("Пожалуйста, укажите название NFT")
      return
    }

    if (!nftImage) {
      setError("Пожалуйста, загрузите изображение для NFT")
      return
    }

    // Проверяем, что все атрибуты заполнены
    const invalidAttributes = nftAttributes.filter((attr) => !attr.trait_type.trim() || !attr.value.trim())
    if (invalidAttributes.length > 0) {
      setError("Пожалуйста, заполните все поля атрибутов или удалите пустые")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Проверяем, что кошелек Phantom
      if (walletInfo.type === "phantom") {
        // Проверяем доступность Phantom в окне браузера
        if (typeof window !== "undefined" && "phantom" in window) {
          const provider = (window as any).phantom?.solana

          if (provider?.isPhantom) {
            try {
              // Проверяем, подключен ли кошелек
              if (!provider.isConnected) {
                await provider.connect()
              }

              // Здесь будет реальный код минтинга NFT через Phantom
              // Для демонстрации используем имитацию с задержкой
              await new Promise((resolve) => setTimeout(resolve, 3000))

              // Сохраняем созданный NFT в localStorage для демонстрации
              const createdNFTs = JSON.parse(localStorage.getItem("created_nfts") || "[]")

              const newNFT = {
                id: Date.now().toString(),
                name: nftName,
                description: nftDescription,
                image: nftImagePreview,
                attributes: nftAttributes.filter((attr) => attr.trait_type && attr.value),
                creator: walletInfo.address,
                price: nftPrice || "0.1 TON",
                royalty: nftRoyalty,
                createdAt: new Date().toISOString(),
              }

              createdNFTs.push(newNFT)
              localStorage.setItem("created_nfts", JSON.stringify(createdNFTs))

              toast({
                title: "NFT успешно создан!",
                description: `Ваш NFT "${nftName}" успешно создан и добавлен в коллекцию`,
              })

              // Перенаправляем на страницу коллекции
              router.push("/nft-collection")
            } catch (err) {
              console.error("Ошибка при создании NFT через Phantom:", err)
              setError("Произошла ошибка при создании NFT. Пожалуйста, попробуйте снова.")
            }
          } else {
            setError("Phantom кошелек не обнаружен. Пожалуйста, установите расширение Phantom.")
          }
        } else {
          setError("Phantom кошелек не обнаружен. Пожалуйста, установите расширение Phantom.")
        }
      } else {
        // Для других кошельков используем имитацию
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Сохраняем созданный NFT в localStorage для демонстрации
        const createdNFTs = JSON.parse(localStorage.getItem("created_nfts") || "[]")

        const newNFT = {
          id: Date.now().toString(),
          name: nftName,
          description: nftDescription,
          image: nftImagePreview,
          attributes: nftAttributes.filter((attr) => attr.trait_type && attr.value),
          creator: walletInfo.address,
          price: nftPrice || "0.1 TON",
          royalty: nftRoyalty,
          createdAt: new Date().toISOString(),
        }

        createdNFTs.push(newNFT)
        localStorage.setItem("created_nfts", JSON.stringify(createdNFTs))

        toast({
          title: "NFT успешно создан!",
          description: `Ваш NFT "${nftName}" успешно создан и добавлен в коллекцию`,
        })

        // Перенаправляем на страницу коллекции
        router.push("/nft-collection")
      }
    } catch (error) {
      console.error("Ошибка при создании NFT:", error)
      setError("Произошла ошибка при создании NFT. Пожалуйста, попробуйте снова.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <NavBar showBack={true} />

      <div className="flex-1 p-4 pb-20">
        <h1 className="text-3xl font-bold text-center mb-2">Create NFT</h1>
        <p className="text-center text-muted-foreground mb-6">Mint your own unique NFT on the blockchain</p>

        {/* Информация о подключенном кошельке */}
        {walletInfo ? (
          <Card className="bg-secondary mb-6">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
                <span className="text-sm">
                  {walletInfo.type === "phantom"
                    ? "Phantom"
                    : walletInfo.type === "ton"
                      ? "TON Keeper"
                      : "Telegram Wallet"}{" "}
                  подключен
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {walletInfo.address.substring(0, 6)}...{walletInfo.address.substring(walletInfo.address.length - 4)}
              </span>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-secondary mb-6">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-red-500 h-2 w-2 rounded-full mr-2"></div>
                <span className="text-sm">Кошелек не подключен</span>
              </div>
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-black"
                onClick={() => {
                  // Открываем диалог подключения кошелька
                  const connectButton = document.querySelector("[data-wallet-connect-button]")
                  if (connectButton instanceof HTMLElement) {
                    connectButton.click()
                  }
                }}
              >
                Подключить
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="basic" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="basic">Основное</TabsTrigger>
            <TabsTrigger value="attributes">Атрибуты</TabsTrigger>
            <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nft-name">Название NFT</Label>
              <Input
                id="nft-name"
                placeholder="Введите название NFT"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                className="bg-secondary border-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nft-description">Описание</Label>
              <Textarea
                id="nft-description"
                placeholder="Опишите ваш NFT"
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
                className="bg-secondary border-0 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Изображение (JPEG, PNG, GIF)</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-6 bg-secondary/50">
                {nftImagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={nftImagePreview || "/placeholder.svg"}
                      alt="NFT Preview"
                      className="w-full h-auto max-h-[300px] object-contain rounded-lg mb-4"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => {
                        setNftImage(null)
                        setNftImagePreview(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Перетащите изображение сюда или нажмите для выбора
                    </p>
                    <Button variant="outline" onClick={() => document.getElementById("nft-image-upload")?.click()}>
                      Выбрать файл
                    </Button>
                  </div>
                )}
                <input
                  id="nft-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nft-price">Цена (TON)</Label>
                <Input
                  id="nft-price"
                  type="number"
                  placeholder="0.1"
                  value={nftPrice}
                  onChange={(e) => setNftPrice(e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nft-royalty">Роялти (%)</Label>
                <Input
                  id="nft-royalty"
                  type="number"
                  placeholder="5"
                  value={nftRoyalty}
                  onChange={(e) => setNftRoyalty(e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attributes" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Атрибуты NFT</h3>
              <Button variant="outline" size="sm" onClick={addAttribute} className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Добавить атрибут
              </Button>
            </div>

            {nftAttributes.map((attr, index) => (
              <div key={attr.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                <Input
                  placeholder="Тип атрибута"
                  value={attr.trait_type}
                  onChange={(e) => updateAttribute(attr.id, "trait_type", e.target.value)}
                  className="bg-secondary border-0"
                />
                <Input
                  placeholder="Значение"
                  value={attr.value}
                  onChange={(e) => updateAttribute(attr.id, "value", e.target.value)}
                  className="bg-secondary border-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttribute(attr.id)}
                  disabled={nftAttributes.length === 1}
                  className="h-10 w-10 text-red-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="text-sm text-muted-foreground mt-4">
              <p>Атрибуты помогают описать свойства вашего NFT и делают его уникальным.</p>
              <p>Примеры атрибутов: Цвет, Редкость, Уровень, Тип и т.д.</p>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card className="bg-secondary overflow-hidden">
              <div className="relative">
                {nftImagePreview ? (
                  <img
                    src={nftImagePreview || "/placeholder.svg"}
                    alt="NFT Preview"
                    className="w-full aspect-square object-contain bg-black"
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-900 flex items-center justify-center">
                    <p className="text-muted-foreground">Нет изображения</p>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{nftName || "Название NFT"}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {nftDescription || "Описание NFT будет отображаться здесь"}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Цена:</span>
                  <span className="font-medium">{nftPrice || "0.1"} TON</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Роялти:</span>
                  <span className="font-medium">{nftRoyalty || "5"}%</span>
                </div>

                {nftAttributes.some((attr) => attr.trait_type && attr.value) && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Атрибуты:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {nftAttributes
                        .filter((attr) => attr.trait_type && attr.value)
                        .map((attr) => (
                          <div key={attr.id} className="bg-gray-800 p-2 rounded-md">
                            <div className="text-xs text-muted-foreground">{attr.trait_type}</div>
                            <div className="font-medium text-sm">{attr.value}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="bg-red-900 bg-opacity-30 p-3 rounded-md flex items-start mb-6">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-black py-6 text-lg"
          onClick={createNFT}
          disabled={isLoading || !walletInfo}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Создание NFT...
            </>
          ) : (
            "Создать NFT"
          )}
        </Button>
      </div>

      <BottomNav activeTab="nft" />
    </main>
  )
}
