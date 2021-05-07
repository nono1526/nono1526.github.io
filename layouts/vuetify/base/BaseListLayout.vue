<template>
  <v-container class="vuetify__list">
    <v-row justify="start" alngn="top" class="fill-height" v-if="$pagination">
      <v-col
        v-for="page in $pagination.pages"
        :key="page.path"
        sm="12"
        md="4"
      >
        <v-card
          tile
          outlined
          tag="article"
        >
          <router-link
            class="white--text"
            :to="page.path"
            style="text-decoration: none;"
          >
            <v-img
              class="white--text"
              :src="page.frontmatter.cover"
              height="200px"
            >
              <v-card-title class="align-end fill-height bottom-gradient">
                {{ page.title }}
              </v-card-title>
            </v-img>
          </router-link>
          <v-card-text class="card__text">{{ page.frontmatter.summary || page.summary }}</v-card-text>
          <v-card-actions class="mt-auto">
            <v-btn color="amber lighten-2" small outlined :to="page.path">read more</v-btn>
            <v-spacer></v-spacer>
            <span class="font-italic font-weight-light overline mt-auto">{{ formatDate(page) }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="text-center" v-if="$pagination">
      <v-pagination
        :value="$pagination.paginationIndex + 1"
        circle
        :length="$pagination.length"
        @input="toPage"
      ></v-pagination>
    </v-row>
  </v-container>
</template>

<script>
import { formatDateToChinese } from '../../../util/time'
export default {
  name: 'base-list-layout',
  methods: {
    formatDate (page) {
      return formatDateToChinese(page.frontmatter.date)
    },
    toPage (page) {
      const path = page > 1 ? `/page/${page}` : `/`
      this.$router.push(path)
    }
  },
  created () {
  }
}
</script>

<style lang="sass">
  .card__text
    min-height: 80px
  .out-wrapper
    max-width: 1080px
  .bottom-gradient
    background: linear-gradient(to top right, rgba(0, 0, 0, 0.45), transparent)
    text-decoration: none
    transition: background-image 1s
    background-size: 100%

    transition: .5s

    &:hover
      background-size: 100%
      transition: background-image 1s 
 
</style>  