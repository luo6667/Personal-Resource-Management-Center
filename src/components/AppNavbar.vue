<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand" @click="goHome">
        <div class="brand-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
            <path d="M10 16L14 20L22 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                <stop stop-color="#667eea"/>
                <stop offset="1" stop-color="#764ba2"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">个人工作台</span>
          <span class="brand-subtitle">Personal Dashboard</span>
        </div>
      </div>

      <div class="navbar-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          active-class="active"
        >
          <template v-if="item.path === '/'">
            <img 
              :src="isDark ? '/image/首页白.png' : '/image/首页黑.png'" 
              :alt="item.name"
              class="nav-icon-img"
            />
          </template>
          <template v-else-if="item.path === '/todos'">
            <img 
              :src="isDark ? '/image/待办白.png' : '/image/待办黑.png'" 
              :alt="item.name"
              class="nav-icon-img"
            />
          </template>
          <template v-else-if="item.path === '/journey'">
            <img 
              :src="isDark ? '/image/折线图白.png' : '/image/折线图黑.png'" 
              :alt="item.name"
              class="nav-icon-img"
            />
          </template>
          <template v-else-if="item.path === '/resources'">
            <img 
              :src="isDark ? '/image/书-堆叠白.png' : '/image/书-堆叠黑.png'" 
              :alt="item.name"
              class="nav-icon-img"
            />
          </template>
          <template v-else-if="item.path === '/projects'">
            <img 
              :src="isDark ? '/image/项目集白.png' : '/image/项目集黑.png'" 
              :alt="item.name"
              class="nav-icon-img"
            />
          </template>
          <template v-else-if="item.path === '/ai'">
            <img 
              :src="isDark ? '/image/智能机器人白.png' : '/image/智能机器人黑.png'" 
              :alt="item.name"
              class="nav-icon-img"
            />
          </template>
          <span v-else class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.name }}</span>
        </router-link>
      </div>

      <div class="navbar-actions">
        <button class="theme-toggle" @click="toggleTheme">
          <img :src="isDark ? '/image/凌晨.png' : '/image/上午.png'" class="theme-icon" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar',
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      menuItems: [
        { name: '首页', path: '/', icon: '🏠' },
        { name: '待办事项', path: '/todos', icon: '✅' },
        { name: '个人历程', path: '/journey', icon: '📈' },
        { name: '学习资源', path: '/resources', icon: '📚' },
        { name: '项目集', path: '/projects', icon: '🚀' },
        { name: '智能助手', path: '/ai', icon: '🤖' }
      ]
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    toggleTheme() {
      this.$emit('toggle-theme')
    }
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.light-mode .navbar {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-bottom-color: #e2e8f0;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.brand-icon {
  display: flex;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.light-mode .brand-name {
  color: #1e293b;
}

.brand-subtitle {
  font-size: 11px;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.navbar-menu {
  display: flex;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  color: #888;
  border-radius: 10px;
  transition: all 0.3s;
  font-size: 14px;
}

.nav-item:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #e0e0e0;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  color: #667eea;
}

.light-mode .nav-item {
  color: #64748b;
}

.light-mode .nav-item:hover {
  background: rgba(102, 126, 234, 0.08);
  color: #334155;
}

.light-mode .nav-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.nav-icon {
  font-size: 16px;
}

.nav-icon-img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  background: rgba(102, 126, 234, 0.1);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.theme-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.theme-toggle:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.05);
}

.light-mode .theme-toggle {
  background: rgba(102, 126, 234, 0.08);
  border-color: rgba(102, 126, 234, 0.15);
}

.light-mode .theme-toggle:hover {
  background: rgba(102, 126, 234, 0.15);
}

@media (max-width: 1024px) {
  .nav-label {
    display: none;
  }

  .nav-item {
    padding: 10px 14px;
  }
}

@media (max-width: 768px) {
  .navbar-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%);
    padding: 10px 20px;
    justify-content: space-around;
    border-top: 1px solid rgba(102, 126, 234, 0.1);
  }

  .light-mode .navbar-menu {
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    border-top-color: #e2e8f0;
  }

  .navbar-container {
    height: 64px;
  }
}
</style>