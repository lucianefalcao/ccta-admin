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

    <v-col>
      <v-card flat min-height="500px">
        <v-app-bar dark flat dense color="primary">
          <v-card-title>{{ selectedUser.nome }}</v-card-title>
        </v-app-bar>
        <v-card-text class="chat-container">
          <div
            v-for="message in currentMessages"
            :key="message.messageId"
            :class="{ 'd-flex flex-row-reverse': message.name === currentUser.uid ? true : false }"
          >
            <v-chip
              color="primary"
              class="pa-5"
            >
              {{ message.message }}
            </v-chip>
          </div>
        </v-card-text>
      </v-card>
      <v-card-text>
        <v-text-field
          append-outer-icon="mdi-send"
          outlined
          label="Mensagem"
        />
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import ChatWindow from 'vue-advanced-chat'
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

  currentMessages: { messageId: string; name: string; message: string; timestamp: number; }[] = []

  chats = [
    {
      id: 'one',
      members: [
        {
          id: 'lucianefalcao',
          nome: 'Luciane Falcão',
          email: 'luciane@mail.com',
          tipo: 'visitante',
          chatId: 'one'
        },
        {
          id: 'KJkyIGH3DxqSLa1pm6wbSE3wPqt3',
          nome: 'Test',
          email: 'test@mail.com',
          tipo: 'admin'
        }
      ],
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
      members: [
        {
          id: 'lod',
          nome: 'Lod',
          email: 'lod@mail.com',
          tipo: 'visitante'
        }
      ],
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
      const chatMembers = chat.members.find(m => m.tipo === 'visitante')
      users.push(chatMembers)
    }

    return users
  }

  get currentUser () {
    return userStore.authUser
  }

  getChat (userId: String) {
    const chat = this.chats.find((chat) => {
      return chat.members.find(m => m.id === userId)
    })

    return chat
  }

  loadMessages (chat: any) {
    return chat.messages
  }

  selectChat (user: any) {
    this.selectedUser = user
    const chat = this.getChat(user.id)
    const messages = this.loadMessages(chat)
    this.currentMessages = messages!

    console.log(this.currentMessages)
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
