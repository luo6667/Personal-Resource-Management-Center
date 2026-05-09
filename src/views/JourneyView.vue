<template>
  <div class="journey-page">
    <div class="page-header">
      <h1 class="page-title"><img :src="isDark ? '/image/折线图白.png' : '/image/折线图黑.png'" class="page-title-icon"> 个人历程</h1>
      <p class="page-subtitle">记录成长的每一步，见证蜕变的过程</p>
    </div>

    <div class="section-header timeline-header">
      <h2 class="section-title"><img :src="isDark ? '/image/折线图白.png' : '/image/折线图黑.png'" class="title-icon"> 个人历程</h2>
      <button class="btn btn-primary" @click="showJourneyModal()">
        <span class="btn-icon">+</span>
        添加历程
      </button>
    </div>
    <div class="journey-timeline">
      <div class="timeline-line"></div>
      <div
        v-for="(item, index) in journeyData"
        :key="item.id || index"
        class="timeline-item"
        :class="{ 'item-right': index % 2 !== 0 }"
      >
        <div class="timeline-dot" :style="{ background: item.color }">
          <span>{{ item.icon }}</span>
        </div>
        <div class="timeline-content card">
          <div class="timeline-actions">
            <button class="icon-btn" @click="editJourneyItem(item)"><img :src="isDark ? '/image/铅笔白.png' : '/image/铅笔黑.png'" class="icon-img-xs" /></button>
            <button class="icon-btn delete" @click="deleteJourneyItem(item.id)"><img :src="isDark ? '/image/删除白.png' : '/image/删除黑.png'" class="icon-img-xs" /></button>
          </div>
          <div class="timeline-period">{{ item.period }}</div>
          <h3 class="timeline-title">{{ item.title }}</h3>
          <p class="timeline-desc">{{ item.description }}</p>
          <div class="timeline-tags">
            <span v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="skills-section">
      <div class="section-header">
        <h2 class="section-title"><img src="/image/飞镖.png" class="title-icon"> 技能树</h2>
        <button class="btn btn-primary" @click="showSkillModal()">
          <span class="btn-icon">+</span>
          添加技能
        </button>
      </div>
      <div class="skills-grid">
        <div v-for="skill in skills" :key="skill.id" class="skill-card card">
          <div class="skill-header">
            <span class="skill-icon">{{ skill.icon }}</span>
            <span class="skill-name">{{ skill.name }}</span>
            <div class="skill-actions">
              <button class="icon-btn" @click="editSkill(skill)"><img :src="isDark ? '/image/铅笔白.png' : '/image/铅笔黑.png'" class="icon-img-xs" /></button>
              <button class="icon-btn delete" @click="deleteSkill(skill.id)"><img :src="isDark ? '/image/删除白.png' : '/image/删除黑.png'" class="icon-img-xs" /></button>
            </div>
          </div>
          <div class="skill-bar-container">
            <input
              type="range"
              :value="skill.level"
              min="0"
              max="100"
              @input="updateSkillLevel(skill.id, $event.target.value)"
              class="skill-slider"
            />
            <div class="skill-bar">
              <div
                class="skill-fill"
                :style="{ width: skill.level + '%', background: skill.color }"
              ></div>
            </div>
          </div>
          <span class="skill-percent">{{ skill.level }}%</span>
        </div>
      </div>
    </div>

    <div class="goals-section">
      <div class="section-header">
        <h2 class="section-title"><img src="/image/飞镖.png" class="title-icon"> 目标规划</h2>
        <button class="btn btn-primary" @click="showGoalModal()">
          <span class="btn-icon">+</span>
          添加目标
        </button>
      </div>
      <div class="goals-list">
        <div v-for="goal in journeyGoals" :key="goal.id" class="goal-card card">
          <div class="goal-header">
            <div>
              <h3 class="goal-title">{{ goal.title }}</h3>
              <p class="goal-period">{{ goal.period }}</p>
            </div>
            <div class="goal-actions">
              <span class="goal-status" :class="'status-' + goal.status">
                {{ getStatusLabel(goal.status) }}
              </span>
              <button class="icon-btn" @click="editGoal(goal)"><img :src="isDark ? '/image/铅笔白.png' : '/image/铅笔黑.png'" class="icon-img-xs" /></button>
              <button class="icon-btn delete" @click="deleteGoal(goal.id)"><img :src="isDark ? '/image/删除白.png' : '/image/删除黑.png'" class="icon-img-xs" /></button>
            </div>
          </div>
          <p class="goal-desc">{{ goal.description }}</p>
          <div class="goal-progress">
            <div class="progress-info">
              <span>进度</span>
              <span>{{ goal.progress }}%</span>
            </div>
            <input
              type="range"
              :value="goal.progress"
              min="0"
              max="100"
              @input="updateGoalProgress(goal.id, $event.target.value)"
              class="progress-slider"
            />
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: goal.progress + '%', background: goal.color }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能编辑弹窗 -->
    <div v-if="isSkillModalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingSkill ? '编辑技能' : '添加技能' }}</h3>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>图标</label>
            <input type="text" v-model="skillForm.icon" class="input-field" placeholder="输入emoji或icon" />
          </div>
          <div class="form-group">
            <label>技能名称</label>
            <input type="text" v-model="skillForm.name" class="input-field" placeholder="例如：Vue.js" />
            <span v-if="skillError" class="error-hint">{{ skillError }}</span>
          </div>
          <div class="form-group">
            <label>掌握程度 (0-100)</label>
            <input type="number" v-model.number="skillForm.level" min="0" max="100" class="input-field" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveSkill">保存</button>
        </div>
      </div>
    </div>

    <!-- 历程编辑弹窗 -->
    <div v-if="isJourneyModalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingJourneyItem ? '编辑历程' : '添加历程' }}</h3>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>图标</label>
            <input type="text" v-model="journeyForm.icon" class="input-field" placeholder="例如：📚" />
          </div>
          <div class="form-group">
            <label>时间周期</label>
            <input type="text" v-model="journeyForm.period" class="input-field" placeholder="例如：2022.09 - 2026.06" />
            <span v-if="journeyPeriodError" class="error-hint">{{ journeyPeriodError }}</span>
          </div>
          <div class="form-group">
            <label>标题</label>
            <input type="text" v-model="journeyForm.title" class="input-field" placeholder="例如：大学本科" />
            <span v-if="journeyTitleError" class="error-hint">{{ journeyTitleError }}</span>
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="journeyForm.description" class="input-field" rows="3" placeholder="描述这个历程..."></textarea>
          </div>
          <div class="form-group">
            <label>标签 (用逗号分隔)</label>
            <input type="text" v-model="journeyForm.tagsInput" class="input-field" placeholder="例如：计算机基础,数据结构,算法" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveJourneyItem">保存</button>
        </div>
      </div>
    </div>
    <!-- 目标编辑弹窗 -->
    <div v-if="isGoalModalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingGoal ? '编辑目标' : '添加目标' }}</h3>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>目标标题</label>
            <input type="text" v-model="goalForm.title" class="input-field" placeholder="例如：2024年度目标" />
            <span v-if="goalTitleError" class="error-hint">{{ goalTitleError }}</span>
          </div>
          <div class="form-group">
            <label>时间周期</label>
            <input type="text" v-model="goalForm.period" class="input-field" placeholder="例如：2024.01 - 2024.12" />
          </div>
          <div class="form-group">
            <label>目标描述</label>
            <textarea v-model="goalForm.description" class="input-field" rows="3" placeholder="描述这个目标..."></textarea>
          </div>
          <div class="form-group">
            <label>进度 (0-100)</label>
            <input type="number" v-model.number="goalForm.progress" min="0" max="100" class="input-field" />
          </div>
          <div class="form-group">
            <label>状态</label>
            <select v-model="goalForm.status" class="input-field">
              <option value="planning">规划中</option>
              <option value="progress">进行中</option>
              <option value="completed">已完成</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveGoal">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const skillColors = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #11998e, #38ef7d)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #42b883, #354a95)',
  'linear-gradient(135deg, #61dafb, #20232a)',
  'linear-gradient(135deg, #ffd43b, #306998)'
]

export default {
  name: 'JourneyView',
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const store = useTaskStore()

    const journeyData = computed(() => store.journeyData)
    const skills = computed(() => store.skills)
    const journeyGoals = computed(() => store.journeyGoals)

    const isSkillModalVisible = ref(false)
    const isGoalModalVisible = ref(false)
    const isJourneyModalVisible = ref(false)
    const editingSkill = ref(null)
    const editingGoal = ref(null)
    const editingJourneyItem = ref(null)

    const skillError = ref('')
    const goalTitleError = ref('')
    const journeyTitleError = ref('')
    const journeyPeriodError = ref('')

    const skillForm = ref({
      icon: '💻',
      name: '',
      level: 50,
      color: skillColors[0]
    })

    const goalForm = ref({
      title: '',
      period: '',
      description: '',
      progress: 0,
      status: 'planning',
      color: skillColors[0]
    })

    const journeyForm = ref({
      icon: '📚',
      period: '',
      title: '',
      description: '',
      tagsInput: '',
      tags: [],
      color: skillColors[0]
    })

    const getStatusLabel = (status) => {
      const labels = { planning: '规划中', progress: '进行中', completed: '已完成' }
      return labels[status] || status
    }

    const showSkillModal = (skill = null) => {
      editingSkill.value = skill
      if (skill) {
        skillForm.value = { ...skill }
      } else {
        skillForm.value = {
          icon: '💻',
          name: '',
          level: 50,
          color: skillColors[Math.floor(Math.random() * skillColors.length)]
        }
      }
      isSkillModalVisible.value = true
    }

    const editSkill = (skill) => showSkillModal(skill)

    const deleteSkill = (skillId) => {
      if (confirm('确定要删除这个技能吗？')) {
        store.deleteSkill(skillId)
      }
    }

    const updateSkillLevel = (skillId, value) => {
      store.updateSkill(skillId, { level: Number(value) })
    }

    const saveSkill = () => {
      skillError.value = ''
      if (!skillForm.value.name.trim()) {
        skillError.value = '请输入技能名称'
        return
      }
      if (editingSkill.value) {
        store.updateSkill(editingSkill.value.id, skillForm.value)
      } else {
        store.addSkill(skillForm.value)
      }
      isSkillModalVisible.value = false
    }

    const showGoalModal = (goal = null) => {
      editingGoal.value = goal
      if (goal) {
        goalForm.value = { ...goal }
      } else {
        goalForm.value = {
          title: '',
          period: '',
          description: '',
          progress: 0,
          status: 'planning',
          color: skillColors[Math.floor(Math.random() * skillColors.length)]
        }
      }
      isGoalModalVisible.value = true
    }

    const editGoal = (goal) => showGoalModal(goal)

    const deleteGoal = (goalId) => {
      if (confirm('确定要删除这个目标吗？')) {
        store.deleteJourneyGoal(goalId)
      }
    }

    const updateGoalProgress = (goalId, value) => {
      store.updateJourneyGoal(goalId, { progress: Number(value) })
    }

    const saveGoal = () => {
      goalTitleError.value = ''
      if (!goalForm.value.title.trim()) {
        goalTitleError.value = '请输入目标标题'
        return
      }
      if (editingGoal.value) {
        store.updateJourneyGoal(editingGoal.value.id, goalForm.value)
      } else {
        store.addJourneyGoal(goalForm.value)
      }
      isGoalModalVisible.value = false
    }

    const showJourneyModal = (item = null) => {
      editingJourneyItem.value = item
      if (item) {
        journeyForm.value = {
          ...item,
          tagsInput: item.tags ? item.tags.join(',') : ''
        }
      } else {
        journeyForm.value = {
          icon: '📚',
          period: '',
          title: '',
          description: '',
          tagsInput: '',
          tags: [],
          color: skillColors[Math.floor(Math.random() * skillColors.length)]
        }
      }
      isJourneyModalVisible.value = true
    }

    const editJourneyItem = (item) => showJourneyModal(item)

    const deleteJourneyItem = (itemId) => {
      if (confirm('确定要删除这个历程吗？')) {
        store.deleteJourneyItem(itemId)
      }
    }

    const saveJourneyItem = () => {
      journeyTitleError.value = ''
      journeyPeriodError.value = ''
      if (!journeyForm.value.title.trim()) {
        journeyTitleError.value = '请输入标题'
        return
      }
      if (!journeyForm.value.period.trim()) {
        journeyPeriodError.value = '请输入时间周期'
        return
      }
      // 处理标签
      const tags = journeyForm.value.tagsInput
        ? journeyForm.value.tagsInput.split(',').map(t => t.trim()).filter(t => t)
        : []
      const dataToSave = {
        ...journeyForm.value,
        tags
      }
      if (editingJourneyItem.value) {
        store.updateJourneyItem(editingJourneyItem.value.id, dataToSave)
      } else {
        store.addJourneyItem(dataToSave)
      }
      isJourneyModalVisible.value = false
    }

    const closeModal = () => {
      isSkillModalVisible.value = false
      isGoalModalVisible.value = false
      isJourneyModalVisible.value = false
      editingSkill.value = null
      editingGoal.value = null
      editingJourneyItem.value = null
      skillError.value = ''
      goalTitleError.value = ''
      journeyTitleError.value = ''
      journeyPeriodError.value = ''
    }

    return {
      journeyData,
      skills,
      journeyGoals,
      isSkillModalVisible,
      isGoalModalVisible,
      isJourneyModalVisible,
      skillForm,
      goalForm,
      journeyForm,
      skillError,
      goalTitleError,
      journeyTitleError,
      journeyPeriodError,
      getStatusLabel,
      showSkillModal,
      editSkill,
      deleteSkill,
      updateSkillLevel,
      saveSkill,
      showGoalModal,
      editGoal,
      deleteGoal,
      updateGoalProgress,
      saveGoal,
      showJourneyModal,
      editJourneyItem,
      deleteJourneyItem,
      saveJourneyItem,
      closeModal
    }
  }
}
</script>

<style scoped>
.journey-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
}

.journey-timeline {
  position: relative;
  margin: 60px 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 50px;
  padding-left: calc(50% + 40px);
}

.timeline-item.item-right {
  justify-content: flex-end;
  padding-left: 0;
  padding-right: calc(50% + 40px);
}

.timeline-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.timeline-content {
  max-width: 45%;
  border-left: none;
  position: relative;
}

.timeline-item.item-right .timeline-content {
  text-align: right;
}

.timeline-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.3s;
}

.timeline-content:hover .timeline-actions {
  opacity: 1;
}

.timeline-header {
  margin-bottom: 20px;
}

.timeline-period {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.timeline-title {
  font-size: 20px;
  color: white;
  margin-bottom: 10px;
}

.timeline-desc {
  font-size: 14px;
  color: #888;
  line-height: 1.7;
  margin-bottom: 16px;
}

.timeline-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.timeline-item.item-right .timeline-tags {
  justify-content: flex-end;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 24px;
  color: white;
  margin: 0;
  padding-left: 12px;
  border-left: 4px solid #667eea;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.page-title-icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  vertical-align: middle;
}

.icon-img-xs {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  font-size: 20px;
  margin-right: 6px;
  vertical-align: middle;
}

.skills-section {
  margin-bottom: 60px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.skill-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  position: relative;
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 120px;
}

.skill-icon {
  font-size: 24px;
}

.skill-name {
  font-size: 14px;
  color: #e0e0e0;
}

.skill-actions {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.icon-btn {
  background: rgba(102, 126, 234, 0.1);
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.icon-btn:hover {
  background: rgba(102, 126, 234, 0.2);
}

.icon-btn.delete:hover {
  background: rgba(245, 87, 108, 0.2);
}

.skill-bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skill-slider {
  width: 100%;
  cursor: pointer;
  -webkit-appearance: none;
  height: 4px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 2px;
  margin-bottom: 8px;
}

.skill-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
}

.skill-bar {
  height: 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.skill-percent {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  min-width: 45px;
  text-align: right;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.goal-card {
  padding: 24px;
  position: relative;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.goal-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.goal-title {
  font-size: 18px;
  color: white;
  margin-bottom: 4px;
}

.goal-period {
  font-size: 13px;
  color: #888;
}

.goal-status {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
}

.status-planning {
  background: rgba(102, 126, 234, 0.15);
  color: #667eea;
}

.status-progress {
  background: rgba(255, 193, 60, 0.15);
  color: #ffc13c;
}

.status-completed {
  background: rgba(56, 239, 125, 0.15);
  color: #38ef7d;
}

.goal-desc {
  font-size: 14px;
  color: #888;
  line-height: 1.7;
  margin-bottom: 16px;
}

.goal-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #888;
}

.progress-slider {
  width: 100%;
  cursor: pointer;
  -webkit-appearance: none;
  height: 4px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 2px;
  margin-bottom: 4px;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
}

.progress-bar {
  height: 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* 弹窗样式 */
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
  background: #1a1a2e;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #2d2d44;
}

.modal-header h3 {
  color: white;
  font-size: 18px;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: white;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #2d2d44;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: white;
  font-size: 13px;
  margin-bottom: 8px;
  font-weight: 500;
}

.error-hint {
  display: block;
  color: #f5576c;
  font-size: 12px;
  margin-top: 6px;
}

.input-field {
  width: 100%;
  padding: 10px 14px;
  background: #0f0f23;
  border: 1px solid #2d2d44;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

@media (max-width: 768px) {
  .timeline-line {
    left: 25px;
  }

  .timeline-item,
  .timeline-item.item-right {
    padding-left: 70px;
    padding-right: 0;
    justify-content: flex-start;
  }

  .timeline-dot,
  .timeline-item.item-right .timeline-dot {
    left: 25px;
    transform: translateX(-50%);
  }

  .timeline-content,
  .timeline-item.item-right .timeline-content {
    max-width: 100%;
    text-align: left;
  }

  .timeline-tags,
  .timeline-item.item-right .timeline-tags {
    justify-content: flex-start;
  }
}

/* 浅色模式样式 */
.light-mode .timeline-title {
  color: #1e293b;
}

.light-mode .timeline-desc {
  color: #64748b;
}

.light-mode .section-title {
  color: #1e293b;
}

.light-mode .skill-name {
  color: #334155;
}

.light-mode .goal-title {
  color: #1e293b;
}

.light-mode .goal-period {
  color: #64748b;
}

.light-mode .goal-desc {
  color: #64748b;
}

.light-mode .progress-info {
  color: #64748b;
}

.light-mode .modal-content {
  background: white;
}

.light-mode .modal-header {
  border-bottom-color: #e2e8f0;
}

.light-mode .modal-header h3 {
  color: #1e293b;
}

.light-mode .close-btn {
  color: #64748b;
}

.light-mode .close-btn:hover {
  color: #1e293b;
}

.light-mode .modal-footer {
  border-top-color: #e2e8f0;
}

.light-mode .form-group label {
  color: #1e293b;
}

.light-mode .input-field {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #1e293b;
}

.light-mode .error-hint {
  color: #f5576c;
}
</style>