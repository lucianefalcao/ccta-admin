<template>
  <v-snackbar
    v-model="snackbar"
    :color="cor"
    :timeout="-1"
    :multi-line="true"
  >
    {{ mensagem }}

    <template #action="{ attrs }">
      <v-btn
        color="white"
        text
        v-bind="attrs"
        @click="close"
      >
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Snackbar extends Vue {
  @Prop({ type: Boolean, required: true })
  snackbar: boolean

  @Prop({ type: String, required: true })
  mensagem: string

  @Prop({ type: String, default: 'red' })
  cor: string

  close (): void {
    this.$emit('fecharSnackbar', false)
  }
}
</script>
