<template>
  <div class="todos-page">
    <div class="page-header">
      <div>
        <h1 class="page-title"><img :src="isDark ? '/image/待办白.png' : '/image/待办黑.png'" style="width: 24px; height: 24px; margin-right: 10px; vertical-align: middle; object-fit: contain;"> 待办事项</h1>
        <p class="page-subtitle">规划你的每一天，让生活更有条理</p>
      </div>
      <button class="btn btn-primary" @click="showAddModal = true">
        <img src="/image/添加.png" class="btn-icon-img" /> 新增任务
      </button>
    </div>

    <div class="todo-filters">
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

    <div class="todo-stats">
      <div class="stat-item">
        <span class="stat-label">待完成</span>
        <span class="stat-value pending">{{ pendingCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">进行中</span>
        <span class="stat-value progress">{{ inProgressCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">已完成</span>
        <span class="stat-value completed">{{ completedCount }}</span>
      </div>
    </div>

    <transition-group name="slide-up" tag="div" class="todo-list">
      <div v-for="task in filteredTasks" :key="task.id" class="todo-item card">
        <div class="todo-main">
          <div
            class="todo-checkbox"
            :class="{ checked: task.completed }"
            @click="toggleTask(task)"
          >
            <span v-if="task.completed">✓</span>
          </div>
          <div class="todo-content">
            <h3 class="todo-title" :class="{ completed: task.completed }">{{ task.title }}</h3>
            <p class="todo-desc">{{ task.description }}</p>
            <div class="todo-meta">
              <span class="todo-date"><img :src="isDark ? '/image/日历白.png' : '/image/日历黑.png'" class="icon-img" /> {{ task.date }}</span>
              <span class="todo-priority" :class="'priority-' + task.priority">
                {{ getPriorityLabel(task.priority) }}
              </span>
              <span v-if="task.category" class="todo-category">
                🏷️ {{ task.category }}
              </span>
            </div>
          </div>
        </div>
        <div class="todo-actions">
          <button
            v-if="!task.completed"
            class="action-btn progress-btn"
            :class="{ active: task.inProgress }"
            @click="toggleProgress(task)"
            :title="task.inProgress ? '暂停任务' : '开始执行任务'"
          >
            <span>{{ task.inProgress ? '⏸️' : '▶️' }}</span>
            <span class="btn-text">{{ task.inProgress ? '进行中' : '开始' }}</span>
          </button>
          <button class="action-btn edit" @click="editTask(task)" title="编辑"><img :src="isDark ? '/image/铅笔白.png' : '/image/铅笔黑.png'" class="icon-img-xs" /></button>
          <button class="action-btn delete" @click="showDeleteConfirm(task)" title="删除"><img :src="isDark ? '/image/删除白.png' : '/image/删除黑.png'" class="icon-img-xs" /></button>
        </div>
      </div>
    </transition-group>

    <div v-if="filteredTasks.length === 0" class="empty-state card">
      <div class="empty-icon">🎉</div>
      <div class="empty-text">暂无{{ getFilterLabel() }}任务</div>
    </div>

    <!-- 删除确认模态框 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content card delete-confirm">
        <div class="delete-icon">⚠️</div>
        <h2 class="modal-title">确认删除</h2>
        <p class="delete-message">确定要删除任务 "{{ deletingTask?.title }}" 吗？此操作无法撤销。</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showDeleteModal = false">取消</button>
          <button class="btn btn-danger" @click="deleteTask">确认删除</button>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content card">
        <h2 class="modal-title">{{ editingTask ? '编辑任务' : '新增任务' }}</h2>
        <div class="form-group">
          <label>任务标题</label>
          <input
            v-model="taskForm.title"
            type="text"
            class="input-field"
            placeholder="输入任务标题..."
          >
        </div>
        <div class="form-group">
          <label>任务描述</label>
          <textarea
            v-model="taskForm.description"
            class="input-field"
            rows="3"
            placeholder="输入任务描述..."
          ></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>优先级</label>
            <select v-model="taskForm.priority" class="input-field">
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>
          <div class="form-group">
            <label>分类</label>
            <select v-model="taskForm.category" class="input-field">
              <option value="">无</option>
              <option value="工作">工作</option>
              <option value="学习">学习</option>
              <option value="生活">生活</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>截止日期</label>
          <input v-model="taskForm.date" type="date" class="input-field">
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveTask">
            {{ editingTask ? '保存' : '添加' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'

export default {
  name: 'TodosView',
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const taskStore = useTaskStore()
    const showAddModal = ref(false)
    const showDeleteModal = ref(false)
    const deletingTask = ref(null)
    const editingTask = ref(null)
    const currentFilter = ref('all')
    const filters = [
      { key: 'all', label: '全部' },
      { key: 'pending', label: '待完成' },
      { key: 'progress', label: '进行中' },
      { key: 'completed', label: '已完成' }
    ]
    const taskForm = ref({
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      date: new Date().toISOString().split('T')[0]
    })

    const filteredTasks = computed(() => {
      const tasks = taskStore.tasks
      switch (currentFilter.value) {
        case 'pending':
          return tasks.filter(t => !t.completed && !t.inProgress)
        case 'progress':
          return tasks.filter(t => t.inProgress)
        case 'completed':
          return tasks.filter(t => t.completed)
        default:
          return tasks
      }
    })

    const pendingCount = computed(() => taskStore.pendingCount)
    const inProgressCount = computed(() => taskStore.inProgressCount)
    const completedCount = computed(() => taskStore.completedCount)

    const toggleTask = (task) => {
      taskStore.toggleTask(task)
    }

    const toggleProgress = (task) => {
      taskStore.toggleProgress(task)
    }

    const showDeleteConfirm = (task) => {
      deletingTask.value = task
      showDeleteModal.value = true
    }

    const deleteTask = () => {
      if (deletingTask.value) {
        taskStore.deleteTask(deletingTask.value.id)
        showDeleteModal.value = false
        deletingTask.value = null
      }
    }

    const editTask = (task) => {
      editingTask.value = task
      taskForm.value = { ...task }
      showAddModal.value = true
    }

    const closeModal = () => {
      showAddModal.value = false
      editingTask.value = null
      taskForm.value = {
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        date: new Date().toISOString().split('T')[0]
      }
    }

    const saveTask = () => {
      if (!taskForm.value.title.trim()) return

      if (editingTask.value) {
        taskStore.updateTask(editingTask.value.id, taskForm.value)
      } else {
        taskStore.addTask(taskForm.value)
      }
      closeModal()
    }

    const getPriorityLabel = (priority) => {
      const labels = { high: '高', medium: '中', low: '低' }
      return labels[priority]
    }

    const getFilterLabel = () => {
      const filter = filters.find(f => f.key === currentFilter.value)
      return filter ? filter.label : ''
    }

    return {
      showAddModal,
      showDeleteModal,
      deletingTask,
      editingTask,
      currentFilter,
      filters,
      taskForm,
      filteredTasks,
      pendingCount,
      inProgressCount,
      completedCount,
      toggleTask,
      toggleProgress,
      showDeleteConfirm,
      deleteTask,
      editTask,
      closeModal,
      saveTask,
      getPriorityLabel,
      getFilterLabel
    }
  }
}
</script>

<style scoped>
.todos-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.todo-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.filter-btn {
  padding: 8px 16px;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover,
.filter-btn.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
}

.todo-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(26, 26, 46, 0.5);
  border-radius: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-label {
  font-size: 14px;
  color: #888;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
}

.stat-value.pending {
  color: #ff416c;
}

.stat-value.progress {
  color: #ffc13c;
}

.stat-value.completed {
  color: #38ef7d;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.todo-main {
  display: flex;
  gap: 16px;
  flex: 1;
}

.todo-checkbox {
  width: 26px;
  height: 26px;
  border: 2px solid #4a4a6a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
  margin-top: 4px;
}

.todo-checkbox:hover {
  border-color: #667eea;
}

.todo-checkbox.checked {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  color: white;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 6px;
}

.todo-title.completed {
  text-decoration: line-through;
  color: #666;
}

.todo-desc {
  font-size: 13px;
  color: #888;
  margin-bottom: 10px;
}

.todo-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.todo-date,
.todo-category {
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

.icon-img-xs {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.btn-icon-img {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  vertical-align: middle;
}

.todo-priority {
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

.todo-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: rgba(26, 26, 46, 0.8);
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(102, 126, 234, 0.2);
}

.action-btn.active {
  background: rgba(255, 193, 60, 0.2);
}

.action-btn.delete:hover {
  background: rgba(255, 65, 108, 0.2);
}

.action-btn.progress-btn {
  width: auto;
  padding: 0 12px;
  gap: 6px;
  font-size: 12px;
}

.action-btn.progress-btn .btn-text {
  font-size: 12px;
  color: #888;
}

.action-btn.progress-btn.active .btn-text {
  color: #ffc13c;
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
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
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

.btn-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
}

.btn-danger:hover {
  opacity: 0.9;
}

/* 浅色模式样式 */
.light-mode .todo-title {
  color: #1e293b;
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

.light-mode .todo-stats {
  background: rgba(241, 245, 249, 0.5);
}

.light-mode .stat-label {
  color: #64748b;
}

.light-mode .action-btn {
  background: rgba(241, 245, 249, 0.8);
}

.light-mode .empty-text {
  color: #64748b;
}

.light-mode .form-group label {
  color: #64748b;
}

</style>