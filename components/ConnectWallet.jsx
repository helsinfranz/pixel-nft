"use client";

import { BrowserProvider } from "ethers";
import { useState } from "react";

export default function ConnectWallet({ onConnect }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const switchNetwork = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const eduChainId = "0xa3c3";
        const eduNetwork = {
          chainId: eduChainId,
          chainName: "EDUCHAIN Mainnet",
          nativeCurrency: {
            name: "EDUCHAIN",
            symbol: "EDU",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.edu-chain.raas.gelato.cloud"],
          blockExplorerUrls: ["https://educhain.blockscout.com/"],
        };

        const provider = new BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const currentChainId = "0x" + network.chainId.toString(16);

        if (currentChainId !== eduChainId) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: eduChainId }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [eduNetwork],
              });
            } else {
              throw switchError;
            }
          }
        }
      } catch (error) {
        console.error("Error switching or adding network:", error);
      }
    } else {
      alert(
        "MetaMask is not installed. Please install it to use this feature."
      );
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    if (typeof window.ethereum !== "undefined") {
      try {
        await switchNetwork();
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        onConnect(address);
        setIsConnecting(false);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert(
        "MetaMask is not installed. Please install it to use this feature."
      );
      setIsConnecting(false);
      return;
    }
  };

  return (
    <div className="p-6 backdrop-blur-lg bg-white/90 shadow-xl rounded-lg">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
        <p className="text-gray-600">
          Connect your wallet to start creating and minting pixelated NFTs
        </p>

        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-70"
        >
          {isConnecting ? (
            <span className="flex items-center justify-center">
              Connecting
              <span className="ml-2 animate-pulse">...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Connect Wallet
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
