<template>
  <v-app>
    <vertical-nav-menu :is-drawer-open.sync="isDrawerOpen" />

    <v-app-bar app flat absolute color="transparent">
      <v-app-bar-nav-icon
        class="d-block d-lg-none me-2"
        @click="isDrawerOpen = !isDrawerOpen"
      />
      <v-spacer />
      <v-avatar size="40" color="#ff4c51">
        <span class="white--text text-h5">{{ userName[0] }}</span>
      </v-avatar>
    </v-app-bar>
  </v-app>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { userStore } from '@/store'
import VerticalNavMenu from '@/components/VerticalNavMenu.vue'

@Component({
  components: {
    VerticalNavMenu
  }
})
export default class Default extends Vue {
  get userName (): String {
    return userStore.authUser?.name!
  }

  isDrawerOpen: Boolean = false
}
</script>

<style lang="scss" scoped>
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}
</style>
