<template>
  <v-app-bar
    app
    color="primary"
    flat
    dark
  >
    <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
    <v-toolbar-title>{{ $site.title }}</v-toolbar-title>
    <div class="flex-grow-1"></div>
    <v-btn color="amber lighten-2" text v-for="item in $themeConfig.nav" :key="item.link" :to="item.link">
      {{item.text}}
    </v-btn>
    <SearchBox/>
  </v-app-bar>
</template>

<script>
import SearchBox from '@SearchBox'
export default {
  name: 'core-header',
  components: { SearchBox }
}
</script>

<style>

</style>