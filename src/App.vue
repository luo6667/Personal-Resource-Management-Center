<template>
  <div id="app" :class="{ 'light-mode': !isDark }">
    <div class="app-container">
      <!-- 全局背景层 -->
      <!-- 夜间模式视频背景 -->
      <video 
        class="global-bg-video dark" 
        v-show="isDark"
        autoplay 
        loop 
        muted 
        playsinline
      >
        <source src="/image/星云.mp4" type="video/mp4">
      </video>
      <!-- 浅色模式视频背景 -->
      <video 
        class="global-bg-video light" 
        v-show="!isDark"
        autoplay 
        loop 
        muted 
        playsinline
      >
        <source src="/image/蓝天白云.mp4" type="video/mp4">
      </video>
      <div class="global-bg" :class="{ 'light': !isDark }"></div>
      <div class="global-bg-overlay" :class="{ 'light': !isDark }"></div>
      
      <AppNavbar :isDark="isDark" @toggle-theme="toggleTheme" />
      <main class="main-content">
        <router-view v-slot="{ Component, route }">
          <transition name="slide-fade" mode="out-in">
            <keep-alive :include="cachedViews">
              <component 
                :is="Component" 
                :isDark="isDark"
                :key="route.fullPath"
              />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import AppNavbar from './components/AppNavbar.vue'
import HomeView from './views/HomeView.vue'
import TodosView from './views/TodosView.vue'
import JourneyView from './views/JourneyView.vue'
import ResourcesView from './views/ResourcesView.vue'
import ProjectsView from './views/ProjectsView.vue'
import AIView from './views/AIView.vue'

export default {
  name: 'App',
  components: {
    AppNavbar,
    HomeView,
    TodosView,
    JourneyView,
    ResourcesView,
    ProjectsView,
    AIView
  },
  data() {
    return {
      isDark: true,
      cachedViews: ['HomeView', 'TodosView', 'JourneyView', 'ResourcesView', 'ProjectsView', 'AIView']
    }
  },
  created() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme !== null) {
      this.isDark = savedTheme === 'dark'
    }
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    }
  }
}
</script>

<style>
@import './assets/styles/common.css';

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

.app-container {
  position: relative;
  min-height: 100vh;
}

.global-bg-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -3;
}

.global-bg-video.light {
  filter: brightness(1.1);
}

.global-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 15, 35, 0.6);
  z-index: -2;
  transition: background 0.5s ease;
}

.global-bg.light {
  background: linear-gradient(-45deg, rgba(255, 255, 255, 0.3) 0%, rgba(240, 244, 248, 0.5) 50%, rgba(226, 232, 240, 0.3) 100%);
}

.global-bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(102, 126, 234, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(118, 75, 162, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(240, 147, 251, 0.05) 0%, transparent 70%);
  z-index: -1;
  animation: subtle-pulse 8s ease-in-out infinite;
  transition: background 0.5s ease;
}

.global-bg-overlay.light {
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(118, 75, 162, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(240, 147, 251, 0.03) 0%, transparent 70%);
}

@keyframes subtle-pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.main-content {
  min-height: calc(100vh - 72px);
  position: relative;
  z-index: 1;
}

/* 页面切换动画 */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>