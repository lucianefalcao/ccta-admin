<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-title class="mb-5">
        <h2>Perfil</h2>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" align-self="center">
            <v-text-field
              v-model="name"
              dense
              outlined
              label="Nome"
            />

            <v-text-field
              v-model="email"
              dense
              outlined
              label="Email"
            />

            <v-text-field
              v-model="password"
              dense
              outlined
              label="Nova senha"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-img src="/account.svg" contain max-height="250" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn depressed color="primary" @click="update">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { userStore } from '@/store'

@Component
export default class Perfil extends Vue {
  name: String = userStore.authUser.name!
  email: String = userStore.authUser.email!
  password: String = ''

  async update () {
    const newData = {
      name: this.name,
      email: this.email,
      password: this.password
    }
    await userStore.update(newData)
  }
}
</script>
