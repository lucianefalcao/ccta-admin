<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    :timeout="-1"
    :multi-line="true"
  >
    {{ message }}

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
  snackbar!: Boolean

  @Prop({ type: String, required: true })
  message!: String

  @Prop({ type: String, default: 'red' })
  color!: String

  close (): void {
    this.$emit('closeSnackbar', false)
  }
}
</script>
