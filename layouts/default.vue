<template>
  <v-app>
    <vertical-nav-menu :menu-aberto="menuAberto" />

    <v-app-bar
      app
      flat
      absolute
      color="transparent"
    >
      <v-row class="boxed-container w-full d-flex align-center mx-6">
        <v-app-bar-nav-icon
          class="d-block d-lg-none me-2"
          @click="menuAberto = !menuAberto"
        />
        <v-spacer />
        <v-avatar v-if="nomeUsuario" size="40" color="primary" class="mr-5">
          <span class="white--text text-h5">{{ nomeUsuario[0] }}</span>
        </v-avatar>
        <v-btn
          color="secondary"
          outlined
          small
          depressed
          @click="sair"
        >
          Sair
        </v-btn>
      </v-row>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height boxed-container pa-6">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { usuarioStore } from '~/store'
import VerticalNavMenu from '~/components/menu/VerticalNavMenu.vue'

@Component({
  components: {
    VerticalNavMenu
  }
})
export default class Default extends Vue {
  get nomeUsuario (): string {
    return usuarioStore.usuario ? usuarioStore.usuario.getNome() : null
  }

  menuAberto = true

  async sair (): Promise<void> {
    await this.$fire.auth.signOut()
    this.$router.push('/auth/login')
  }
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
.w-full {
  width: 100%;
}
.boxed-container {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}

</style>
