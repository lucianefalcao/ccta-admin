<template>
  <v-container class="auth-wrapper pa-0">
    <v-row justify="space-around">
      <v-col align="center">
        <v-card class="auth-card" width="400">
          <v-alert v-if="errorMessage !== ''" text type="error">
            {{ errorMessage }}
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
            <validation-observer
              ref="observer"
              v-slot="{invalid}"
            >
              <v-form @submit.prevent="login">
                <validation-provider
                  v-slot="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="email"
                    outlined
                    label="Email"
                    class="mb-3"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Password"
                  rules="required|min:6"
                >
                  <v-text-field
                    v-model="password"
                    label="Senha"
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
                  Login
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
import { extend, ValidationProvider, ValidationObserver, setInteractionMode } from 'vee-validate'
import { userStore } from '@/store/index'

setInteractionMode('eager')

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
export default class Index extends Vue {
  email: String = ''
  password: String = ''
  isPasswordVisible: Boolean = false
  errorMessage: String = ''

  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }

  async login (): Promise<void> {
    try {
      if (await this.$refs.observer.validate()) {
        await userStore.signIn({ email: this.email, password: this.password })
        this.$router.push('/')
      } else {
        this.errorMessage = 'Os dados inseridos são inválidos.'
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/user-not-found') {
          this.errorMessage = 'Usuário não encontrado. Entre em contato com o administrador do sistema.'
        } else if (e.code === 'auth/wrong-password') {
          this.errorMessage = 'Senha incorreta.'
        }
      }
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
