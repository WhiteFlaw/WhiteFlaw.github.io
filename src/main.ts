import { createApp } from 'vue'
import Lenis from 'lenis'
import { MotionPlugin } from '@vueuse/motion'
import '@unocss/reset/tailwind-compat.css'
import 'uno.css'
import 'lenis/dist/lenis.css'
import '@/styles/global.css'
import '@/styles/starfield.css'
import App from "./App.vue";
import { getLanguage, setLanguage } from '@/utils/i18n'
import { setupSEO } from '@/plugins/seo'
import { SITE_CONFIG } from '@/constants'
import { getEnvVariable } from '@/utils/tool'
// 引入 SVG 图标
import 'virtual:svg-icons-register'
import {passwordApi} from "@/utils/password";

// 开发环境下 Vite 的 HMR 会以动态 import 重新执行本模块（而不是整页刷新），
// 导致 Lenis、主题监听、createApp().mount() 等被重复初始化。
// 所以这里让 main.ts 接受更新后直接整页刷新，保证运行状态始终干净。
if (import.meta.hot) {
  import.meta.hot.accept(() => window.location.reload())
}

// 初始化平滑滚动
export const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    syncTouch: false,
    // 排除 router-link 元素，避免阻止路由跳转
    autoRaf: true,
    gestureOrientation: 'vertical',
    // normalizeWheel: true, // Removed: not in LenisOptions type
    lerp: 0.1
})

function raf(t: number) {
    lenis.raf(t)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// 更好的主题管理
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    let theme = 'dark'
    if (savedTheme) {
        theme = savedTheme
    } else if (systemPrefersDark) {
        theme = 'dark'
    }

    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme) // 确保主题设置被存储

    // 触发自定义事件，通知其他组件主题已更改
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }))

    // 更新所有 markdown-body 元素的 data-theme 属性
    document.querySelectorAll('.markdown-body').forEach(el => {
        el.setAttribute('data-theme', theme);
    });
}

// 监听系统主题变化
const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    const isDark = e.matches
    const theme = isDark ? 'dark' : 'light'

    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)

    // 触发自定义事件，通知其他组件主题已更改
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }))

    // 更新所有 markdown-body 元素的 data-theme 属性
    document.querySelectorAll('.markdown-body').forEach(el => {
        el.setAttribute('data-theme', theme);
    });
}

// 初始化语言
function initializeLanguage() {
    const lang = getLanguage()
    setLanguage(lang)
}

// 初始化SEO
function initializeSEO() {
    setupSEO()
    // 设置初始页面标题
    document.title = SITE_CONFIG.title
}

initializeTheme()
initializeLanguage()
initializeSEO()

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange)

// 检查是否需要密码保护
function isPasswordProtected(): boolean {
    return !!getEnvVariable('VITE_BLOG_PASSWORD_HASH')
}

// 检查用户是否已通过身份验证
function isAuthenticated(): boolean {
    const pwd = localStorage.getItem('blog-access-pwd')||'';
    const result = passwordApi.verifyPassword(pwd)
    if(result.success){
        return true
    }
    return false
}

async function mountApp() {
    const { createRouter, createWebHistory } = await import('vue-router')
    const pages = (await import('virtual:generated-pages')).default
    const { articleRoutes } = await import('virtual:article-routes')
    // const editorRoute = {
    //     path: '/file-manager',
    //     component: () => import('@/pages/fileManager.vue')
    // }
    const routes = [
        ...pages,
        ...articleRoutes,
        // editorRoute,
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]

    // 如果启用了密码保护，添加密码保护页面
    if (isPasswordProtected()) {
        const passwordRoute = {
            path: '/password',
            component: () => import('@/components/PasswordProtection.vue')
        }
        routes.push(passwordRoute)
    }

    // 获取 Vite 配置的基础路径
    const base = import.meta.env.BASE_URL || '/';

    const router = createRouter({
        history: createWebHistory(base),
        routes
    })

    // 添加路由守卫以处理SEO和密码保护
    router.beforeEach((to, _from, next) => {
        // 动态设置页面标题和SEO
        if (to.meta.title) {
            document.title = `${to.meta.title} - ${SITE_CONFIG.title}`
            // 更新SEO标签
            setupSEO({
                title: `${to.meta.title} - ${SITE_CONFIG.title}`,
                description: typeof to.meta.description === 'string' ? to.meta.description : SITE_CONFIG.description,
                path: to.path
            })
        } else {
            document.title = SITE_CONFIG.title
            // 设置默认SEO标签
            setupSEO()
        }

        // 检查是否需要密码保护
        if (isPasswordProtected() && !isAuthenticated() && to.path !== '/password') {
            // 保存用户尝试访问的路径
            sessionStorage.setItem('redirect-after-login', to.fullPath)
            // 重定向到密码保护页面
            next('/password')
        } else {
            next()
        }
    })

    // GitHub Pages SPA 路由支持
    // 检查是否有保存的重定向 URL
    const redirectUrl = sessionStorage.getItem('redirectUrl');
    if (redirectUrl) {
        sessionStorage.removeItem('redirectUrl');
        // 如果有保存的 URL，则导航到该路径
        router.push(redirectUrl).catch(err => {
            console.warn('路由重定向失败:', err);
        });
    }

    createApp(App).use(router).use(MotionPlugin).mount('#app')
}

mountApp()
// 将 passwordApi 暴露到全局，供各页面调用登出等功能
// 注意：必须允许重新配置（configurable: true）。
// Vite 的 HMR 会以动态 import 的方式重新执行本模块，属性若不可配置，
// 第二次 defineProperty 就会抛出 "Cannot redefine property: pjfun"。
// 对外依然只读：writable: false 已保证无法被赋值改写。
Object.defineProperty(window, 'pjfun', {
  value: Object.freeze({
    ...((window as any).pjfun || {}),
    loaded: true,
    passwordApi: passwordApi
  }),
  writable: false,
  configurable: true
});
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', { message, source, lineno, colno, error });
};

// 禁止浏览器默认的拖拽行为：拖拽选中的文字、把图片/链接拖到桌面或书签栏。
// global.css 里的 -webkit-user-drag 只对 Blink/WebKit 生效，这里统一兜底（含 Firefox）。
// 输入框与可编辑区域内的拖拽保留，避免影响正常的文字编辑。
document.addEventListener(
  'dragstart',
  (event) => {
    const target = event.target as HTMLElement | null
    if (target?.closest('input, textarea, [contenteditable="true"]')) return
    event.preventDefault()
  },
  { capture: true }
)