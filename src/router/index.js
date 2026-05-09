import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TodosView from '../views/TodosView.vue'
import JourneyView from '../views/JourneyView.vue'
import ResourcesView from '../views/ResourcesView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import AIView from '../views/AIView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { keepAlive: true }
  },
  {
    path: '/todos',
    name: 'todos',
    component: TodosView,
    meta: { keepAlive: true }
  },
  {
    path: '/journey',
    name: 'journey',
    component: JourneyView,
    meta: { keepAlive: true }
  },
  {
    path: '/resources',
    name: 'resources',
    component: ResourcesView,
    meta: { keepAlive: true }
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsView,
    meta: { keepAlive: true }
  },
  {
    path: '/ai',
    name: 'ai',
    component: AIView,
    meta: { keepAlive: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router