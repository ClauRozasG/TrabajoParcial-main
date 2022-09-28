<template>
  <pv-toast/>
  <header >
    <pv-toolbar class="bg-primary">
      <template #start>
        <h3>VaRuta</h3>
      </template>

      <template #end>
        <div class="flex-column">
          <router-link v-for="item in items"
                       v-model:to="item.to"
                       custom
                       v-slot="{navigate, href, isActive}"
                       v-model:key="item.label">

            <pv-button class="p-button-text text-white"
               v-bind:href="href"
                @click="navigate">{{ item.label }}
            </pv-button>
          </router-link>
        </div>
      </template>
    </pv-toolbar>
  </header>
  <pv-sidebar v-model:visible="drawer"></pv-sidebar>
  <router-view></router-view>
</template>

<script >
import { RouterLink, RouterView } from 'vue-router'
export default {
  data() {
    return {
      drawer: false,
      items: [
        { label: 'Inicio', to: '/home' },
        { label: 'Remitentes', to: '/remitentes' },
        { label: 'Consignatarios', to: '/consignatarios' },
        { label: 'Destinos', to: '/destinos' },
        { label: 'Tipo documento', to: '/tipodocumento' },
        { label: 'Envio', to: '/envio' },
        { label: 'Entrega de envio', to: '/entrega' },
        { label: 'Consulta de envio', to: '/consulta' },
      ]
    }
  }
}
</script>


<style scoped>
</style>
