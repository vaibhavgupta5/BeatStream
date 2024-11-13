'use client'

import { useState, useEffect } from 'react'
// import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowDown, ArrowUp, ChevronRight, Moon, Pause, SkipBack, SkipForward, Sun } from "lucide-react"

// Add this custom CSS
const customStyles = `
  .dark {
    --background: 0 0% 0%;
    --foreground: 210 40% 98%;
  }
`

export default function MusicQueuePlayer() {
  const [mounted, setMounted] = useState(false)
  const [ theme, setTheme ] = useState("light")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={`flex flex-col md:flex-row h-screen bg-background text-foreground ${theme === 'dark' ? 'dark' : ''}`}>
      <style jsx global>{customStyles}</style>
      {/* Theme Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-background border-primary"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Left Section - Music Player */}
      <div className="w-full md:w-1/4 p-4 border-r border-border">
        <div className="flex flex-col justify-center  h-full">
          <div className="flex-1">
            <img
              src="https://source.boomplaymusic.com/group10/M00/09/09/9c4889ec0c1f4587a6d607fb336dde4cH3000W3000_320_320.jpg"
              alt="Album cover"
              className="w-full aspect-square object-cover rounded-md mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Currently Playing</h2>
            <p className="text-lg">Artist Name</p>
          </div>
          <div className="space-y-4">
            <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
            <div className="flex justify-between text-sm">
              <span>1:23</span>
              <span>3:45</span>
            </div>
            <div className="flex justify-center space-x-4">
              <Button size="icon" variant="ghost">
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost">
                <Pause className="h-6 w-6" />
              </Button>
              <Button size="icon" variant="ghost">
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Song Queue */}
      <div className="w-full md:w-2/4 p-4 border-r border-border overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Queue</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center p-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={`/placeholder.svg?height=48&width=48&text=Song${i}`} alt={`Song ${i}`} />
                  <AvatarFallback>S{i}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">Song Title {i}</h3>
                  <p className="text-sm text-muted-foreground">Artist {i}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="icon" variant="ghost">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Section - Chat and Song Submission */}
      <div className="w-full md:w-1/4 p-4 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-4">Chat</h2>
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32&text=U${i}`} alt={`User ${i}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">User {i}</p>
                  <p className="text-sm">This is a chat message {i}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex space-x-2 mb-4">
          <Input placeholder="Type your message..." />
          <Button size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <hr className='my-4'></hr>
          <h2 className="text-2xl font-bold mb-4">Add Song to Queue</h2>
          <div className="flex space-x-2">
            <Input placeholder="Paste song link here" />
            <Button size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}