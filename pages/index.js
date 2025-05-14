"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import AnimatedBackground from "../components/AnimatedBackground"
import ConnectWallet from "../components/ConnectWallet"
import PromptForm from "../components/PromptForm"
import PixelGrid from "../components/PixelGrid"
import MintButton from "../components/MintButton"
import MintModal from "../components/MintModal"
import { BrowserProvider, Contract, parseEther } from "ethers";
import NFTContractABI from "../ABI/PixelNFT.json";

// Background generation function
const generateBackgroundGradient = (x, y, imageData) => {
  // Check if this position is part of the main image
  const key = `${x} ${y}`;
  if (imageData[key]) return imageData[key];
  // Create different background patterns based on position      
  const normalizedX = x / 31;  // Normalize to 0-1
  const normalizedY = y / 31;  // Normalize to 0-1

  // Generate base colors for gradient
  const r = Math.floor(20 + (normalizedX * normalizedY * 40));
  const g = Math.floor(20 + (normalizedY * 40));
  const b = Math.floor(40 + (normalizedX * 60));

  // Add some noise/variation
  const noise = Math.sin(x * 0.5 + y * 0.7) * 10;

  // Convert to hex color
  const color = `#${Math.max(0, Math.min(255, r + noise)).toString(16).padStart(2, '0')}${Math.max(0, Math.min(255, g + noise)).toString(16).padStart(2, '0')}${Math.max(0, Math.min(255, b + noise)).toString(16).padStart(2, '0')}`;

  return color;
};

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [pixelGrid, setPixelGrid] = useState([])
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [isMintModalOpen, setIsMintModalOpen] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")
  const [mintingStage, setMintingStage] = useState("confirming") // confirming, processing, success

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        disconnectWallet();
      });
      window.ethereum.on("chainChanged", () => {
        disconnectWallet();
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", disconnectWallet);
        window.ethereum.removeListener("chainChanged", disconnectWallet);
      }
    };
  }, []);

  const CONTRACT_ADDRESS = "0x332F5AC348C1161779fedB1842cC3cb7135906D6"; // Replace with your contract address

  const disconnectWallet = () => {
    setWalletAddress("");
    setWalletConnected(false);
  };

  const handleConnectWallet = async (address) => {
    setWalletAddress(address);
    setWalletConnected(true)
  }

  const handleGenerateImage = async (prompt) => {
    setIsGenerating(true)
    setCurrentPrompt(prompt)

    try {
      const response = await fetch('/api/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      
      // Create a 32x32 grid with an interesting gradient background
      const grid = Array(32).fill().map((_, y) =>
        Array(32).fill().map((_, x) => {
          // Create a subtle gradient background
          const gradientColor = generateBackgroundGradient(x, y, data.image || {});
          return parseInt(gradientColor.replace('#', ''), 16);
        })
      );

      // Fill in the pixels from the API response
      if (data.image) {
        Object.entries(data.image).forEach(([coords, color]) => {
          const [x, y] = coords.split(' ').map(Number)
          // Convert hex color to number (removing the # if present)
          const colorNum = parseInt(color.replace('#', ''), 16)
          if (x >= 0 && x < 32 && y >= 0 && y < 32) {
            grid[y][x] = colorNum
          }
        })
      }

      setPixelGrid(grid)
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerateImage = () => {
    handleGenerateImage(currentPrompt)
  }

  const handleMintNFT = () => {
    setIsMintModalOpen(true)
    setMintingStage("confirming")
    setTransactionHash("")
  }

  const handleConfirmMint = async () => {
    setMintingStage("processing");

    try {
      if (pixelGrid.length === 0) {
        throw new Error("Cannot generate image from an empty array");
      } const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      const scale = 16; // Scale factor from 32x32 to 512x512 (16 pixels per grid cell)

      for (let i = 0; i < pixelGrid.length; i++) {
        const row = pixelGrid[i];
        for (let j = 0; j < row.length; j++) {
          const color = row[j];
          ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
          ctx.fillRect(j * scale, i * scale, scale, scale);
        }
      }

      const dataURL = canvas.toDataURL();
      const base64Image = dataURL.split(",")[1];

      const response = await fetch('/api/uploadPinata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: base64Image, prompt: currentPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload to Pinata');
      }

      const data = await response.json();
      const pinataUrl = data.ipfsUrl;

      if (!walletConnected || !pinataUrl) {
        alert("Please connect wallet and provide IPFS hash");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const nftContract = new Contract(
        CONTRACT_ADDRESS,
        NFTContractABI,
        signer
      );

      const ipfsUrl = pinataUrl;
      const mintingPrice = parseEther("0.01");

      const transaction = await nftContract.safeMint(
        walletAddress,
        ipfsUrl,
        { value: mintingPrice }
      );

      // Wait for transaction to be mined
      const receipt = await transaction.wait();
      console.log("NFT Minted!", receipt);

      setTransactionHash(receipt.hash)
      setMintingStage("success")
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert(error.message || "Error minting NFT");
    }
  }

  const handleCloseMintModal = () => {
    setIsMintModalOpen(false)
  }

  return (
    <>
      <Head>
        <title>PixelNFT - Create and Mint Pixel Art NFTs</title>
        <meta name="description" content="Create and mint pixel art NFTs from text prompts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AnimatedBackground />

      <main className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
        <div className="container max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              PixelNFT
            </h1>
            <p className="text-gray-600 mt-2">Create and mint pixel art NFTs from text prompts</p>
          </header>

          {!walletConnected ? (
            <div className="max-w-md mx-auto">
              <ConnectWallet onConnect={handleConnectWallet} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-lg rounded-lg p-4 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Generate Pixel Art</h2>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </div>
                </div>

                <PromptForm onSubmit={handleGenerateImage} isLoading={isGenerating} />
              </div>

              {pixelGrid.length > 0 && (
                <div className="bg-white/80 backdrop-blur-lg rounded-lg p-6 shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Your Pixel Art</h2>

                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-shrink-0">
                      <PixelGrid grid={pixelGrid} />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-700">Prompt</h3>
                        <p className="text-gray-600 italic">"{currentPrompt}"</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleRegenerateImage}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                        >
                          Regenerate
                        </button>

                        <MintButton onClick={handleMintNFT} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <MintModal
        isOpen={isMintModalOpen}
        onClose={handleCloseMintModal}
        transactionHash={transactionHash}
        stage={mintingStage}
        onConfirm={handleConfirmMint}
      />
    </>
  )
}
