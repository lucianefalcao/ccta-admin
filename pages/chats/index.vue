<template>
  <v-row no-gutters>
    <v-col sm="3">
      <v-card flat class="scrollable">
        <v-card-text>
          <v-list subheader rounded>
            <v-subheader>Chats</v-subheader>

            <v-list-item-group v-model="selected">
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
        <v-card-text class="chat-container">
          <div
            v-for="message in currentMessages"
            :key="message.messageId"
            :class="{ 'd-flex flex-row-reverse': message.memberId === currentUser.uid ? true : false }"
          >
            <v-chip
              color="primary"
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

import { Component, Vue } from 'vue-property-decorator'
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

  selectedChat = {}

  message: String = ''

  currentMessages: { messageId: string; name: string; message: string; timestamp: number; }[] = []

  chats = [
    {
      id: 'one',
      visitante: {
        id: 'lucianefalcao',
        nome: 'Luciane Falcão',
        email: 'luciane@mail.com'
      },
      atendente: {
        id: 'sJG736FxJevQoQFdU6tDWC7chlJj',
        nome: 'Test',
        email: 'test@mail.com'
      },
      messages: [
        {
          id: 'm1',
          message: 'Preciso de ajuda',
          memberId: 'lucianefalcao',
          timestamp: 4564654
        }
      ]
    },
    {
      id: 'two',
      visitante: {
        id: 'lod',
        nome: 'Lod',
        email: 'lod@mail.com'
      },
      messages: [
        {
          id: 'm11',
          message: 'Oi',
          memberId: 'lod',
          timestamp: 4564654
        }
      ]
    }
  ]

  get users () {
    const users = []
    for (const chat of this.chats) {
      users.push(chat.visitante)
    }

    return users
  }

  get currentUser () {
    return userStore.authUser
  }

  getChat (userId: String) {
    const chat = this.chats.find((chat) => {
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
    const messages = this.loadMessages(chat)
    this.currentMessages = messages!
  }

  get isChatSelected () {
    return !isEmpty(this.selectedChat)
  }

  get atendente () {
    return !isEmpty(this.selectedChat.atendente) ? this.selectedChat.atendente : false
  }

  sendMessage () {
    const chat = this.chats.find(c => c.id === this.selectedChat?.id!)
    chat?.messages.push({
      id: 'm11',
      message: this.message as string,
      memberId: this.currentUser.uid! as string,
      timestamp: new Date()
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
</style>
