import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function NFTDetailPage({ params }: { params: { id: string } }) {
  const nfts = [
    {
      name: "The Archive Orb",
      description: "The monkey finds an orb that contains the compressed archives of an ancient digital civilization.",
      price: "0.15 TON",
      left: 847,
    },
    {
      name: "The Floating Circuit",
      description: "A monkey navigates through a digital landscape of floating circuit platforms.",
      price: "0.12 TON",
      left: 4595,
    },
    {
      name: "The Data Cathedral",
      description: "A vast digital cathedral where ancient data is stored and protected by digital guardians.",
      price: "0.18 TON",
      left: 4662,
    },
    {
      name: "The Sentinel of Str",
      description: "A giant mechanical sentinel that guards the boundaries between digital realms.",
      price: "0.20 TON",
      left: 3071,
    },
  ]

  const nft = nfts[Number.parseInt(params.id)] || nfts[0]

  return (
    <main className="flex min-h-screen flex-col">
      <div className="p-4 flex items-center">
        <Link href="/nft-collection" className="mr-4">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1 text-center">
          <h1 className="font-medium">Bullish Treasury NFT</h1>
        </div>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <Image
          src="/images/nft-image.gif"
          alt={nft.name}
          width={600}
          height={600}
          className="w-full aspect-square object-cover rounded-lg mb-4"
        />

        <h1 className="text-2xl font-bold mb-2">{nft.name}</h1>
        <p className="text-muted-foreground mb-4">{nft.description}</p>

        <div className="flex gap-4 mb-4">
          <div className="bg-blue-900/30 rounded-full px-4 py-2 text-sm">{nft.price}</div>
          <div className="bg-gray-800/50 rounded-full px-4 py-2 text-sm">{nft.left} NFT left</div>
        </div>

        <div className="mt-auto">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-black text-lg py-6">Mint</Button>
        </div>
      </div>
    </main>
  )
}
