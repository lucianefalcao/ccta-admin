<template>
  <v-col align-self="start">
    <div v-if="buscandoDados" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <noticia-editor
      v-else
      titulo-pagina="Editar notícia"
      :carregando="atualizando"
      :noticia="noticia"
      @salvarNoticia="atualizarNoticia"
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
export default class Edit extends Vue {
  noticia: Noticia

  buscandoDados = true
  snackbar = false
  atualizando = false
  mensagemErro = ''

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async atualizarNoticia (noticia: Noticia, capa: File|null): Promise<void> {
    try {
      this.atualizando = true
      await noticiaStore.atualizar({ noticia, capa })
      noticiaStore.context.commit('setNoticiaSelecionada', noticia)
      this.$router.push('/noticias/' + noticia.getId())
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao atualizar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.atualizando = false
    }
  }

  async mounted (): Promise<void> {
    try {
      if (!noticiaStore.context) {
        this.noticia = await noticiaStore.getNoticiaPorId(this.$route.params.uid)
      } else {
        this.noticia = noticiaStore.context.rootState.noticias.noticiaSelecionada
      }
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao buscar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.buscandoDados = false
    }
  }
}
</script>
