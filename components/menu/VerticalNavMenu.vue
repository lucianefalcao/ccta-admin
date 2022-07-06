<template>
  <v-navigation-drawer
    :value="menuAberto"
    app
    floating
    bottom
    width="300px"
  >
    <div class="align-center ps-6 pe-5 pt-5 pb-2">
      <nuxt-link
        to="/"
        class="d-flex text-decoration-none align-center"
      >
        <logo-site />
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
        v-for="item in primario"
        :key="item.icone"
        :icone="item.icone"
        :titulo="item.titulo"
        :to="item.to"
      />

      <v-divider v-if="primario.length > 0" class="my-5" />

      <nav-menu-item
        v-for="item in secundario"
        :key="item.icone"
        :icone="item.icone"
        :titulo="item.titulo"
        :to="item.to"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import LogoSite from '../LogoSite.vue'
import NavMenuItem from './NavMenuItem.vue'
import { Menu } from '~/models/helpers/PermissionMenuMap'
import { menuStore } from '~/store'

@Component({
  components: {
    NavMenuItem,
    LogoSite
  }
})
export default class VerticalNavMenu extends Vue {
  get primario (): Menu[] {
    return menuStore.menuPrimario
  }

  get secundario (): Menu[] {
    return menuStore.menuSecundario
  }

  @Prop({ type: Boolean })
  menuAberto: boolean
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
