"use client"

import { useState, useEffect } from "react"
import NavBar from "@/components/nav-bar"
import BottomNav from "@/components/bottom-nav"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mintNFT } from "@/lib/ton-connect"
// Добавляем импорт Link из next/link
import Link from "next/link"

// Добавляем интерфейс для кошелька
interface WalletInfo {
  type: string
  address: string
  balance: string
}

export default function NFTCollectionPage() {
  const [mintingNFT, setMintingNFT] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<{
    id: number
    name: string
    left: number
    price: string
  } | null>(null)
  const { toast } = useToast()
  // Добавляем состояние для хранения информации о подключенном кошельке
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  // Добавляем состояние для отслеживания ошибок
  const [mintError, setMintError] = useState<string | null>(null)

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

    // Загружаем созданные пользователем NFT
    const loadCreatedNFTs = () => {
      if (typeof window !== "undefined") {
        const createdNFTs = JSON.parse(localStorage.getItem("created_nfts") || "[]")

        // Если есть созданные NFT, отображаем их
        if (createdNFTs.length > 0) {
          const container = document.getElementById("created-nfts-container")
          if (container) {
            container.innerHTML = createdNFTs
              .map(
                (nft: any) => `
              <div class="bg-secondary overflow-hidden rounded-lg">
                <div class="relative">
                  <img 
                    src="${nft.image}" 
                    alt="${nft.name}" 
                    class="w-full aspect-square object-contain bg-black"
                  />
                </div>
                <div class="p-2 flex flex-col items-start w-full">
                  <h3 class="font-bold text-sm">${nft.name}</h3>
                  <div class="flex justify-between items-center w-full mt-1">
                    <p class="text-xs text-muted-foreground">Your NFT</p>
                    <p class="text-xs font-medium text-amber-500">${nft.price}</p>
                  </div>
                  <button 
                    class="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-black text-xs py-1 px-2 rounded-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            `,
              )
              .join("")
          }
        }
      }
    }

    checkWalletConnection()
    loadCreatedNFTs()
  }, [])

  const nfts = [
    { id: 0, name: "The Archive Orb", left: 847, price: "0.15 TON" },
    { id: 1, name: "The Floating Circuit", left: 4595, price: "0.12 TON" },
    { id: 2, name: "The Data Cathedral", left: 4662, price: "0.18 TON" },
    { id: 3, name: "The Sentinel of Str", left: 3071, price: "0.20 TON" },
  ]

  const handleMintClick = (nft: (typeof nfts)[0]) => {
    // Проверяем, подключен ли кошелек
    if (!walletInfo) {
      toast({
        title: "Кошелек не подключен",
        description: "Для минтинга NFT необходимо подключить кошелек",
        variant: "destructive",
      })
      return
    }

    setSelectedNFT(nft)
    setIsDialogOpen(true)
    // Сбрасываем ошибку при каждом новом открытии диалога
    setMintError(null)
  }

  const handleMint = async () => {
    if (!selectedNFT || !walletInfo) return

    setIsMinting(true)
    setMintingNFT(selectedNFT.id)
    setMintError(null)

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
              await new Promise((resolve) => setTimeout(resolve, 2000))

              // Имитируем успешный минтинг
              toast({
                title: "NFT успешно создан!",
                description: `Вы успешно создали NFT "${selectedNFT.name}" с помощью Phantom`,
              })

              setIsMinting(false)
              setMintingNFT(null)
              setIsDialogOpen(false)
            } catch (err) {
              console.error("Ошибка при минтинге через Phantom:", err)
              setMintError("Произошла ошибка при минтинге NFT. Пожалуйста, попробуйте снова.")
              setIsMinting(false)
            }
          } else {
            setMintError("Phantom кошелек не обнаружен. Пожалуйста, установите расширение Phantom.")
            setIsMinting(false)
          }
        } else {
          setMintError("Phantom кошелек не обнаружен. Пожалуйста, установите расширение Phantom.")
          setIsMinting(false)
        }
      } else {
        // Для других кошельков используем существующую имитацию
        await mintNFT(selectedNFT.id.toString(), walletInfo.address)

        // Имитация процесса минтинга
        setTimeout(() => {
          setIsMinting(false)
          setMintingNFT(null)
          setIsDialogOpen(false)

          toast({
            title: "NFT успешно создан!",
            description: `Вы успешно создали NFT "${selectedNFT.name}"`,
          })
        }, 2000)
      }
    } catch (error) {
      console.error("Ошибка при минтинге:", error)
      setMintError("Произошла ошибка при минтинге NFT. Пожалуйста, попробуйте снова.")
      setIsMinting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <NavBar />

      <div className="flex-1 p-4 pb-20">
        <h1 className="text-3xl font-bold text-center mb-2">NFT Collection</h1>
        <p className="text-center text-muted-foreground mb-6">Mint the NFT to get additional bonuses</p>
        <div className="flex justify-center mb-6">
          <Link href="/create-nft">
            <Button className="bg-amber-500 hover:bg-amber-600 text-black">Create NFT</Button>
          </Link>
        </div>

        <div className="space-y-4 mb-6">
          <Card className="bg-secondary">
            <CardContent className="p-4 flex items-center gap-4">
              <span className="text-blue-400 text-2xl">💎</span>
              <div className="flex-1">
                <h3 className="font-bold">20 000 TON Giveaway</h3>
                <p className="text-sm text-muted-foreground">You need to collect all the NFTs from the collection</p>
              </div>
              <span className="text-xl">›</span>
            </CardContent>
          </Card>

          <Card className="bg-secondary">
            <CardContent className="p-4 flex items-center gap-4">
              <span className="text-red-400 text-2xl">⏰</span>
              <div className="flex-1">
                <h3 className="font-bold">58 / 100 NFTs listed</h3>
                <p className="text-sm text-muted-foreground">
                  We periodically add new NFTs until there are 100 of them. Follow this page and our Telegram channel.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

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

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Your Created NFTs</h2>
          <div className="grid grid-cols-2 gap-4" id="created-nfts-container">
            {/* Здесь будут отображаться созданные пользователем NFT */}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">Available NFTs</h2>
          <div className="grid grid-cols-2 gap-4">
            {nfts.map((nft) => (
              <Card key={nft.id} className="bg-secondary overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/nft-image.gif"
                    alt={nft.name}
                    width={200}
                    height={200}
                    className="w-full aspect-square object-cover"
                  />
                  {nft.id < 3 && (
                    <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold py-1 px-2 rotate-12 translate-x-2 -translate-y-1">
                      New
                    </div>
                  )}
                </div>
                <CardFooter className="p-2 flex flex-col items-start w-full">
                  <h3 className="font-bold text-sm">{nft.name}</h3>
                  <div className="flex justify-between items-center w-full mt-1">
                    <p className="text-xs text-muted-foreground">{nft.left} left</p>
                    <p className="text-xs font-medium text-amber-500">{nft.price}</p>
                  </div>
                  <Button
                    className="w-full mt-2 bg-green-500 hover:bg-green-600 text-black text-xs py-1"
                    onClick={() => handleMintClick(nft)}
                    disabled={mintingNFT === nft.id}
                  >
                    {mintingNFT === nft.id ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      "Mint NFT"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mint NFT</DialogTitle>
            <DialogDescription>Are you sure you want to mint this NFT? This action cannot be undone.</DialogDescription>
          </DialogHeader>

          {selectedNFT && (
            <div className="flex items-center space-x-4 py-4">
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image src="/images/nft-image.gif" alt={selectedNFT.name} fill className="object-cover rounded-md" />
              </div>
              <div>
                <h3 className="font-bold">{selectedNFT.name}</h3>
                <p className="text-sm text-muted-foreground">Price: {selectedNFT.price}</p>
                <p className="text-sm text-muted-foreground">{selectedNFT.left} NFTs left</p>
              </div>
            </div>
          )}

          {/* Отображаем информацию о кошельке */}
          {walletInfo && (
            <div className="bg-black bg-opacity-30 p-3 rounded-md">
              <p className="text-sm mb-1">Mint using:</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
                  <span>
                    {walletInfo.type === "phantom"
                      ? "Phantom"
                      : walletInfo.type === "ton"
                        ? "TON Keeper"
                        : "Telegram Wallet"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {walletInfo.address.substring(0, 6)}...{walletInfo.address.substring(walletInfo.address.length - 4)}
                </span>
              </div>
            </div>
          )}

          {/* Отображаем ошибку, если она есть */}
          {mintError && (
            <div className="bg-red-900 bg-opacity-30 p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{mintError}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isMinting}>
              Cancel
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-black" onClick={handleMint} disabled={isMinting}>
              {isMinting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Minting...
                </>
              ) : (
                "Confirm Mint"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav activeTab="nft" />
    </main>
  )
}
