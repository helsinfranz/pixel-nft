"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, ArrowRight } from "lucide-react"

export function ConnectWallet({ onConnect }) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)

    // Mock wallet connection - in a real app, this would connect to MetaMask or another wallet
    setTimeout(() => {
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 42)
      onConnect(mockAddress)
      setIsConnecting(false)
    }, 1000)
  }

  return (
    <Card className="p-6 backdrop-blur-lg bg-white/90 shadow-xl">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
          <Wallet className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
        <p className="text-gray-600">Connect your wallet to start creating and minting pixelated NFTs</p>

        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          {isConnecting ? (
            <span className="flex items-center">
              Connecting
              <span className="ml-2 animate-pulse">...</span>
            </span>
          ) : (
            <span className="flex items-center">
              Connect Wallet
              <ArrowRight className="ml-2 w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </Card>
  )
}
