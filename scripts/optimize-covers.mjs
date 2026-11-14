// 一次性脚本：压缩 public/img 下的封面图
// 用法：node scripts/optimize-covers.mjs
//
// 背景：卡片上封面只显示约 400×250px，但原图高达 2.1 MB，
//       public/ 下的图片不经构建处理，原样发布 → 首屏加载慢。
// 策略：等比缩到宽 1200px（覆盖 2x 屏），webp 质量 78，原图备份到 .cache/covers-backup

import sharp from 'sharp'
import { readdir, mkdir, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const IMG_DIR = 'public/img'
const BACKUP_DIR = path.join('.cache', 'covers-backup')  // 放在 public 外，避免被打进产物
const MAX_WIDTH = 1200
const QUALITY = 78

const isCover = (name) => /^d\d+\.(webp|jpg|jpeg|png)$/i.test(name)

async function main() {
  if (!existsSync(BACKUP_DIR)) await mkdir(BACKUP_DIR, { recursive: true })

  const entries = await readdir(IMG_DIR, { withFileTypes: true })
  const covers = entries.filter((e) => e.isFile() && isCover(e.name))

  if (covers.length === 0) {
    console.log('没有找到封面图')
    return
  }

  let beforeTotal = 0
  let afterTotal = 0

  for (const file of covers) {
    const src = path.join(IMG_DIR, file.name)
    const backup = path.join(BACKUP_DIR, file.name)

    // 备份一次即可，避免二次压缩导致画质累积损失
    if (!existsSync(backup)) await copyFile(src, backup)

    const inputStat = await sharp(backup).metadata()
    const beforeSize = (await import('node:fs/promises')).stat
      ? (await (await import('node:fs/promises')).stat(backup)).size
      : 0

    // 从备份读取，保证多次运行结果一致
    const buf = await sharp(backup)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer()

    const { writeFile } = await import('node:fs/promises')
    await writeFile(src, buf)

    beforeTotal += beforeSize
    afterTotal += buf.length

    const pct = beforeSize ? Math.round((1 - buf.length / beforeSize) * 100) : 0
    console.log(
      `  ${file.name.padEnd(12)} ${String(inputStat.width).padStart(5)}×${String(inputStat.height).padEnd(5)} ` +
        `${(beforeSize / 1024).toFixed(0).padStart(6)} KB → ${(buf.length / 1024).toFixed(0).padStart(5)} KB  (-${pct}%)`
    )
  }

  console.log(
    `\n合计：${(beforeTotal / 1024 / 1024).toFixed(2)} MB → ${(afterTotal / 1024 / 1024).toFixed(2)} MB ` +
      `(-${Math.round((1 - afterTotal / beforeTotal) * 100)}%)`
  )
  console.log(`原图备份在：${BACKUP_DIR}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
