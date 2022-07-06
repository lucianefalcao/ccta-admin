<template>
  <v-col align-self="start">
    <div v-if="carregandoDados" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <edital-editor
      v-else
      :titulo-pagina="'Editar Edital'"
      :edital="edital"
      :carregando="atualizando"
      @salvarEdital="salvar"
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
export default class Editar extends Vue {
  mensagemErro = ''
  snackbar = false
  carregandoDados = true
  atualizando = false

  edital: Edital

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async salvar (edital: Edital, documento: File|null): Promise<void> {
    try {
      this.atualizando = true
      await editalStore.atualizar({
        edital,
        novoDocumento: documento
      })
      editalStore.context.commit('setEditalSelecionado', edital)
      this.$router.push('/editais')
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao atualizar o edital. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.atualizando = false
    }
  }

  async mounted (): Promise<void> {
    try {
      if (!editalStore.context) {
        this.edital = await editalStore.getEditalPorId(this.$route.params.uid)
      } else {
        this.edital = editalStore.context.rootState.editais.editalSelecionado
      }
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao buscar o edital. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.carregandoDados = false
    }
  }
}
</script>
