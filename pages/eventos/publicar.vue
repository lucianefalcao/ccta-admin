<template>
  <v-col align-self="start">
    <evento-editor
      :titulo-pagina="'Publicar Evento'"
      :carregando="atualizando"
      @criarEvento="criarEvento"
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
import { eventoStore } from '~/store'
import EventoEditor from '~/components/eventos/EventoEditor.vue'
import Snackbar from '~/components/Snackbar.vue'
import Evento from '~/src/aplicacao/eventos/entidade/evento'

@Component({
  components: {
    EventoEditor,
    Snackbar
  }
})
export default class CriarEvento extends Vue {
  mensagemErro = ''
  snackbar = false
  atualizando = false

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async criarEvento (evento: Evento): Promise<void> {
    try {
      this.atualizando = true
      await eventoStore.criar(evento)
      eventoStore.context.commit('setEventoSelecionado', evento)
      this.$router.push(`/eventos/${evento.getId()}`)
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao publicar o evento. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.atualizando = false
    }
  }
}
</script>
