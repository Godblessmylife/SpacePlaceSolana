"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface VectorShipRendererProps {
  svgData: string
  width: number
  height: number
  color?: string
}

/**
 * Компонент для рендеринга векторного корабля из SVG данных
 */
const VectorShipRenderer: React.FC<VectorShipRendererProps> = ({ svgData, width, height, color = "#4AF" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Очищаем холст
    ctx.clearRect(0, 0, width, height)

    // Создаем SVG изображение
    const img = new Image()
    img.crossOrigin = "anonymous" // Важно для CORS

    // Обработчик успешной загрузки
    img.onload = () => {
      console.log("SVG loaded successfully in renderer")

      // Рисуем SVG на холсте
      ctx.drawImage(img, 0, 0, width, height)

      // Применяем цветовой фильтр
      ctx.globalCompositeOperation = "source-in"
      ctx.fillStyle = color
      ctx.fillRect(0, 0, width, height)

      // Восстанавливаем режим композиции
      ctx.globalCompositeOperation = "source-over"
    }

    // Обработчик ошибки загрузки
    img.onerror = (e) => {
      console.error("Failed to load SVG in renderer:", e)

      // Запасной вариант - рисуем простую ракету
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(width / 2, 0)
      ctx.lineTo(0, height)
      ctx.lineTo(width, height)
      ctx.closePath()
      ctx.fill()
    }

    // Создаем Blob из SVG данных для надежной загрузки
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" })
    const url = URL.createObjectURL(svgBlob)

    img.src = url

    // Очистка URL при размонтировании
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [svgData, width, height, color])

  return <canvas ref={canvasRef} width={width} height={height} className="vector-ship-canvas" />
}

export default VectorShipRenderer
