<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-actions>
        <botao-voltar />
      </v-card-actions>
      <v-card-title class="mb-5">
        Cadastrar usuário
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col sm="6" cols="12">
            <v-text-field
              v-model="nome"
              label="Nome"
              outlined
              dense
            />
          </v-col>
          <v-col sm="6" cols="12">
            <campo-email dense @email="getEmail" @emailValido="getEmailValido" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          depressed
          color="primary"
          :disabled="!podeRegistrar || estaSalvando"
          :loading="estaSalvando"
          @click="register"
        >
          Cadastrar
        </v-btn>
      </v-card-actions>
    </v-card>
    <snackbar
      v-if="snackbar"
      :snackbar="snackbar"
      :mensagem="mensagemErro"
      @fecharSnackbar="setSnackbar"
    />
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { FirebaseError } from '@firebase/util'
import { v4 } from 'uuid'
import Snackbar from '~/components/Snackbar.vue'
import { usuarioStore } from '~/store'
import CampoEmail from '~/components/auth/CampoEmail.vue'
import BotaoVoltar from '~/components/BotaoVoltar.vue'
import Usuario, { UsuarioEstado } from '~/src/aplicacao/usuarios/entidade/usuario'

@Component({
  components: {
    Snackbar,
    CampoEmail,
    BotaoVoltar
  }
})
export default class Registrar extends Vue {
  nome = ''
  email = ''
  mensagemErro = ''
  emailValido = false

  snackbar = false
  estaSalvando = false

  getEmail (email: string): void {
    this.email = email
  }

  getEmailValido (emailValido: boolean): void {
    this.emailValido = emailValido
  }

  get podeRegistrar (): boolean {
    return this.emailValido && this.nome.length > 0
  }

  async register (): Promise<void> {
    try {
      this.estaSalvando = true

      const usuario = new Usuario(
        v4(),
        this.nome,
        this.email,
        [],
        UsuarioEstado.ATIVO
      )

      await usuarioStore.criarUsuario(usuario)
      this.$router.push(`/usuarios/permissoes/${usuario.getId()}`)
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'functions/unauthenticated') {
          this.mensagemErro = 'Você não está autenticado. Por favor, realize o login novamente.'
          this.snackbar = true
        } else if (error.code === 'functions/already-exists') {
          this.mensagemErro = 'Este email já está cadastrado para outro usuário'
          this.snackbar = true
        }
      }
    } finally {
      this.estaSalvando = false
    }
  }

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }
}
</script>
