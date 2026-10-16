/**
 * 鼠标移动流星尾焰特效
 * ---------------------------------------------------------------------------
 * 鼠标一移动就出现：一条白色、由粗到细、由亮到暗的尾迹，停下后自然淡出
 *（消散快慢由 life 决定）。
 *
 * 为什么单独成文件：这是一段与业务无关的视觉彩蛋，逻辑与绘制全部收在这里，
 * 不往 global.css / starfield.css 里堆代码。
 * 启用 = 在 main.ts 里调用 initCursorTrail()；删除那一行调用即可彻底关闭。
 *
 * 实现要点：
 *   · 一个 fixed 全屏 <canvas>（pointer-events: none），不产生额外的 DOM 节点；
 *   · 有采样点、或尾迹尚未散尽时才跑 requestAnimationFrame，散尽即停，不空转；
 *   · 轨迹 = 最近 N 个采样点，移动越快采样越疏、尾巴自然拉长，这就是"流星"的由来；
 *   · 两遍描边模拟光晕（比 shadowBlur 便宜得多），配合 'lighter' 混合模式发白光；
 *   · 遵循系统「减少动态效果」设置，开启时直接不启用。
 *
 * 常用调整（改下面 TRAIL 里的值即可）：
 *   · color       —— 尾迹颜色，默认白色
 *   · maxPoints   —— 尾巴长度（采样点个数），越大拖尾越长
 *   · minDistance —— 采样最小间距，调大则尾巴更短、颗粒感更强
 *   · headWidth   —— 焰头（鼠标处）粗细
 *   · life        —— 单个采样点的存活时间（ms），决定消散快慢
 *
 * 注意：白色在浅色主题下几乎看不见（本站默认暗色主题，效果最佳）。
 *       若想在浅色主题下也可见，把 color 改成深色，例如 '30, 30, 30'。
 */

/** 特效参数 */
const TRAIL = {
  /** 尾迹颜色，格式为 "R, G, B"（白色） */
  color: '255, 255, 255',
  /** 保留的采样点数量：尾巴长度 */
  maxPoints: 40,
  /** 单个采样点的存活时间（ms）：越小消散越快 */
  life: 600,
  /** 焰头（鼠标处）线宽 */
  headWidth: 4,
  /** 焰尾末端线宽 */
  tailWidth: 0.5,
  /** 采样最小间距（px）：原地抖动时不堆积大量重复点 */
  minDistance: 1.5,
  /** 画布层级：低于弹窗（z-9999），高于页面内容 */
  zIndex: 9998,
} as const

type TrailPoint = { x: number; y: number; t: number }

let started = false

/**
 * 初始化鼠标拖动尾迹特效。重复调用只会生效一次。
 */
export function initCursorTrail(): void {
  if (started) return
  started = true

  // 系统开启了「减少动态效果」就不启用，避免给这类用户造成不适
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  if (document.body) {
    start()
  } else {
    document.addEventListener('DOMContentLoaded', start, { once: true })
  }
}

function start(): void {
  if (!document.body) return

  /* ---------- 画布 ---------- */
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: String(TRAIL.zIndex),
  })
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return
  }

  let viewW = 0
  let viewH = 0

  const resize = () => {
    // 限制到 2 倍，避免 3x 屏上画布过大导致拖尾掉帧
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    viewW = window.innerWidth
    viewH = window.innerHeight
    canvas.width = Math.floor(viewW * dpr)
    canvas.height = Math.floor(viewH * dpr)
    canvas.style.width = viewW + 'px'
    canvas.style.height = viewH + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()

  /* ---------- 状态 ---------- */
  const points: TrailPoint[] = []
  let rafId = 0

  const pushPoint = (x: number, y: number) => {
    const last = points[points.length - 1]
    if (last) {
      const dx = x - last.x
      const dy = y - last.y
      if (dx * dx + dy * dy < TRAIL.minDistance * TRAIL.minDistance) return
    }
    points.push({ x, y, t: performance.now() })
    if (points.length > TRAIL.maxPoints) points.shift()
    // 只有真的产生了新采样点才需要唤醒循环；
    // 这里引用的是下方定义的 ensureLoop，调用发生在事件回调里，声明早已完成。
    ensureLoop()
  }

  /* ---------- 绘制 ---------- */
  const render = (now: number) => {
    // 丢弃超时的采样点
    while (points.length) {
      const oldest = points[0]
      if (!oldest || now - oldest.t <= TRAIL.life) break
      points.shift()
    }

    ctx.clearRect(0, 0, viewW, viewH)

    const n = points.length
    if (n === 0) return

    ctx.globalCompositeOperation = 'lighter'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const headFade = (p: TrailPoint) =>
      Math.max(0, 1 - (now - p.t) / TRAIL.life) ** 0.6

    // 两遍描边：第一遍宽而淡 = 光晕，第二遍窄而亮 = 焰芯
    for (let pass = 0; pass < 2; pass++) {
      const isGlow = pass === 0
      for (let i = 1; i < n; i++) {
        const p0 = points[i - 1]
        const p1 = points[i]
        if (!p0 || !p1) continue
        const k = i / (n - 1) // 0 = 焰尾，1 = 焰头
        const alpha = Math.pow(k, 1.4) * headFade(p1) * (isGlow ? 0.16 : 0.95)
        if (alpha <= 0.002) continue
        const width =
          TRAIL.tailWidth + (TRAIL.headWidth - TRAIL.tailWidth) * Math.pow(k, 0.85)

        ctx.strokeStyle = `rgba(${TRAIL.color}, ${alpha})`
        ctx.lineWidth = isGlow ? width * 3.2 : width
        ctx.beginPath()
        ctx.moveTo(p0.x, p0.y)
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()
      }
    }

    // 焰头亮点：只有一个采样点时也能看到反馈
    const head = points[n - 1]
    if (head) {
      ctx.beginPath()
      ctx.arc(head.x, head.y, TRAIL.headWidth * 0.85, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${TRAIL.color}, ${0.55 * headFade(head)})`
      ctx.fill()
    }
  }

  const loop = () => {
    const now = performance.now()
    render(now)

    // 尾迹已全部过期就停止循环，避免鼠标静止时空转；
    // 再次移动时由 pushPoint() → ensureLoop() 重新唤醒。
    if (points.length === 0) {
      rafId = 0
      return
    }
    rafId = requestAnimationFrame(loop)
  }

  const ensureLoop = () => {
    if (!rafId) rafId = requestAnimationFrame(loop)
  }

  /* ---------- 事件 ---------- */
  // 全部挂在 window 的捕获阶段，避免被页面里 stopPropagation 的交互吃掉

  const onMove = (e: MouseEvent) => {
    pushPoint(e.clientX, e.clientY)
    ensureLoop()
  }

  // 鼠标移出文档（移到地址栏、别的窗口或显示器）时清空轨迹：
  // 否则几百毫秒内快速移出再移入时，旧采样点还在，会从旧位置
  // 直接拉出一条横跨屏幕的直线。
  const onLeave = () => {
    points.length = 0
  }

  window.addEventListener('mousemove', onMove, { capture: true, passive: true })
  document.addEventListener('mouseleave', onLeave, { passive: true })
  window.addEventListener('resize', resize, { passive: true })
}
