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
    </v-card>
    <v-card
      class="my-4"
      v-for="tag in $frontmatterKey.list" :key="tag.name">
      <v-card-title>{{ tag.name }}</v-card-title>
      <v-card-text>
        <v-list-item v-for="page in tag.pages" :key="page.key" @click="$router.push({path: page.path})">
          <v-list-item-content >
            <v-list-item-title>
              <span class="font-weight-light caption">{{formateDate(page.frontmatter.date)}}
              </span>
              <span class="ml-3">
                {{ page.title }}
              </span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { formatDateToChinese } from '../util/time.js'

export default {
  methods: {
    formateDate (date) {
      return formatDateToChinese(date)
    }
  },
  created () {
    console.log(this.$frontmatterKey)
  }
}
</script>