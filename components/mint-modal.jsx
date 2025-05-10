"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, Check, Loader2 } from "lucide-react"

export function MintModal({ isOpen, onClose, transactionHash }) {
  const [stage, setStage] = useState("confirming")

  useEffect(() => {
    if (isOpen && !transactionHash) {
      setStage("confirming")
    } else if (isOpen && transactionHash) {
      setStage("success")
    }
  }, [isOpen, transactionHash])

  const handleConfirm = () => {
    setStage("processing")
    // In a real app, this would trigger the actual minting process
  }

  const explorerUrl = `https://explorer.example.com/tx/${transactionHash}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {stage === "confirming" && "Mint Your NFT"}
            {stage === "processing" && "Processing Transaction"}
            {stage === "success" && "NFT Minted Successfully!"}
          </DialogTitle>
          <DialogDescription>
            {stage === "confirming" && "Mint this pixelated image as an NFT on the blockchain."}
            {stage === "processing" && "Please wait while we process your transaction."}
            {stage === "success" && "Your NFT has been minted and is now on the blockchain."}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          {stage === "confirming" && (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cost</span>
                  <span className="font-semibold">0.01 EDU</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  Confirm & Mint
                </Button>
              </div>
            </div>
          )}

          {stage === "processing" && (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
              <p className="text-gray-600">Processing your transaction...</p>
            </div>
          )}

          {stage === "success" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Transaction Complete</h3>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Transaction Hash</span>
                  <span className="font-mono text-sm truncate max-w-[150px]">
                    {transactionHash.substring(0, 10)}...
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  onClick={() => window.open(explorerUrl, "_blank")}
                >
                  View on Explorer
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
