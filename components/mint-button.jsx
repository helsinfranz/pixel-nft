"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function MintButton({ onClick }) {
  return (
    <Button
      onClick={onClick}
      className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg shadow-lg transition-all hover:shadow-xl"
    >
      <span className="flex items-center">
        Mint NFT
        <Sparkles className="ml-2 w-4 h-4" />
      </span>
    </Button>
  )
}
