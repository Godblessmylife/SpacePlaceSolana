import { type GameState, GAME_WIDTH, GAME_HEIGHT } from "./game-engine"

// Интерфейс для игровых ассетов
export interface GameAssets {
  playerSvgRocket: HTMLImageElement | null
  playerShip: null
  playerAirplane: null
  enemyShips: HTMLImageElement[] | null
  meteors: HTMLImageElement[] | null
  background: HTMLImageElement | null
  powerUps: HTMLImageElement[] | null
}

// Функция для рендеринга игры
export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  assets: GameAssets,
  selectedShipType = "svgRocket",
  enhanceTextVisibility = false,
): void {
  // Очищаем canvas полностью
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  // Рисуем фон с полной непрозрачностью
  ctx.globalAlpha = 1.0
  // Всегда используем запасной фон
  drawStarfield(ctx)

  // Сбрасываем прозрачность
  ctx.globalAlpha = 1.0

  // Рисуем игрока
  renderPlayer(ctx, state, assets, selectedShipType)

  // Рисуем врагов
  renderEnemies(ctx, state, assets)

  // Рисуем метеориты
  renderMeteors(ctx, state, assets)

  // Рисуем пули
  renderBullets(ctx, state)

  // Рисуем взрывы
  renderExplosions(ctx, state)

  // Рисуем усиления
  renderPowerUps(ctx, state, assets)

  // Рисуем интерфейс
  renderUI(ctx, state, enhanceTextVisibility)

  // Рисуем экран паузы или окончания игры
  if (state.paused) {
    renderPauseScreen(ctx)
  } else if (state.gameOver) {
    renderGameOverScreen(ctx, state)
  }
}

// Рисуем поле звезд (запасной вариант, если анимированный фон не загрузился)
function drawStarfield(ctx: CanvasRenderingContext2D): void {
  // Фон
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT)
  gradient.addColorStop(0, "#0a1030") // Более темный синий
  gradient.addColorStop(0.5, "#1a0a30") // Фиолетовый
  gradient.addColorStop(1, "#000000") // Черный
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  // Маленькие звезды (больше звезд)
  ctx.fillStyle = "#FFF"
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * GAME_WIDTH
    const y = Math.random() * GAME_HEIGHT
    const size = Math.random() * 2 + 1
    ctx.fillRect(x, y, size, size)
  }

  // Цветные звезды (больше цветных звезд)
  const colors = ["#8AF", "#F8A", "#AFA", "#FAF", "#FFA"]
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * GAME_WIDTH
    const y = Math.random() * GAME_HEIGHT
    const size = Math.random() * 2 + 0.5
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    ctx.fillRect(x, y, size, size)
  }

  // Добавим несколько туманностей для красоты
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * GAME_WIDTH
    const y = Math.random() * GAME_HEIGHT
    const radius = 50 + Math.random() * 100

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)

    // Используем фиксированные цвета для туманностей
    gradient.addColorStop(0, "rgba(100, 100, 255, 0.1)")
    gradient.addColorStop(1, "rgba(100, 100, 255, 0)")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Рисуем игрока
function renderPlayer(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  assets: GameAssets,
  selectedShipType: string,
): void {
  const player = state.player

  if (!player.active) return

  // Pulsating effect during invulnerability
  if (player.invulnerable && Math.floor(Date.now() / 60) % 2 === 0) {
    return
  }

  try {
    // Используем SVG ракету если доступна
    const playerImage = assets.playerSvgRocket

    if (playerImage) {
      // Save context for transformations
      ctx.save()

      // Move origin to center of ship
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2)

      // Draw the player ship with center offset
      ctx.drawImage(playerImage, -player.width / 2, -player.height / 2, player.width, player.height)

      // Restore context
      ctx.restore()

      // Engine effect
      drawSvgRocketEngine(ctx, player)
    } else {
      // Если изображение не загрузилось, рисуем запасной вариант
      renderFallbackPlayer(ctx, player)
    }

    // Shield during invulnerability
    if (player.invulnerable) {
      drawPlayerShield(ctx, player)
    }
  } catch (error) {
    console.error("Error rendering player ship:", error)
    renderFallbackPlayer(ctx, player)
  }
}

// Функция для запасного рендеринга игрока
function renderFallbackPlayer(ctx: CanvasRenderingContext2D, player: any): void {
  // Сохраняем контекст
  ctx.save()

  // Перемещаем начало координат в центр корабля
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2)

  // Рисуем треугольную ракету
  ctx.beginPath()
  ctx.moveTo(0, -player.height / 2)
  ctx.lineTo(-player.width / 2, player.height / 2)
  ctx.lineTo(player.width / 2, player.height / 2)
  ctx.closePath()

  // Заливка градиентом
  const gradient = ctx.createLinearGradient(0, -player.height / 2, 0, player.height / 2)
  gradient.addColorStop(0, "#4AF")
  gradient.addColorStop(1, "#08F")
  ctx.fillStyle = gradient
  ctx.fill()

  // Обводка
  ctx.strokeStyle = "#FFF"
  ctx.lineWidth = 1
  ctx.stroke()

  // Детали корабля
  ctx.fillStyle = "#0FF"
  ctx.fillRect(-player.width * 0.2, player.height * 0.1, player.width * 0.4, player.height * 0.3)

  // Восстанавливаем контекст
  ctx.restore()

  // Рисуем эффект двигателя
  drawSvgRocketEngine(ctx, player)
}

// Функция для отрисовки эффекта двигателя SVG ракеты
function drawSvgRocketEngine(ctx: CanvasRenderingContext2D, player: any): void {
  // Save context
  ctx.save()

  // Move origin to center of bottom part of the rocket
  ctx.translate(player.x + player.width / 2, player.y + player.height)

  // Pulsating effect
  const pulseSize = 1 + Math.sin(Date.now() * 0.01) * 0.2

  // Draw additional flame effect
  ctx.beginPath()
  ctx.moveTo(-player.width * 0.3, 0)
  ctx.lineTo(0, player.height * 0.6 * pulseSize)
  ctx.lineTo(player.width * 0.3, 0)
  ctx.closePath()

  // Gradient for flame
  const gradient = ctx.createLinearGradient(0, 0, 0, player.height * 0.6)
  gradient.addColorStop(0, "rgba(255, 100, 0, 0.9)")
  gradient.addColorStop(0.6, "rgba(255, 200, 0, 0.7)")
  gradient.addColorStop(1, "rgba(255, 255, 100, 0.4)")

  ctx.fillStyle = gradient
  ctx.fill()

  // Inner flame
  ctx.beginPath()
  ctx.moveTo(-player.width * 0.15, 0)
  ctx.lineTo(0, player.height * 0.4 * pulseSize)
  ctx.lineTo(player.width * 0.15, 0)
  ctx.closePath()

  const innerGradient = ctx.createLinearGradient(0, 0, 0, player.height * 0.4)
  innerGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)")
  innerGradient.addColorStop(1, "rgba(255, 200, 100, 0.5)")

  ctx.fillStyle = innerGradient
  ctx.fill()

  // Restore context
  ctx.restore()
}

// Рисуем щит игрока
function drawPlayerShield(ctx: CanvasRenderingContext2D, player: any): void {
  ctx.beginPath()
  ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width * 0.7, 0, Math.PI * 2)

  // Градиент для щита
  const gradient = ctx.createRadialGradient(
    player.x + player.width / 2,
    player.y + player.height / 2,
    player.width * 0.4,
    player.x + player.width / 2,
    player.y + player.height / 2,
    player.width * 0.7,
  )
  gradient.addColorStop(0, "rgba(64, 170, 255, 0)")
  gradient.addColorStop(1, "rgba(64, 170, 255, 0.7)")

  ctx.strokeStyle = "#4AF"
  ctx.lineWidth = 2
  ctx.stroke()

  // Добавляем свечение
  ctx.fillStyle = gradient
  ctx.fill()
}

// Рисуем врагов
function renderEnemies(ctx: CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
  for (const enemy of state.enemies) {
    if (!enemy.active) continue

    try {
      // Определяем, какое изображение использовать для врага
      const enemyShipIndex = Math.min(enemy.variant, (assets.enemyShips?.length || 1) - 1)

      if (assets.enemyShips && assets.enemyShips.length > 0 && assets.enemyShips[enemyShipIndex]) {
        // Сохраняем контекст для применения фильтров
        ctx.save()

        // Применяем разные цветовые фильтры в зависимости от типа врага
        switch (enemy.variant) {
          case 0:
            ctx.filter = "hue-rotate(0deg) saturate(1.5)" // Красный
            break
          case 1:
            ctx.filter = "hue-rotate(270deg) saturate(1.5)" // Фиолетовый
            break
          case 2:
            ctx.filter = "hue-rotate(90deg) saturate(1.5)" // Зеленый
            break
        }

        // Рисуем корабль врага
        ctx.drawImage(assets.enemyShips[enemyShipIndex], enemy.x, enemy.y, enemy.width, enemy.height)

        // Восстанавливаем контекст
        ctx.restore()
      } else {
        // Запасной рендеринг
        renderFallbackEnemy(ctx, enemy)
      }
    } catch (error) {
      console.error("Error rendering enemy ship:", error)
      renderFallbackEnemy(ctx, enemy)
    }
  }
}

// Функция для запасного рендеринга врагов
function renderFallbackEnemy(ctx: CanvasRenderingContext2D, enemy: any): void {
  const colors = ["#F55", "#F5F", "#55F"]
  ctx.fillStyle = colors[enemy.variant % colors.length]
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)

  // Детали для различения типов врагов
  ctx.beginPath()
  ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width * 0.3, 0, Math.PI * 2)
  ctx.fillStyle = "#000"
  ctx.fill()

  ctx.beginPath()
  ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width * 0.15, 0, Math.PI * 2)
  ctx.fillStyle = "#FF0"
  ctx.fill()
}

// Рисуем метеориты
function renderMeteors(ctx: CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
  for (const meteor of state.meteors) {
    if (!meteor.active) continue

    if (assets.meteors && assets.meteors[meteor.variant]) {
      // Сохраняем контекст для вращения
      ctx.save()

      // Перемещаем начало координат в центр метеорита
      ctx.translate(meteor.x + meteor.width / 2, meteor.y + meteor.height / 2)

      // Вращаем
      ctx.rotate(meteor.angle || 0)

      // Рисуем с учетом сдвига координат
      ctx.drawImage(assets.meteors[meteor.variant], -meteor.width / 2, -meteor.height / 2, meteor.width, meteor.height)

      // Восстанавливаем контекст
      ctx.restore()
    } else {
      // Запасной рендеринг
      ctx.save()
      ctx.translate(meteor.x + meteor.width / 2, meteor.y + meteor.height / 2)
      ctx.rotate(meteor.angle || 0)

      // Круг серого цвета
      ctx.beginPath()
      ctx.arc(0, 0, meteor.width / 2, 0, Math.PI * 2)
      ctx.fillStyle = "#AAA"
      ctx.fill()

      // Кратеры
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5
        const dist = meteor.width * 0.2

        ctx.beginPath()
        ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, meteor.width * 0.1, 0, Math.PI * 2)
        ctx.fillStyle = "#888"
        ctx.fill()
      }

      ctx.restore()
    }
  }
}

// Рисуем пули
function renderBullets(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const bullet of state.bullets) {
    if (!bullet.active) continue

    if (bullet.isPlayerBullet) {
      // Пули игрока
      ctx.fillStyle = "#0F0"
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)

      // Свечение для пуль игрока
      ctx.beginPath()
      ctx.rect(bullet.x - 1, bullet.y - 2, bullet.width + 2, bullet.height + 2)
      ctx.fillStyle = "rgba(0, 255, 0, 0.3)"
      ctx.fill()
    } else {
      // Пули врагов
      ctx.fillStyle = "#F00"
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)

      // Свечение для пуль врагов
      ctx.beginPath()
      ctx.rect(bullet.x - 1, bullet.y, bullet.width + 2, bullet.height + 2)
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)"
      ctx.fill()
    }
  }
}

// Рисуем взрывы
function renderExplosions(ctx: CanvasRenderingContext2D, state: GameState): void {
  for (const explosion of state.explosions) {
    const alpha = explosion.timer / explosion.maxTime
    const size = explosion.size * (1 - alpha * 0.5)

    // Внешний круг
    ctx.beginPath()
    ctx.arc(explosion.x, explosion.y, size, 0, Math.PI * 2)
    ctx.fillStyle = `${explosion.color}${Math.floor(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`
    ctx.fill()

    // Внутренний круг
    ctx.beginPath()
    ctx.arc(explosion.x, explosion.y, size * 0.6, 0, Math.PI * 2)
    ctx.fillStyle = `#FFFF00${Math.floor(alpha * 230)
      .toString(16)
      .padStart(2, "0")}`
    ctx.fill()

    // Частицы
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 + state.gameTime * 0.01
      const distance = size * (0.5 + Math.random() * 0.5)

      ctx.beginPath()
      ctx.arc(
        explosion.x + Math.cos(angle) * distance,
        explosion.y + Math.sin(angle) * distance,
        size * 0.1,
        0,
        Math.PI * 2,
      )
      ctx.fillStyle = "#FFF"
      ctx.fill()
    }
  }
}

// Рисуем усиления
function renderPowerUps(ctx: CanvasRenderingContext2D, state: GameState, assets: GameAssets): void {
  for (const powerUp of state.powerUps) {
    if (!powerUp.active) continue

    // Всегда используем запасной рендеринг для powerups
    // Запасной рендеринг
    ctx.beginPath()
    ctx.arc(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, powerUp.width / 2, 0, Math.PI * 2)

    // Цвет в зависимости от типа
    switch (powerUp.type) {
      case "health":
        ctx.fillStyle = "#F55"
        break
      case "power":
        ctx.fillStyle = "#5F5"
        break
      case "shield":
        ctx.fillStyle = "#55F"
        break
      case "speed":
        ctx.fillStyle = "#FF5"
        break
      default:
        ctx.fillStyle = "#FFF"
    }

    ctx.fill()

    // Символ внутри
    ctx.fillStyle = "#FFF"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    let symbol = ""
    switch (powerUp.type) {
      case "health":
        symbol = "+"
        break
      case "power":
        symbol = "P"
        break
      case "shield":
        symbol = "S"
        break
      case "speed":
        symbol = ">"
        break
      default:
        symbol = "?"
    }

    ctx.fillText(symbol, powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2)

    // Эффект свечения
    const pulseSize = 1 + Math.sin(state.gameTime * 0.1) * 0.1
    ctx.beginPath()
    ctx.arc(
      powerUp.x + powerUp.width / 2,
      powerUp.y + powerUp.height / 2,
      (powerUp.width / 2) * pulseSize,
      0,
      Math.PI * 2,
    )

    // Цвет свечения в зависимости от типа
    switch (powerUp.type) {
      case "health":
        ctx.strokeStyle = "rgba(255, 50, 50, 0.5)"
        break
      case "power":
        ctx.strokeStyle = "rgba(50, 255, 50, 0.5)"
        break
      case "shield":
        ctx.strokeStyle = "rgba(50, 50, 255, 0.5)"
        break
      case "speed":
        ctx.strokeStyle = "rgba(255, 255, 50, 0.5)"
        break
      default:
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
    }

    ctx.lineWidth = 2
    ctx.stroke()
  }
}

// Получаем индекс для изображения усиления
function getPowerUpIndex(type: string): number {
  switch (type) {
    case "health":
      return 0
    case "power":
      return 1
    case "shield":
      return 2
    case "speed":
      return 3
    default:
      return 0
  }
}

// Рисуем пользовательский интерфейс
function renderUI(ctx: CanvasRenderingContext2D, state: GameState, enhanceTextVisibility = false): void {
  // Настройки текста
  ctx.font = 'bold 18px "Press Start 2P", monospace'
  ctx.textBaseline = "top"

  // Добавляем тень для текста, если включено улучшение видимости
  if (enhanceTextVisibility) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
    ctx.shadowBlur = 5
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
  }

  // Счет - переместим левее и выше
  ctx.fillStyle = "#FFF"
  ctx.textAlign = "left"

  // Рисуем фон для текста счета
  if (enhanceTextVisibility) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(5, 5, 200, 30)
    ctx.fillStyle = "#FFF"
  }

  ctx.fillText(`SCORE: ${state.player.score}`, 10, 10)

  // Уровень и волна - переместим ниже, чтобы не перекрывать счет
  ctx.textAlign = "center"

  // Рисуем фон для текста уровня и волны
  if (enhanceTextVisibility) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(GAME_WIDTH / 2 - 150, 40, 300, 30) // Перемещаем ниже
    ctx.fillStyle = "#FFF"
  }

  ctx.fillText(`LEVEL ${state.level}  WAVE ${state.wave}`, GAME_WIDTH / 2, 45) // Перемещаем ниже

  // Жизни - переместим правее и выше
  ctx.textAlign = "right"

  // Рисуем фон для текста жизней
  if (enhanceTextVisibility) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(GAME_WIDTH - 150, 5, 145, 30)
    ctx.fillStyle = "#FFF"
  }

  ctx.fillText(`LIVES: ${state.player.lives}`, GAME_WIDTH - 10, 10)

  // Сбрасываем тени, если они были включены
  if (enhanceTextVisibility) {
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
  }

  // Иконки жизней - перемещаем ниже
  for (let i = 0; i < state.player.lives; i++) {
    ctx.beginPath()
    ctx.moveTo(GAME_WIDTH - 20 - i * 25, 70) // Перемещаем ниже
    ctx.lineTo(GAME_WIDTH - 10 - i * 25, 70) // Перемещаем ниже
    ctx.lineTo(GAME_WIDTH - 15 - i * 25, 60) // Перемещаем ниже
    ctx.closePath()
    ctx.fillStyle = "#5F5"
    ctx.fill()
  }

  // Мощность оружия - перемещаем ниже
  ctx.textAlign = "left"
  ctx.fillStyle = "#FFF"

  // Рисуем фон для текста мощности
  if (enhanceTextVisibility) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(5, 75, 150, 30) // Перемещаем ниже
    ctx.fillStyle = "#FFF"
  }

  ctx.fillText(`POWER: ${state.player.power}`, 10, 80) // Перемещаем ниже

  // Индикатор мощности - перемещаем ниже
  for (let i = 0; i < state.player.power; i++) {
    ctx.fillStyle = i === 0 ? "#5F5" : i === 1 ? "#55F" : "#F5F"
    ctx.fillRect(15 + i * 25, 115, 20, 5) // Перемещаем ниже
  }
}

// Рисуем экран паузы
function renderPauseScreen(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  ctx.fillStyle = "#FFF"
  ctx.font = 'bold 36px "Press Start 2P", monospace'
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("PAUSED", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40)

  ctx.font = '16px "Press Start 2P", monospace'
  ctx.fillText("Press P to continue", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20)
}

// Рисуем экран окончания игры
function renderGameOverScreen(ctx: CanvasRenderingContext2D, state: GameState): void {
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  ctx.fillStyle = "#F55"
  ctx.font = 'bold 36px "Press Start 2P", monospace'
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("GAME OVER", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60)

  ctx.fillStyle = "#FFF"
  ctx.font = '20px "Press Start 2P", monospace'
  ctx.fillText(`FINAL SCORE: ${state.player.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2)
  ctx.fillText(`LEVEL: ${state.level}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40)

  ctx.font = '16px "Press Start 2P", monospace'
  ctx.fillText("Press ENTER to play again", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100)
}
