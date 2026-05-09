// src/stores/taskStore.js
import { defineStore } from 'pinia'

const STORAGE_KEYS = {
  TASKS: 'gerendaiban_tasks',
  PROJECTS: 'gerendaiban_projects',
  GOALS: 'gerendaiban_goals',
  JOURNEY: 'gerendaiban_journey',
  SKILLS: 'gerendaiban_skills',
  JOURNEY_GOALS: 'gerendaiban_journey_goals',
  RESOURCES: 'gerendaiban_resources'
}

const getFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error('Failed to save to localStorage:', key)
  }
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: getFromStorage(STORAGE_KEYS.TASKS, [
      {
        id: 1,
        title: '完成Vue3项目架构设计',
        description: '包括路由配置、状态管理、组件拆分等',
        priority: 'high',
        category: '工作',
        date: '2024-01-15',
        completed: false,
        inProgress: true
      },
      {
        id: 2,
        title: '学习TypeScript高级特性',
        description: '泛型、装饰器、类型守卫等',
        priority: 'medium',
        category: '学习',
        date: '2024-01-18',
        completed: false,
        inProgress: false
      },
      {
        id: 3,
        title: '整理前端知识体系',
        description: '构建完整的前端技术图谱',
        priority: 'high',
        category: '学习',
        date: '2024-01-20',
        completed: false,
        inProgress: false
      },
      {
        id: 4,
        title: '优化个人博客性能',
        description: '实现SSR和静态生成',
        priority: 'medium',
        category: '工作',
        date: '2024-01-10',
        completed: true,
        inProgress: false
      },
      {
        id: 5,
        title: '阅读《算法导论》',
        description: '第5-8章内容',
        priority: 'low',
        category: '学习',
        date: '2024-01-12',
        completed: true,
        inProgress: false
      }
    ]),
    projects: getFromStorage(STORAGE_KEYS.PROJECTS, [
      { id: 1, name: 'Vue3管理系统', description: '基于Vue3的后台管理模板', status: 'developing', color: 'linear-gradient(135deg, #667eea, #764ba2)', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', progress: 65, tags: ['Vue3', 'Element Plus', 'TypeScript'], date: '2024-03', github: 'https://github.com/luo6667?tab=repositories', demo: 'https://demo.com' },
      { id: 2, name: '个人博客', description: '技术文章分享平台', status: 'completed', color: 'linear-gradient(135deg, #11998e, #38ef7d)', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)', progress: 100, tags: ['Nuxt.js', 'Markdown', 'Tailwind'], date: '2024-01', github: 'https://github.com/luo6667?tab=repositories' },
      { id: 3, name: '小程序商城', description: '电商小程序开发', status: 'planning', color: 'linear-gradient(135deg, #f093fb, #f5576c)', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', progress: 10, tags: ['微信小程序', '云开发', 'UI设计'], date: '2024-05' }
    ]),
    goals: getFromStorage(STORAGE_KEYS.GOALS, [
      { id: 1, name: '2024年学习计划', progress: 72, color: 'linear-gradient(135deg, #667eea, #764ba2)' },
      { id: 2, name: '技术书籍阅读', progress: 45, color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
      { id: 3, name: '项目经验积累', progress: 60, color: 'linear-gradient(135deg, #f093fb, #f5576c)' }
    ]),
    journeyData: getFromStorage(STORAGE_KEYS.JOURNEY, [
      {
        period: '2018.09 - 2022.06',
        icon: '📚',
        title: '大学本科',
        description: '系统学习计算机科学专业，掌握数据结构、算法、操作系统等核心知识',
        color: 'linear-gradient(135deg, #11998e, #38ef7d)',
        tags: ['计算机基础', '数据结构', '算法', 'Java'],
        id: 1
      },
      {
        period: '2022.03 - 2022.08',
        icon: '💼',
        title: '第一份实习',
        description: '进入互联网公司实习，参与前端项目开发，正式踏入职业生涯',
        color: 'linear-gradient(135deg, #f093fb, #f5576c)',
        tags: ['Vue.js', '团队协作', '项目经验'],
        id: 2
      }
    ]),
    skills: getFromStorage(STORAGE_KEYS.SKILLS, [
      { name: 'Vue.js', icon: '💚', level: 90, color: 'linear-gradient(135deg, #42b883, #354a95)', id: 1 },
      { name: 'React', icon: '🔵', level: 75, color: 'linear-gradient(135deg, #61dafb, #20232a)', id: 2 },
      { name: 'Node.js', icon: '🟢', level: 80, color: 'linear-gradient(135deg, #68a063, #3c873a)', id: 3 },
      { name: 'TypeScript', icon: '🔷', level: 85, color: 'linear-gradient(135deg, #3178c6, #235a97)', id: 4 },
      { name: 'Python', icon: '🐍', level: 70, color: 'linear-gradient(135deg, #ffd43b, #306998)', id: 5 },
      { name: 'Docker', icon: '🐳', level: 65, color: 'linear-gradient(135deg, #2496ed, #1f8act)', id: 6 }
    ]),
    journeyGoals: getFromStorage(STORAGE_KEYS.JOURNEY_GOALS, [
      {
        id: 1,
        title: '2024年度目标',
        period: '2024.01 - 2024.12',
        description: '完成技术书籍阅读计划，提升架构设计能力，参与开源项目',
        progress: 45,
        status: 'progress',
        color: 'linear-gradient(135deg, #667eea, #764ba2)'
      },
      {
        id: 2,
        title: '技术分享计划',
        period: '2024.01 - 2024.06',
        description: '每月至少输出一篇高质量技术文章，建立个人技术影响力',
        progress: 60,
        status: 'progress',
        color: 'linear-gradient(135deg, #11998e, #38ef7d)'
      },
      {
        id: 3,
        title: '全栈能力提升',
        period: '2024.01 - 2024.09',
        description: '深入学习微服务、云原生相关技术，完成2个全栈项目',
        progress: 30,
        status: 'progress',
        color: 'linear-gradient(135deg, #f093fb, #f5576c)'
      }
    ]),
    resources: getFromStorage(STORAGE_KEYS.RESOURCES, [
      { id: 1, name: 'Vue.js', url: 'https://vuejs.org', description: '渐进式 JavaScript 框架，易学易用', logo: '💚', color: 'linear-gradient(135deg, #42b883, #354a95)', category: '前端', tags: ['框架', '中文文档'], favorited: true, date: '2024-01', type: '文档' },
      { id: 2, name: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Web技术权威文档，全面的前端教程', logo: '📖', color: 'linear-gradient(135deg, #11998e, #38ef7d)', category: '前端', tags: ['文档', 'API'], favorited: true, date: '2024-01', type: '文档' },
      { id: 3, name: 'GitHub Learning Lab', url: 'https://lab.github.com', description: '交互式学习Git和GitHub，从零开始', logo: '🎓', color: 'linear-gradient(135deg, #f093fb, #f5576c)', category: '工具', tags: ['Git', '教程'], favorited: false, date: '2024-01', type: '教程' },
      { id: 4, name: 'LeetCode', url: 'https://leetcode.com', description: '算法刷题平台，提升编程能力', logo: '🧠', color: 'linear-gradient(135deg, #fc4a1a, #f7b733)', category: '算法', tags: ['算法', '面试'], favorited: true, date: '2024-01', type: '平台' },
      { id: 5, name: 'Node.js', url: 'https://nodejs.org', description: 'Node.js权威指南，后端开发必备', logo: '🟢', color: 'linear-gradient(135deg, #68a063, #3c873a)', category: '后端', tags: ['Node', '后端'], favorited: false, date: '2024-01', type: '文档' },
      { id: 6, name: 'TypeScript Handbook', url: 'https://typescriptlang.org', description: 'TypeScript官方教程，类型安全的JavaScript', logo: '🔷', color: 'linear-gradient(135deg, #3178c6, #235a97)', category: '前端', tags: ['TypeScript', '类型'], favorited: false, date: '2024-01', type: '文档' }
    ]),
    resourceCount: 6
  }),
  getters: {
    pendingCount() {
      return this.tasks.filter(t => !t.completed && !t.inProgress).length
    },
    inProgressCount() {
      return this.tasks.filter(t => t.inProgress).length
    },
    completedCount() {
      return this.tasks.filter(t => t.completed).length
    },
    pendingTasks() {
      return this.tasks.filter(t => !t.completed).length
    },
    projectCount() {
      return this.projects.filter(p => p.status === 'completed').length
    },
    recentProjects() {
      return this.projects.slice(0, 3)
    },
    todayTasks() {
      // 显示未完成或进行中的任务
      return this.tasks.filter(t => !t.completed)
    },
    resourceCount() {
      return this.resources.length
    },
    journeyCount() {
      return this.journeyData.length
    }
  },
  actions: {
    toggleTask(task) {
      task.completed = !task.completed
      if (task.completed) task.inProgress = false
      this.saveTasks()
      this.autoUpdateGoalProgress()
    },
    toggleProgress(task) {
      task.inProgress = !task.inProgress
      this.saveTasks()
    },
    deleteTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id)
      this.saveTasks()
    },
    addTask(taskData) {
      this.tasks.unshift({
        id: Date.now(),
        ...taskData,
        completed: false,
        inProgress: false
      })
      this.saveTasks()
    },
    updateTask(taskId, taskData) {
      const index = this.tasks.findIndex(t => t.id === taskId)
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...taskData }
        this.saveTasks()
      }
    },
    // 任务持久化
    saveTasks() {
      saveToStorage(STORAGE_KEYS.TASKS, this.tasks)
    },
    // 技能管理
    updateSkill(skillId, newData) {
      const index = this.skills.findIndex(s => s.id === skillId)
      if (index !== -1) {
        this.skills[index] = { ...this.skills[index], ...newData }
        saveToStorage(STORAGE_KEYS.SKILLS, this.skills)
      }
    },
    addSkill(skillData) {
      this.skills.unshift({
        id: Date.now(),
        ...skillData
      })
      saveToStorage(STORAGE_KEYS.SKILLS, this.skills)
    },
    deleteSkill(skillId) {
      this.skills = this.skills.filter(s => s.id !== skillId)
      saveToStorage(STORAGE_KEYS.SKILLS, this.skills)
    },
    // 历程目标管理
    updateJourneyGoal(goalId, newData) {
      const index = this.journeyGoals.findIndex(g => g.id === goalId)
      if (index !== -1) {
        this.journeyGoals[index] = { ...this.journeyGoals[index], ...newData }
        saveToStorage(STORAGE_KEYS.JOURNEY_GOALS, this.journeyGoals)
      }
    },
    addJourneyGoal(goalData) {
      this.journeyGoals.unshift({
        id: Date.now(),
        ...goalData
      })
      saveToStorage(STORAGE_KEYS.JOURNEY_GOALS, this.journeyGoals)
    },
    deleteJourneyGoal(goalId) {
      this.journeyGoals = this.journeyGoals.filter(g => g.id !== goalId)
      saveToStorage(STORAGE_KEYS.JOURNEY_GOALS, this.journeyGoals)
    },
    // 历程时间线管理
    updateJourneyItem(itemId, newData) {
      const index = this.journeyData.findIndex(i => i.id === itemId)
      if (index !== -1) {
        this.journeyData[index] = { ...this.journeyData[index], ...newData }
        saveToStorage(STORAGE_KEYS.JOURNEY, this.journeyData)
        this.journeyCount = this.journeyData.length
      }
    },
    addJourneyItem(itemData) {
      this.journeyData.push({
        id: Date.now(),
        ...itemData
      })
      saveToStorage(STORAGE_KEYS.JOURNEY, this.journeyData)
      this.journeyCount = this.journeyData.length
    },
    deleteJourneyItem(itemId) {
      this.journeyData = this.journeyData.filter(i => i.id !== itemId)
      saveToStorage(STORAGE_KEYS.JOURNEY, this.journeyData)
      this.journeyCount = this.journeyData.length
    },
    // 项目管理
    updateProject(projectId, newData) {
      const index = this.projects.findIndex(p => p.id === projectId)
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...newData }
        saveToStorage(STORAGE_KEYS.PROJECTS, this.projects)
      }
    },
    addProject(projectData) {
      this.projects.unshift({
        id: Date.now(),
        ...projectData
      })
      saveToStorage(STORAGE_KEYS.PROJECTS, this.projects)
    },
    deleteProject(projectId) {
      this.projects = this.projects.filter(p => p.id !== projectId)
      saveToStorage(STORAGE_KEYS.PROJECTS, this.projects)
    },
    // 资源管理
    addResource(resourceData) {
      this.resources.unshift({
        id: Date.now(),
        ...resourceData
      })
      saveToStorage(STORAGE_KEYS.RESOURCES, this.resources)
    },
    updateResource(resourceId, newData) {
      const index = this.resources.findIndex(r => r.id === resourceId)
      if (index !== -1) {
        this.resources[index] = { ...this.resources[index], ...newData }
        saveToStorage(STORAGE_KEYS.RESOURCES, this.resources)
      }
    },
    deleteResource(resourceId) {
      this.resources = this.resources.filter(r => r.id !== resourceId)
      saveToStorage(STORAGE_KEYS.RESOURCES, this.resources)
    },
    // 目标管理
    updateGoal(goalId, newData) {
      const index = this.goals.findIndex(g => g.id === goalId)
      if (index !== -1) {
        this.goals[index] = { ...this.goals[index], ...newData }
        saveToStorage(STORAGE_KEYS.GOALS, this.goals)
      }
    },
    addGoal(goalData) {
      this.goals.unshift({
        id: Date.now(),
        ...goalData
      })
      saveToStorage(STORAGE_KEYS.GOALS, this.goals)
    },
    deleteGoal(goalId) {
      this.goals = this.goals.filter(g => g.id !== goalId)
      saveToStorage(STORAGE_KEYS.GOALS, this.goals)
    },
    // 根据任务完成情况自动更新目标进度
    autoUpdateGoalProgress() {
      const completedCount = this.tasks.filter(t => t.completed).length
      const totalCount = this.tasks.length
      if (totalCount > 0 && this.goals.length > 0) {
        const progress = Math.round((completedCount / totalCount) * 100)
        this.updateGoal(this.goals[0].id, { progress: Math.min(progress, 100) })
      }
    }
  }
})