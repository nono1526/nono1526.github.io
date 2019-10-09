<template>
  <div>
    <base-list-layout v-if="$pagination"/>
    <Post v-else/>
  </div>
</template>

<script>
import BaseListLayout from './vuetify/base/BaseListLayout'
export default {
  components: {
    BaseListLayout
  },
  
}
</script>

