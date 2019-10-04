<template>
  <v-app id="inspire">
    <!-- <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item @click="">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <core-header></core-header>
    <v-content>
      <DefaultGlobalLayout/>
    </v-content>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2019</span>
    </v-footer>
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