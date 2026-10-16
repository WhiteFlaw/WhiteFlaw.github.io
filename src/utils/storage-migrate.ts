/**
 * localStorage 键名迁移（一次性）
 * ---------------------------------------------------------------------------
 * 项目早期是 pjfun-blog，本地存储的键都带 pjfun_ / pj_ 前缀；现在统一成
 * whiteflaw_ 前缀。直接改名会让老访客已有的收藏、阅读进度、搜索缓存全部
 * "消失"（其实是躺在旧键里没人读），所以这里做一次搬迁：
 *   旧键有数据、新键没有  → 复制到新键，再删掉旧键
 *   新键已有数据          → 直接删掉旧键，绝不覆盖新数据
 *
 * 在 main.ts 里尽早调用（必须早于任何模块读取 localStorage）。
 * 等旧键在访客浏览器里基本绝迹后，本文件连同调用一起删掉即可。
 */

/** [旧键, 新键] */
const LEGACY_KEYS: ReadonlyArray<readonly [string, string]> = [
  ['pjfun_blog_favorites', 'whiteflaw_blog_favorites'],
  ['pjfun_blog_reading_progress', 'whiteflaw_blog_reading_progress'],
  ['pjfun_blog_recent_articles', 'whiteflaw_blog_recent_articles'],
  ['pjfun_blog_search_cache', 'whiteflaw_blog_search_cache'],
  ['pjfun_blog_nav_data_cache', 'whiteflaw_blog_nav_data_cache'],
  ['pj_blog_web_version', 'whiteflaw_blog_web_version'],
]

export function migrateLegacyStorage(): void {
  try {
    for (const [oldKey, newKey] of LEGACY_KEYS) {
      const legacy = localStorage.getItem(oldKey)
      if (legacy === null) continue
      if (localStorage.getItem(newKey) === null) {
        localStorage.setItem(newKey, legacy)
      }
      localStorage.removeItem(oldKey)
    }
  } catch (error) {
    // 无痕模式、存储被禁用等场景下拿不到 localStorage，跳过即可
    console.warn('localStorage 键名迁移已跳过:', error)
  }
}
