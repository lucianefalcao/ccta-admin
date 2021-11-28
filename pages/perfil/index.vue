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
              :rules="rules.password"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              dense
              outlined
              label="Nova senha"
              @click:append="isPasswordVisible = !isPasswordVisible"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-img src="/account.svg" contain max-height="250" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn depressed color="primary" :disabled="!canUpdate" @click="update">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
    <snackbar
      v-if="snackbar"
      :color="snackbarColor"
      :snackbar="snackbar"
      :message="errorMessage"
      @closeSnackbar="setSnackbar"
    />
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { userStore } from '@/store'
import Snackbar from '@/components/Snackbar.vue'

@Component({
  components: {
    Snackbar
  }
})
export default class Perfil extends Vue {
  name: String = userStore.authUser.name!
  email: String = userStore.authUser.email!
  password: String = ''

  snackbar: Boolean = false
  isPasswordVisible: Boolean = false
  snackbarColor: String = ''
  errorMessage: String = ''

  rules = {
    password: [
      (value: String) => value.length >= 6 || 'A senha deve conter 6 caracteres.']
  }

  async update () {
    try {
      await userStore.update({
        name: this.name,
        email: this.email,
        password: this.password
      })

      this.errorMessage = 'Suas informações foram atualizadas.'
      this.snackbarColor = 'green'
      this.snackbar = true
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao atualizar suas informações, por favor tente novamente.'
      this.snackbarColor = 'red'
      this.snackbar = true
    }
  }

  get canUpdate (): Boolean {
    const password = this.rules.password.every((element: Function) => element(this.password) === true)
    return password
  }

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }
}
</script>
