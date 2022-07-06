<template>
  <v-container class="auth-wrapper pa-0">
    <v-row justify="space-around">
      <v-col align="center">
        <v-card class="auth-card" width="400">
          <v-alert v-if="exibirAlerta" text :type="tipoAlerta">
            {{ mensagemAlerta }}
          </v-alert>

          <v-card-title class="d-flex align-center justify-center">
            <logo-site />
            <p class="text-2xl font-weight-medium mb-0">
              Primeiro acesso
            </p>
          </v-card-title>

          <v-card-text>
            <p class="mb-2">
              {{ mensagemInstrucao }}
            </p>
          </v-card-text>

          <v-card-text>
            <v-form @submit.prevent="acaoBotao">
              <campo-email v-if="!emailVerificado" @email="getEmail" @emailValido="getEmailValido" />
              <campo-senha v-else label="Criar senha" @senha="getSenha" @senhaValida="getSenhaValida" />
              <v-btn
                block
                color="primary"
                class="mt-4"
                type="submit"
                :disabled="carregando"
                :loading="carregando"
              >
                {{ textoBotao }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { FirebaseError } from '@firebase/util'
import { AuthErrorCodes } from '@firebase/auth'
import { usuarioStore } from '~/store/'
import CampoEmail from '~/components/auth/CampoEmail.vue'
import CampoSenha from '~/components/auth/CampoSenha.vue'
import Usuario from '~/src/aplicacao/usuarios/entidade/usuario'
import LogoSite from '~/components/LogoSite.vue'

@Component({
  layout: 'empty',
  components: {
    CampoEmail,
    CampoSenha,
    LogoSite
  }
})
export default class PrimeiroAcesso extends Vue {
  email = ''
  senha = ''
  mensagemErro = ''
  mensagemSucesso = ''
  tipoAlerta = 'error'
  emailVerificado = false
  emailValido = false
  senhaValida = false
  carregando = false
  usuario: Usuario

  get textoBotao (): string {
    return this.emailVerificado ? 'Salvar' : 'Verificar email'
  }

  get exibirAlerta (): boolean {
    return this.mensagemErro.length !== 0 || this.mensagemSucesso.length !== 0
  }

  get mensagemAlerta (): string {
    return this.mensagemErro.length !== 0 ? this.mensagemErro : this.mensagemSucesso
  }

  get mensagemInstrucao (): string {
    return this.emailVerificado ? 'Por favor, crie uma senha' : 'Por favor, informe seu email'
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

  async acaoBotao (): Promise<void> {
    if (this.emailVerificado) {
      await this.criarSenha()
    } else {
      await this.verificarEmail()
    }
  }

  async criarSenha (): Promise<void> {
    try {
      if (this.usuario === null) {
        this.mensagemErro = 'O usuário não está definido.'
        return
      }

      if (!this.emailValido) {
        this.mensagemErro = 'Por favor, informe um e-mail válido.'
        return
      }

      if (!this.senhaValida) {
        this.mensagemErro = 'A senha é obrigatória e deve possuir no mínimo 6 caracteres.'
        return
      }

      await usuarioStore.criarSenha({ uid: this.usuario.getId(), senha: this.senha })
      await usuarioStore.login({ email: this.email, senha: this.senha })
      this.$router.push('/')
    } catch (e) {
      if (e instanceof FirebaseError) {
        if (e.code === AuthErrorCodes.USER_DELETED) {
          this.mensagemErro = 'Usuário não encontrado. Entre em contato com o administrador do sistema.'
        } else if (e.code === AuthErrorCodes.INVALID_PASSWORD) {
          this.mensagemErro = 'Senha incorreta.'
        }
        this.mensagemErro = 'Não foi possível criar uma nova senha. Por favor, tente novamente.'
        this.tipoAlerta = 'error'
      } else {
        this.mensagemErro = 'Não foi possível criar uma nova senha. Por favor, tente novamente.'
        this.tipoAlerta = 'error'
      }
    }
  }

  async verificarEmail (): Promise<void> {
    try {
      this.mensagemErro = ''
      if (!this.emailValido) {
        this.mensagemErro = 'Por favor, informe um e-mail válido.'
        return
      }

      this.carregando = true
      this.usuario = await usuarioStore.verificarEmail(this.email)
      if (this.usuario === null) {
        this.mensagemErro = 'O seu email não está cadastrado. Por favor, contate o administrador do sistema.'
        return
      }
      this.emailVerificado = true
      this.mensagemSucesso = 'Seu email foi verificado. Por favor, crie uma senha para o acesso.'
      this.tipoAlerta = 'success'
    } catch (e) {
      this.mensagemErro = 'Não foi possível verificar seu email. Por favor, tente novamente.'
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
