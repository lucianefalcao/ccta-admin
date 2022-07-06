<template>
  <v-col align-self="start">
    <edital-editor
      :titulo-pagina="'Publicar Edital'"
      :carregando="atualizando"
      @salvarEdital="criar"
    />

    <snackbar
      v-if="snackbar"
      :snackbar="snackbar"
      :mensagem="mensagemErro"
      @fecharSnackbar="setSnackbar"
    />
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { editalStore } from '~/store'
import EditalEditor from '~/components/editais/EditalEditor.vue'
import Snackbar from '~/components/Snackbar.vue'
import Edital from '~/src/aplicacao/editais/entidade/edital'

@Component({
  components: {
    EditalEditor,
    Snackbar
  }
})
export default class Publish extends Vue {
  mensagemErro = ''
  snackbar = false
  atualizando = false

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async criar (edital: Edital, documento: File): Promise<void> {
    try {
      this.atualizando = true
      await editalStore.criar({ edital, documento })
      this.$router.push('/editais')
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao publicar o edital. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.atualizando = false
    }
  }
}
</script>
