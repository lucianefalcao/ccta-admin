<template>
  <v-row no-gutters>
    <v-col sm="3">
      <v-card flat class="scrollable">
        <v-card-text>
          <v-list subheader rounded>
            <v-subheader>Chats</v-subheader>

            <v-list-item-group v-model="selected">
              <v-list-item v-for="user in users" :key="user.email">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ user.nome }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-message-outline
                  </v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col>
      <v-card flat min-height="500px">
        <v-app-bar dark flat dense color="primary">
          <v-card-title>Luc</v-card-title>
        </v-app-bar>
        <v-card-text class="chat-container">
          <div
            :class="{ 'd-flex flex-row-reverse': true }"
          >
            <v-chip
              color="primary"
              class="pa-5"
            >
              Lorem ipsum pode ajudar
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
  messages = []
  selected = 0

  users = {
    lucianefalcao: {
      nome: 'Luciane',
      email: 'luciane@mail.com'
    },
    maria: {
      nome: 'Maria',
      email: 'maria@mail.com'
    },
    jose: {
      nome: 'Sicrano',
      email: 'jose@mail.com'
    },
    fulano: {
      nome: 'Fulano',
      email: 'fulano@mail.com'
    },
    sicrano: {
      nome: 'Sicrano',
      email: 'sicrano@mail.com'
    },
    mariajose: {
      nome: 'Maria José',
      email: 'mariajose@mail.com'
    },
    josemaria: {
      nome: 'José Maria',
      email: 'josemaria@mail.com'
    },
    richard: {
      nome: 'Richard',
      email: 'richard@mail.com'
    },
    ava: {
      nome: 'Ava',
      email: 'ava@mail.com'
    },
    leo: {
      nome: 'Leo',
      email: 'leo@mail.com'
    },
    lod: {
      nome: 'Lod',
      email: 'lod@mail.com'
    },
    lid: {
      nome: 'Lid',
      email: 'lid@mail.com'
    },
    lud: {
      nome: 'Lud',
      email: 'lud@mail.com'
    }
  }

  chats = {
    one: {
      lastMessage: 'lucianefalcao: bla bla',
      timestamp: 14785964
    }
  }

  members = {
    one: {
      XQZQw5conawlnjkaC8czlYhGwb6S: true,
      lucianefalcao: true
    }
  }

  get currentUser () {
    return userStore.authUser
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
