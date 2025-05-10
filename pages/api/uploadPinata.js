import axios from 'axios';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { imageData, prompt } = req.body;

        if (!imageData) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        // Create metadata object
        const metadata = {
            name: "PixelNFT",
            description: "This NFT represents a unique asset created on PixelNFT platform.",
            image: `data:image/png;base64,${imageData}`,
            prompt: prompt,
            attributes: [
                {
                    trait_type: "Created By",
                    value: "PixelNFT"
                }
            ]
        };

        // Upload to Pinata
        const pinataResponse = await axios.post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            metadata,
            {
                headers: {
                    pinata_api_key: process.env.PINATA_API_KEY,
                    pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
                }
            }
        );

        const ipfsHash = pinataResponse.data.IpfsHash;
        const ipfsUrl = `https://rose-permanent-cricket-557.mypinata.cloud/ipfs/${ipfsHash}`;

        // Return success response
        return res.status(200).json({
            success: true,
            ipfsUrl: ipfsUrl,
        });

    } catch (error) {
        console.error("Error uploading to Pinata:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            error: error.response?.data?.message || error.message || 'Internal server error'
        });
    }
}
