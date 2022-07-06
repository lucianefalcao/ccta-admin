<template>
  <v-btn icon @click="voltar">
    <v-icon>mdi-arrow-left </v-icon>
  </v-btn>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BotaoVoltar extends Vue {
  @Prop({ type: String, default: '' })
  rota: string

  voltar (): void {
    if (this.rota.length === 0) {
      this.$router.back()
    }

    this.$router.push(this.rota)
  }
}
</script>
