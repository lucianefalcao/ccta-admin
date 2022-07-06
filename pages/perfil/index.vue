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
              v-model="nome"
              dense
              outlined
              label="Nome"
            />

            <campo-email dense :valor-inicial="email" @email="getEmail" @emailValido="getEmailValido" />
            <campo-senha dense label="Nova senha" @senha="getSenha" @senhaValida="getSenhaValida" />
          </v-col>

          <v-col cols="12" sm="6">
            <v-img src="/account.svg" contain max-height="250" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn depressed color="primary" :disabled="!podeAtualizar" @click="atualizar">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
    <snackbar
      v-if="snackbar"
      :color="snackbarCor"
      :snackbar="snackbar"
      :mensagem="mensagemErro"
      @fecharSnackbar="setSnackbar"
    />
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { usuarioStore } from '~/store'
import Snackbar from '~/components/Snackbar.vue'
import CampoSenha from '~/components/auth/CampoSenha.vue'
import CampoEmail from '~/components/auth/CampoEmail.vue'

@Component({
  components: {
    Snackbar,
    CampoSenha,
    CampoEmail
  }
})
export default class Perfil extends Vue {
  nome: string = usuarioStore.usuario.getNome()
  email: string = usuarioStore.usuario.getEmail()
  senha = ''
  usuario = usuarioStore.usuario

  snackbar = false
  senhaEstaVisivel = false
  snackbarCor = ''
  mensagemErro = ''
  emailValido = false
  senhaValida = false

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

  async atualizar (): Promise<void> {
    try {
      if (this.nome !== this.usuario.getNome()) {
        this.usuario.mudarNome(this.nome)
      }

      if (this.email !== this.usuario.getEmail()) {
        this.usuario.mudarEmail(this.email)
      }

      await usuarioStore.atualizar({
        usuario: this.usuario,
        senha: this.senha
      })

      this.mensagemErro = 'Suas informações foram atualizadas.'
      this.snackbarCor = 'green'
      this.snackbar = true
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao atualizar suas informações, por favor tente novamente.'
      this.snackbarCor = 'red'
      this.snackbar = true
    }
  }

  get podeAtualizar (): boolean {
    return this.emailValido && this.senhaValida && this.nome.length > 0
  }

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }
}
</script>
