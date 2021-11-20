<template>
  <v-btn icon @click="back">
    <v-icon>{{ icons.mdiArrowLeft }}</v-icon>
  </v-btn>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { mdiArrowLeft } from '@mdi/js'

@Component
export default class BackButton extends Vue {
  icons = {
    mdiArrowLeft
  }

  back (): void {
    this.$router.go(-1)
  }
}
</script>
