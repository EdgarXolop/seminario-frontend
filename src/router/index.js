import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/alumno',
    name: 'Alumno',
    component: () => import('../views/Alumno.vue')
  },
  {
    path: '/administrativo',
    name: 'Administrativo',
    component: () => import('../views/Administrativo.vue')
  },
  {
    path: '/carrera',
    name: 'Carrera',
    component: () => import('../views/Carrera.vue')
  },
  {
    path: '/seccion',
    name: 'Seccion',
    component: () => import('../views/Seccion.vue')
  },
  {
    path: '/grado',
    name: 'Grado',
    component: () => import('../views/Grado.vue')
  },
  {
    path: '/curso',
    name: 'curso',
    component: () => import('../views/Curso.vue')
  },
  {
    path: '/materia',
    name: 'materia',
    component: () => import('../views/Materia.vue')
  },
  {
    path: '/horario',
    name: 'horario',
    component: () => import('../views/Horario.vue')
  },
  {
    path: '/clase',
    name: 'clase',
    component: () => import('../views/CursoMateria.vue')
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
