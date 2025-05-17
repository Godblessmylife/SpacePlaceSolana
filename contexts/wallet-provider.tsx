"use client"

import { type FC, type ReactNode, useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  // Добавляем адаптеры для мобильных кошельков
  type PhantomWalletAdapterConfig,
} from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"

// Импортируем стили по умолчанию
import "@solana/wallet-adapter-react-ui/styles.css"

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Выбираем сеть Solana
  const network = WalletAdapterNetwork.Devnet

  // Получаем URL эндпоинта для выбранной сети
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  // Настройка для Phantom адаптера
  const phantomConfig: PhantomWalletAdapterConfig = {
    appIdentity: { name: "Space Place Solana" },
    // Важно: включаем поддержку deep linking для мобильных устройств
    detectionOptions: {
      // Включаем поддержку мобильного подключения через deep linking
      preferredMobileWallets: ["phantom"],
      // Включаем поддержку редиректа для мобильных устройств
      mobileDetection: true,
    },
  }

  // Инициализируем адаптеры кошельков с настройками
  const wallets = useMemo(() => [new PhantomWalletAdapter(phantomConfig), new SolflareWalletAdapter()], [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
