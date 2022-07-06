<template>
  <v-col align-self="start">
    <div v-if="carregandoDados" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <evento-editor
      v-else
      :titulo-pagina="'Editar Evento'"
      :evento="evento"
      :carregando="atualizando"
      @criarEvento="atualizarEvento"
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
export default class Editar extends Vue {
  mensagemErro = ''
  snackbar = false
  carregandoDados = true
  atualizando = false

  evento: Evento

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async atualizarEvento (evento: Evento): Promise<void> {
    try {
      this.atualizando = true
      await eventoStore.atualizar(evento)
      eventoStore.context.commit('setEventoSelecionado', evento)
      this.$router.push(`/eventos/${evento.getId()}`)
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao atualizar o evento. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.atualizando = false
    }
  }

  async mounted (): Promise<void> {
    try {
      if (!eventoStore.context) {
        this.evento = await eventoStore.getEventoPorId(this.$route.params.uid)
      } else {
        this.evento = eventoStore.context.rootState.eventos.eventoSelecionado
      }
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao buscar o evento. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.carregandoDados = false
    }
  }
}
</script>
