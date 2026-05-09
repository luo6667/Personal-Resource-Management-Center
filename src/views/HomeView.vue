<template>
  <div class="home">
    <!-- 粒子背景 -->
    <div class="particles-container" ref="particlesContainer"></div>
    <!-- 鼠标跟随光晕 -->
    <div class="cursor-glow" ref="cursorGlow"></div>
    <div class="cursor-glow-inner" ref="cursorGlowInner"></div>
    
    <div class="hero-section">
      <div class="hero-bg animated-gradient"></div>
      <div class="hero-content">
        <div class="greeting">
          <img :src="getTimeIcon()" class="time-icon-img" />
          <h1 class="greeting-text">{{ getGreeting() }}</h1>
        </div>
        <p class="hero-subtitle">欢迎回到你的个人工作台，这里记录着你的一切</p>

        <div class="quick-stats">
          <div class="stat-card" @click="$router.push('/todos')">
            <img :src="isDark ? '/image/待办白.png' : '/image/待办黑.png'" class="stat-icon-img" />
            <div class="stat-info">
              <span class="stat-value">{{ pendingTasks }}</span>
              <span class="stat-label">待办事项</span>
            </div>
          </div>
          <div class="stat-card" @click="$router.push('/journey')">
            <img :src="isDark ? '/image/折线图白.png' : '/image/折线图黑.png'" class="stat-icon-img" />
            <div class="stat-info">
              <span class="stat-value">{{ journeyCount }}</span>
              <span class="stat-label">历程节点</span>
            </div>
          </div>
          <div class="stat-card" @click="$router.push('/resources')">
            <img :src="isDark ? '/image/书-堆叠白.png' : '/image/书-堆叠黑.png'" class="stat-icon-img" />
            <div class="stat-info">
              <span class="stat-value">{{ resourceCount }}</span>
              <span class="stat-label">学习资源</span>
            </div>
          </div>
          <div class="stat-card" @click="$router.push('/projects')">
            <img :src="isDark ? '/image/项目集白.png' : '/image/项目集黑.png'" class="stat-icon-img" />
            <div class="stat-info">
              <span class="stat-value">{{ projectCount }}</span>
              <span class="stat-label">完成项目</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-section">
        <div class="section-header">
          <h2><img src="/image/飞镖.png" class="title-icon"> 今日目标</h2>
          <router-link to="/todos" class="view-more">查看全部 →</router-link>
        </div>
        <div class="today-tasks">
          <div v-for="task in todayTasks" :key="task.id" class="task-item">
            <div class="task-checkbox" :class="{ completed: task.completed }" @click="toggleTask(task)">
              <span v-if="task.completed">✓</span>
            </div>
            <span class="task-title" :class="{ completed: task.completed }">{{ task.title }}</span>
            <span class="task-priority" :class="'priority-' + task.priority">{{ getPriorityLabel(task.priority) }}</span>
          </div>
          <div v-if="todayTasks.length === 0" class="empty-state">
            <span>🎉 太棒了！今日任务已全部完成</span>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-header">
          <h2><img :src="isDark ? '/image/快捷操作夜间.png' : '/image/快捷操作浅色.png'" class="title-icon"> 快捷操作</h2>
        </div>
        <div class="quick-actions">
          <router-link to="/todos" class="action-card">
            <img src="/image/添加.png" class="action-icon-img" />
            <span class="action-text">添加任务</span>
          </router-link>
          <router-link to="/ai" class="action-card">
            <img :src="isDark ? '/image/智能机器人白.png' : '/image/智能机器人黑.png'" class="action-icon-img" />
            <span class="action-text">AI 助手</span>
          </router-link>
          <router-link to="/resources" class="action-card">
            <img src="/image/首页添加资源.png" class="action-icon-img" />
            <span class="action-text">添加资源</span>
          </router-link>
          <router-link to="/projects" class="action-card">
            <img :src="isDark ? '/image/文件夹白.png' : '/image/文件夹黑.png'" class="action-icon-img" />
            <span class="action-text">新项目</span>
          </router-link>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-header">
          <h2><img src="/image/红心.png" class="title-icon"> 我的收藏</h2>
          <router-link to="/resources" class="view-more">查看全部 →</router-link>
        </div>
        <div class="favorites-list">
          <a
            v-for="resource in favoriteResources"
            :key="resource.id"
            :href="resource.url"
            target="_blank"
            class="favorite-item"
          >
            <div class="favorite-logo" :style="{ background: resource.color }">
              {{ resource.logo }}
            </div>
            <div class="favorite-info">
              <span class="favorite-name">{{ resource.name }}</span>
              <span class="favorite-category">{{ resource.category }}</span>
            </div>
          </a>
          <div v-if="favoriteResources.length === 0" class="empty-state">
            <span>还没有收藏的资源</span>
          </div>
        </div>
      </div>

      <div class="dashboard-section recent-projects">
        <div class="section-header">
          <h2><img :src="isDark ? '/image/项目集白.png' : '/image/项目集黑.png'" class="title-icon"> 最近项目</h2>
          <router-link to="/projects" class="view-more">查看全部 →</router-link>
        </div>
        <div class="project-list">
          <div v-for="project in recentProjects" :key="project.id" class="project-item">
            <div class="project-icon" :style="{ background: project.color }">{{ project.name[0] }}</div>
            <div class="project-info">
              <span class="project-name">{{ project.name }}</span>
              <span class="project-desc">{{ project.description }}</span>
            </div>
            <span class="project-status" :class="'status-' + project.status">
              {{ getStatusLabel(project.status) }}
            </span>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <div class="section-header">
          <h2><img src="/image/目标进度.png" class="title-icon"> 目标进度</h2>
          <button class="btn btn-primary btn-small" @click="showAddGoal = true">
            <span>+</span> 添加目标
          </button>
        </div>
        <div class="goals-list">
          <div v-for="goal in goals" :key="goal.id" class="goal-item">
            <div class="goal-header">
              <div class="goal-name">
                <input
                  v-if="editingGoalId === goal.id"
                  v-model="editingGoalName"
                  type="text"
                  class="input-field-small"
                  @blur="saveGoalName(goal)"
                  @keyup.enter="saveGoalName(goal)"
                />
                <span v-else @click="startEditGoal(goal)">{{ goal.name }}</span>
              </div>
              <div class="goal-percent">
                <input
                  v-if="editingGoalId === goal.id"
                  v-model.number="editingGoalProgress"
                  type="range"
                  min="0"
                  max="100"
                  class="progress-slider-inline"
                  @input="updateGoalProgress(goal)"
                />
                <span v-else @click="startEditGoal(goal)" class="percent-text">{{ goal.progress }}%</span>
              </div>
              <button class="icon-btn" @click="deleteGoal(goal.id)"><img :src="isDark ? '/image/删除白.png' : '/image/删除黑.png'" class="icon-img-xs" /></button>
            </div>
            <div class="goal-progress-bar" @click="startEditGoal(goal)">
              <div class="goal-progress-fill" :style="{ width: goal.progress + '%', background: goal.color }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加目标弹窗 -->
      <div v-if="showAddGoal" class="modal-overlay" @click.self="showAddGoal = false">
        <div class="modal-content card">
          <h3 class="modal-title">添加新目标</h3>
          <div class="form-group">
            <label>目标名称</label>
            <input v-model="newGoalName" type="text" class="input-field" placeholder="输入目标名称" />
          </div>
          <div class="form-group">
            <label>初始进度 (0-100)</label>
            <input v-model.number="newGoalProgress" type="number" min="0" max="100" class="input-field" />
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="showAddGoal = false">取消</button>
            <button class="btn btn-primary" @click="addGoal">添加</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useTaskStore } from '../stores/taskStore'

export default {
  name: 'HomeView',
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const taskStore = useTaskStore()
    const particlesContainer = ref(null)
    const cursorGlow = ref(null)
    const cursorGlowInner = ref(null)
    const particles = ref([])
    
    // 创建粒子
    const createParticles = () => {
      if (!particlesContainer.value) return
      
      const container = particlesContainer.value
      const particleCount = 80  // 粒子数量
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.top = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 8 + 's'
        particle.style.animationDuration = (4 + Math.random() * 4) + 's'
        // 随机大小变化更丰富
        const size = (4 + Math.random() * 10)
        particle.style.width = size + 'px'
        particle.style.height = size + 'px'
        // 随机颜色变化
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#38ef7d']
        const color = colors[Math.floor(Math.random() * colors.length)]
        particle.style.background = `radial-gradient(circle, ${color}99 0%, ${color}66 40%, transparent 70%)`
        particle.style.boxShadow = `0 0 12px ${color}cc, 0 0 24px ${color}88, 0 0 36px ${color}44`
        particles.value.push(particle)
        container.appendChild(particle)
      }
    }
    
    // 鼠标跟随
    const handleMouseMove = (e) => {
      if (cursorGlow.value && cursorGlowInner.value) {
        cursorGlow.value.style.left = e.clientX + 'px'
        cursorGlow.value.style.top = e.clientY + 'px'
        cursorGlowInner.value.style.left = e.clientX + 'px'
        cursorGlowInner.value.style.top = e.clientY + 'px'
      }
    }
    
    onMounted(() => {
      createParticles()
      window.addEventListener('mousemove', handleMouseMove)
    })
    
    onUnmounted(() => {
      window.removeEventListener('mousemove', handleMouseMove)
      particles.value.forEach(p => p.remove())
    })

    const pendingTasks = computed(() => taskStore.pendingTasks)
    const journeyCount = computed(() => taskStore.journeyCount)
    const resourceCount = computed(() => taskStore.resourceCount)
    const projectCount = computed(() => taskStore.projectCount)
    const todayTasks = computed(() => taskStore.todayTasks.slice(0, 4))
    const recentProjects = computed(() => taskStore.recentProjects)
    const goals = computed(() => taskStore.goals)
    const favoriteResources = computed(() => taskStore.resources.filter(r => r.favorited).slice(0, 4))

    // 目标编辑相关状态
    const showAddGoal = ref(false)
    const editingGoalId = ref(null)
    const editingGoalName = ref('')
    const editingGoalProgress = ref(0)
    const newGoalName = ref('')
    const newGoalProgress = ref(0)

    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)'
    ]

    const startEditGoal = (goal) => {
      editingGoalId.value = goal.id
      editingGoalName.value = goal.name
      editingGoalProgress.value = goal.progress
    }

    const saveGoalName = (goal) => {
      taskStore.updateGoal(goal.id, { name: editingGoalName.value })
      editingGoalId.value = null
    }

    const updateGoalProgress = (goal) => {
      taskStore.updateGoal(goal.id, { progress: editingGoalProgress.value })
    }

    const deleteGoal = (goalId) => {
      if (confirm('确定要删除这个目标吗？')) {
        taskStore.deleteGoal(goalId)
      }
    }

    const addGoal = () => {
      if (newGoalName.value.trim()) {
        taskStore.addGoal({
          name: newGoalName.value,
          progress: newGoalProgress.value,
          color: gradients[Math.floor(Math.random() * gradients.length)]
        })
        newGoalName.value = ''
        newGoalProgress.value = 0
        showAddGoal.value = false
      }
    }

    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 6) return '凌晨好'
      if (hour < 9) return '早上好'
      if (hour < 12) return '上午好'
      if (hour < 14) return '中午好'
      if (hour < 18) return '下午好'
      if (hour < 22) return '晚上好'
      return '夜深了'
    }

    const getTimeIcon = () => {
      const hour = new Date().getHours()
      if (hour < 6) return '/image/凌晨.png'
      if (hour < 9) return '/image/早上.png'
      if (hour < 12) return '/image/上午.png'
      if (hour < 14) return '/image/中午.png'
      if (hour < 18) return '/image/下午.png'
      return '/image/夜晚.png'
    }

    const toggleTask = (task) => {
      taskStore.toggleTask(task)
    }

    const getPriorityLabel = (priority) => {
      const labels = { high: '高', medium: '中', low: '低' }
      return labels[priority]
    }

    const getStatusLabel = (status) => {
      const labels = { planning: '规划中', developing: '开发中', completed: '已完成' }
      return labels[status]
    }

    return {
      pendingTasks,
      journeyCount,
      resourceCount,
      projectCount,
      todayTasks,
      recentProjects,
      goals,
      favoriteResources,
      getGreeting,
      getTimeIcon,
      toggleTask,
      getPriorityLabel,
      getStatusLabel,
      // 目标相关
      showAddGoal,
      editingGoalId,
      editingGoalName,
      editingGoalProgress,
      newGoalName,
      newGoalProgress,
      startEditGoal,
      saveGoalName,
      updateGoalProgress,
      deleteGoal,
      addGoal
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero-section {
  position: relative;
  padding: 60px 24px 80px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at top right, rgba(102, 126, 234, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse at bottom left, rgba(118, 75, 162, 0.2) 0%, transparent 50%);
  z-index: 0;
  opacity: 0.8;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.greeting {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.time-icon {
  font-size: 48px;
}

.time-icon-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.greeting-text {
  font-size: 36px;
  font-weight: 700;
  color: white;
}

.light-mode .greeting-text {
  color: #1e293b;
}

.hero-subtitle {
  font-size: 16px;
  color: #888;
  margin-bottom: 40px;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.light-mode .stat-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-color: #e2e8f0;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transform: rotate(45deg);
  transition: all 0.6s;
  opacity: 0;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(102, 126, 234, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4),
              0 0 30px rgba(102, 126, 234, 0.2);
}

.stat-card:hover::before {
  opacity: 1;
  animation: shimmer 0.6s ease-out;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.stat-icon {
  font-size: 36px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.light-mode .stat-value {
  color: #1e293b;
}

.stat-label {
  font-size: 13px;
  color: #888;
}

.dashboard-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 60px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.stat-icon-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.light-mode .section-header h2 {
  color: #1e293b;
}

.view-more {
  font-size: 13px;
  color: #667eea;
  transition: color 0.3s;
}

.view-more:hover {
  color: #85b3ff;
}

.today-tasks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(26, 26, 46, 0.5);
  border-radius: 10px;
  transition: all 0.3s;
}

.light-mode .task-item {
  background: rgba(241, 245, 249, 0.8);
}

.task-item:hover {
  background: rgba(102, 126, 234, 0.1);
}

.task-checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid #4a4a6a;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.task-checkbox.completed {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  color: white;
}

.task-title {
  flex: 1;
  font-size: 14px;
  color: #e0e0e0;
}

.light-mode .task-title {
  color: #334155;
}

.task-title.completed {
  text-decoration: line-through;
  color: #666;
}

.task-priority {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 12px;
}

.priority-high {
  background: rgba(255, 65, 108, 0.15);
  color: #ff416c;
}

.priority-medium {
  background: rgba(255, 193, 60, 0.15);
  color: #ffc13c;
}

.priority-low {
  background: rgba(56, 239, 125, 0.15);
  color: #38ef7d;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #888;
  font-size: 14px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(26, 26, 46, 0.5);
  border-radius: 12px;
  transition: all 0.3s;
}

.light-mode .action-card {
  background: rgba(241, 245, 249, 0.8);
}

.action-card:hover {
  background: rgba(102, 126, 234, 0.15);
  transform: translateX(4px);
}

.action-icon {
  font-size: 24px;
}

.action-icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.icon-img-xs {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.action-text {
  font-size: 14px;
  color: #e0e0e0;
}

.light-mode .action-text {
  color: #334155;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: rgba(26, 26, 46, 0.5);
  border-radius: 12px;
  transition: all 0.3s;
}

.light-mode .project-item {
  background: rgba(241, 245, 249, 0.8);
}

.project-item:hover {
  background: rgba(102, 126, 234, 0.1);
}

.project-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.project-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-name {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.light-mode .project-name {
  color: #1e293b;
}

.project-desc {
  font-size: 12px;
  color: #888;
}

.project-status {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 12px;
}

.status-planning {
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
}

.status-developing {
  background: rgba(255, 193, 60, 0.15);
  color: #ffc13c;
}

.status-completed {
  background: rgba(56, 239, 125, 0.15);
  color: #38ef7d;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goal-name {
  font-size: 14px;
  color: #e0e0e0;
}

.light-mode .goal-name {
  color: #334155;
}

.goal-percent {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.goal-progress-bar {
  height: 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.goal-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.goal-progress-bar {
  cursor: pointer;
}

.favorites-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.favorite-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(26, 26, 46, 0.5);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s;
}

.favorite-item:hover {
  background: rgba(102, 126, 234, 0.15);
  transform: translateX(4px);
}

.favorite-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.favorite-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.favorite-name {
  font-size: 13px;
  font-weight: 600;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorite-category {
  font-size: 11px;
  color: #667eea;
}

.light-mode .favorite-item {
  background: rgba(241, 245, 249, 0.8);
}

.light-mode .favorite-name {
  color: #334155;
}

.goal-header {
  gap: 12px;
}

.goal-name {
  flex: 1;
  cursor: pointer;
}

.goal-name span:hover {
  color: #667eea;
}

.percent-text {
  cursor: pointer;
}

.percent-text:hover {
  color: #764ba2;
}

.input-field-small {
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  flex: 1;
}

.light-mode .input-field-small {
  background: white;
  border-color: #e2e8f0;
  color: #1e293b;
}

.progress-slider-inline {
  width: 100px;
  cursor: pointer;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  transition: all 0.3s;
}

.icon-btn:hover {
  transform: scale(1.2);
  opacity: 0.8;
}

.btn-small {
  padding: 6px 12px;
  font-size: 13px;
}

.section-header .btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 400px;
  padding: 24px;
}

.modal-title {
  font-size: 20px;
  color: white;
  margin-bottom: 20px;
}

.light-mode .modal-title {
  color: #1e293b;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}

.light-mode .form-group label {
  color: #64748b;
}

.input-field {
  width: 100%;
  padding: 10px 14px;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.light-mode .input-field {
  background: white;
  border-color: #e2e8f0;
  color: #1e293b;
}

.input-field:focus {
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

@media (max-width: 1024px) {
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .greeting-text {
    font-size: 28px;
  }

  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>