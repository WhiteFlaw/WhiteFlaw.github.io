import {defineConfig} from 'unocss'
import {presetWind3, presetIcons, transformerVariantGroup, transformerDirectives} from 'unocss'

export default defineConfig({
    presets: [
        presetWind3(),
        presetIcons({
            scale: 1.2,
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            }
        }),
    ],
    transformers: [transformerVariantGroup(), transformerDirectives()],
    shortcuts: {
        'flex-center': 'flex items-center justify-center',
        'absolute-center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
        'card': 'bg-white dark:bg-[#111113] rounded-xl shadow-sm',
        'btn': 'px-6 py-3 rounded-lg bg-cyber-600 text-white hover:bg-cyber-700 transition-colors',
        'btn-secondary': 'px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors',
        // 常用工具类
        'line-clamp-2': 'overflow-hidden overflow-ellipsis',
        'scrollbar-hide': 'overflow-auto',
        'toc-scrollbar': 'overflow-y-auto',
        // 页面级复用组件
        'sticky-header': 'sticky top-0 z-50 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black backdrop-blur-sm transition-colors duration-300',
        'scroll-top-btn': 'fixed bottom-20 lg:bottom-8 right-8 p-3 flex-center bg-gray-900 dark:bg-gray-700 text-white rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95 z-50 cursor-pointer',
        // 图标按钮
        'icon-btn': 'w-10 h-10 flex-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer',
        'icon-btn-sm': 'w-9 h-9 flex-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer',
        // PDF 工具栏按钮
        'pdf-toolbar-btn': 'flex-center w-9 h-9 border-none bg-transparent text-gray-700 dark:text-gray-300 rounded cursor-pointer transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed',
        // 图标徽章（赛博朋克品红渐变）
        'badge': 'w-9 h-9 rounded-xl bg-gradient-to-br from-cyber-600 to-cyber-800 flex-center',
        // 玻璃态导航栏按钮
        'glass-nav-btn': 'flex items-center p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer',
        // 主题切换按钮
        'theme-toggle-btn': 'p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer',
        // 卡片链接包装器
        'card-link': 'cursor-pointer block',
        // 暗色主题三色：只留中性灰阶，强调色交给 primary（紫）
        'theme-title': 'dark:text-[#f3f4f6]',
        'theme-text': 'dark:text-[#d1d5db]',
        'theme-panel': 'dark:bg-[#111113]',
    },
    rules: [
        // .line-clamp-2 的多行截断
        [/^line-clamp-(\d+)$/, ([, line]) => ({
            'overflow': 'hidden',
            'display': '-webkit-box',
            '-webkit-line-clamp': line,
            '-webkit-box-orient': 'vertical',
        })],
        // .scrollbar-hide
        ['scrollbar-hide', {
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
        }],
        ['scrollbar-hide::-webkit-scrollbar', {
            'display': 'none',
        }],
        // 美化滚动条
        ['toc-scrollbar', {
            'overflow-y': 'auto',
        }],
        ['toc-scrollbar::-webkit-scrollbar', {
            'width': '4px',
        }],
        ['toc-scrollbar::-webkit-scrollbar-track', {
            'background': 'transparent',
        }],
        ['toc-scrollbar::-webkit-scrollbar-thumb', {
            'background': '#d1d5db',
            'border-radius': '4px',
        }],
        ['.dark .toc-scrollbar::-webkit-scrollbar-thumb', {
            'background': '#4b5563',
        }],
        // ease-out-back 弹性曲线
        ['ease-out-back', {
            'transition-timing-function': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }],
    ],
    theme: {
        fontFamily: {
            // 中文衬线：只给标题用，正文保持无衬线（长文可读性优先）。
            // 全部走系统字体栈，零网络加载：
            //   macOS/iOS → Songti SC；装了思源宋体的机器优先用更漂亮的版本；
            //   Windows → SimSun（宋体，大字号下可读）。
            serif: ['"Songti SC"', '"STSong"', '"Source Han Serif SC"', '"Noto Serif SC"', 'SimSun', 'serif'],
        },
        colors: {
            // 赛博朋克主题色：暗夜紫为主（低饱和、低亮度，避免"白天感"）
            primary: '#7c3aed',
            // cyber 色阶 —— 全站高亮色统一用它（原先散落各处的 blue-* 已整体替换）
            cyber: {
                50: '#f5f3ff',
                100: '#ede9fe',
                200: '#ddd6fe',
                300: '#c4b5fd',
                400: '#a78bfa',
                500: '#7c3aed',
                600: '#6d28d9',
                700: '#5b21b6',
                800: '#4c1d95',
                900: '#3b1578',
                950: '#2e1065',
            },
        },
        animation: {
            keyframes: {
                'fade-in': '{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}',
                'slide-up': '{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}',
                'scale-in': '{0%{opacity:0;transform:scale(0.9)}100%{opacity:1;transform:scale(1)}}',
            },
            durations: {
                'fade-in': '0.3s',
                'slide-up': '0.4s',
                'scale-in': '0.3s',
            },
            timingFns: {
                'fade-in': 'ease-out',
                'slide-up': 'ease-out',
            },
        }
    },
})
