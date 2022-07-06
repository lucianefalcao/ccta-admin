<template>
  <v-col align-self="start">
    <div v-if="buscandoDados" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>

    <curso-editor
      v-else
      titulo-pagina="Editar Curso"
      :curso="curso"
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
export default class Edit extends Vue {
  mensagemErro = ''
  snackbar = false
  buscandoDados = true
  atualizando = false

  curso: Curso = null

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async salvarCurso (curso: Curso): Promise<void> {
    try {
      this.atualizando = true
      await cursoStore.atualizar(curso)
      cursoStore.context.commit('setCursoSelecionado', curso)
      this.$router.push(`/info-centro/cursos/${curso.getId()}`)
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao atualizar o curso. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.atualizando = false
    }
  }

  async mounted (): Promise<void> {
    try {
      if (!cursoStore.context) {
        this.curso = await cursoStore.getCursoPorId(this.$route.params.uid)
      } else {
        this.curso = cursoStore.context.rootState.cursos.cursoSelecionado
      }
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao buscar o curso. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.buscandoDados = false
    }
  }
}
</script>
