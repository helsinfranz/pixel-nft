"use client"

import { useRef, useEffect } from "react"

export default function PixelGrid({ grid }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !grid.length) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size for 32x32 grid
    canvas.width = 384  // 32 * 12 (12 pixels per grid cell)
    canvas.height = 384
    const pixelSize = canvas.width / grid.length

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw pixels
    grid.forEach((row, y) => {
      row.forEach((color, x) => {
        ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
      })
    })

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineWidth = 1

    for (let i = 0; i <= grid.length; i++) {
      const pos = i * pixelSize

      // Vertical line
      ctx.beginPath()
      ctx.moveTo(pos, 0)
      ctx.lineTo(pos, canvas.height)
      ctx.stroke()

      // Horizontal line
      ctx.beginPath()
      ctx.moveTo(0, pos)
      ctx.lineTo(canvas.width, pos)
      ctx.stroke()
    }
  }, [grid])

  return (
    <div className="border-4 border-gray-200 rounded-lg overflow-hidden shadow-lg">
      <canvas ref={canvasRef} width={320} height={320} className="bg-white" />
    </div>
  )
}
