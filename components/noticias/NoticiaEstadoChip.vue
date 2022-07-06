<template>
  <v-chip
    :outlined="isOutlined"
    small
    :color="estadoCor[estadoItem]"
  >
    {{ mapEstado[estadoItem] }}
  </v-chip>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import { NoticiaEstado } from '~/src/aplicacao/noticias/entidade/noticia'

@Component
export default class NoticiaEstadoChip extends Vue {
  @Prop({ type: Boolean, default: false })
  isOutlined: boolean

  @Prop({ type: String, required: true })
  estadoItem: string

  estadoCor = {
    [NoticiaEstado.RASCUNHO]: 'info',
    [NoticiaEstado.PUBLICADO]: 'success'
  }

  mapEstado = {
    [NoticiaEstado.RASCUNHO]: 'Rascunho',
    [NoticiaEstado.PUBLICADO]: 'Publicado'
  }
}
</script>
