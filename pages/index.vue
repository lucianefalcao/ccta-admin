<template>
  <v-container class="auth-wrapper pa-0">
    <v-row justify="space-around">
      <v-card class="auth-card" width="400" height="400">
        <v-card-title class="d-flex align-center justify-center">
          <v-img
            src="/logo.svg"
            max-height="30px"
            max-width="30px"
            alt="logo"
            class="me-3"
            contain
          />
          <p class="text-2xl font-weight-medium mb-0">
            CCTA
          </p>
        </v-card-title>

        <v-card-text>
          <p class="text-2xl font-weight-medium text--primary mb-2">
            Bem vindo(a) ao CCTA Admin!
          </p>
          <p class="mb-2">
            Por favor, realize o login
          </p>
        </v-card-text>

        <v-card-text>
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              outlined
              label="Email"
              hide-details
              class="mb-3"
            />
            <v-text-field
              v-model="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-icon="isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline"
              outlined
              label="Senha"
              hide-details
              class="mb-3"
              @click:append="isPasswordVisible = !isPasswordVisible"
            />

            <v-btn
              block
              color="primary"
              class="mt-6"
              @click="login"
            >
              Login
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { mdiEyeOffOutline, mdiEyeOutline } from '@mdi/js'
import { FirebaseError } from '@firebase/util'
import { userStore } from '@/store/index'

@Component({
  layout: 'empty'
})
export default class Index extends Vue {
  email: String = ''
  password: String = ''
  isPasswordVisible: Boolean = false
  icons: Object = {
    mdiEyeOffOutline,
    mdiEyeOutline
  }

  errorMessage: String = ''

  async login (): Promise<void> {
    try {
      await userStore.signIn({ email: this.email, password: this.password })
    } catch (e) {
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/invalid-email') {
          this.errorMessage = 'Seu email é inválido'
        } else if (e.code === 'auth/user-not-found') {
          this.errorMessage = 'Seu usuário não encontrado'
        } else if (e.code === 'auth/wrong-password') {
          this.errorMessage = 'Sua senha está errada.'
        }
      }
    }
  }
}
</script>

<style>
.auth-card {
  padding: 0.9375rem 0.875rem;
}
.text-2xl {
  font-size: 1.5rem !important;
  line-height: 2rem !important;
}
.auth-wrapper {
  display: flex;
  min-height: 95vh;
  width: 100%;
  flex-basis: 100%;
  align-items: center;
}
</style>
