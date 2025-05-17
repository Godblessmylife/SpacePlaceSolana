// Утилиты для работы с кошельками без использования TON Connect

export interface WalletInfo {
  name: string
  address: string
  balance: string
  network: string
}

// Функция для подключения к кошельку
export async function connectWallet(type: "phantom" | "solflare" | "metamask"): Promise<WalletInfo> {
  // Проверяем, мобильное ли устройство
  const isMobile =
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // Для Phantom на мобильных устройствах используем специальную логику
  if (type === "phantom" && isMobile) {
    try {
      // В реальном приложении здесь будет код для глубоких ссылок
      // Для демо возвращаем фиктивные данные
      return {
        name: "Phantom Wallet",
        address: "0QBfn_5PqGPEDjLV_zMm3YttvlxHzwQcmDhVPGLJj12ZhV7k",
        balance: "5.7",
        network: "Solana Mainnet",
      }
    } catch (error) {
      console.error("Ошибка при работе с мобильным Phantom:", error)
      throw error
    }
  }

  // Для Phantom на десктопе используем существующую логику
  if (type === "phantom" && !isMobile) {
    try {
      // Проверяем, доступен ли Phantom в окне браузера
      if (typeof window !== "undefined" && "phantom" in window) {
        const provider = (window as any).phantom?.solana

        if (provider?.isPhantom) {
          try {
            // Запрашиваем подключение к кошельку
            const response = await provider.connect()
            const publicKey = response.publicKey.toString()

            // Получаем баланс (в реальном приложении здесь был бы запрос к блокчейну)
            // Для демо используем фиксированное значение
            const balance = "5.7"

            return {
              name: "Phantom Wallet",
              address: publicKey,
              balance,
              network: "Solana Mainnet",
            }
          } catch (err) {
            console.error("Ошибка при подключении к Phantom:", err)
            // Если произошла ошибка, возвращаем демо-данные
            return {
              name: "Phantom Wallet",
              address: "0QBfn_5PqGPEDjLV_zMm3YttvlxHzwQcmDhVPGLJj12ZhV7k",
              balance: "5.7",
              network: "Solana Mainnet",
            }
          }
        }
      }

      // Если Phantom не доступен, показываем сообщение пользователю
      if (!isMobile) {
        console.warn("Phantom кошелек не обнаружен. Пожалуйста, установите расширение Phantom.")
      }

      // И возвращаем демо-данные
      return {
        name: "Phantom Wallet",
        address: "0QBfn_5PqGPEDjLV_zMm3YttvlxHzwQcmDhVPGLJj12ZhV7k",
        balance: "5.7",
        network: "Solana Mainnet",
      }
    } catch (error) {
      console.error("Ошибка при работе с Phantom:", error)
      throw error
    }
  }

  // Для других типов кошельков используем имитацию
  return new Promise((resolve) => {
    setTimeout(() => {
      // Генерируем случайный адрес кошелька для демонстрации
      const addresses = {
        phantom: "0QBfn_5PqGPEDjLV_zMm3YttvlxHzwQcmDhVPGLJj12ZhV7k",
        solflare: "0QCz6WnXFMBzKFXEw-Z8xBgK9nkrEMLxRLnYKNgYhpBkvVZ3",
        metamask: "0QA4qplfL_MiHRrSx5hGhWJRvh0Fi2uPqBzoTBFswzKcG1qi",
      }

      resolve({
        name: type === "phantom" ? "Phantom Wallet" : type === "solflare" ? "Solflare Wallet" : "MetaMask Wallet",
        address: addresses[type],
        balance: type === "phantom" ? "5.7" : type === "solflare" ? "8.3" : "12.5",
        network: "Solana Mainnet",
      })
    }, 1000)
  })
}

// Функция для проверки подключения к Phantom
export function isPhantomInstalled(): boolean {
  return typeof window !== "undefined" && "phantom" in window && !!(window as any).phantom?.solana?.isPhantom
}

// Функция для получения баланса кошелька
export async function getWalletBalance(address: string): Promise<string> {
  // В реальном приложении здесь был бы запрос к блокчейну
  // Для демо возвращаем фиктивное значение
  return "5.7"
}

// Функция для сокращения адреса кошелька
export function shortenWalletAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Функция для создания deeplink для Phantom
export function createPhantomDeepLink(currentUrl: string): string {
  if (typeof window === "undefined") return ""
  const encodedUrl = encodeURIComponent(currentUrl)
  return `phantom://browse/${encodedUrl}?ref=${encodedUrl}`
}

// Функции для работы с NFT и токенами
export async function mintNFT(nftId: string, walletAddress: string): Promise<boolean> {
  // В реальном приложении здесь был бы вызов блокчейна для создания NFT
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 2000)
  })
}

export async function sellToken(amount: number, price: number, address: string): Promise<boolean> {
  // В реальном приложении здесь был бы вызов блокчейна для создания ордера на продажу
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1500)
  })
}

export async function buyToken(orderId: string, walletAddress: string): Promise<boolean> {
  // В реальном приложении здесь был бы вызов блокчейна для выполнения ордера на покупку
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1500)
  })
}
