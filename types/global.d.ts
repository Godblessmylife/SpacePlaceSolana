interface Window {
  phantom?: {
    solana?: {
      isPhantom: boolean
      connect: () => Promise<{ publicKey: { toString: () => string } }>
      disconnect: () => Promise<void>
      isConnected: boolean
    }
  }
  solana?: {
    isWalletStandard?: boolean
    wallets?: Array<{
      name: string
      icon: string
      connect: () => Promise<any>
    }>
  }
  solflare?: {
    isSolflare: boolean
  }
  ethereum?: {
    isMetaMask: boolean
  }
}
