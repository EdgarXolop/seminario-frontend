<template>
  <div class="wrapper">
    <Navbar/>
    <main class="container">
      <router-view/>
    </main>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import Navbar from '@/components/Navbar.vue'

Vue.use(VueAxios, axios)
Vue.use(Buefy)

export default {
  name: 'App',
  data() {
      return {
      isStriped: true,
      isHoverable: true,
      isLoading: false,
      hasMobileCards: true,
      selected: {}
    }
  },
  components: {
    Navbar
  },
  mounted () {
    document.body.classList.add('has-background-light')
    
  },
}
</script>

<style>
html{
  height: 100%;
}

body{
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.wrapper {
  flex: 1;
}
</style>
