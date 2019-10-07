<template>
  <v-container>
    <v-card class="pa-5">
      <v-btn 
        class="ma-3"
        v-for="(tag, name) in $frontmatterKey.map"
        text
        outlined
        color="primary"
        :key="name"
        :to="tag.path"
        
      >
        {{name}}
      </v-btn>
      <!-- <BlogTags :tags="$frontmatterKey.list"/> -->
    </v-card>
  </v-container>
</template>

<script>
export default {
  created () {
    console.log(this.$frontmatterKey)
  }
}
</script>