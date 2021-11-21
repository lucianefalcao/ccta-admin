<template>
  <v-col align-self="start">
    <div v-if="fetchingData" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <edital-publish
      v-else
      :page-title="'Editar Edital'"
      :edital="edital"
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
  fetchingData: Boolean = true

  edital: Edital = {
    uid: undefined,
    title: undefined,
    lastModified: undefined,
    user: undefined,
    documentPath: undefined
  }

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async saveEdital (edital: Edital): Promise<void> {
    try {
      await editaisStore.update(edital)
      this.$router.push('/editais')
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao atualizar o edital. Por favor, tente novamente.'
      this.snackbar = true
    }
  }

  async beforeCreate (): Promise<void> {
    try {
      this.edital = await editaisStore.getEditalByUid(this.$route.params.uid)

      if (this.edital.documentPath!.length > 0) {
        await editaisStore.getDocument(this.edital.documentPath!)
      }
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao buscar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.fetchingData = false
    }
  }
}
</script>
