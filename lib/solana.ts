import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js"
import bs58 from "bs58"

// Настройки подключения к Solana
const SOLANA_NETWORK = "devnet" // 'mainnet-beta', 'testnet', 'devnet'
const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), "confirmed")

// Функция для получения баланса кошелька
export async function getBalance(publicKeyString: string): Promise<number> {
  try {
    const publicKey = new PublicKey(publicKeyString)
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL // Конвертируем из lamports в SOL
  } catch (error) {
    console.error("Ошибка при получении баланса:", error)
    return 0
  }
}

// Функция для получения информации о транзакциях кошелька
export async function getTransactions(publicKeyString: string, limit = 10): Promise<any[]> {
  try {
    const publicKey = new PublicKey(publicKeyString)
    const transactions = await connection.getSignaturesForAddress(publicKey, { limit })
    return transactions
  } catch (error) {
    console.error("Ошибка при получении транзакций:", error)
    return []
  }
}

// Функция для отправки SOL
export async function sendSol(
  fromPublicKey: string,
  toPublicKey: string,
  amount: number,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
): Promise<string> {
  try {
    const from = new PublicKey(fromPublicKey)
    const to = new PublicKey(toPublicKey)

    // Создаем транзакцию
    const transaction = new Transaction().add(
      Transaction.systemTransfer({
        fromPubkey: from,
        toPubkey: to,
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    )

    // Получаем последний блокхеш
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = from

    // Подписываем транзакцию (требуется функция подписи от кошелька)
    const signedTransaction = await signTransaction(transaction)

    // Отправляем транзакцию
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())

    // Ждем подтверждения
    await connection.confirmTransaction(signature)

    return signature
  } catch (error) {
    console.error("Ошибка при отправке SOL:", error)
    throw error
  }
}

// Функция для проверки валидности адреса Solana
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch (error) {
    return false
  }
}

// Функция для получения сокращенного адреса (для отображения)
export function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`
}

// Функция для декодирования данных от Phantom
export function decodePhantomData(data: string): any {
  try {
    const decoded = bs58.decode(data)
    const decodedString = new TextDecoder().decode(decoded)
    return JSON.parse(decodedString)
  } catch (error) {
    console.error("Ошибка при декодировании данных от Phantom:", error)
    return null
  }
}

// Функция для получения информации о NFT по адресу
export async function getNFTInfo(mintAddress: string): Promise<any> {
  try {
    const mint = new PublicKey(mintAddress)
    // Здесь должен быть код для получения метаданных NFT
    // Для полной реализации требуется дополнительная библиотека @metaplex-foundation/js
    return { mint: mintAddress }
  } catch (error) {
    console.error("Ошибка при получении информации о NFT:", error)
    return null
  }
}

// Экспортируем соединение для использования в других частях приложения
export { connection, SOLANA_NETWORK }
