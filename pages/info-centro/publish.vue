<template>
  <v-col align-self="start">
    <center-info
      :page-title="'Publicar Informações do Centro'"
      @saveCenterInfo="saveCenterInfo"
    />

    <snackbar
      v-if="snackbar"
      :snackbar="snackbar"
      :message="errorMessage"
      @closeSnackbar="setSnackbar"
    />
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { centerStore } from '@/store'
import CenterInfo from '@/components/CenterInfo.vue'
import Snackbar from '@/components/Snackbar.vue'
import Center from '@/models/domain/Center'

@Component({
  components: {
    CenterInfo,
    Snackbar
  }
})
export default class Publish extends Vue {
  errorMessage: String = ''
  snackbar: Boolean = false

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async saveCenterInfo (center: Center): Promise<void> {
    try {
      await centerStore.save(center)
      this.$router.push('/info-centro')
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao publicar as informações. Por favor, tente novamente.'
      this.snackbar = true
    }
  }
}
</script>
