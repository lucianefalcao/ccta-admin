<template>
  <v-col align-self="start">
    <edital-publish
      :page-title="'Publicar Edital'"
      @saveEdital="saveEdital"
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
import { editaisStore } from '@/store'
import EditalPublish from '@/components/EditalPublish.vue'
import Snackbar from '@/components/Snackbar.vue'
import Edital from '~/models/domain/Edital'

@Component({
  components: {
    EditalPublish,
    Snackbar
  }
})
export default class Publish extends Vue {
  errorMessage: String = ''
  snackbar: Boolean = false

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async saveEdital (edital: Edital): Promise<void> {
    try {
      await editaisStore.save(edital)
      this.$router.push('/editais')
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao publicar o edital. Por favor, tente novamente.'
      this.snackbar = true
    }
  }
}
</script>
