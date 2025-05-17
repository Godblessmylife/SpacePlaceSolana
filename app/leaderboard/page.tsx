import BottomNav from "@/components/bottom-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle } from "lucide-react"

export default function LeaderboardPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="p-4 flex items-center">
        <button className="mr-4">Закрыть</button>
        <div className="flex-1 text-center">
          <h1 className="font-medium">Monkey</h1>
          <p className="text-xs text-muted-foreground">мини-приложение</p>
        </div>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-4 pb-20">
        <h1 className="text-3xl font-bold text-center mb-6">Leaderboard</h1>

        <Tabs defaultValue="monkey" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="monkey">MONKEY</TabsTrigger>
            <TabsTrigger value="bananas">Bananas</TabsTrigger>
          </TabsList>

          <TabsContent value="monkey">
            <div className="bg-secondary rounded-lg p-4 mb-6 flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src="/cartoon-monkey-glasses.png" alt="Your profile" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="font-bold">You</div>
                  <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                </div>
                <div className="text-muted-foreground">9 354 276 MONKEY</div>
              </div>
              <div className="text-xl font-bold">#883</div>
            </div>

            <Button className="w-full bg-green-500 hover:bg-green-600 text-black mb-6">Upgrade score</Button>

            <div className="text-sm text-muted-foreground mb-4">4 985 124 leaders</div>

            <div className="space-y-4">
              {[
                { name: "GOODWIN", rank: 1, amount: "133.8M" },
                { name: "No Crypto God", rank: 2, amount: "127.0M" },
                { name: "Gleb_CryptoRank", rank: 3, amount: "117.8M" },
                { name: "mlkbhtt", rank: 4, amount: "65.4M" },
                { name: "BUMP", rank: 5, amount: "64.8M" },
                { name: "Oleg_sukhanov1", rank: 6, amount: "63.8M" },
                { name: "Max_kr_ursa", rank: 7, amount: "62.5M" },
              ].map((user, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src={`/placeholder.svg?height=100&width=100&query=cartoon monkey avatar ${index}`}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="font-bold">{user.name}</div>
                      <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                    </div>
                    <div className="text-muted-foreground">{user.amount} MONKEY</div>
                  </div>
                  <div className="text-lg font-bold">#{user.rank}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bananas">
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              Bananas leaderboard coming soon
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav activeTab="leaders" />
    </main>
  )
}
