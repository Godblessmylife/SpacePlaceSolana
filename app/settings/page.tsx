"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Settings, Volume2, VolumeX, Moon, Sun, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [username, setUsername] = useState("SpaceExplorer")
  const [email, setEmail] = useState("explorer@space.com")
  const [volume, setVolume] = useState(75)
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Settings className="w-6 h-6 mr-2" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Game Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="volume">Volume</Label>
                <div className="flex items-center">
                  {volume === 0 ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                  <span>{volume}%</span>
                </div>
              </div>
              <Slider
                id="volume"
                defaultValue={[volume]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notifications</Label>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Account Management</h2>
          <div className="space-y-4">
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from
                    our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      toast({
                        title: "Account deleted",
                        description: "Your account has been successfully deleted.",
                      })
                      setShowDeleteDialog(false)
                    }}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Button onClick={saveSettings} className="w-full">
          Save Settings
        </Button>
      </div>
    </div>
  )
}
