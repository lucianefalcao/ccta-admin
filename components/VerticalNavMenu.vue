<template>
  <v-navigation-drawer
    :value="isDrawerOpen"
    app
    floating
    width="280px"
  >
    <div class="align-center ps-6 pe-5 pt-5 pb-2">
      <nuxt-link
        to="/teste"
        class="d-flex text-decoration-none align-center"
      >
        <v-img
          src="/logo.svg"
          contain
          max-width="30px"
          max-height="30px"
          class="me-3"
        />
        <h2 class="app-title">
          CCTA
        </h2>
      </nuxt-link>
    </div>

    <v-list
      expand
      shaped
      class="pr-5"
    >
      <nav-menu-item
        v-for="item in primaryMenu"
        :key="item.icon"
        :icon="item.icon"
        :title="item.title"
        :to="item.to"
      />

      <v-divider class="my-5" />

      <nav-menu-item
        v-for="item in subMenu"
        :key="item.icon"
        :icon="item.icon"
        :title="item.title"
        :to="item.to"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import NavMenuItem from '@/components/NavMenuItem.vue'
import { Menu } from '@/models/helpers/PermissionMenuMap'
import { menuStore } from '@/store'

@Component({
  components: {
    NavMenuItem
  }
})
export default class VerticalNavMenu extends Vue {
  primaryMenu: Menu[] = menuStore.primary

  subMenu: Menu[] = menuStore.secondary

  @Prop({ type: Boolean })
  isDrawerOpen!: Boolean
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
