/**
 * 像素风暴雪（canvas 版）
 *
 * 为什么要用 canvas 而不是 DOM：几百个方块如果做成 <div>，
 * 每帧改 transform 会触发几百次样式计算和合成层更新；
 * canvas 只是同一张画布上多画几笔，开销小得多。
 *
 * 回收策略：雪花落出屏幕（或吹出左边）就回收，再从顶部随机重生。
 * 这样天然无缝 —— 不需要"铺两层、只移动一层"那种拼接技巧。
 *
 * 四层纵深：越近越大，越快，飘得越远，越亮。
 * 风统一从右往左。
 */

interface Flake {
  /** 所属层的下标。回收重生时按它取速度/尺寸/透明度，不靠尺寸反查 */
  layer: number
  x: number
  y: number
  size: number
  speed: number   // 垂直下落速度 px/s
  drift: number   // 水平漂移速度 px/s（正数 = 向右，负数 = 向左）
  alpha: number
}

interface LayerSpec {
  count: number
  sizeMin: number
  sizeMax: number
  speedMin: number
  speedMax: number
  driftMin: number
  driftMax: number
  alphaMin: number
  alphaMax: number
}

/**
 * 帧间隔下限（ms）。
 * 雪是永不停歇的动画，跑满 60fps 时每秒要做上万次绘制调用。
 * 限到 30fps 后视觉几乎无差别，主线程与 GPU 占用直接减半。
 */
const FRAME_INTERVAL = 1000 / 30

/** 雪花颜色：深色底用浅灰，浅色底用深灰，否则任一方都会看不见 */
const SNOW_COLOR_DARK = '#9ca3af'
const SNOW_COLOR_LIGHT = '#64748b'

const currentSnowColor = () =>
  document.documentElement.classList.contains('dark') ? SNOW_COLOR_DARK : SNOW_COLOR_LIGHT

/** 四层规格：远 → 近 */
const LAYERS: LayerSpec[] = [
  // 远景：小而密，慢，淡
  { count: 42, sizeMin: 2, sizeMax: 2, speedMin: 55, speedMax: 80, driftMin: -30, driftMax: -55, alphaMin: 0.18, alphaMax: 0.42 },
  // 中景
  { count: 34, sizeMin: 3, sizeMax: 4, speedMin: 85, speedMax: 120, driftMin: -55, driftMax: -95, alphaMin: 0.28, alphaMax: 0.6 },
  // 近景：最大最快最亮
  { count: 26, sizeMin: 5, sizeMax: 6, speedMin: 140, speedMax: 200, driftMin: -90, driftMax: -150, alphaMin: 0.45, alphaMax: 0.85 },
  // 最前：快速掠过的小片，制造速度感
  { count: 28, sizeMin: 2, sizeMax: 3, speedMin: 110, speedMax: 160, driftMin: -100, driftMax: -170, alphaMin: 0.25, alphaMax: 0.55 },
]

const rand = (min: number, max: number) => min + Math.random() * (max - min)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * 挂载雪景，返回销毁函数。
 * 只应调用一次；调用前若已有实例，请先销毁。
 */
export function initSnow(): () => void {
  // 尊重"减少动画"偏好：干脆不画，比画一张静止的雪更省事
  if (prefersReducedMotion()) return () => {}

  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.cssText = [
    'position: fixed',
    'inset: 0',
    'width: 100%',
    'height: 100%',
    'pointer-events: none',
    'z-index: -1',
  ].join(';')
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return () => {}
  }

  let dpr = 1
  let width = 0   // CSS 像素宽
  let height = 0  // CSS 像素高
  let flakes: Flake[] = []
  let rafId = 0
  let lastTime = 0
  let running = false

  /** 从顶部外侧生成一片雪；initial 为 true 时允许出生在屏幕内 */
  const makeFlake = (layerIndex: number, initial: boolean): Flake => {
    const spec = LAYERS[layerIndex]!
    const size = Math.round(rand(spec.sizeMin, spec.sizeMax)) // 整数尺寸 = 像素感

    // x 必须覆盖整个屏宽，否则两侧会出现"真空区"：
    //   · 起点太大 → 左侧没有新雪补给（左上角空）
    //   · 起点太小 → 右侧被风吹空后补不上（右下角空）
    // 所以从屏幕左侧外侧一直生成到右侧外侧，右边多留一点余量，
    // 抵掉风向左吹造成的流失。
    const x = initial
      ? rand(-80, width + 80)
      : rand(-120, width + 320)

    return {
      layer: layerIndex,
      x,
      y: initial ? rand(-40, height) : rand(-size * 4, -size),
      size,
      speed: rand(spec.speedMin, spec.speedMax),
      drift: rand(spec.driftMin, spec.driftMax),
      alpha: rand(spec.alphaMin, spec.alphaMax),
    }
  }

  /** 按规格重建全部雪花 */
  const respawnAll = () => {
    flakes = []
    for (let li = 0; li < LAYERS.length; li++) {
      const spec = LAYERS[li]!
      for (let i = 0; i < spec.count; i++) flakes.push(makeFlake(li, true))
    }
  }

  /** 尺寸变化：按设备像素比重设画布，并重建雪花避免坐标错位 */
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2) // 上限 2，避免高分屏上画布过大
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    // 收尾时关掉抗锯齿，方块边缘保持硬边
    ctx.imageSmoothingEnabled = false
    respawnAll()
  }

  const step = (delta: number) => {
    ctx.clearRect(0, 0, width, height)
    // ⚠️ 必须显式指定颜色：canvas 的 fillStyle 默认是黑色，
    // 在深色背景上等于什么都没画（这就是之前"完全看不见"的真正原因）
    ctx.fillStyle = currentSnowColor()

    for (const f of flakes) {
      f.y += f.speed * delta
      f.x += f.drift * delta

      // 落出底部、或吹出左右任一侧：回收重生回顶部
      if (f.y - f.size > height || f.x + f.size < -100 || f.x - f.size > width + 100) {
        // 数组长度恒定：这里只是把同一个对象搬回顶部，不删不建
        Object.assign(f, makeFlake(f.layer, false))
        continue
      }

      ctx.globalAlpha = f.alpha
      // 用矩形而不是路径：像素方块就是要硬边直角
      ctx.fillRect(Math.round(f.x), Math.round(f.y), f.size, f.size)
    }

    ctx.globalAlpha = 1
  }

  const frame = (time: number) => {
    if (!running) return

    // 限帧：距上一帧不足 FRAME_INTERVAL 就跳过本次绘制，只继续排队
    if (time - lastTime < FRAME_INTERVAL) {
      rafId = requestAnimationFrame(frame)
      return
    }

    // delta 上限 50ms：切回标签页时避免雪瞬间"跳"一大段
    const delta = Math.min((time - lastTime) / 1000, 0.05)
    lastTime = time
    step(delta)
    rafId = requestAnimationFrame(frame)
  }

  const start = () => {
    if (running) return
    running = true
    lastTime = performance.now()
    rafId = requestAnimationFrame(frame)
  }

  const stop = () => {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
  }

  // 标签页切走时停掉，别在后台空转
  const onVisibility = () => {
    if (document.hidden) stop()
    else start()
  }

  const onResize = () => resize()

  resize()
  start()
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('resize', onResize, { passive: true })

  // 返回销毁函数
  return () => {
    stop()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('resize', onResize)
    canvas.remove()
    flakes = []
  }
}
