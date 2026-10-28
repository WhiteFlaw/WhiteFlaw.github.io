<template>
  <header :class="['sticky-header', scrolled ? 'py-2 shadow-lg' : 'py-4']">
    <div class="max-w-7xl mx-auto flex justify-between items-center gap-3">
      <!-- 左：返回 + logo + 标题 -->
      <div class="flex items-center gap-3 min-w-0">
        <button
          v-if="showBack"
          @click="goBack"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          :title="t('back') || '返回'"
          aria-label="返回"
        >
          <svg class="w-5 h-5 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <router-link to="/" class="badge flex-shrink-0" :title="t('siteTitle')">
          <span class="text-white font-bold text-lg">{{ SITE_CONFIG.icon }}</span>
        </router-link>

        <h1 class="text-xl font-serif font-bold text-cyber-600 truncate">
          {{ displayTitle }}
        </h1>
      </div>

      <!-- 右：搜索 + 功能按钮 -->
      <div class="flex items-center space-x-3 flex-shrink-0">
        <!-- 桌面搜索框（点开弹窗，不真输入） -->
        <div class="relative hidden md:block">
          <input
            type="text"
            :placeholder="t('searchPlaceholder')"
            class="w-48 lg:w-64 xl:w-80 py-2 px-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyber-500 text-sm transition-shadow duration-200 cursor-pointer"
            @click="openSearch"
            readonly
          >
          <IconCarbonSearch class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        <!-- 移动端搜索 -->
        <button @click="openSearch" class="md:hidden glass-nav-btn" :title="t('search')">
          <IconCarbonSearch class="w-5 h-5 dark:text-gray-300" />
        </button>

        <button @click="toDev" class="hidden sm:flex glass-nav-btn" title="GitHub">
          <IconCarbonLogoGithub class="w-5 h-5 dark:text-gray-300" />
        </button>

        <button
          @click="toggleLanguage"
          class="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <IconCarbonLanguage class="w-4 h-4" />
          <span class="hidden xl:inline">{{ currentLang === 'zh' ? 'EN' : '中文' }}</span>
        </button>

        <ThemeToggle />

        <router-link to="/archive" class="hidden sm:flex glass-nav-btn" :title="t('archive')">
          <IconCarbonArchive class="w-5 h-5 dark:text-gray-300" />
        </router-link>

        <router-link to="/favorites" class="hidden sm:flex glass-nav-btn" :title="t('favorites')">
          <IconCarbonStar class="w-5 h-5 dark:text-gray-300" />
        </router-link>

        <button
          v-if="isLoggedIn"
          @click="logout"
          class="hidden sm:flex items-center p-2 rounded-lg border border-red-300 dark:border-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
          :title="t('logout')"
        >
          <IconCarbonLogout class="w-5 h-5 text-red-500 dark:text-red-400" />
        </button>

        <!-- 移动端菜单：内容由各页面自己决定，这里只发事件 -->
        <button
          v-if="showMenu"
          @click="emit('menu-click')"
          class="lg:hidden dark:text-gray-300 glass-nav-btn"
          aria-label="菜单"
        >
          <IconCarbonMenu class="w-6 h-6" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { t, getLanguage, setLanguage } from '@/utils/i18n'
import { SITE_CONFIG } from '@/constants'
import { toDev } from '@/utils/tool'
import { passwordApi } from '@/utils/password'

const props = withDefaults(defineProps<{
  /** 栏中间的标题；不传就用站点名 */
  title?: string
  /** 是否显示返回按钮（首页不需要） */
  showBack?: boolean
  /** 是否显示移动端菜单按钮（页面自己处理抽屉） */
  showMenu?: boolean
}>(), {
  title: '',
  showBack: true,
  showMenu: false,
})

const emit = defineEmits<{ 'menu-click': [] }>()

const router = useRouter()
const scrolled = ref(false)
const currentLang = ref(getLanguage())
const isLoggedIn = ref(false)

const displayTitle = computed(() => props.title || t('siteTitle'))

const goBack = () => {
  // history.state.back 为空 = 直接打开或刷新进来的，没有可回退的历史
  if (window.history.state?.back) router.back()
  else router.push('/')
}

const openSearch = () => {
  window.dispatchEvent(new CustomEvent('open-search-modal'))
}

const toggleLanguage = () => {
  const next = currentLang.value === 'zh' ? 'en' : 'zh'
  setLanguage(next)
  currentLang.value = next
}

const checkLogin = () => {
  try {
    const pwd = localStorage.getItem('blog-access-pwd') || ''
    isLoggedIn.value = !!pwd && passwordApi.verifyPassword(pwd).success
  } catch {
    isLoggedIn.value = false
  }
}

const logout = () => {
  passwordApi.logout()
  isLoggedIn.value = false
}

const onScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  onScroll()
  checkLogin()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
