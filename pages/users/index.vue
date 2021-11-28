<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-title>Usuários</v-card-title>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="registerUser">
          <v-icon left>
            mdi-plus
          </v-icon>
          Cadastrar usuário
        </v-btn>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="users"
          :items-per-page="10"
          :no-data-text="message"
          :footer-props="{
            itemsPerPageAllText: 'Todas',
            itemsPerPageText: 'Items por página',
            itemsPerPageOptions: [10, 15, 20, -1]
          }"
        >
          <template #item.status="{ item }">
            <news-status-chip :item-state="item.state" />
          </template>

          <template #item.actions="{ item }">
            <div class="text-end">
              <v-btn
                small
                depressed
                outlined
                color="secondary"
                @click="gerenciar(item.uid)"
              >
                Gerenciar
              </v-btn>
              <v-btn
                icon
                class="text-right"
                color="red"
                :loading="isDeleting && item.uid === uid"
                @click="deleteUser(item)"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { userStore } from '@/store'
import User from '@/models/domain/User'

@Component
export default class Index extends Vue {
  users: User[] = []

  fetchingData: Boolean = false
  isDeleting: Boolean = false
  uid: String = ''
  message: String = 'Nenhum usuário cadastrado'

  headers = [
    {
      text: 'Nome',
      align: 'start',
      value: 'name'
    },
    {
      text: 'Opções',
      value: 'actions',
      align: 'center',
      class: 'v-data-table-header',
      sortable: false,
      width: '220px'
    }
  ]

  registerUser (): void {
    this.$router.push('/users/register')
  }

  gerenciar (uid: String): void {
    this.$router.push(`/users/permissions/${uid}`)
  }

  async deleteUser (item: User): Promise<void> {
    await userStore.deleteUser(item)
  }

  async mounted (): Promise<void> {
    try {
      this.fetchingData = true
      this.users = await userStore.getAll()
    } catch (error) {
      this.message = 'Ocorreu um erro ao buscar as notícias. Por favor, tente novamento mais tarde.'
    } finally {
      this.fetchingData = false
    }
  }
}
</script>
