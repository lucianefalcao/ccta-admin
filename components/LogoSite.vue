<template>
  <v-img
    src="/logo.svg"
    contain
    :max-width="largura"
    :max-height="altura"
    class="me-3"
    alt="Logo CCTA"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class LogoSite extends Vue {
  @Prop({ type: String, default: '30px' })
  largura: string

  @Prop({ type: String, default: '30px' })
  altura: string
}
</script>
