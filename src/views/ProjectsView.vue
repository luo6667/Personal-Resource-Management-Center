<template>
  <div class="projects-page">
    <div class="page-header">
      <div>
        <h1 class="page-title"><img :src="isDark ? '/image/项目集白.png' : '/image/项目集黑.png'" class="title-icon"> 项目集</h1>
        <p class="page-subtitle">展示个人作品，记录技术成长</p>
      </div>
      <button class="btn btn-primary" @click="showAddModal = true">
        <img src="/image/添加.png" class="btn-icon-img" /> 添加项目
      </button>
    </div>

    <div class="project-filters">
      <button
        v-for="filter in filters"
        :key="filter.key"
        class="filter-btn"
        :class="{ active: currentFilter === filter.key }"
        @click="currentFilter = filter.key"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="projects-grid">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card card"
      >
        <div class="project-cover" :class="'bg-' + (project.bgType || 'gradient')">
          <div v-if="project.bgType === 'gradient'" class="cover-gradient" :style="{ background: project.gradient || project.color }"></div>
          <div v-else-if="project.bgType === 'image'" class="cover-image" :style="{ backgroundImage: `url(${project.bgImage})` }"></div>
          <div v-else-if="project.bgType === 'text'" class="cover-text" :style="{ background: project.gradient || project.color }">
            <span :style="{ color: project.bgTextColor }">{{ project.bgText || project.name[0] }}</span>
          </div>
          <div v-else class="cover-gradient" :style="{ background: project.gradient || project.color }"></div>
          <div class="project-icon">{{ project.name[0] }}</div>
        </div>
        <div class="project-content">
          <div class="project-header">
            <h3 class="project-name">{{ project.name }}</h3>
            <span class="project-status" :class="'status-' + project.status">
              {{ getStatusLabel(project.status) }}
            </span>
          </div>
          <p class="project-desc">{{ project.description }}</p>
          <div class="project-tags">
            <span v-for="(tag, index) in project.tags" :key="index" class="tag">{{ tag }}</span>
          </div>
          <div class="project-footer">
            <div class="project-date">
              <span><img :src="isDark ? '/image/日历白.png' : '/image/日历黑.png'" class="icon-img" /> {{ project.date }}</span>
            </div>
            <div class="project-actions">
              <a v-if="project.github" :href="project.github" target="_blank" class="action-link">
                <span>🐙</span> 源码
              </a>
              <a v-if="project.demo" :href="project.demo" target="_blank" class="action-link">
                <img src="/image/地球.png" class="icon-img-xs" /> 演示
              </a>
              <button class="action-btn edit-btn" @click="editProject(project)">
                <img :src="isDark ? '/image/铅笔白.png' : '/image/铅笔黑.png'" class="icon-img-xs" /> 编辑
              </button>
              <button class="action-btn delete-btn" @click="showDeleteConfirm(project)">
                <img :src="isDark ? '/image/删除白.png' : '/image/删除黑.png'" class="icon-img-xs" /> 删除
              </button>
            </div>
          </div>
          <div class="project-progress">
            <div class="progress-info">
              <span>进度</span>
              <span>{{ project.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: project.progress + '%', background: project.gradient }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredProjects.length === 0" class="empty-state card">
      <img :src="isDark ? '/image/文件夹白.png' : '/image/文件夹黑.png'" class="empty-icon-img" />
      <div class="empty-text">暂无{{ getFilterLabel() }}项目</div>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content card">
        <h2 class="modal-title">{{ editingProject ? '编辑项目' : '添加新项目' }}</h2>
        <div class="form-group">
          <label>项目名称</label>
          <input v-model="projectForm.name" type="text" class="input-field" placeholder="输入项目名称...">
        </div>
        <div class="form-group">
          <label>项目描述</label>
          <textarea v-model="projectForm.description" class="input-field" rows="2" placeholder="简短描述项目..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>状态</label>
            <select v-model="projectForm.status" class="input-field">
              <option value="planning">规划中</option>
              <option value="developing">开发中</option>
              <option value="completed">已完成</option>
            </select>
          </div>
          <div class="form-group">
            <label>进度</label>
            <input v-model="projectForm.progress" type="number" min="0" max="100" class="input-field">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>GitHub链接</label>
            <input v-model="projectForm.github" type="url" class="input-field" placeholder="https://github.com/...">
          </div>
          <div class="form-group">
            <label>演示链接</label>
            <input v-model="projectForm.demo" type="url" class="input-field" placeholder="https://...">
          </div>
        </div>
        <div class="form-group">
          <label>技术标签（逗号分隔）</label>
          <input v-model="projectForm.tagsInput" type="text" class="input-field" placeholder="Vue3, TypeScript, Node.js">
        </div>
        <div class="form-group">
          <label>背景类型</label>
          <div class="bg-type-selector">
            <button
              v-for="type in bgTypes"
              :key="type.value"
              class="bg-type-btn"
              :class="{ active: projectForm.bgType === type.value }"
              @click="projectForm.bgType = type.value"
            >
              <span>{{ type.icon }}</span>
              <span>{{ type.label }}</span>
            </button>
          </div>
        </div>
        <div v-if="projectForm.bgType === 'gradient'" class="form-group">
          <label>渐变主题</label>
          <div class="color-picker">
            <button
              v-for="(color, index) in gradientOptions"
              :key="index"
              class="color-option"
              :class="{ active: projectForm.gradient === color.value }"
              :style="{ background: color.value }"
              @click="projectForm.gradient = color.value"
            ></button>
          </div>
        </div>
        <div v-if="projectForm.bgType === 'image'" class="form-group">
          <label>背景图片URL</label>
          <input v-model="projectForm.bgImage" type="url" class="input-field" placeholder="https://example.com/image.jpg">
          <div v-if="projectForm.bgImage" class="preview-image">
            <img :src="projectForm.bgImage" alt="预览" @error="projectForm.bgImage = ''">
          </div>
        </div>
        <div v-if="projectForm.bgType === 'text'" class="form-group">
          <label>背景文字</label>
          <input v-model="projectForm.bgText" type="text" class="input-field" placeholder="输入背景大字...">
          <input v-model="projectForm.bgTextColor" type="color" class="color-input" title="文字颜色">
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveProject">{{ editingProject ? '保存' : '添加' }}</button>
        </div>
      </div>
    </div>

    <!-- 删除确认模态框 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content card delete-confirm">
        <div class="delete-icon">⚠️</div>
        <h2 class="modal-title">确认删除</h2>
        <p class="delete-message">确定要删除项目 "{{ deletingProject?.name }}" 吗？此操作无法撤销。</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showDeleteModal = false">取消</button>
          <button class="btn btn-danger" @click="deleteProject">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'

export default {
  name: 'ProjectsView',
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const taskStore = useTaskStore()
    const currentFilter = ref('all')
    const showAddModal = ref(false)
    const showDeleteModal = ref(false)
    const deletingProject = ref(null)
    const editingProject = ref(null)
    
    const filters = [
      { key: 'all', label: '全部' },
      { key: 'planning', label: '规划中' },
      { key: 'developing', label: '开发中' },
      { key: 'completed', label: '已完成' }
    ]
    
    const projectForm = ref({
      name: '',
      description: '',
      status: 'planning',
      progress: 0,
      github: '',
      demo: '',
      tagsInput: '',
      bgType: 'gradient',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgImage: '',
      bgText: '',
      bgTextColor: '#667eea'
    })

    const bgTypes = [
      { value: 'gradient', label: '渐变', icon: '🎨' },
      { value: 'image', label: '图片', icon: '🖼️' },
      { value: 'text', label: '文字', icon: '📝' }
    ]

    const gradientOptions = [
      { value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', name: '紫蓝渐变' },
      { value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', name: '青绿渐变' },
      { value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', name: '粉紫渐变' },
      { value: 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)', name: '橙黄渐变' },
      { value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', name: '天蓝渐变' },
      { value: 'linear-gradient(135deg, #434343 0%, #000000 100%)', name: '深灰渐变' }
    ]

    const filteredProjects = computed(() => {
      const projects = taskStore.projects
      if (currentFilter.value === 'all') return projects
      return projects.filter(p => p.status === currentFilter.value)
    })

    const getStatusLabel = (status) => {
      const labels = { planning: '规划中', developing: '开发中', completed: '已完成' }
      return labels[status]
    }

    const getFilterLabel = () => {
      const filter = filters.find(f => f.key === currentFilter.value)
      return filter ? filter.label : ''
    }

    const closeModal = () => {
      showAddModal.value = false
      editingProject.value = null
      projectForm.value = {
        name: '',
        description: '',
        status: 'planning',
        progress: 0,
        github: '',
        demo: '',
        tagsInput: '',
        bgType: 'gradient',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        bgImage: '',
        bgText: '',
        bgTextColor: '#667eea'
      }
    }

    const editProject = (project) => {
      editingProject.value = project
      projectForm.value = {
        ...project,
        tagsInput: project.tags ? project.tags.join(',') : '',
        bgType: project.bgType || 'gradient',
        gradient: project.gradient || project.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        bgImage: project.bgImage || '',
        bgText: project.bgText || '',
        bgTextColor: project.bgTextColor || '#667eea'
      }
      showAddModal.value = true
    }

    const saveProject = () => {
      if (!projectForm.value.name) return
      
      const projectData = {
        ...projectForm.value,
        tags: projectForm.value.tagsInput.split(',').map(t => t.trim()).filter(t => t),
        color: projectForm.value.gradient,
        date: editingProject.value ? editingProject.value.date : new Date().toISOString().slice(0, 7)
      }
      delete projectData.tagsInput

      if (editingProject.value) {
        taskStore.updateProject(editingProject.value.id, projectData)
      } else {
        taskStore.addProject(projectData)
      }
      closeModal()
    }

    const showDeleteConfirm = (project) => {
      deletingProject.value = project
      showDeleteModal.value = true
    }

    const deleteProject = () => {
      if (deletingProject.value) {
        taskStore.deleteProject(deletingProject.value.id)
        showDeleteModal.value = false
        deletingProject.value = null
      }
    }

    return {
      currentFilter,
      showAddModal,
      showDeleteModal,
      deletingProject,
      editingProject,
      filters,
      projectForm,
      filteredProjects,
      getStatusLabel,
      getFilterLabel,
      closeModal,
      editProject,
      saveProject,
      showDeleteConfirm,
      deleteProject
    }
  }
}
</script>

<style scoped>
.projects-page {
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

.project-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 30px;
}

.filter-btn {
  padding: 8px 18px;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover,
.filter-btn.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.project-card {
  padding: 0;
  overflow: hidden;
}

.project-content {
  padding: 20px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.project-name {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.project-status {
  font-size: 11px;
  padding: 3px 10px;
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

.project-desc {
  font-size: 13px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 14px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project-date {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-img {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.title-icon {
  width: 28px;
  height: 28px;
  margin-right: 10px;
  vertical-align: middle;
}

.icon-img-xs {
  width: 16px;
  height: 16px;
  object-fit: contain;
  margin-right: 4px;
}

.btn-icon-img {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  vertical-align: middle;
}

.project-actions {
  display: flex;
  gap: 12px;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #667eea;
  transition: opacity 0.3s;
}

.action-link:hover {
  opacity: 0.7;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #667eea;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
}

.action-btn:hover {
  opacity: 0.7;
}

.delete-btn {
  color: #ff6b6b;
}

.delete-confirm {
  text-align: center;
}

.delete-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.delete-message {
  color: #888;
  margin-bottom: 20px;
}

.bg-type-selector {
  display: flex;
  gap: 8px;
}

.bg-type-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid transparent;
  border-radius: 8px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.bg-type-btn:hover {
  background: rgba(102, 126, 234, 0.2);
}

.bg-type-btn.active {
  background: rgba(102, 126, 234, 0.2);
  border-color: #667eea;
  color: #667eea;
}

.color-picker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #fff;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.5);
}

.color-input {
  width: 100%;
  height: 40px;
  margin-top: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.preview-image {
  margin-top: 12px;
  max-height: 150px;
  overflow: hidden;
  border-radius: 8px;
  border: 2px dashed rgba(102, 126, 234, 0.3);
}

.preview-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.project-cover {
  position: relative;
  height: 120px;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.cover-gradient,
.cover-image,
.cover-text {
  position: absolute;
  inset: 0;
}

.cover-image {
  background-size: cover;
  background-position: center;
}

.cover-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-text span {
  font-size: 48px;
  font-weight: bold;
  opacity: 0.3;
  text-transform: uppercase;
}

.project-icon {
  position: relative;
  z-index: 1;
  position: absolute;
  bottom: 12px;
  left: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  border-radius: 10px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.project-progress {
  padding-top: 14px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-icon-img {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  object-fit: contain;
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
  max-width: 560px;
  padding: 32px;
}

.modal-title {
  font-size: 22px;
  color: white;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

textarea.input-field {
  resize: vertical;
  min-height: 60px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

/* 浅色模式样式 */
.light-mode .project-name {
  color: #1e293b;
}

.light-mode .project-desc {
  color: #64748b;
}

.light-mode .project-date {
  color: #64748b;
}

.light-mode .modal-title {
  color: #1e293b;
}

.light-mode .filter-btn {
  background: rgba(241, 245, 249, 0.8);
  border-color: #e2e8f0;
  color: #64748b;
}

.light-mode .filter-btn:hover,
.light-mode .filter-btn.active {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.light-mode .form-group label {
  color: #64748b;
}

.light-mode .empty-text {
  color: #64748b;
}

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
}

.btn-danger:hover {
  opacity: 0.9;
}

</style>