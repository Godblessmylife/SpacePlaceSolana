"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface AnimatedBackgroundProps {
  width: number
  height: number
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Создаем звезды
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.9 ? getRandomColor() : "#FFF",
      twinkle: Math.random() > 0.7,
      twinkleSpeed: Math.random() * 0.05 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
    }))

    // Создаем туманности
    const nebulae = Array.from({ length: 3 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 150 + 100,
      color: getRandomColor(0.2),
      speed: Math.random() * 0.1 + 0.05,
    }))

    // Создаем падающие звезды
    const shootingStars: any[] = []

    // Функция для создания падающей звезды
    const createShootingStar = () => {
      if (shootingStars.length < 3 && Math.random() < 0.01) {
        shootingStars.push({
          x: Math.random() * width,
          y: 0,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 5 + 3,
          angle: Math.PI / 4 + (Math.random() * Math.PI) / 4,
          life: 1.0,
        })
      }
    }

    // Функция для получения случайного цвета
    function getRandomColor(alpha = 1) {
      const colors = ["#88AAFF", "#FF88AA", "#AAFFAA", "#FFAAFF", "#FFFFAA"]
      const color = colors[Math.floor(Math.random() * colors.length)]

      if (alpha < 1) {
        // Преобразуем альфа-значение в шестнадцатеричное и добавляем к цвету
        const alphaHex = Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, "0")
        return color + alphaHex
      }

      return color
    }

    // Анимация
    let animationFrameId: number
    let lastTime = 0

    const animate = (timestamp: number) => {
      // Ограничиваем FPS
      if (timestamp - lastTime < 1000 / 30) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }
      lastTime = timestamp

      // Очищаем холст
      ctx.clearRect(0, 0, width, height)

      // Рисуем фон
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, "#000235")
      gradient.addColorStop(1, "#000010")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Рисуем туманности
      nebulae.forEach((nebula) => {
        const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.size)
        gradient.addColorStop(0, nebula.color)
        gradient.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        // Двигаем туманность
        nebula.y += nebula.speed
        if (nebula.y - nebula.size > height) {
          nebula.y = -nebula.size
          nebula.x = Math.random() * width
        }
      })

      // Рисуем звезды
      stars.forEach((star) => {
        let opacity = 1
        if (star.twinkle) {
          star.twinklePhase += star.twinkleSpeed
          opacity = 0.5 + Math.sin(star.twinklePhase) * 0.5
        }

        ctx.fillStyle = star.color
        ctx.globalAlpha = opacity
        ctx.fillRect(star.x, star.y, star.size, star.size)
        ctx.globalAlpha = 1

        // Двигаем звезду
        star.y += star.speed
        if (star.y > height) {
          star.y = 0
          star.x = Math.random() * width
        }
      })

      // Создаем и обновляем падающие звезды
      createShootingStar()

      // Рисуем падающие звезды
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i]

        // Рисуем след
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        const endX = star.x - Math.cos(star.angle) * star.length * star.life
        const endY = star.y + Math.sin(star.angle) * star.length * star.life
        ctx.lineTo(endX, endY)

        // Градиент для следа
        const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.life})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        // Обновляем позицию
        star.x += Math.cos(star.angle) * star.speed
        star.y += Math.sin(star.angle) * star.speed

        // Уменьшаем время жизни
        star.life -= 0.01

        // Удаляем, если вышла за пределы или истекло время жизни
        if (star.x > width || star.y > height || star.life <= 0) {
          shootingStars.splice(i, 1)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [width, height])

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} width={width} height={height} className="w-full h-full" />
    </div>
  )
}

export default AnimatedBackground
