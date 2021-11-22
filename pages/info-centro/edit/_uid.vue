<template>
  <v-col align-self="start">
    <div v-if="fetchingData" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <center-info
      v-else
      :page-title="'Editar Informações do Centro'"
      :center="center"
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
export default class Edit extends Vue {
  errorMessage: String = ''
  snackbar: Boolean = false
  fetchingData: Boolean = true

  center: Center = {
    uid: undefined,
    about: undefined,
    location: undefined
  }

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async saveCenterInfo (center: Center): Promise<void> {
    try {
      await centerStore.update(center)
      this.$router.push('/info-centro')
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao atualizar o centero. Por favor, tente novamente.'
      this.snackbar = true
    }
  }

  async beforeCreate (): Promise<void> {
    try {
      this.center = await centerStore.getCenterInfo()
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao buscar o evento. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.fetchingData = false
    }
  }
}
</script>
