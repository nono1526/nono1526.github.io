<template>
  <v-app-bar
    app
    color="indigo"
    flat
    dark
    dense
  >
    <v-toolbar-title>{{ $site.title }}</v-toolbar-title>
    <div class="flex-grow-1"></div>
    <v-btn color="amber lighten-2" text v-for="item in $themeConfig.nav" :key="item.link" :to="item.link">
      {{item.text}}
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'core-header'
}
</script>

<style>

</style>