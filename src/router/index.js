import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '../public/pages/Home.component.vue'

//const AboutView = () => import('../public/pages/aboutView.vue');
const Destino =() => import('../varuta/pages/destiny-list.component.vue')
const Remitente =() => import('../varuta/pages/senders-list.component.vue')
const Consignatarios =() => import('../varuta/pages/consignees-list.component.vue')
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeComponent
    },
    {
      path: '/destinos',
      name: 'destinos',
      component: Destino
    },
    {
      path: '/remitentes',
      name: 'remitentes',
      component: Remitente
    },
    {
      path: '/consignatarios',
      name: 'consignatarios',
      component: Consignatarios
    }
  ]
})

export default router
