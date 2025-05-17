import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ChevronLeft, X } from "lucide-react"

export default function SellPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="p-4 flex items-center">
        <Link href="/" className="mr-4">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="flex-1 text-center">
          <h1 className="font-medium">Bullish Treasury NFT</h1>
        </div>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-8">Sell $GOLD</h1>

        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <Label htmlFor="amount">Gold amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <img src="/images/gold-logo.jpg" alt="Gold" className="w-5 h-5 rounded-full" />
              </span>
              <Input id="amount" type="number" placeholder="10" className="pl-10 bg-secondary border-0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">💎</span>
              <Input id="price" type="number" placeholder="1" className="pl-10 bg-secondary border-0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">TON address</Label>
            <div className="relative">
              <Input
                id="address"
                placeholder="0QA4qplfL_MiHRrSx5hGhWJRvh0Fi2uPqBzoTBFswzKcG1qi"
                className="pr-10 bg-secondary border-0"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-8">
          If someone buys your gold, you will receive a TON at this address. The commission is 10%.
        </p>

        <div className="mt-auto">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-black text-lg py-6">Place order</Button>
        </div>
      </div>
    </main>
  )
}
