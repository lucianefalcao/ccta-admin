<template>
  <v-col align-self="start">
    <div v-if="buscandoDados" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <centro-editor
      v-else
      :titulo-pagina="'Editar Informações do Centro'"
      :centro="centro"
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
export default class Editar extends Vue {
  mensagemErro = ''
  snackbar = false
  buscandoDados = true
  atualizando = false

  centro: Centro = null

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async salvarCentro (centro: Centro): Promise<void> {
    try {
      this.atualizando = true
      await centroStore.atualizar(centro)
      this.$router.push('/info-centro')
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao atualizar o centero. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.atualizando = false
    }
  }

  async mounted (): Promise<void> {
    try {
      if (!centroStore.context) {
        this.centro = await centroStore.getCentro()
      } else {
        this.centro = centroStore.context.rootState.centro.centro
      }
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao buscar o evento. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.buscandoDados = false
    }
  }
}
</script>
