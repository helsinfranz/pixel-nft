"use client";

export default function MintModal({
  isOpen,
  onClose,
  transactionHash,
  stage,
  onConfirm,
}) {
  if (!isOpen) return null;

  const explorerUrl = `https://educhain.blockscout.com/tx/${transactionHash}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">
            {stage === "confirming" && "Mint Your NFT"}
            {stage === "processing" && "Processing Transaction"}
            {stage === "success" && "NFT Minted Successfully!"}
          </h3>
          <p className="text-gray-600 mt-1">
            {stage === "confirming" &&
              "Mint this pixelated image as an NFT on the blockchain."}
            {stage === "processing" &&
              "Please wait while we process your transaction."}
            {stage === "success" &&
              "Your NFT has been minted and is now on the blockchain."}
          </p>
        </div>

        {stage === "confirming" && (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cost</span>
                <span className="font-semibold">0.01 EDU</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-colors"
              >
                Confirm & Mint
              </button>
            </div>
          </div>
        )}

        {stage === "processing" && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-600">Processing your transaction...</p>
          </div>
        )}

        {stage === "success" && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
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

              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-center"
              >
                <span className="flex items-center justify-center">
                  View on Explorer
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
