<template>
  <v-col align-self="start">
    <div v-if="buscandoDados" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <v-card v-else class="pa-5">
      <v-card-actions class="mb-10">
        <botao-voltar rota="/eventos" />
        <v-spacer />
        <v-btn
          depressed
          color="secondary"
          @click="editar"
        >
          Editar
        </v-btn>
      </v-card-actions>

      <v-card-title style="word-break: break-word;">
        <h2 class="pr-2">
          {{ titulo }}
        </h2>
      </v-card-title>

      <v-card-text class="mb-2">
        <div>
          Criado por {{ nomeUsuarioCriador }} &bull; criado em {{ criadoEm }}
        </div>
        <div v-if="editadoEm">
          Editado por {{ nomeUsuarioEditor }} &bull; última atualização {{ editadoEm }}
        </div>
      </v-card-text>

      <v-card-title>
        Data e horário do evento: {{ dataEvento }}
      </v-card-title>

      <v-card-title>
        Descrição
      </v-card-title>

      <v-card-text class="black--text">
        {{ descricao }}
      </v-card-text>
    </v-card>

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
import { eventoStore, usuarioStore } from '~/store'
import BotaoVoltar from '~/components/BotaoVoltar.vue'
import Snackbar from '~/components/Snackbar.vue'
import Evento from '~/src/aplicacao/eventos/entidade/evento'
import Usuario from '~/src/aplicacao/usuarios/entidade/usuario'

@Component({
  components: {
    BotaoVoltar,
    Snackbar
  }
})
export default class EventoUid extends Vue {
  evento: Evento
  usuarioCriador: Usuario
  usuarioEditor: Usuario

  mensagemErro = ''
  buscandoDados = true
  snackbar = false

  get criadoEm (): string {
    return this.evento?.getCriadoEm().toLocaleDateString('pt-BR') ?? ''
  }

  get editadoEm (): string|null {
    return this.evento?.getEditadoEm()?.toLocaleDateString('pt-BR') ?? null
  }

  get titulo (): string {
    return this.evento?.getTitulo() ?? ''
  }

  get descricao (): string {
    return this.evento?.getDescricao() ?? ''
  }

  get dataEvento (): string {
    const data = this.evento.getData()
    const hora = data.toLocaleTimeString(['pt-BR'], { hour: '2-digit', minute: '2-digit' })
    return data.toLocaleDateString('pt-BR') + ' às ' + hora
  }

  get nomeUsuarioCriador (): string {
    return this.usuarioCriador?.getNome() ?? 'Usuário não identificado'
  }

  get nomeUsuarioEditor (): string {
    return this.usuarioEditor?.getNome() ?? 'Usuário não identificado'
  }

  editar (): void {
    this.$router.push('/eventos/editar/' + this.evento.getId())
  }

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async mounted (): Promise<void> {
    try {
      if (!eventoStore.context) {
        this.evento = await eventoStore.getEventoPorId(this.$route.params.uid)
      } else {
        this.evento = eventoStore.context.rootState.eventos.eventoSelecionado
      }

      this.usuarioCriador = await usuarioStore.getUsuarioPorId(this.evento.getCriadoPor())
      if (this.evento.getEditadoPor()) {
        this.usuarioEditor = await usuarioStore.getUsuarioPorId(this.evento.getEditadoPor())
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
