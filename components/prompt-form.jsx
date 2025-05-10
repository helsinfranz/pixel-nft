"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"

export function PromptForm({ onSubmit, isLoading }) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          type="text"
          placeholder="Enter a prompt (e.g., 'pixel art space cat')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 bg-white border-gray-300"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          {isLoading ? (
            <span className="flex items-center">
              Generating
              <span className="ml-2 animate-pulse">...</span>
            </span>
          ) : (
            <span className="flex items-center">
              Generate
              <Sparkles className="ml-2 w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
