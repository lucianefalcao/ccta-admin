<template>
  <v-container class="auth-wrapper pa-0">
    <v-row justify="space-around">
      <v-col align="center">
        <v-card class="auth-card" width="400">
          <v-alert v-if="showAlert" text :type="alertType">
            {{ alertMessage }}
          </v-alert>

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
              Primeiro acesso
            </p>
          </v-card-title>

          <v-card-text>
            <p class="mb-2">
              {{ instructionMessage }}
            </p>
          </v-card-text>

          <v-card-text>
            <validation-observer
              ref="observer"
              v-slot="{invalid}"
            >
              <v-form @submit.prevent="buttonAction">
                <validation-provider
                  v-if="!emailVerified"
                  v-slot="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="email"
                    outlined
                    label="Email"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>

                <validation-provider
                  v-else
                  v-slot="{ errors }"
                  name="Password"
                  rules="required|min:6"
                >
                  <v-text-field
                    v-model="password"
                    label="Criar senha"
                    class="mb-3"
                    outlined
                    required
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    :error-messages="errors"
                    @click:append="isPasswordVisible = !isPasswordVisible"
                  />
                </validation-provider>

                <v-btn
                  block
                  color="primary"
                  class="mt-6"
                  type="submit"
                  :disabled="invalid"
                >
                  {{ buttonName }}
                </v-btn>
              </v-form>
            </validation-observer>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { FirebaseError } from '@firebase/util'
import { required, email, min } from 'vee-validate/dist/rules'
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate'
import { userStore } from '@/store/index'
import User from '~/models/domain/User'

extend('required', {
  ...required,
  message: 'Este campo não pode ser vazio.'
})

extend('min', {
  ...min,
  message: 'A senha precisa de no mínimo 6 dígitos.'
})

extend('email', {
  ...email,
  message: 'Por favor, adicione um email válido.'
})

@Component({
  layout: 'empty',
  components: {
    ValidationProvider,
    ValidationObserver
  }
})
export default class PrimeiroAcesso extends Vue {
  email: String = ''
  password: String = ''
  errorMessage: String = ''
  successMessage: String = ''
  alertType: String = 'error'
  emailVerified: Boolean = false
  isPasswordVisible: Boolean = false
  user: User = {
    uid: undefined,
    email: undefined,
    name: undefined,
    state: 'A'
  }

  get buttonName () {
    return this.emailVerified ? 'Salvar' : 'Verificar email'
  }

  get showAlert () {
    return this.errorMessage.length !== 0 || this.successMessage.length !== 0
  }

  get alertMessage () {
    return this.errorMessage.length !== 0 ? this.errorMessage : this.successMessage
  }

  get instructionMessage () {
    return this.emailVerified ? 'Por favor, crie uma senha' : 'Por favor, informe seu email'
  }

  async buttonAction () {
    if (this.emailVerified) {
      await this.createPassword()
    } else {
      await this.verifyEmail()
    }
  }

  async createPassword () {
    try {
      const u = this.user.uid!
      await userStore.createPassword({ password: this.password, uid: u })
      await userStore.signIn({ email: this.email, password: this.password })
    } catch (e) {
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/user-not-found') {
          this.errorMessage = 'Usuário não encontrado. Entre em contato com o administrador do sistema.'
        } else if (e.code === 'auth/wrong-password') {
          this.errorMessage = 'Senha incorreta.'
        }
        this.errorMessage = 'Não foi possível criar uma nova senha. Por favor, tente novamente.'
        this.alertType = 'error'
      } else {
        this.errorMessage = 'Não foi possível criar uma nova senha. Por favor, tente novamente.'
        this.alertType = 'error'
      }
    }
  }

  async verifyEmail () {
    try {
      const users = await userStore.verifyEmail(this.email)

      if (users.length === 0) {
        this.errorMessage = 'O seu email não está cadastrado. Por favor, contate o administrador do sistema.'
        return
      }

      this.user = users[0]
      this.emailVerified = true
      this.successMessage = 'Seu email foi verificado. Por favor, crie uma senha para o acesso.'
      this.alertType = 'success'
    } catch (e) {
      this.errorMessage = 'Não foi possível verificar seu email. Por favor, tente novamente.'
    }
  }
}
</script>

<style scoped>
.auth-card {
  padding: 0.9375rem 0.875rem;
}
.text-2xl {
  font-size: 1.5rem !important;
  line-height: 2rem !important;
}
.auth-wrapper {
  display: flex;
  height: 95vh;
  width: 100%;
  flex-basis: 100%;
  align-items: center;
}
</style>
