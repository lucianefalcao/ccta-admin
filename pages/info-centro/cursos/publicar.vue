<template>
  <v-col align-self="start">
    <curso-editor
      titulo-pagina="Cadastrar Curso"
      :carregando="atualizando"
      @salvarCurso="salvarCurso"
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
import { cursoStore } from '~/store'
import CursoEditor from '~/components/cursos/CursoEditor.vue'
import Snackbar from '~/components/Snackbar.vue'
import Curso from '~/src/aplicacao/cursos/entidade/curso'

@Component({
  components: {
    CursoEditor,
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

  async salvarCurso (curso: Curso): Promise<void> {
    try {
      this.atualizando = true
      await cursoStore.criar(curso)
      cursoStore.context.commit('setCursoSelecionado', curso)
      this.$router.push(`/info-centro/cursos/${curso.getId()}`)
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao publicar as informações. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.atualizando = false
    }
  }
}
</script>
