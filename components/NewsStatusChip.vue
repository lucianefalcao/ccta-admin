<template>
  <v-chip
    :outlined="isOutlined"
    small
    :color="statusColor[itemState]"
  >
    {{ statusMap[itemState] }}
  </v-chip>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import StatusTranslateMap from '@/models/helpers/StatusTranslateMap'
import StatusColorMap from '@/models/helpers/StatusColorMap'

@Component
export default class NewsStatusChip extends Vue {
  @Prop({ type: Boolean, default: false })
  isOutlined!: Boolean

  @Prop({ type: String, required: true })
  itemState!: String

  statusColor: StatusColorMap = {
    draft: 'info',
    published: 'success'
  }

  statusMap: StatusTranslateMap = {
    draft: 'rascunho',
    published: 'publicado'
  }
}
</script>
