import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { WalletContextProvider } from "@/contexts/wallet-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Solana Space Miner",
  description: "Mint and sell NFTs on the Solana blockchain",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/images/background-animation.webp" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        {/* Добавляем мета-теги для оптимизации мобильных устройств */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Добавляем скрипт для Phantom */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Проверяем, поддерживается ли Phantom
              const checkForPhantom = () => {
                if (typeof window !== 'undefined' && 'solana' in window) {
                  console.log('Phantom доступен в window.solana');
                } else if (typeof window !== 'undefined' && 'phantom' in window) {
                  console.log('Phantom доступен в window.phantom');
                } else {
                  console.log('Phantom не обнаружен');
                }
              };
              
              // Запускаем проверку после загрузки страницы
              if (document.readyState === 'complete') {
                checkForPhantom();
              } else {
                window.addEventListener('load', checkForPhantom);
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <WalletContextProvider>
            {children}
            <Toaster />
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
