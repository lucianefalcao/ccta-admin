<template>
  <v-row v-if="buscandoDados" no-gutters justify="center">
    <v-progress-circular
      color="primary"
      indeterminate
    />
  </v-row>
  <v-row v-else-if="visitantes.length === 0" no-gutters justify="center">
    Nenhum atendimento
  </v-row>
  <v-row v-else no-gutters>
    <v-col sm="3">
      <v-card flat class="scrollable light">
        <v-card-text>
          <v-list subheader rounded>
            <v-subheader>Chats</v-subheader>
            <v-list-item-group v-model="selecionado" color="secondary">
              <v-list-item v-for="(visitante, i) in visitantes" :key="i" @click="selecionarChat(visitante.nome, visitante.chat)">
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-message-outline
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ visitante.nome }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col v-if="estaSelecionado">
      <v-card flat min-height="500px">
        <v-app-bar dense flat color="primary" dark>
          <v-card-title>{{ visitanteSelecionado }}</v-card-title>
          <v-spacer />
          <v-btn depressed small color="secondary" @click="encerrarChat">
            Encerrar chat
          </v-btn>
        </v-app-bar>
        <v-card-text ref="chat" class="chat-container light">
          <v-row
            v-for="(mensagem, i) in mensagens"
            :key="i"
            :justify="mensagem.getMembro() === usuario.getId() ? 'end' : 'start'"
            class="ma-2"
            align="center"
          >
            <v-sheet
              dark
              class="pa-2 mr-2"
              rounded
              :color="mensagem.getMembro() === usuario.getId() ? 'primary' : 'secondary'"
              max-width="400"
            >
              {{ mensagem.getTexto() }}
            </v-sheet>
            <small>{{ getHora(mensagem.getData()) }}</small>
          </v-row>
          <v-row
            v-if="(atendente !== null) && (atendente.id !== usuario.getId())"
            no-gutters
            justify="center"
          >
            <span>{{ atendente.nome }} está atendendo </span>
          </v-row>
          <v-row v-else-if="!atendente" no-gutters justify="center">
            <v-btn
              small
              depressed
              outlined
              rounded
              color="secondary"
              @click="entrarNoAtendimento"
            >
              Entrar no atendimento
            </v-btn>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col align="center">
              <v-text-field
                v-model="mensagem"
                outlined
                dense
                label="Mensagem"
                :disabled="!atendente || atendente.id !== usuario.getId()"
                @keyup.enter="enviarMensagem"
              />
            </v-col>
            <v-col sm="1" align="center">
              <v-btn
                :disabled="!(mensagem.length > 0)"
                icon
                @click="enviarMensagem"
              >
                <v-icon color="primary">
                  mdi-send
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">

import { v4 } from 'uuid'
import { Vue, Component } from 'vue-property-decorator'
import Chat from '~/src/aplicacao/chat/entidade/chat'
import Membro, { MembroTipo } from '~/src/aplicacao/chat/objeto-valor/membro'
import Mensagem from '~/src/aplicacao/chat/objeto-valor/mensagem'
import Usuario from '~/src/aplicacao/usuarios/entidade/usuario'
import { usuarioStore, chatStore } from '~/store'

@Component
export default class Index extends Vue {
  selecionado = null
  membros: Membro[] = []
  chats = {}
  mensagens = []
  chatSelecionado: Chat = null
  chatID = ''
  visitanteSelecionado = ''
  chatEstaSelecionado = false
  mensagem = ''
  buscandoDados = true

  get estaSelecionado (): boolean {
    return this.chatSelecionado !== null
  }

  get visitantes (): {nome: string, chat: string}[] {
    const visitantes = this.membros.filter(m => m.getTipo() === MembroTipo.VISITANTE)
    return visitantes.map((m) => {
      return {
        nome: m.getNome(),
        chat: m.getChatId()
      }
    })
  }

  get usuario (): Usuario|null {
    return usuarioStore.usuario
  }

  get atendente (): {id: string, nome: string}|null {
    const membros = this.membros.filter(m => m.getTipo() === MembroTipo.ATENDENTE && m.getChatId() === this.chatID)
    if (membros.length === 1) {
      return {
        id: membros[0].getId(),
        nome: membros[0].getNome()
      }
    }

    return null
  }

  async selecionarChat (visitante: string, chat: string): Promise<void> {
    this.chatSelecionado = await chatStore.getChat(chat)
    this.mensagens = await chatStore.getMensagens(chat)
    this.visitanteSelecionado = visitante
    this.chatID = chat
    this.chatEstaSelecionado = true
    this.scrollToEnd()
  }

  async entrarNoAtendimento (): Promise<void> {
    const membro = new Membro(
      this.usuario.getId(),
      this.usuario.getNome(),
      MembroTipo.ATENDENTE,
      this.chatID
    )
    await chatStore.entrarNoAtendimento(membro)
  }

  async encerrarChat (): Promise<void> {
    await chatStore.encerrarChat(this.chatID)
    this.mensagens = []
    this.membros = this.membros.filter(m => m.getChatId() !== this.chatID)
    this.visitanteSelecionado = ''
    this.chatID = ''
    this.selecionado = null
    this.chatSelecionado = null
  }

  getHora (data: Date): string {
    if (!data) {
      return ''
    }
    return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  async enviarMensagem (): Promise<void> {
    if (this.mensagem.length > 0) {
      const novaMensagem = new Mensagem(
        v4(),
        this.usuario.getId(),
        this.mensagem,
        new Date(),
        this.chatID
      )
      await chatStore.enviarMensagem(novaMensagem)

      this.mensagem = ''
      this.scrollToEnd()
    }
  }

  async mounted (): Promise<void> {
    await this.$fire.database.ref('membros/').on('value', (snapshot) => {
      if (snapshot.exists()) {
        const auxiliar = []
        snapshot.forEach((snap) => {
          auxiliar.push(
            new Membro(
              snap.val().visitante.id,
              snap.val().visitante.nome,
              MembroTipo.VISITANTE,
              snap.key
            )
          )

          if (snap.val().atendente) {
            auxiliar.push(
              new Membro(
                snap.val().atendente.id,
                snap.val().atendente.nome,
                MembroTipo.ATENDENTE,
                snap.key
              )
            )
          }
        })
        this.membros = auxiliar
      }
    })
    this.buscandoDados = false
  }

  scrollToEnd (): void {
    this.$nextTick(() => {
      const container = this.$el.querySelector('.chat-container') as HTMLElement
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    })
  }
}
</script>

<style scoped>

  .scrollable {
    overflow-y: auto;
    height: 80vh;
  }

  .chat-container{
    box-sizing: border-box;
    height: calc(80vh - 7rem);
    overflow-y: auto;
    padding: 10px;
  }

  .light::-webkit-scrollbar {
    width: 15px;
  }

  .light::-webkit-scrollbar-track {
    background: #e6e6e6;
    border-left: 1px solid #dadada;
  }

  .light::-webkit-scrollbar-thumb {
    background: #b0b0b0;
    border: solid 3px #e6e6e6;
    border-radius: 7px;
  }

  .light::-webkit-scrollbar-thumb:hover {
    background: black;
  }
</style>
