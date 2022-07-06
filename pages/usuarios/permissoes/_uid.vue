<template>
  <v-col align-self="start">
    <div v-if="buscandoDados" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <v-card v-else class="pa-5">
      <v-card-actions>
        <botao-voltar rota="/usuarios" />
      </v-card-actions>
      <v-card-title class="text-h4">
        Permissões
      </v-card-title>

      <v-card-title class="pb-0">
        {{ usuarioNome }}
      </v-card-title>
      <v-card-text class="text-subtitle-1">
        {{ usuarioEmail }}
      </v-card-text>

      <v-card-text>
        <v-row justify="start">
          <v-col
            v-for="(permissao,i) in permissoes"
            :key="i"
            sm="6"
            cols="12"
          >
            <v-card outlined>
              <v-card-text>
                <v-row justify="space-between" align="center">
                  <v-col class="py-0">
                    <v-switch
                      v-model="permissoesSelecionadas"
                      :label="permissao.label"
                      :value="permissao.codigo"
                      color="success"
                    />
                  </v-col>
                </v-row>

                <v-divider />

                <div class="text--primary pt-2">
                  {{ permissao.descricao }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          depressed
          color="primary"
          :loading="estaSalvando"
          :disabled="estaSalvando"
          @click="salvar"
        >
          Salvar
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
import Usuario, { Permissao } from '~/src/aplicacao/usuarios/entidade/usuario'
import Snackbar from '~/components/Snackbar.vue'
import BotaoVoltar from '~/components/BotaoVoltar.vue'
import { usuarioStore } from '~/store'

@Component({
  components: {
    Snackbar,
    BotaoVoltar
  }
})
export default class PermissoesUsuario extends Vue {
  usuario: Usuario

  mensagemErro = ''
  snackbar = false
  estaSalvando = false
  buscandoDados = true

  permissoesSelecionadas: Permissao[] = []

  permissoes: {codigo: string, label: string, descricao: string}[] = [
    {
      codigo: 'gerenciar-usuarios',
      label: 'Gerenciar usuários',
      descricao: 'O usuário com está permissão poderá cadastrar e excluir outros usuários, assim como definir suas permissões.'
    },
    {
      codigo: 'gerenciar-eventos',
      label: 'Gerenciar eventos',
      descricao: 'O usuário com está permissão poderá publicar, editar e excluir eventos.'
    },
    {
      codigo: 'gerenciar-editais',
      label: 'Gerenciar editais',
      descricao: 'O usuário com está permissão poderá publicar, editar e excluir editais.'
    },
    {
      codigo: 'gerenciar-noticias',
      label: 'Gerenciar notícias',
      descricao: 'O usuário com está permissão poderá cadastrar, editar e excluir notícias.'
    },
    {
      codigo: 'gerenciar-chat',
      label: 'Gerenciar atendimento',
      descricao: 'O usuário com está permissão poderá realizar os atendimentos onlines.'
    },
    {
      codigo: 'gerenciar-info-centro',
      label: 'Gerenciar informações do centro',
      descricao: 'O usuário com está permissão poderá cadastrar, editar e excluir informações do centro.'
    }
  ]

  get usuarioNome (): string {
    return this.usuario?.getNome() ?? 'Usuário não identificado'
  }

  get usuarioEmail (): string {
    return this.usuario?.getEmail() ?? ''
  }

  get usuarioPermissoes (): Permissao[] {
    return this.usuario?.getPermissoes() ?? []
  }

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async salvar (): Promise<void> {
    try {
      this.estaSalvando = true
      this.usuario.modificarPermissoes(this.permissoesSelecionadas)
      await usuarioStore.atualizarPermissoes(this.usuario)

      this.$router.push('/usuarios')
    } catch (error) {
      this.mensagemErro = 'Não foi possível salvar as alterações. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.estaSalvando = false
    }
  }

  async mounted (): Promise<void> {
    try {
      this.usuario = await usuarioStore.getUsuarioPorId(this.$route.params.uid)

      this.permissoesSelecionadas = this.usuarioPermissoes
    } catch (e) {
      this.mensagemErro = 'Ocorreu um erro ao buscar o usuário. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.buscandoDados = false
    }
  }
}
</script>
