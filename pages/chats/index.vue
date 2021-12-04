<template>
  <v-row v-if="users.length === 0" no-gutters justify="center">
    Nenhum atendimento
  </v-row>
  <v-row v-else no-gutters>
    <v-col sm="3">
      <v-card flat class="scrollable light">
        <v-card-text>
          <v-list subheader rounded>
            <v-subheader>Chats</v-subheader>

            <v-list-item-group v-model="selected" color="secondary">
              <v-list-item v-for="user in users" :key="user.id" @click="selectChat(user)">
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-message-outline
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ user.nome }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col v-if="isChatSelected">
      <v-card flat min-height="500px">
        <v-app-bar dark flat dense color="primary">
          <v-card-title>{{ selectedUser.nome }}</v-card-title>
        </v-app-bar>
        <v-card-text class="chat-container light">
          <div
            v-for="message in selectedChat.messages"
            :key="message.messageId"
            :class="{ 'd-flex flex-row-reverse': message.memberId === currentUser.uid ? true : false }"
          >
            <v-chip
              :color="message.memberId === currentUser.uid ? 'primary' : 'secondary'"
              class="pa-5 mb-2"
            >
              {{ message.message }}
            </v-chip>

            <v-row no-gutters justify="center">
              <span v-if="atendente && atendente.id !== currentUser.uid">{{ atendente.nome }} está atendendo </span>
              <v-btn
                v-else-if="!atendente"
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
          </div>
        </v-card-text>
      </v-card>
      <v-card-text>
        <v-row>
          <v-col align="center">
            <v-text-field
              v-model="message"
              :disabled="atendente.id !== currentUser.uid"
              outlined
              dense
              label="Mensagem"
              @keyup.enter="sendMessage"
            />
          </v-col>

          <v-col sm="1" align="center">
            <v-btn
              :disabled="!(message.length > 0)"
              icon
              @click="sendMessage"
            >
              <v-icon color="primary">
                mdi-send
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>

    <v-col v-else>
      <v-card flat>
        <v-col align="center">
          <v-card-text>Nenhum chat selecionado</v-card-text>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator'
import ChatWindow from 'vue-advanced-chat'
import { isEmpty } from 'lodash'
import { userStore } from '@/store'

@Component({
  components: {
    ChatWindow
  }
})
export default class Chat extends Vue {
  selected = null
  selectedUser = {
    nome: ''
  }

  selectedChat: any = {}

  message: String = ''

  chats: any = []

  get users () {
    const users = []
    for (const chat of this.chats) {
      if (chat.messages) {
        users.push(chat.visitante)
      }
    }
    return users
  }

  get currentUser () {
    return userStore.authUser
  }

  getChat (userId: String) {
    const chat = this.chats.find((chat: any) => {
      if (chat.visitante.id === userId) {
        return chat.visitante
      }

      return null
    })

    return chat
  }

  loadMessages (chat: any) {
    return chat.messages
  }

  selectChat (user: any) {
    this.selectedUser = user
    const chat = this.getChat(user.id)
    this.selectedChat = chat
  }

  get isChatSelected () {
    return !isEmpty(this.selectedChat)
  }

  get atendente () {
    return !isEmpty(this.selectedChat.atendente) ? this.selectedChat.atendente : false
  }

  async sendMessage () {
    const chatRef = this.$fire.database.ref(`chats/${this.selectedChat.id}`)
    await chatRef.set({
      ...this.selectedChat,
      messages: [
        ...this.selectedChat.messages,
        {
          message: this.message as string,
          memberId: this.currentUser.uid! as string,
          timestamp: new Date()
        }
      ]
    })

    this.message = ''
  }

  entrarNoAtendimento () {
    this.$set(
      this.selectedChat,
      'atendente',
      {
        id: this.currentUser.uid,
        nome: this.currentUser.name,
        email: this.currentUser.email
      })
  }

  async mounted () {
    const chatsRef = this.$fire.database.ref('chats')

    await chatsRef.on('value', (snapshot: any) => {
      this.chats = Object.keys(snapshot.val()).map((s) => {
        const chats = snapshot.val()[s]
        chats.id = s
        return chats
      })
    })
  }

  @Watch('chats')
  updateSelectedChat (newValue: []) {
    const chat = newValue.find((chat: any) => chat.id === this.selectedChat.id) as any
    if (!isEmpty(this.selectedChat) && chat) {
      this.$set(
        this.selectedChat,
        'messages',
        chat.messages
      )
    }
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
