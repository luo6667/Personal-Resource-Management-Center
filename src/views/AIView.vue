<template>
  <div class="ai-page">
    <div class="page-header">
      <h1 class="page-title"><img :src="isDark ? '/image/智能机器人白.png' : '/image/智能机器人黑.png'" class="ai-title-icon"> 智能助手</h1>
      <p class="page-subtitle">AI 驱动的学习伙伴，解答疑惑、推荐资源、规划任务</p>
    </div>

    <div class="ai-container">
      <div class="ai-features">
        <div class="feature-card card" @click="setActiveFeature('chat')" :class="{ active: activeFeature === 'chat' }">
          <img src="/image/智能回答.png" class="feature-icon-img" />
          <h3>智能问答</h3>
          <p>随时提问，获得即时解答</p>
        </div>
        <div class="feature-card card" @click="setActiveFeature('recommend')"  :class="{ active: activeFeature === 'recommend' }">
          <img src="/image/智能推荐.png" class="feature-icon-img" />
          <h3>智能推荐</h3>
          <p>根据你的目标推荐学习资源</p>
        </div>
        <div class="feature-card card" @click="setActiveFeature('plan')" :class="{ active: activeFeature === 'plan' }">
          <img :src="isDark ? '/image/日历白.png' : '/image/日历黑.png'" class="feature-icon-img" />
          <h3>任务规划</h3>
          <p>AI 帮你拆解和规划任务</p>
        </div>
      </div>

      <div class="ai-main card">
        <div class="chat-container" v-if="activeFeature === 'chat'">
          <div class="chat-messages" ref="chatMessages">
            <div
              v-for="(msg, index) in chatMessages"
              :key="index"
              class="message"
              :class="msg.role"
            >
              <div class="message-avatar">
                <img v-if="msg.role !== 'user'" :src="isDark ? '/image/智能机器人白.png' : '/image/智能机器人黑.png'" class="avatar-img" />
                <span v-else>👤</span>
              </div>
              <div class="message-content">
                <div class="message-text">{{ msg.content }}</div>
                <div class="message-time">{{ msg.time }}</div>
              </div>
            </div>
            <div v-if="isLoading" class="message assistant">
              <div class="message-avatar">
                <img :src="isDark ? '/image/智能机器人白.png' : '/image/智能机器人黑.png'" class="avatar-img" />
              </div>
              <div class="message-content">
                <div class="message-text typing">思考中...</div>
              </div>
            </div>
          </div>
          <div class="chat-input-container">
            <input
              v-model="userInput"
              type="text"
              class="chat-input"
              placeholder="输入你的问题..."
              @keyup.enter="sendMessage"
              :disabled="isLoading"
            >
            <button class="send-btn btn btn-primary" @click="sendMessage" :disabled="isLoading">
              {{ isLoading ? '发送中...' : '发送' }}
            </button>
          </div>
        </div>

        <div class="recommend-container" v-if="activeFeature === 'recommend'">
          <div class="recommend-header">
            <h2><img :src="isDark ? '/image/书-堆叠白.png' : '/image/书-堆叠黑.png'" class="title-icon"> 为你推荐的学习资源</h2>
            <p>基于你的学习目标，智能匹配相关资源</p>
          </div>
          <div class="recommend-form">
            <input
              v-model="recommendTopic"
              type="text"
              class="input-field"
              placeholder="输入你想学习的主题..."
              :disabled="isLoading"
              @keyup.enter="getRecommendations"
            >
            <button class="btn btn-primary" @click="getRecommendations" :disabled="isLoading">
              {{ isLoading ? '思考中...' : '推荐' }}
            </button>
          </div>
          <div class="recommend-results" v-if="recommendations.length">
            <div v-for="(rec, index) in recommendations" :key="index" class="recommend-item card">
              <div class="recommend-rank">#{{ index + 1 }}</div>
              <div class="recommend-info">
                <h4>{{ rec.name }}</h4>
                <p>{{ rec.description }}</p>
                <div class="recommend-tags">
                  <span class="tag">{{ rec.category }}</span>
                  <span class="tag">{{ rec.level }}</span>
                </div>
              </div>
              <div class="recommend-actions">
                <a :href="rec.url" target="_blank" class="btn btn-secondary">查看</a>
                <button class="btn btn-primary" @click="addToResources(rec)">添加到资源</button>
              </div>
            </div>
          </div>
        </div>

        <div class="plan-container" v-if="activeFeature === 'plan'">
          <div class="plan-header">
            <h2><img :src="isDark ? '/image/日历白.png' : '/image/日历黑.png'" class="title-icon"> AI 任务规划助手</h2>
            <p>描述你的目标，AI 帮你拆解成可执行的步骤</p>
          </div>
          <div class="plan-form">
            <textarea
              v-model="planGoal"
              class="input-field"
              rows="3"
              placeholder="例如：我想在3个月内学会Vue3，并完成一个完整项目...（Ctrl+Enter快速生成）"
              :disabled="isLoading"
              @keydown.ctrl.enter="generatePlan"
            ></textarea>
            <button class="btn btn-primary" @click="generatePlan" :disabled="isLoading">
              {{ isLoading ? '思考中...' : '生成计划' }}
            </button>
          </div>
          <div class="plan-results" v-if="planSteps.length || planText">
            <div v-if="planText" class="plan-text-display card">
              <div class="plan-text-content">
                <pre>{{ planText }}</pre>
              </div>
            </div>
            <div v-else class="plan-steps-container">
              <div v-for="(step, index) in planSteps" :key="index" class="plan-step card">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.description }}</p>
                  <div class="step-meta">
                    <span>⏱️ {{ step.duration }}</span>
                    <span><img src="/image/飞镖.png" class="icon-img-small"> {{ step.difficulty }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_KEY = 'ark-4fb996b0-145d-4613-8906-759ab7f21f3c-25efd'
import { useTaskStore } from '../stores/taskStore'

export default {
  name: 'AIView',
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    return {
      taskStore: useTaskStore()
    }
  },
  data() {
    // 关键字分类映射
    this.categoryKeywords = {
      '前端': ['前端', 'frontend', 'vue', 'react', 'angular', 'javascript', 'typescript', 'html', 'css', 'css3', 'webpack', 'vite', 'es6', 'node', 'npm', 'yarn', 'tailwind', 'sass', 'less', 'dom', 'axios', 'fetch'],
      '后端': ['后端', 'backend', 'server', 'java', 'python', 'go', 'golang', 'spring', 'django', 'flask', 'express', 'koa', 'mysql', 'postgresql', 'mongodb', 'redis', 'api', 'restful', 'graphql'],
      '算法': ['算法', 'algorithm', '数据结构', 'datastructure', 'leetcode', '排序', '搜索', '树', '图', '动态规划', 'dp', '贪心', '递归', '复杂度', '哈希'],
      '工具': ['工具', 'tool', 'git', 'github', 'gitlab', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'nginx', 'linux', 'shell', 'terminal', '编辑器', 'vscode', 'idea'],
      '学习社区': ['社区', 'community', '博客', 'blog', '论坛', 'forum', 'github', '开源', 'opensource', '教程', 'tutorial', '文档', 'docs', '课程', 'course', '视频', 'video']
    }
    return {
      activeFeature: 'chat',
      userInput: this.getStoredValue('ai_userInput', ''),
      isLoading: false,
      chatMessages: (() => {
        const stored = localStorage.getItem('ai_chatMessages')
        if (stored) {
          try {
            return JSON.parse(stored)
          } catch {
            return [{
              role: 'assistant',
              content: '你好！我是你的AI学习助手。我可以帮助你：\n• 解答技术问题\n• 推荐学习资源\n• 制定学习计划\n有什么我可以帮你的吗？',
              time: new Date().toLocaleTimeString()
            }]
          }
        }
        return [{
          role: 'assistant',
          content: '你好！我是你的AI学习助手。我可以帮助你：\n• 解答技术问题\n• 推荐学习资源\n• 制定学习计划\n有什么我可以帮你的吗？',
          time: new Date().toLocaleTimeString()
        }]
      })(),
      recommendTopic: this.getStoredValue('ai_recommendTopic', ''),
      recommendations: (() => {
        const stored = localStorage.getItem('ai_recommendations')
        if (stored) {
          try {
            return JSON.parse(stored)
          } catch {
            return []
          }
        }
        return []
      })(),
      planGoal: this.getStoredValue('ai_planGoal', ''),
      planSteps: [],
      planText: '',
      conversationHistory: (() => {
        const stored = localStorage.getItem('ai_conversationHistory')
        if (stored) {
          try {
            return JSON.parse(stored)
          } catch {
            return [
              {
                role: 'system',
                content: '你是一个智能学习助手，名字叫小帮。你擅长解答技术问题、推荐学习资源和制定学习计划。请用友好、专业的态度回答用户的问题。'
              },
              {
                role: 'assistant',
                content: '你好！我是你的AI学习助手。我可以帮助你：\n• 解答技术问题\n• 推荐学习资源\n• 制定学习计划\n有什么我可以帮你的吗？'
              }
            ]
          }
        }
        return [
          {
            role: 'system',
            content: '你是一个智能学习助手，名字叫小帮。你擅长解答技术问题、推荐学习资源和制定学习计划。请用友好、专业的态度回答用户的问题。'
          },
          {
            role: 'assistant',
            content: '你好！我是你的AI学习助手。我可以帮助你：\n• 解答技术问题\n• 推荐学习资源\n• 制定学习计划\n有什么我可以帮你的吗？'
          }
        ]
      })()
    }
  },
  watch: {
    userInput(val) {
      this.setStoredValue('ai_userInput', val)
    },
    recommendTopic(val) {
      this.setStoredValue('ai_recommendTopic', val)
    },
    planGoal(val) {
      this.setStoredValue('ai_planGoal', val)
    }
  },
  methods: {
    getStoredValue(key, defaultValue) {
      try {
        const stored = localStorage.getItem(key)
        return stored !== null ? stored : defaultValue
      } catch (e) {
        console.warn('Failed to get stored value:', e)
        return defaultValue
      }
    },
    getCategoryByKeywords(text) {
      if (!text) return '其他'
      const lowerText = text.toLowerCase()
      for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
        if (keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))) {
          return category
        }
      }
      return '其他'
    },
    setStoredValue(key, value) {
      try {
        localStorage.setItem(key, value)
      } catch (e) {
        console.warn('Failed to set stored value:', e)
      }
    },
    showToast(message, type = 'success') {
      const toast = document.createElement('div')
      toast.className = `toast toast-${type}`
      toast.textContent = message
      document.body.appendChild(toast)
      
      setTimeout(() => {
        toast.classList.add('show')
      }, 10)
      
      setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 300)
      }, 3000)
    },
    setActiveFeature(feature) {
      this.activeFeature = feature
    },
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return

      const userMessage = {
        role: 'user',
        content: this.userInput,
        time: new Date().toLocaleTimeString()
      }
      this.chatMessages.push(userMessage)
      this.conversationHistory.push({ role: 'user', content: this.userInput })
      
      // 保存聊天记录到 localStorage
      this.setStoredValue('ai_chatMessages', JSON.stringify(this.chatMessages))
      this.setStoredValue('ai_conversationHistory', JSON.stringify(this.conversationHistory))
      
      this.userInput = ''
      this.isLoading = true

      try {
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions?version=2024-12-01', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: 'ep-20260503145330-b9hzg',
            messages: this.conversationHistory,
            max_tokens: 2048,
            temperature: 0.7,
            stream: false
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`API请求失败 (${response.status}): ${errorData.error?.message || response.statusText}`)
        }

        const data = await response.json()
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const aiResponse = data.choices[0].message.content
          
          this.chatMessages.push({
            role: 'assistant',
            content: aiResponse,
            time: new Date().toLocaleTimeString()
          })
          this.conversationHistory.push({ role: 'assistant', content: aiResponse })
          
          // 保存聊天记录到 localStorage
          this.setStoredValue('ai_chatMessages', JSON.stringify(this.chatMessages))
          this.setStoredValue('ai_conversationHistory', JSON.stringify(this.conversationHistory))
        } else {
          throw new Error('API响应格式错误')
        }
      } catch (error) {
        console.error('AI API Error:', error)
        this.chatMessages.push({
          role: 'assistant',
          content: `抱歉，发生了错误：${error.message}\n\n请稍后重试。`,
          time: new Date().toLocaleTimeString()
        })
        // 保存错误消息到 localStorage
        this.setStoredValue('ai_chatMessages', JSON.stringify(this.chatMessages))
      } finally {
        this.isLoading = false
        this.$nextTick(() => {
          if (this.$refs.chatMessages) {
            this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight
          }
        })
      }
    },
    async getRecommendations() {
      if (!this.recommendTopic.trim()) return

      this.recommendations = []
      this.isLoading = true

      try {
        const prompt = `
请根据用户输入的学习主题"${this.recommendTopic}"，推荐4个最相关的学习资源。
请以JSON格式输出，包含name(资源名称), description(资源描述), category(分类), level(难度级别), url(链接，如无则留空)。
示例输出格式：
[
  {"name": "资源名称", "description": "描述", "category": "前端", "level": "入门", "url": "https://example.com"}
]
        `

        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions?version=2024-12-01', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: 'ep-20260503145330-b9hzg',
            messages: [
              { role: 'system', content: '你是一个学习资源推荐专家，请根据用户的学习主题推荐高质量的学习资源。' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 1024,
            temperature: 0.7,
            stream: false
          })
        })

        if (!response.ok) {
          throw new Error('API请求失败')
        }

        const data = await response.json()
        const aiResponse = data.choices[0].message.content
        
        try {
          this.recommendations = JSON.parse(aiResponse)
        } catch {
          this.recommendations = [
            { name: '学习资源推荐', description: aiResponse, category: '推荐', level: '综合', url: '' }
          ]
        }
        // 保存推荐结果到 localStorage
        this.setStoredValue('ai_recommendations', JSON.stringify(this.recommendations))
      } catch (error) {
        console.error('推荐API Error:', error)
        this.recommendations = [
          { name: 'Vue.js 官方文档', description: '最权威的Vue学习资料', category: '前端', level: '入门到进阶', url: 'https://vuejs.org' },
          { name: 'MDN Web Docs', description: 'Web技术权威文档', category: '前端', level: '入门到高级', url: 'https://developer.mozilla.org' },
          { name: 'GitHub Learning Lab', description: '交互式学习Git和GitHub', category: '工具', level: '入门', url: 'https://lab.github.com' },
          { name: 'LeetCode', description: '算法刷题平台', category: '算法', level: '进阶', url: 'https://leetcode.com' }
        ]
      } finally {
        this.isLoading = false
      }
    },
    addToResources(rec) {
      const { taskStore } = this
      
      const exists = taskStore.resources.some(r => r.name === rec.name)
      if (exists) {
        this.showToast('该资源已存在于学习资源中', 'warning')
        return
      }
      
      // 根据关键字自动分类
        const autoCategory = this.getCategoryByKeywords(rec.name + ' ' + rec.description)
        
        const newResource = {
          name: rec.name,
          url: rec.url || '#',
          description: rec.description,
          logo: '📚',
          color: 'linear-gradient(135deg, #667eea, #764ba2)',
          category: autoCategory,
          tags: [rec.level],
          favorited: false,
          date: new Date().toISOString().slice(0, 7),
          type: '教程'
        }
      taskStore.addResource(newResource)
      this.showToast('已成功添加到学习资源！', 'success')
    },
    async generatePlan() {
      if (!this.planGoal.trim()) return

      this.planSteps = []
      this.planText = ''
      this.isLoading = true

      try {
        const prompt = `请根据用户的目标："${this.planGoal}"，生成一个详细的学习/任务规划。
请以清晰的步骤格式输出，包括：
1. 明确的步骤编号
2. 每个步骤的标题
3. 详细的描述
4. 预计完成时长
5. 难度级别（入门/进阶/高级）
请使用友好的、易于阅读的格式，不要使用JSON或任何代码格式。`

        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions?version=2024-12-01', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: 'ep-20260503145330-b9hzg',
            messages: [
              { role: 'system', content: '你是一个专业的学习规划师，请根据用户的目标制定详细的学习计划。' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 1500,
            temperature: 0.7,
            stream: false
          })
        })

        if (!response.ok) {
          throw new Error('API请求失败')
        }

        const data = await response.json()
        const aiResponse = data.choices[0].message.content
        
        // 直接使用文本，不需要解析JSON
        this.planText = aiResponse
        
        // 同时尝试提取步骤到planSteps数组用于渲染
        const lines = aiResponse.split('\n').filter(line => line.trim())
        const steps = []
        let currentStep = null
        
        for (const line of lines) {
          const numMatch = line.match(/^(\d+)[、. ]+(.+)$/)
          if (numMatch) {
            if (currentStep) steps.push(currentStep)
            currentStep = {
              title: numMatch[2],
              description: '',
              duration: '灵活调整',
              difficulty: '入门'
            }
          } else if (currentStep) {
            if (currentStep.description) currentStep.description += '\n'
            currentStep.description += line
            
            if (line.includes('周') || line.includes('小时') || line.includes('天')) {
              currentStep.duration = line.trim()
            }
            if (line.includes('入门') || line.includes('进阶') || line.includes('高级')) {
              currentStep.difficulty = line.includes('入门') ? '入门' : line.includes('进阶') ? '进阶' : '高级'
            }
          }
        }
        if (currentStep) steps.push(currentStep)
        
        if (steps.length > 0) {
          this.planSteps = steps
        } else {
          this.planSteps = [
            { title: '学习计划', description: aiResponse, duration: '根据实际情况安排', difficulty: '综合' }
          ]
        }
      } catch (error) {
        console.error('规划API Error:', error)
        this.planSteps = [
          { title: '基础概念学习', description: '了解目标技术的基本概念和核心原理', duration: '1-2周', difficulty: '入门' },
          { title: '官方文档教程', description: '跟随官方文档完成基础教程和示例', duration: '2-3周', difficulty: '入门' },
          { title: '小项目实战', description: '完成2-3个小型实战项目，巩固所学知识', duration: '3-4周', difficulty: '进阶' },
          { title: '综合项目开发', description: '完成一个完整的综合性项目', duration: '4-6周', difficulty: '高级' }
        ]
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.ai-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.ai-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.feature-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.feature-card:hover,
.feature-card.active {
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-icon-img {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.title-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}

.ai-title-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  vertical-align: middle;
}

.avatar-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.icon-img-small {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.feature-card h3 {
  font-size: 18px;
  color: white;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 13px;
  color: #888;
}

.ai-main {
  min-height: 500px;
  padding: 0;
  overflow: hidden;
}

.chat-container {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
}

.message-text {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.message.assistant .message-text {
  background: rgba(102, 126, 234, 0.15);
  color: #e0e0e0;
  border-bottom-left-radius: 4px;
}

.message.user .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-text.typing {
  color: #888;
  font-style: italic;
}

.message-time {
  font-size: 11px;
  color: #666;
  margin-top: 6px;
}

.message.user .message-time {
  text-align: right;
}

.chat-input-container {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: rgba(26, 26, 46, 0.5);
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  background: #1a1a2e;
  border: 1px solid #2d2d44;
  border-radius: 10px;
  color: #e0e0e0;
  font-size: 14px;
}

.chat-input:focus {
  outline: none;
  border-color: #667eea;
}

.chat-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-btn {
  padding: 12px 24px;
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.recommend-container,
.plan-container {
  padding: 24px;
}

.recommend-header,
.plan-header {
  text-align: center;
  margin-bottom: 30px;
}

.recommend-header h2,
.plan-header h2 {
  font-size: 22px;
  color: white;
  margin-bottom: 8px;
}

.recommend-header p,
.plan-header p {
  font-size: 14px;
  color: #888;
}

.recommend-form,
.plan-form {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}

.recommend-form .input-field,
.plan-form .input-field {
  flex: 1;
}

textarea.input-field {
  resize: none;
}

.recommend-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recommend-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.recommend-rank {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  min-width: 50px;
}

.recommend-info {
  flex: 1;
}

.recommend-actions {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.recommend-info h4 {
  font-size: 16px;
  color: white;
  margin-bottom: 6px;
}

.recommend-info p {
  font-size: 13px;
  color: #888;
  margin-bottom: 10px;
}

.recommend-tags {
  display: flex;
  gap: 8px;
}

.plan-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plan-step {
  display: flex;
  gap: 16px;
  padding: 20px;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 16px;
  color: white;
  margin-bottom: 6px;
}

.step-content p {
  font-size: 13px;
  color: #888;
  margin-bottom: 10px;
}

.step-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #667eea;
}

.plan-text-display {
  padding: 24px;
}

.plan-text-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: 14px;
  color: #e0e0e0;
  line-height: 1.8;
  margin: 0;
}

.light-mode .plan-text-content pre {
  color: #334155;
}

@media (max-width: 768px) {
  .ai-features {
    grid-template-columns: 1fr;
  }

  .recommend-form,
  .plan-form {
    flex-direction: column;
  }

  .recommend-item {
    flex-direction: column;
    text-align: center;
  }

  .recommend-rank {
    min-width: auto;
  }
}

/* 浅色模式样式 */
.light-mode .feature-card h3 {
  color: #1e293b;
}

.light-mode .feature-card p {
  color: #64748b;
}

.light-mode .message.assistant .message-text {
  color: #334155;
}

.light-mode .recommend-header h2,
.light-mode .plan-header h2 {
  color: #1e293b;
}

.light-mode .recommend-header p,
.light-mode .plan-header p {
  color: #64748b;
}

.light-mode .recommend-info h4 {
  color: #1e293b;
}

.light-mode .recommend-info p {
  color: #64748b;
}

.light-mode .step-content h4 {
  color: #1e293b;
}

.light-mode .step-content p {
  color: #64748b;
}

.light-mode .chat-input-container {
  background: rgba(241, 245, 249, 0.5);
  border-top-color: #e2e8f0;
}

.light-mode .chat-input {
  background: #ffffff;
  border-color: #e2e8f0;
  color: #334155;
}

.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 14px 24px;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  transform: translateX(120%);
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.toast.show {
  transform: translateX(0);
  opacity: 1;
}

.toast-success {
  background: linear-gradient(135deg, #11998e, #38ef7d);
}

.toast-warning {
  background: linear-gradient(135deg, #fc4a1a, #f7b733);
}

.toast-error {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}

.light-mode .toast {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

</style>