<template>
  <v-col align-self="start">
    <noticia-editor
      titulo-pagina="Cadastrar notícia"
      :carregando="atualizando"
      @salvarNoticia="criarNoticia"
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
import { noticiaStore } from '~/store'
import NoticiaEditor from '~/components/noticias/NoticiaEditor.vue'
import Snackbar from '~/components/Snackbar.vue'
import Noticia from '~/src/aplicacao/noticias/entidade/noticia'

@Component({
  components: {
    NoticiaEditor,
    Snackbar
  }
})
export default class Criar extends Vue {
  mensagemErro = ''
  snackbar = false
  atualizando = false

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async criarNoticia (noticia: Noticia, capa: File|null): Promise<void> {
    try {
      this.atualizando = true
      await noticiaStore.criar({ noticia, capa })
      noticiaStore.context.commit('setNoticiaSelecionada', noticia)
      this.$router.push('/noticias/' + noticia.getId())
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao atualizar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.atualizando = false
    }
  }
}
</script>
