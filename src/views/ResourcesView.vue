<template>
  <div class="resources-page" :class="{ 'light-mode': !isDark }">
    <div class="page-header">
      <div>
        <h1 class="page-title"><img :src="isDark ? '/image/书-堆叠白.png' : '/image/书-堆叠黑.png'" style="width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; object-fit: contain;"> 学习资源</h1>
        <p class="page-subtitle">收藏整理开发资源，让学习更高效</p>
      </div>
      <button class="btn btn-primary" @click="showAddModal = true">
        <img src="/image/添加.png" style="width: 12px; height: 12px; margin-right: 5px; vertical-align: middle; object-fit: contain;" /> 添加资源
      </button>
    </div>

    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="tab-btn"
        :class="{ active: currentCategory === cat.key }"
        @click="currentCategory = cat.key"
      >
        <template v-if="cat.icon === '📁'">
          <img :src="isDark ? '/image/文件夹白.png' : '/image/文件夹黑.png'" style="width: 12px; height: 12px; margin-right: 5px; vertical-align: middle; object-fit: contain;" />
        </template>
        <template v-else-if="cat.icon === '🌐'">
          <img src="/image/地球.png" style="width: 12px; height: 12px; margin-right: 5px; vertical-align: middle; object-fit: contain;" />
        </template>
        <template v-else-if="cat.icon === '📦'">
          <img src="/image/包装盒.png" style="width: 12px; height: 12px; margin-right: 5px; vertical-align: middle; object-fit: contain;" />
        </template>
        <span v-else>{{ cat.icon }}</span>
        {{ cat.label }}
      </button>
    </div>

    <div class="resources-grid">
      <a
        v-for="resource in filteredResources"
        :key="resource.id"
        :href="resource.url"
        target="_blank"
        class="resource-card card"
      >
        <div class="resource-header">
          <div class="resource-logo" :style="{ background: resource.color || resource.bgColor }">
            {{ resource.logo }}
          </div>
          <div class="resource-actions">
            <button class="action-btn edit-btn" @click.prevent="editResource(resource)" title="编辑"><img :src="isDark ? '/image/铅笔白.png' : '/image/铅笔黑.png'" class="icon-img-xs" /></button>
            <button class="action-btn delete-btn" @click.prevent="deleteResource(resource)" title="删除"><img :src="isDark ? '/image/删除白.png' : '/image/删除黑.png'" class="icon-img-xs" /></button>
            <button class="favorite-btn" :class="{ active: resource.favorited }" @click.prevent="toggleFavorite(resource)">
              <img :src="resource.favorited ? '/image/红心.png' : (isDark ? '/image/空心夜间.png' : '/image/空心浅色.png')" class="favorite-icon" />
            </button>
          </div>
        </div>
        <h3 class="resource-name">{{ resource.name }}</h3>
        <p class="resource-desc">{{ resource.description }}</p>
        <div class="resource-tags">
          <span class="tag category-tag">{{ resource.category }}</span>
        </div>
        <div class="resource-footer">
          <span class="resource-category">{{ resource.category }}</span>
          <span class="resource-date">{{ resource.date }}</span>
        </div>
      </a>
    </div>

    <div v-if="filteredResources.length === 0" class="empty-state card">
      <div class="empty-icon">📭</div>
      <div class="empty-text">暂无相关资源</div>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content card">
        <h2 class="modal-title">{{ editingResource ? '编辑资源' : '添加新资源' }}</h2>
        <div class="form-group">
          <label>资源名称</label>
          <input v-model="resourceForm.name" type="text" class="input-field" placeholder="输入资源名称...">
        </div>
        <div class="form-group">
          <label>资源链接</label>
          <input v-model="resourceForm.url" type="url" class="input-field" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>资源描述</label>
          <textarea v-model="resourceForm.description" class="input-field" rows="2" placeholder="简短描述..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>分类</label>
            <select v-model="resourceForm.category" class="input-field">
              <option value="前端">前端</option>
              <option value="后端">后端</option>
              <option value="算法">算法</option>
              <option value="工具">工具</option>
              <option value="学习社区">学习社区</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div class="form-group">
            <label>标签</label>
            <input v-model="resourceForm.tagInput" type="text" class="input-field" placeholder="输入标签后回车">
          </div>
        </div>
        <div class="tag-list" v-if="resourceForm.tags.length">
          <span v-for="(tag, index) in resourceForm.tags" :key="index" class="tag" @click="removeTag(index)">
            {{ tag }} ×
          </span>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveResource">
            {{ editingResource ? '保存' : '添加' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content card delete-confirm">
        <div class="delete-icon">⚠️</div>
        <h2 class="modal-title">确认删除</h2>
        <p class="delete-message">确定要删除资源 "{{ deletingResource?.name }}" 吗？此操作无法撤销。</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showDeleteModal = false">取消</button>
          <button class="btn btn-danger" @click="confirmDelete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'

export default {
  name: 'ResourcesView',
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const taskStore = useTaskStore()
    const currentCategory = ref('all')
    const showAddModal = ref(false)
    const editingResource = ref(null)
    const showDeleteModal = ref(false)
    const deletingResource = ref(null)
    
    const defaultCategories = {
      '前端': { icon: '⚛️', key: 'frontend' },
      '后端': { icon: '�', key: 'backend' },
      '算法': { icon: '🧮', key: 'algorithm' },
      '工具': { icon: '🛠️', key: 'tools' },
      '学习社区': { icon: '🌐', key: 'community' },
      '其他': { icon: '📁', key: 'other' }
    }

    // 关键字分类映射
    const categoryKeywords = {
      '前端': ['前端', 'frontend', 'vue', 'react', 'angular', 'javascript', 'typescript', 'html', 'css', 'css3', 'webpack', 'vite', 'es6', 'node', 'npm', 'yarn', 'tailwind', 'sass', 'less', 'dom', 'axios', 'fetch'],
      '后端': ['后端', 'backend', 'server', 'java', 'python', 'go', 'golang', 'spring', 'django', 'flask', 'express', 'koa', 'mysql', 'postgresql', 'mongodb', 'redis', 'api', 'restful', 'graphql'],
      '算法': ['算法', 'algorithm', '数据结构', 'datastructure', 'leetcode', '排序', '搜索', '树', '图', '动态规划', 'dp', '贪心', '递归', '复杂度', '哈希'],
      '工具': ['工具', 'tool', 'git', 'github', 'gitlab', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'nginx', 'linux', 'shell', 'terminal', '编辑器', 'vscode', 'idea'],
      '学习社区': ['社区', 'community', '博客', 'blog', '论坛', 'forum', 'github', '开源', 'opensource', '教程', 'tutorial', '文档', 'docs', '课程', 'course', '视频', 'video']
    }

    // 根据关键字自动分类
    const getCategoryByKeywords = (text) => {
      if (!text) return '其他'
      const lowerText = text.toLowerCase()
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))) {
          return category
        }
      }
      return '其他'
    }
    
    const categories = computed(() => {
      const allCategories = new Set()
      taskStore.resources.forEach(resource => {
        if (resource.category) {
          allCategories.add(resource.category)
        }
      })
      
      // 确保"其他"分类始终存在
      allCategories.add('其他')
      
      const result = [
        { key: 'all', icon: '📦', label: '全部' }
      ]
      
      Array.from(allCategories).forEach(cat => {
        const defaultInfo = defaultCategories[cat]
        result.push({
          key: defaultInfo?.key || cat.toLowerCase().replace(/\s+/g, '-'),
          icon: defaultInfo?.icon || '📁',
          label: cat
        })
      })
      
      return result
    })
    
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)'
    ]
    
    const resourceForm = ref({
      name: '',
      url: '',
      description: '',
      category: '前端',
      tags: [],
      tagInput: ''
    })

    const filteredResources = computed(() => {
      const resources = taskStore.resources
      if (currentCategory.value === 'all') {
        return resources
      }
      const categoryLabel = categories.value.find(cat => cat.key === currentCategory.value)?.label
      return resources.filter(r => r.category === categoryLabel)
    })

    const editResource = (resource) => {
      editingResource.value = resource
      resourceForm.value = {
        name: resource.name,
        url: resource.url,
        description: resource.description,
        category: resource.category,
        tags: resource.tags || [],
        tagInput: ''
      }
      showAddModal.value = true
    }

    const toggleFavorite = (resource) => {
      taskStore.updateResource(resource.id, { favorited: !resource.favorited })
    }

    const deleteResource = (resource) => {
      deletingResource.value = resource
      showDeleteModal.value = true
    }

    const confirmDelete = () => {
      if (deletingResource.value) {
        taskStore.deleteResource(deletingResource.value.id)
      }
      showDeleteModal.value = false
      deletingResource.value = null
    }

    const saveResource = () => {
      if (!resourceForm.value.name.trim()) return
      
      // 根据名称和描述自动分类
      const autoCategory = getCategoryByKeywords(resourceForm.value.name + ' ' + resourceForm.value.description)
      
      const resourceData = {
        name: resourceForm.value.name,
        url: resourceForm.value.url,
        description: resourceForm.value.description,
        category: editingResource.value ? resourceForm.value.category : autoCategory,
        tags: resourceForm.value.tags,
        color: editingResource.value ? editingResource.value.color : gradients[Math.floor(Math.random() * gradients.length)],
        logo: resourceForm.value.name[0],
        date: editingResource.value ? editingResource.value.date : new Date().toISOString().slice(0, 7),
        favorited: editingResource.value ? editingResource.value.favorited : false
      }

      if (editingResource.value) {
        taskStore.updateResource(editingResource.value.id, resourceData)
      } else {
        taskStore.addResource(resourceData)
      }
      closeModal()
    }

    const removeTag = (index) => {
      resourceForm.value.tags.splice(index, 1)
    }

    const closeModal = () => {
      showAddModal.value = false
      editingResource.value = null
      resourceForm.value = {
        name: '',
        url: '',
        description: '',
        category: '前端',
        tags: [],
        tagInput: ''
      }
    }

    // 监听tagInput
    const handleTagInput = () => {
      const val = resourceForm.value.tagInput
      if (val && (val.includes(',') || val.includes('回车'))) {
        const tag = val.replace(',', '').replace('回车', '').trim()
        if (tag && !resourceForm.value.tags.includes(tag)) {
          resourceForm.value.tags.push(tag)
        }
        resourceForm.value.tagInput = ''
      }
    }

    return {
      currentCategory,
      showAddModal,
      editingResource,
      showDeleteModal,
      deletingResource,
      categories,
      resourceForm,
      filteredResources,
      editResource,
      toggleFavorite,
      deleteResource,
      confirmDelete,
      saveResource,
      removeTag,
      closeModal,
      handleTagInput
    }
  },
  watch: {
    'resourceForm.tagInput'(val) {
      if (val && (val.includes(',') || val.includes('回车'))) {
        const tag = val.replace(',', '').replace('回车', '').trim()
        if (tag && !this.resourceForm.tags.includes(tag)) {
          this.resourceForm.tags.push(tag)
        }
        this.resourceForm.tagInput = ''
      }
    }
  }
}
</script>

<style scoped>
.resources-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 10px 18px;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 10px;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn:hover,
.tab-btn.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
}

.light-mode .tab-btn {
  background: rgba(255, 255, 255, 0.8);
  border-color: #e2e8f0;
  color: #64748b;
}

.light-mode .tab-btn:hover,
.light-mode .tab-btn.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
}

.light-mode .tab-btn {
  background: rgba(255, 255, 255, 0.8);
  border-color: #e2e8f0;
  color: #64748b;
}

.light-mode .tab-btn:hover,
.light-mode .tab-btn.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
}

.light-mode .tab-btn {
  background: rgba(255, 255, 255, 0.8);
  border-color: #e2e8f0;
  color: #64748b;
}

.light-mode .tab-btn:hover,
.light-mode .tab-btn.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.resource-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-decoration: none;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.light-mode .resource-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-color: #e2e8f0;
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.resource-logo {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.resource-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(26, 26, 46, 0.8);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;

.light-mode .action-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #cbd5e1;
}

.light-mode .action-btn:hover {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.2);
}

.light-mode .delete-btn:hover {
  background: rgba(255, 65, 108, 0.15);
  border-color: rgba(255, 65, 108, 0.2);
}

.btn.btn-primary img.btn-icon-img {
  width: 14px !important;
  height: 14px !important;
  margin-right: 6px;
  vertical-align: middle;
  object-fit: contain;
}

.tab-icon-img {
  width: 12px;
  height: 12px;
  margin-right: 5px;
  vertical-align: middle;
  object-fit: contain;
}

.page-title img.page-title-icon {
  width: 24px !important;
  height: 24px !important;
  margin-right: 10px;
  vertical-align: middle;
  object-fit: contain;
}

.light-mode .action-btn {
  background: rgba(203, 213, 224, 0.8);
}

.light-mode .action-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.light-mode .delete-btn:hover {
  background: rgba(255, 65, 108, 0.1);
}

.light-mode .action-btn {
  background: rgba(203, 213, 224, 0.8);
}

.light-mode .action-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.light-mode .delete-btn:hover {
  background: rgba(255, 65, 108, 0.1);
}
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  transform: scale(1.1);
  background: rgba(102, 126, 234, 0.2);
}

.delete-btn:hover {
  background: rgba(255, 65, 108, 0.2);
}

.icon-img-xs {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.favorite-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

/* 浅色模式样式 */
.light-mode .tab-btn {
  background: rgba(255, 255, 255, 0.8);
  border-color: #e2e8f0;
  color: #64748b;
}

.light-mode .tab-btn:hover,
.light-mode .tab-btn.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: rgba(102, 126, 234, 0.3);
}

.light-mode .action-btn {
  background: rgba(203, 213, 224, 0.8);
}

.light-mode .action-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.light-mode .delete-btn:hover {
  background: rgba(255, 65, 108, 0.1);
}

/* 浅色模式样式 */
.light-mode .tab-btn {
  background: rgba(255, 255, 255, 0.8);
  border-color: #e2e8f0;
  color: #64748b;
}

.light-mode .tab-btn:hover,
.light-mode .tab-btn.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: rgba(102, 126, 234, 0.3);
}

.light-mode .action-btn {
  background: rgba(203, 213, 224, 0.8);
}

.light-mode .action-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.light-mode .delete-btn:hover {
  background: rgba(255, 65, 108, 0.1);
}

/* 浅色模式样式 */
.light-mode .tab-btn {
  background: rgba(255, 255, 255, 0.8);
  border-color: #e2e8f0;
  color: #64748b;
}

.light-mode .tab-btn:hover,
.light-mode .tab-btn.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: rgba(102, 126, 234, 0.3);
}

.light-mode .action-btn {
  background: rgba(209, 217, 224, 0.8);
}

.light-mode .action-btn:hover {
  background: rgba(102, 126, 234, 0.1);
}

.light-mode .delete-btn:hover {
  background: rgba(255, 65, 108, 0.1);
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 4px;
}

.favorite-btn:hover {
  transform: scale(1.2);
}

.favorite-btn.active {
  animation: heartBeat 0.3s ease;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.resource-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.light-mode .resource-name {
  color: #1e293b;
}

.resource-desc {
  font-size: 13px;
  color: #888;
  margin: 0;
  line-height: 1.5;
}

.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 11px;
  padding: 4px 10px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 12px;
}

.resource-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.resource-category {
  font-size: 12px;
  color: #667eea;
}

.resource-date {
  font-size: 12px;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #888;
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
  max-width: 500px;
  padding: 32px;
}

.modal-title {
  font-size: 22px;
  color: white;
  margin-bottom: 24px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag-list .tag {
  cursor: pointer;
  transition: all 0.2s;
}

.tag-list .tag:hover {
  background: rgba(255, 65, 108, 0.2);
  color: #ff416c;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>