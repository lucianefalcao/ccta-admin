<template>
  <v-col align-self="start">
    <centro-editor
      titulo-pagina="Publicar Informações do Centro"
      :carregando="atualizando"
      @salvarCentro="salvarCentro"
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
import { centroStore } from '~/store'
import CentroEditor from '~/components/centro/CentroEditor.vue'
import Snackbar from '~/components/Snackbar.vue'
import Centro from '~/src/aplicacao/centro/entidade/centro'

@Component({
  components: {
    CentroEditor,
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

  async salvarCentro (centro: Centro): Promise<void> {
    try {
      this.atualizando = true
      await centroStore.criar(centro)
      this.$router.push('/info-centro')
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao publicar as informações. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.atualizando = false
    }
  }
}
</script>
