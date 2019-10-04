<template>
  <!-- <div>
    <ul id="default-layout">
      <li v-for="page in $pagination.pages">
        <router-link class="page-link" :to="page.path">{{ page.title }}</router-link>
      </li>
    </ul>
    Hello
    <div id="pagination">
      <router-link v-if="$pagination.hasPrev" :to="$pagination.prevLink">Prev</router-link>
      <router-link v-if="$pagination.hasNext" :to="$pagination.nextLink">Next</router-link>
    </div>
  </div> -->
  <v-container >
    <v-row justify="left" alngn="top" class="fill-height">
      <v-col
        v-for="page in $pagination.pages"
        :key="page.path"
        sm="12"
        md="6"
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
          <v-card-text>{{ page.frontmatter.summary || page.summary }}</v-card-text>
          <v-card-actions class="mt-auto">
            <v-btn color="amber lighten-2" small outlined>read more</v-btn>
            <v-spacer></v-spacer>
            <span class="font-italic font-weight-light overline">{{ new Date(page.frontmatter.date.trim()).toDateString() }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="text-center">
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
export default {

  methods: {
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
  .out-wrapper
    max-width: 1080px
  .bottom-gradient
    background-image: linear-gradient(to top right, rgba(100,115,201,.33), rgba(25,32,72,.7))
    text-decoration: none
    transition: .6s
    background-size: 100%
    background-position: 0 0

    &:hover
      background-size: 100%
      background-image: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 72px)
 
</style>  