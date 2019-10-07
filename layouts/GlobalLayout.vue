<template>
  <v-app id="inspire">
    <core-header></core-header>
    <v-content>
      <DefaultGlobalLayout/>
    </v-content>
  </v-app>
</template>

<script>
  import GlobalLayout from './Layout.vue'
  import CoreHeader from './vuetify/core/CoreHeader'
  export default {
    components: {
      DefaultGlobalLayout: GlobalLayout,
      CoreHeader
    },
    data () {
      return {
        source: 'https://google.tw',
        drawer: false
      }
    },
    mounted () {
    }
  }
</script>