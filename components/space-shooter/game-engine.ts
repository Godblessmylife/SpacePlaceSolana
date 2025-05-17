// Добавим константы для игры
export const GAME_WIDTH = 400
export const GAME_HEIGHT = 600

// Типы для игровых объектов
export interface Player {
  x: number
  y: number
  width: number
  height: number
  speed: number
  lives: number
  score: number
  power: number
  active: boolean
  invulnerable: boolean
  invulnerableTimer: number
  fireRate: number
  fireTimer: number
}

export interface Enemy {
  x: number
  y: number
  width: number
  height: number
  speed: number
  health: number
  active: boolean
  variant: number
  fireRate: number
  fireTimer: number
  movePattern: string
  moveTimer: number
  points: number
}

export interface Meteor {
  x: number
  y: number
  width: number
  height: number
  speed: number
  health: number
  active: boolean
  variant: number
  angle: number
  rotationSpeed: number
  points: number
}

export interface Bullet {
  x: number
  y: number
  width: number
  height: number
  speed: number
  damage: number
  active: boolean
  isPlayerBullet: boolean
}

export interface Explosion {
  x: number
  y: number
  size: number
  timer: number
  maxTime: number
  color: string
}

export interface PowerUp {
  x: number
  y: number
  width: number
  height: number
  speed: number
  active: boolean
  type: string
}

export interface GameState {
  player: Player
  enemies: Enemy[]
  meteors: Meteor[]
  bullets: Bullet[]
  explosions: Explosion[]
  powerUps: PowerUp[]
  level: number
  wave: number
  gameTime: number
  paused: boolean
  gameOver: boolean
  difficulty: number
}

// Инициализация игрового состояния
export function initGameState(): GameState {
  return {
    player: {
      x: GAME_WIDTH / 2 - 20,
      y: GAME_HEIGHT - 100,
      width: 40,
      height: 40,
      speed: 5,
      lives: 3,
      score: 0,
      power: 1,
      active: true,
      invulnerable: true,
      invulnerableTimer: 120,
      fireRate: 15,
      fireTimer: 0,
    },
    enemies: [],
    meteors: [],
    bullets: [],
    explosions: [],
    powerUps: [],
    level: 1,
    wave: 1,
    gameTime: 0,
    paused: false,
    gameOver: false,
    difficulty: 1,
  }
}

// Создание волны врагов
export function createEnemyWave(level: number, difficulty: number): Enemy[] {
  const enemies: Enemy[] = []
  const enemyCount = Math.min(5 + level, 15)

  for (let i = 0; i < enemyCount; i++) {
    const variant = Math.floor(Math.random() * 3)
    const movePatterns = ["horizontal", "diagonal", "sine"]
    const movePattern = movePatterns[Math.floor(Math.random() * movePatterns.length)]

    enemies.push({
      x: 30 + (GAME_WIDTH - 60) * (i / enemyCount),
      y: 50 + Math.random() * 100,
      width: 30,
      height: 30,
      speed: 1 + difficulty * 0.5,
      health: 1 + Math.floor(level / 3),
      active: true,
      variant,
      fireRate: Math.max(60 - level * 5, 30),
      fireTimer: Math.floor(Math.random() * 60),
      movePattern,
      moveTimer: Math.floor(Math.random() * 120),
      points: 10 + variant * 5 + level * 2,
    })
  }

  return enemies
}

// Создание метеоритов
export function createMeteors(level: number): Meteor[] {
  const meteors: Meteor[] = []
  const meteorCount = Math.min(level, 8)

  for (let i = 0; i < meteorCount; i++) {
    const variant = Math.floor(Math.random() * 3)
    const size = 30 + variant * 10

    meteors.push({
      x: Math.random() * (GAME_WIDTH - size),
      y: -size - Math.random() * 300,
      width: size,
      height: size,
      speed: 1 + Math.random() * 2,
      health: 1 + variant,
      active: true,
      variant,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      points: 5 + variant * 3,
    })
  }

  return meteors
}

// Создание пули
function createBullet(x: number, y: number, isPlayerBullet: boolean, power = 1, angle = 0): Bullet {
  return {
    x,
    y,
    width: isPlayerBullet ? 3 : 2,
    height: isPlayerBullet ? 15 : 10,
    speed: isPlayerBullet ? 10 : 5,
    damage: isPlayerBullet ? power : 1,
    active: true,
    isPlayerBullet,
  }
}

// Создание взрыва
function createExplosion(x: number, y: number, size: number, color = "#FF4400"): Explosion {
  return {
    x,
    y,
    size,
    timer: 30,
    maxTime: 30,
    color,
  }
}

// Создание усиления
function createPowerUp(x: number, y: number): PowerUp {
  const types = ["health", "power", "shield", "speed"]
  const type = types[Math.floor(Math.random() * types.length)]

  return {
    x,
    y,
    width: 20,
    height: 20,
    speed: 1,
    active: true,
    type,
  }
}

// Обновление состояния игры
export function updateGameState(state: GameState, input: any): GameState {
  if (state.paused || state.gameOver) {
    return state
  }

  // Увеличиваем игровое время
  state.gameTime++

  // Обновляем игрока
  updatePlayer(state, input)

  // Обновляем врагов
  updateEnemies(state)

  // Обновляем метеориты
  updateMeteors(state)

  // Обновляем пули
  updateBullets(state)

  // Обновляем взрывы
  updateExplosions(state)

  // Обновляем усиления
  updatePowerUps(state)

  // Проверяем столкновения
  checkCollisions(state)

  // Проверяем условия для следующей волны
  checkWaveCompletion(state)

  // Проверяем условия окончания игры
  if (state.player.lives <= 0 && state.player.active) {
    state.player.active = false
    state.gameOver = true

    // Создаем большой взрыв на месте игрока
    state.explosions.push(
      createExplosion(state.player.x + state.player.width / 2, state.player.y + state.player.height / 2, 50, "#FF0000"),
    )
  }

  return { ...state }
}

// Обновление игрока
function updatePlayer(state: GameState, input: any): void {
  const player = state.player

  if (!player.active) return

  // Обновляем таймер неуязвимости
  if (player.invulnerable) {
    player.invulnerableTimer--
    if (player.invulnerableTimer <= 0) {
      player.invulnerable = false
    }
  }

  // Обновляем таймер стрельбы
  if (player.fireTimer > 0) {
    player.fireTimer--
  }

  // Обрабатываем ввод с плавным ускорением для мобильных устройств
  const acceleration = 0.5 // Коэффициент ускорения
  const maxSpeed = player.speed // Максимальная скорость

  // Горизонтальное движение
  if (input.left) {
    player.x -= Math.min(player.speed, maxSpeed)
  }
  if (input.right) {
    player.x += Math.min(player.speed, maxSpeed)
  }

  // Вертикальное движение
  if (input.up) {
    player.y -= Math.min(player.speed, maxSpeed)
  }
  if (input.down) {
    player.y += Math.min(player.speed, maxSpeed)
  }

  // Ограничиваем позицию игрока
  player.x = Math.max(0, Math.min(GAME_WIDTH - player.width, player.x))
  player.y = Math.max(0, Math.min(GAME_HEIGHT - player.height, player.y))

  // Стрельба с оптимизацией для мобильных устройств
  if (input.fire && player.fireTimer <= 0) {
    // Сбрасываем таймер стрельбы
    player.fireTimer = player.fireRate

    // Создаем пули в зависимости от мощности
    if (player.power === 1) {
      // Одна пуля по центру
      state.bullets.push(createBullet(player.x + player.width / 2 - 1.5, player.y - 15, true, player.power))
    } else if (player.power === 2) {
      // Две пули по бокам
      state.bullets.push(createBullet(player.x + 10, player.y, true, player.power))
      state.bullets.push(createBullet(player.x + player.width - 10, player.y, true, player.power))
    } else {
      // Три пули: по центру и по бокам
      state.bullets.push(createBullet(player.x + player.width / 2 - 1.5, player.y - 15, true, player.power))
      state.bullets.push(createBullet(player.x + 5, player.y, true, player.power))
      state.bullets.push(createBullet(player.x + player.width - 5, player.y, true, player.power))
    }
  }
}

// Обновление врагов
function updateEnemies(state: GameState): void {
  for (const enemy of state.enemies) {
    if (!enemy.active) continue

    // Обновляем таймер стрельбы
    if (enemy.fireTimer > 0) {
      enemy.fireTimer--
    }

    // Обновляем таймер движения
    enemy.moveTimer++

    // Движение в зависимости от паттерна
    switch (enemy.movePattern) {
      case "horizontal":
        enemy.x += Math.sin(enemy.moveTimer * 0.05) * enemy.speed
        enemy.y += 0.5
        break
      case "diagonal":
        enemy.x += Math.cos(enemy.moveTimer * 0.05) * enemy.speed
        enemy.y += 0.7
        break
      case "sine":
        enemy.x += Math.sin(enemy.moveTimer * 0.1) * enemy.speed * 2
        enemy.y += 0.3
        break
      default:
        enemy.y += enemy.speed * 0.5
    }

    // Ограничиваем позицию врага
    enemy.x = Math.max(0, Math.min(GAME_WIDTH - enemy.width, enemy.x))

    // Если враг вышел за пределы экрана, перемещаем его наверх
    if (enemy.y > GAME_HEIGHT) {
      enemy.y = -enemy.height - Math.random() * 100
      enemy.x = Math.random() * (GAME_WIDTH - enemy.width)
    }

    // Стрельба
    if (enemy.fireTimer <= 0 && Math.random() < 0.01 * state.difficulty) {
      // Сбрасываем таймер стрельбы
      enemy.fireTimer = enemy.fireRate

      // Создаем пулю
      state.bullets.push(createBullet(enemy.x + enemy.width / 2 - 1, enemy.y + enemy.height, false))
    }
  }
}

// Обновление метеоритов
function updateMeteors(state: GameState): void {
  for (const meteor of state.meteors) {
    if (!meteor.active) continue

    // Движение
    meteor.y += meteor.speed
    meteor.angle += meteor.rotationSpeed

    // Если метеорит вышел за пределы экрана, перемещаем его наверх
    if (meteor.y > GAME_HEIGHT) {
      meteor.y = -meteor.height - Math.random() * 100
      meteor.x = Math.random() * (GAME_WIDTH - meteor.width)
      meteor.rotationSpeed = (Math.random() - 0.5) * 0.05
    }
  }
}

// Обновление пуль
function updateBullets(state: GameState): void {
  for (const bullet of state.bullets) {
    if (!bullet.active) continue

    // Движение
    if (bullet.isPlayerBullet) {
      bullet.y -= bullet.speed
    } else {
      bullet.y += bullet.speed
    }

    // Если пуля вышла за пределы экрана, деактивируем ее
    if (bullet.y < -bullet.height || bullet.y > GAME_HEIGHT) {
      bullet.active = false
    }
  }

  // Удаляем неактивные пули
  state.bullets = state.bullets.filter((bullet) => bullet.active)
}

// Обновление взрывов
function updateExplosions(state: GameState): void {
  for (const explosion of state.explosions) {
    explosion.timer--

    // Если таймер истек, удаляем взрыв
    if (explosion.timer <= 0) {
      explosion.timer = 0
    }
  }

  // Удаляем истекшие взрывы
  state.explosions = state.explosions.filter((explosion) => explosion.timer > 0)
}

// Обновление усилений
function updatePowerUps(state: GameState): void {
  for (const powerUp of state.powerUps) {
    if (!powerUp.active) continue

    // Движение
    powerUp.y += powerUp.speed

    // Если усиление вышло за пределы экрана, деактивируем его
    if (powerUp.y > GAME_HEIGHT) {
      powerUp.active = false
    }
  }

  // Удаляем неактивные усиления
  state.powerUps = state.powerUps.filter((powerUp) => powerUp.active)
}

// Проверка столкновений
function checkCollisions(state: GameState): void {
  const player = state.player

  if (!player.active) return

  // Проверяем столкновения пуль игрока с врагами и метеоритами
  for (const bullet of state.bullets) {
    if (!bullet.active || !bullet.isPlayerBullet) continue

    // Проверяем столкновения с врагами
    for (const enemy of state.enemies) {
      if (!enemy.active) continue

      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // Наносим урон врагу
        enemy.health -= bullet.damage

        // Деактивируем пулю
        bullet.active = false

        // Если враг уничтожен
        if (enemy.health <= 0) {
          // Деактивируем врага
          enemy.active = false

          // Создаем взрыв
          state.explosions.push(createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 30, "#FF6600"))

          // Начисляем очки
          player.score += enemy.points

          // Шанс создать усиление
          if (Math.random() < 0.2) {
            state.powerUps.push(createPowerUp(enemy.x + enemy.width / 2 - 10, enemy.y + enemy.height / 2 - 10))
          }
        }

        break
      }
    }

    // Проверяем столкновения с метеоритами
    for (const meteor of state.meteors) {
      if (!meteor.active) continue

      if (
        bullet.x < meteor.x + meteor.width &&
        bullet.x + bullet.width > meteor.x &&
        bullet.y < meteor.y + meteor.height &&
        bullet.y + bullet.height > meteor.y
      ) {
        // Наносим урон метеориту
        meteor.health -= bullet.damage

        // Деактивируем пулю
        bullet.active = false

        // Если метеорит уничтожен
        if (meteor.health <= 0) {
          // Деактивируем метеорит
          meteor.active = false

          // Создаем взрыв
          state.explosions.push(
            createExplosion(meteor.x + meteor.width / 2, meteor.y + meteor.height / 2, meteor.width, "#AA6600"),
          )

          // Начисляем очки
          player.score += meteor.points

          // Шанс создать усиление
          if (Math.random() < 0.1) {
            state.powerUps.push(createPowerUp(meteor.x + meteor.width / 2 - 10, meteor.y + meteor.height / 2 - 10))
          }
        }

        break
      }
    }
  }

  // Проверяем столкновения пуль врагов с игроком
  if (!player.invulnerable) {
    for (const bullet of state.bullets) {
      if (!bullet.active || bullet.isPlayerBullet) continue

      if (
        bullet.x < player.x + player.width &&
        bullet.x + bullet.width > player.x &&
        bullet.y < player.y + player.height &&
        bullet.y + bullet.height > player.y
      ) {
        // Деактивируем пулю
        bullet.active = false

        // Уменьшаем жизни игрока
        player.lives--

        // Делаем игрока неуязвимым на некоторое время
        player.invulnerable = true
        player.invulnerableTimer = 120

        // Создаем взрыв
        state.explosions.push(createExplosion(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2, 20, "#FF0000"))

        break
      }
    }
  }

  // Проверяем столкновения игрока с врагами и метеоритами
  if (!player.invulnerable) {
    // Проверяем столкновения с врагами
    for (const enemy of state.enemies) {
      if (!enemy.active) continue

      if (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
      ) {
        // Уменьшаем жизни игрока
        player.lives--

        // Делаем игрока неуязвимым на некоторое время
        player.invulnerable = true
        player.invulnerableTimer = 120

        // Наносим урон врагу
        enemy.health--

        // Если враг уничтожен
        if (enemy.health <= 0) {
          // Деактивируем врага
          enemy.active = false

          // Создаем взрыв
          state.explosions.push(createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 30, "#FF6600"))

          // Начисляем очки
          player.score += enemy.points
        }

        // Создаем взрыв
        state.explosions.push(createExplosion(player.x + player.width / 2, player.y + player.height / 2, 30, "#FF0000"))

        break
      }
    }

    // Проверяем столкновения с метеоритами
    for (const meteor of state.meteors) {
      if (!meteor.active) continue

      if (
        player.x < meteor.x + meteor.width &&
        player.x + player.width > meteor.x &&
        player.y < meteor.y + meteor.height &&
        player.y + player.height > meteor.y
      ) {
        // Уменьшаем жизни игрока
        player.lives--

        // Делаем игрока неуязвимым на некоторое время
        player.invulnerable = true
        player.invulnerableTimer = 120

        // Наносим урон метеориту
        meteor.health--

        // Если метеорит уничтожен
        if (meteor.health <= 0) {
          // Деактивируем метеорит
          meteor.active = false

          // Создаем взрыв
          state.explosions.push(
            createExplosion(meteor.x + meteor.width / 2, meteor.y + meteor.height / 2, meteor.width, "#AA6600"),
          )

          // Начисляем очки
          player.score += meteor.points
        }

        // Создаем взрыв
        state.explosions.push(createExplosion(player.x + player.width / 2, player.y + player.height / 2, 30, "#FF0000"))

        break
      }
    }
  }

  // Проверяем столкновения игрока с усилениями
  for (const powerUp of state.powerUps) {
    if (!powerUp.active) continue

    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {
      // Деактивируем усиление
      powerUp.active = false

      // Применяем эффект усиления
      switch (powerUp.type) {
        case "health":
          // Добавляем жизнь
          player.lives = Math.min(player.lives + 1, 5)
          break
        case "power":
          // Увеличиваем мощность оружия
          player.power = Math.min(player.power + 1, 3)
          break
        case "shield":
          // Делаем игрока неуязвимым на некоторое время
          player.invulnerable = true
          player.invulnerableTimer = 300
          break
        case "speed":
          // Увеличиваем скорость игрока
          player.speed = Math.min(player.speed + 1, 8)
          break
      }

      // Создаем эффект
      state.explosions.push(
        createExplosion(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, 20, "#FFFFFF"),
      )

      break
    }
  }
}

// Проверка завершения волны
function checkWaveCompletion(state: GameState): void {
  // Если все враги уничтожены, создаем новую волну
  if (state.enemies.every((enemy) => !enemy.active)) {
    state.wave++

    // Каждые 3 волны увеличиваем уровень
    if (state.wave > 3) {
      state.wave = 1
      state.level++
      state.difficulty += 0.2
    }

    // Создаем новую волну врагов
    state.enemies = createEnemyWave(state.level, state.difficulty)

    // Добавляем метеориты
    state.meteors = [...state.meteors, ...createMeteors(state.level)]
  }
}
