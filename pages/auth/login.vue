<template>
  <v-container class="auth-wrapper pa-0">
    <v-row justify="space-around">
      <v-col align="center">
        <v-card class="auth-card" width="400">
          <v-alert v-if="menssagemErro !== ''" text type="error">
            {{ menssagemErro }}
          </v-alert>
          <v-card-title class="d-flex align-center justify-center">
            <logo-site />
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
              <campo-email @email="getEmail" @emailValido="getEmailValido" />
              <campo-senha @senha="getSenha" @senhaValida="getSenhaValida" />
              <v-btn
                block
                color="primary"
                class="mt-4"
                type="submit"
                :disabled="!podeFazerLogin || carregando"
                :loading="carregando"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-text>
            <nuxt-link to="/auth/primeiro-acesso">
              Primeiro acesso
            </nuxt-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { AuthErrorCodes } from '@firebase/auth'
import { usuarioStore } from '~/store/'
import CampoEmail from '~/components/auth/CampoEmail.vue'
import CampoSenha from '~/components/auth/CampoSenha.vue'
import LogoSite from '~/components/LogoSite.vue'

@Component({
  layout: 'empty',
  components: {
    CampoEmail,
    CampoSenha,
    LogoSite
  }
})
export default class Login extends Vue {
  email = ''
  senha = ''
  menssagemErro = ''
  carregando = false
  emailValido = false
  senhaValida = false

  get podeFazerLogin (): boolean {
    return this.emailValido && this.senhaValida
  }

  getEmail (email: string): void {
    this.email = email
  }

  getSenha (senha: string): void {
    this.senha = senha
  }

  getEmailValido (emailValido: boolean): void {
    this.emailValido = emailValido
  }

  getSenhaValida (senhaValida: boolean): void {
    this.senhaValida = senhaValida
  }

  async login (): Promise<void> {
    try {
      this.carregando = true
      await usuarioStore.login({ email: this.email, senha: this.senha })
      this.$router.push('/')
    } catch (e) {
      if (e.code === AuthErrorCodes.INVALID_EMAIL) {
        this.menssagemErro = 'O e-mail é inválido'
      } else if (e.code === AuthErrorCodes.USER_DELETED) {
        this.menssagemErro = 'Usuário não encontrado. Entre em contato com o administrador do sistema.'
      } else if (e.code === AuthErrorCodes.INVALID_PASSWORD) {
        this.menssagemErro = 'Senha incorreta.'
      } else {
        this.menssagemErro = 'Ocorreu um erro ao realizar o login.'
      }
    } finally {
      this.carregando = false
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
