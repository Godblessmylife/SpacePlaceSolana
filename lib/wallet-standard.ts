import { PublicKey } from "@solana/web3.js"
import { generateUUID } from "./utils"

// Функция для проверки поддержки Wallet Standard
export function isWalletStandardSupported(): boolean {
  if (typeof window === "undefined") return false
  return "solana" in window && "isWalletStandard" in (window as any).solana
}

// Функция для получения списка доступных кошельков
export function getAvailableWallets(): string[] {
  if (!isWalletStandardSupported()) return []

  const wallets = (window as any).solana?.wallets || []
  return wallets.map((wallet: any) => wallet.name)
}

// Функция для создания deeplink для Phantom
export function createPhantomDeepLink(params: Record<string, string>): string {
  // Базовый URL для deeplink
  const baseUrl = "phantom://ul/v1/connect"

  // Преобразуем параметры в строку запроса
  const queryParams = new URLSearchParams(params).toString()

  // Формируем полный URL
  return `${baseUrl}?${queryParams}`
}

// Функция для создания deeplink для подключения к Phantom
export function createPhantomConnectDeepLink(appName: string, redirectUrl: string): string {
  // Генерируем уникальный идентификатор сессии
  const sessionId = generateUUID()

  // Сохраняем идентификатор сессии в localStorage
  localStorage.setItem("phantom_session_id", sessionId)

  // Параметры для deeplink
  const params = {
    app: appName,
    redirect_url: redirectUrl,
    session: sessionId,
  }

  return createPhantomDeepLink(params)
}

// Функция для проверки возврата из Phantom
export function checkPhantomReturn(): {
  isReturn: boolean
  sessionMatches: boolean
  publicKey?: string
  errorCode?: string
} {
  if (typeof window === "undefined") return { isReturn: false, sessionMatches: false }

  // Получаем параметры из URL
  const urlParams = new URLSearchParams(window.location.search)
  const session = urlParams.get("session")
  const errorCode = urlParams.get("errorCode")
  const phantomPublicKey = urlParams.get("phantom_encryption_public_key")
  const data = urlParams.get("data")

  // Получаем сохраненный идентификатор сессии
  const savedSession = localStorage.getItem("phantom_session_id")

  // Проверяем, соответствует ли сессия сохраненной
  const sessionMatches = Boolean(session && session === savedSession)

  // Определяем, является ли это возвратом из Phantom
  const isReturn = Boolean(session)

  // Если есть данные, декодируем их
  let publicKey: string | undefined
  if (data && phantomPublicKey) {
    try {
      // В реальном приложении здесь должна быть логика расшифровки данных
      // Для демонстрации просто используем phantomPublicKey
      publicKey = phantomPublicKey
    } catch (e) {
      console.error("Ошибка при декодировании данных:", e)
    }
  }

  return { isReturn, sessionMatches, publicKey, errorCode }
}

// Функция для проверки валидности публичного ключа Solana
export function isValidPublicKey(publicKey: string): boolean {
  try {
    new PublicKey(publicKey)
    return true
  } catch (e) {
    return false
  }
}

// Функция для сокращения публичного ключа
export function shortenPublicKey(publicKey: string, chars = 4): string {
  if (!publicKey) return ""
  return `${publicKey.slice(0, chars)}...${publicKey.slice(-chars)}`
}
