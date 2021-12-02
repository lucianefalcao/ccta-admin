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

  visitants = [
    {
      id: 'lucianefalcao',
      nome: 'Luciane',
      email: 'luciane@mail.com'
    },
    {
      id: 'maria',
      nome: 'Maria',
      email: 'maria@mail.com'
    },
    {
      id: 'jose',
      nome: 'Sicrano',
      email: 'jose@mail.com'
    },
    {
      id: 'fulano',
      nome: 'Fulano',
      email: 'fulano@mail.com'
    },
    {
      id: 'sicrano',
      nome: 'Sicrano',
      email: 'sicrano@mail.com'
    },
    {
      id: 'mariajose',
      nome: 'Maria José',
      email: 'mariajose@mail.com'
    },
    {
      id: 'josemaria',
      nome: 'José Maria',
      email: 'josemaria@mail.com'
    },
    {
      id: 'richard',
      nome: 'Richard',
      email: 'richard@mail.com'
    },
    {
      id: 'ava',
      nome: 'Ava',
      email: 'ava@mail.com'
    },
    {
      id: 'leo',
      nome: 'Leo',
      email: 'leo@mail.com'
    },
    {
      id: 'lod',
      nome: 'Lod',
      email: 'lod@mail.com'
    },
    {
      id: 'lid',
      nome: 'Lid',
      email: 'lid@mail.com'
    },
    {
      id: 'lud',
      nome: 'Lud',
      email: 'lud@mail.com'
    }
  ]

  chats = [
    {
      id: 'one',
      lastMessage: 'lucianefalcao: bla bla',
      timestamp: 14785964
    },
    {
      id: 'two',
      lastMessage: 'lod: bla bla',
      timestamp: 14785964
    }
  ]

  members = [
    {
      chatId: 'one',
      admin: 'XQZQw5conawlnjkaC8czlYhGwb6S',
      user: 'lucianefalcao'
    },
    {
      chatId: 'two',
      admin: 'XQZQw5conawlnjkaC8czlYhGwb6S',
      user: 'lod'
    }
  ]

  messages = [
    {
      chatId: 'one',
      messages: [
        {
          messageId: 'm1',
          name: 'lucianefalcao',
          message: 'bla bla',
          timestamp: 14556487
        },
        {
          messageId: 'm2',
          name: 'XQZQw5conawlnjkaC8czlYhGwb6S',
          message: 'Como posso ajudar?',
          timestamp: 14556487
        }
      ]
    },
    {
      chatId: 'two',
      messages: [
        {
          messageId: 'm1',
          name: 'lod',
          message: 'preciso de ajuda',
          timestamp: 14556487
        }
      ]
    }
  ]

  get users () {
    const us = []
    for (const chat of this.chats) {
      const chatMembers = this.members.filter(m => m.chatId === chat.id)

      for (const chatMember of chatMembers) {
        us.push(...this.visitants.filter(v => v.id === chatMember.user))
      }
    }

    return us
  }

  get currentUser () {
    return userStore.authUser
  }

  getChatId (userId: String) {
    const chat = this.members.find(m => m.user === userId)
    return chat?.chatId
  }

  loadMessages (chatId: String) {
    const chatMessages = this.messages.find(m => m.chatId === chatId)
    return chatMessages?.messages
  }

  selectChat (user: any) {
    this.selectedUser = user
    const chatId = this.getChatId(user.id)
    const messages = this.loadMessages(chatId!)
    this.currentMessages = messages!

    console.log(this.currentMessages)
  }
  //   chats =
  //   {
  //     one: {
  //       members: {
  //         XQZQw5conawlnjkaC8czlYhGwb6S: {
  //           name: this.currentUser.name,
  //           type: 'admin'
  //         },
  //         lucianefalcao: {
  //           name: 'Luciane',
  //           email: 'luciane',
  //           type: 'user'
  //         }
  //       },
  //       messages: {
  //         m1: {
  //           nome: 'lucianefalcao',
  //           message: 'test',
  //           timestamp: 123456
  //         }
  //       }
  //     }
  //   }

  // get users () {
  //   const a = []
  //   for (const chat in this.chats) {
  //     for (const member in this.chats[chat].members) {
  //       if (this.chats[chat].members[member].type === 'user') {
  //         a.push(this.chats[chat].members[member])
  //       }
  //     }
  //   }

  //   console.log(a)

  //   return a
  // }
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
