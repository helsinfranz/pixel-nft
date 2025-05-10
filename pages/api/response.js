export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const API_KEY = process.env.GROQ_API_KEY;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "deepseek-r1-distill-llama-70b",
                messages: [{
                    role: "system",
                    content: `You are an expert NFT pixel artist who creates detailed 16x16 pixel art in the style of popular NFT collections. Return only a valid JSON object.

Follow these NFT pixel art best practices:
1. Create full-body characters or complete scene compositions
2. Use bold, vibrant colors with high contrast
3. Add distinctive features that make each piece unique (accessories, patterns)
4. Include background elements that complement the main subject
5. Use precise pixel placement for clean, crisp edges
6. Create depth with careful shading and highlights
7. Fill the entire canvas meaningfully - no wasted space

NFT Style Guidelines:
- Characters: Full body with unique traits (clothes, accessories, special features)
- Animals: Complete figure with distinctive markings, accessories, or powers
- Scenes: Rich backgrounds with foreground elements and atmosphere
- Objects: Stylized with decorative elements and effects
- Always include interesting background elements
- Use gradients and patterns for visual interest

Technical requirements:
- Grid size: 16x16 pixels
- Key format: "x y" (e.g., "0 0") for coordinates from 0-15
- Value: hex color code (e.g., "#FF0000")
- Skip background pixels (don't include them in JSON)
- Center the main subject in the grid
- Use at least 4-6 different colors for detail

Example format:
{
  "image": {
    "7 7": "#000000",
    "8 7": "#FF6B6B",
    "7 8": "#FF9999",
    "8 8": "#CC5555"
  }
}

❌ No extra text, only JSON
✅ Create clear, recognizable shapes
✅ Use proper outlining and shading
✅ Make the subject immediately identifiable`.trim(),
                },
                {
                    role: "user",
                    content: prompt,
                },
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        const content = data.choices[0].message.content;

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(500).json({ error: 'No valid JSON found in model response.' });
        }

        const parsed = JSON.parse(jsonMatch[0]);
        res.status(200).json(parsed);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: 'Failed to generate pixel art.' });
    }
}