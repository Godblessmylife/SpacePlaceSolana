"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import {
  type GameState,
  initGameState,
  updateGameState,
  createEnemyWave,
  createMeteors,
  GAME_WIDTH,
  GAME_HEIGHT,
} from "./game-engine"
import { renderGame, type GameAssets } from "./game-renderer"
import AnimatedBackground from "./animated-background"
import VectorShipRenderer from "./vector-ship-renderer"

export interface SpaceShooterProps {
  onScoreUpdate?: (score: number) => void
  fullscreenMode?: boolean
}

const SVG_ROCKET_URL =
  "https://acne55yuaik8ikk0.public.blob.vercel-storage.com/space-rocket-svgrepo-com-tkuSCxPf7gOTMBEDxQ0I6sPTaFlL4T.svg"

// Функция для загрузки SVG данных
const fetchSvgData = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.status}`)
    }
    return await response.text()
  } catch (error) {
    console.error("Error fetching SVG:", error)
    // Возвращаем простой SVG в случае ошибки
    return '<svg viewBox="0 0 24 24"><polygon points="12,0 0,24 24,24" fill="#4AF"/></svg>'
  }
}

// Функция для создания изображения с обработкой ошибок
const createImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => resolve(img)

    img.onerror = () => {
      console.error(`Failed to load image: ${src}`)
      reject(new Error(`Failed to load image: ${src}`))
    }

    img.src = src
  })
}

// Функция для включения полноэкранного режима
const enterFullscreen = () => {
  if (typeof document !== "undefined") {
    const element = document.documentElement

    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        console.error(`Ошибка при переходе в полноэкранный режим: ${err.message}`)
      })
    } else if ((element as any).webkitRequestFullscreen) {
      ;(element as any).webkitRequestFullscreen()
    } else if ((element as any).msRequestFullscreen) {
      ;(element as any).msRequestFullscreen()
    }
  }
}

const SpaceShooter: React.FC<SpaceShooterProps> = ({ onScoreUpdate, fullscreenMode = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<GameState>(initGameState())
  const [input, setInput] = useState({ left: false, right: false, up: false, down: false, fire: false })
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [highScore, setHighScore] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [svgData, setSvgData] = useState<string>("")
  const [assets, setAssets] = useState<GameAssets>({
    playerSvgRocket: null,
    playerShip: null,
    playerAirplane: null,
    enemyShips: [],
    meteors: [],
    background: null,
    powerUps: [],
  })
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [selectedShipType] = useState("svgRocket")
  const [isMobile, setIsMobile] = useState(false)
  const [autoFire, setAutoFire] = useState(true)
  const [fingerPosition, setFingerPosition] = useState<{ x: number; y: number } | null>(null)

  // Загрузка ассетов
  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoadingProgress(10)

        // Загружаем SVG данные
        console.log("Fetching SVG data from:", SVG_ROCKET_URL)
        const rocketSvgData = await fetchSvgData(SVG_ROCKET_URL)
        setSvgData(rocketSvgData)
        console.log("SVG data loaded, length:", rocketSvgData.length)

        setLoadingProgress(50)

        // Загружаем изображение ракеты
        let rocketImage = null
        try {
          rocketImage = await createImage(SVG_ROCKET_URL)
          console.log("Rocket image loaded successfully")
        } catch (error) {
          console.warn("Failed to load rocket image:", error)
        }

        setAssets({
          playerSvgRocket: rocketImage,
          playerShip: null,
          playerAirplane: null,
          enemyShips: [],
          meteors: [],
          background: null,
          powerUps: [],
        })

        setLoadingProgress(100)
        setAssetsLoaded(true)
      } catch (error) {
        console.error("Error loading assets:", error)
        setAssetsLoaded(true) // Продолжаем даже при ошибке
      }
    }

    // Загружаем сохраненный high score
    if (typeof window !== "undefined") {
      const savedScore = localStorage.getItem("space_shooter_high_score")
      if (savedScore) {
        setHighScore(Number.parseInt(savedScore, 10))
      }
    }

    loadAssets()

    // Устанавливаем таймаут для автоматического продолжения
    const timeoutId = setTimeout(() => {
      if (!assetsLoaded) {
        console.warn("Assets loading timeout, continuing without them")
        setAssetsLoaded(true)
      }
    }, 5000) // 5 секунд таймаут

    return () => clearTimeout(timeoutId)
  }, [])

  // Инициализация игры
  useEffect(() => {
    // Определяем, является ли устройство мобильным
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Создаем начальную волну врагов
    const initialState = initGameState()
    initialState.enemies = createEnemyWave(initialState.level, initialState.difficulty)
    initialState.meteors = createMeteors(initialState.level)
    setGameState(initialState)

    // Настраиваем обработчики клавиатуры
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          setInput((prev) => ({ ...prev, left: true }))
          break
        case "ArrowRight":
        case "d":
        case "D":
          setInput((prev) => ({ ...prev, right: true }))
          break
        case "ArrowUp":
        case "w":
        case "W":
          setInput((prev) => ({ ...prev, up: true }))
          break
        case "ArrowDown":
        case "s":
        case "S":
          setInput((prev) => ({ ...prev, down: true }))
          break
        case " ":
          setInput((prev) => ({ ...prev, fire: true }))
          break
        case "p":
        case "P":
        case "Escape":
          setGameState((prev) => ({ ...prev, paused: !prev.paused }))
          break
        case "Enter":
          if (gameState.gameOver) {
            resetGame()
          } else if (showInstructions) {
            setShowInstructions(false)
          }
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          setInput((prev) => ({ ...prev, left: false }))
          break
        case "ArrowRight":
        case "d":
        case "D":
          setInput((prev) => ({ ...prev, right: false }))
          break
        case "ArrowUp":
        case "w":
        case "W":
          setInput((prev) => ({ ...prev, up: false }))
          break
        case "ArrowDown":
        case "s":
        case "S":
          setInput((prev) => ({ ...prev, down: false }))
          break
        case " ":
          setInput((prev) => ({ ...prev, fire: false }))
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    // Если включен полноэкранный режим, активируем его
    if (fullscreenMode) {
      setTimeout(() => {
        enterFullscreen()
      }, 1000)
    }

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameState.gameOver, showInstructions, fullscreenMode])

  // Функция для перезапуска игры
  const resetGame = () => {
    const initialState = initGameState()
    initialState.enemies = createEnemyWave(initialState.level, initialState.difficulty)
    initialState.meteors = createMeteors(initialState.level)
    setGameState(initialState)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Предотвращаем масштабирование и другие действия браузера
    if (e.touches.length > 1) {
      e.preventDefault()
    }

    if (showInstructions) {
      setShowInstructions(false)
      // Включаем полноэкранный режим на мобильных устройствах
      if (isMobile) {
        enterFullscreen()
      }
      return
    }

    if (gameState.gameOver) {
      resetGame()
      // Включаем полноэкранный режим на мобильных устройствах
      if (isMobile) {
        enterFullscreen()
      }
      return
    }

    if (gameState.paused) {
      setGameState((prev) => ({ ...prev, paused: false }))
      return
    }

    const touch = e.touches[0]
    const canvas = canvasRef.current

    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      setTouchStart({ x, y })
      setFingerPosition({ x, y })

      // Устанавливаем позицию корабля сразу при касании
      updateShipPosition(x, y)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState.paused || gameState.gameOver || showInstructions) return

    const touch = e.touches[0]
    const canvas = canvasRef.current

    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      setFingerPosition({ x, y })

      // Обновляем позицию корабля при движении пальца
      updateShipPosition(x, y)
    }
  }

  // Функция для обновления позиции корабля
  const updateShipPosition = (x: number, y: number) => {
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        x: Math.max(0, Math.min(GAME_WIDTH - prev.player.width, x - prev.player.width / 2)),
        y: Math.max(GAME_HEIGHT / 2, Math.min(GAME_HEIGHT - prev.player.height, y - prev.player.height / 2)),
      },
    }))
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
    setFingerPosition(null)
    setInput((prev) => ({ ...prev, left: false, right: false, up: false, down: false }))
  }

  // Игровой цикл
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let lastTime = 0

    const gameLoop = (timestamp: number) => {
      // Ограничиваем FPS до 60
      if (timestamp - lastTime < 1000 / 60) {
        animationFrameId = requestAnimationFrame(gameLoop)
        return
      }

      lastTime = timestamp

      if (!showInstructions) {
        // Очищаем canvas с прозрачностью
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

        // Обновляем состояние игры
        const newState = updateGameState(gameState, {
          ...input,
          // Включаем автоматическую стрельбу на мобильных устройствах
          fire: isMobile ? autoFire : input.fire,
        })
        setGameState(newState)

        // Обновляем рекорд
        if (newState.player.score > highScore) {
          setHighScore(newState.player.score)
          if (typeof window !== "undefined") {
            localStorage.setItem("space_shooter_high_score", newState.player.score.toString())
          }
        }

        // Уведомляем о изменении счета
        if (onScoreUpdate && newState.player.score !== gameState.player.score) {
          onScoreUpdate(newState.player.score)
        }

        // Рендерим игру
        renderGame(ctx, newState, assets, selectedShipType, true)

        // Рисуем индикатор касания, если есть активное касание
        if (fingerPosition) {
          ctx.beginPath()
          ctx.arc(fingerPosition.x, fingerPosition.y, 20, 0, Math.PI * 2)
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
          ctx.lineWidth = 2
          ctx.stroke()
        }
      } else {
        // Рендерим инструкции
        renderInstructions(ctx)
      }

      animationFrameId = requestAnimationFrame(gameLoop)
    }

    animationFrameId = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [
    gameState,
    input,
    assets,
    onScoreUpdate,
    highScore,
    showInstructions,
    selectedShipType,
    autoFire,
    isMobile,
    fingerPosition,
  ])

  // Рендеринг инструкций
  const renderInstructions = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

    // Рисуем звездное небо
    ctx.fillStyle = "#FFF"
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * GAME_WIDTH
      const y = Math.random() * GAME_HEIGHT
      const size = Math.random() * 2 + 1
      ctx.fillRect(x, y, size, size)
    }

    ctx.fillStyle = "#FFF"
    ctx.font = "bold 24px 'Press Start 2P', monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText("SPACE SHOOTER", GAME_WIDTH / 2, 50)

    ctx.font = "16px 'Press Start 2P', monospace"
    ctx.fillText("HOW TO PLAY", GAME_WIDTH / 2, 100)

    ctx.font = "12px 'Press Start 2P', monospace"
    ctx.fillText("KEYBOARD CONTROLS:", GAME_WIDTH / 2, 150)
    ctx.fillText("ARROWS / WASD - MOVE", GAME_WIDTH / 2, 180)
    ctx.fillText("SPACE - FIRE", GAME_WIDTH / 2, 210)
    ctx.fillText("P / ESC - PAUSE", GAME_WIDTH / 2, 240)

    ctx.fillText("TOUCH CONTROLS:", GAME_WIDTH / 2, 280)
    ctx.fillText("TOUCH & DRAG - MOVE SHIP", GAME_WIDTH / 2, 310)
    ctx.fillText("AUTO-FIRE ENABLED", GAME_WIDTH / 2, 340)

    ctx.font = "16px 'Press Start 2P', monospace"
    ctx.fillStyle = "#5F5"
    const pulseText = 0.7 + 0.3 * Math.sin(Date.now() * 0.005)
    ctx.globalAlpha = pulseText
    ctx.fillText("PRESS ENTER OR TOUCH", GAME_WIDTH / 2, GAME_HEIGHT - 100)
    ctx.fillText("TO START", GAME_WIDTH / 2, GAME_HEIGHT - 70)
    ctx.globalAlpha = 1.0

    ctx.fillStyle = "#FFF"
    ctx.font = "12px 'Press Start 2P', monospace"
    ctx.fillText(`HIGH SCORE: ${highScore}`, GAME_WIDTH / 2, GAME_HEIGHT - 30)
  }

  // Обработчик паузы
  const togglePause = () => {
    if (!gameState.gameOver && !showInstructions) {
      setGameState((prev) => ({ ...prev, paused: !prev.paused }))
    }
  }

  return (
    <div ref={containerRef} className="space-shooter-container relative w-full flex flex-col items-center">
      {/* Анимированный космический фон */}
      <div className="star-background absolute inset-0 overflow-hidden rounded-lg" style={{ zIndex: 0 }}>
        <AnimatedBackground width={GAME_WIDTH} height={GAME_HEIGHT} />
      </div>

      {/* Индикатор загрузки ассетов */}
      {!assetsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
          <div className="text-center w-64">
            <div className="h-2 bg-gray-800 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-white mb-2">Loading game assets... {loadingProgress}%</p>
            <p className="text-gray-400 text-xs mb-4">Attempting to load vector ships</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => setAssetsLoaded(true)}
            >
              Skip Loading
            </button>
          </div>
        </div>
      )}

      {/* Предпросмотр SVG ракеты (только если не в полноэкранном режиме) */}
      {svgData && !fullscreenMode && (
        <div className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 p-2 rounded">
          <p className="text-white text-xs mb-1">Ship Preview:</p>
          <VectorShipRenderer svgData={svgData} width={40} height={40} color="#4AF" />
        </div>
      )}

      {/* Игровой холст с космическим фоном */}
      <div className="relative" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        {/* Космический фон */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black"></div>
        </div>

        {/* Игровой холст */}
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="border border-gray-700 rounded-lg shadow-lg w-full h-full touch-none relative z-10"
          style={{ background: "transparent" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {/* Интерфейс под игрой (только если не в полноэкранном режиме) */}
      {!fullscreenMode && (
        <>
          <div className="mt-4 flex justify-between w-full max-w-[400px]">
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              onClick={togglePause}
              disabled={gameState.gameOver || showInstructions}
            >
              {gameState.paused ? "Resume" : "Pause"}
            </button>
            <div className="text-white font-bold">High Score: {highScore}</div>
          </div>

          {/* Индикаторы управления */}
          <div className="mt-4 w-full max-w-[400px] bg-black bg-opacity-50 p-3 rounded-lg border border-gray-800">
            <div className="text-xs text-center text-gray-400 mb-2">Controls:</div>
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-400 mb-1">Mobile</div>
                <div className="flex items-center space-x-2">
                  <span className="bg-gray-800 px-2 py-1 rounded text-xs">Touch & Drag</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-gray-400 mb-1">Keyboard</div>
                <div className="flex items-center space-x-2">
                  <span className="bg-gray-800 px-2 py-1 rounded text-xs">WASD</span>
                  <span className="bg-gray-800 px-2 py-1 rounded text-xs">Arrows</span>
                  <span className="bg-gray-800 px-2 py-1 rounded text-xs">Space</span>
                </div>
              </div>
            </div>
          </div>

          {/* Переключатель автоматической стрельбы */}
          {isMobile && (
            <div className="mt-2 flex items-center justify-center">
              <label className="flex items-center space-x-2 text-white text-sm">
                <input
                  type="checkbox"
                  checked={autoFire}
                  onChange={() => setAutoFire(!autoFire)}
                  className="rounded text-blue-500"
                />
                <span>Auto-fire {autoFire ? "ON" : "OFF"}</span>
              </label>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SpaceShooter
