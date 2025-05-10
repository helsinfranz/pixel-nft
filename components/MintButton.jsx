"use client"

export default function MintButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg shadow-lg transition-all hover:shadow-xl"
    >
      <span className="flex items-center justify-center">
        Mint NFT
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </span>
    </button>
  )
}
