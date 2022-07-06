<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-title>Usuários</v-card-title>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="registrar">
          <v-icon left>
            mdi-plus
          </v-icon>
          Cadastrar usuário
        </v-btn>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :loading="buscandoDados"
          :options.sync="opcoes"
          loading-text="Carregando..."
          :headers="headers"
          :items="usuarios"
          :items-per-page="10"
          :no-data-text="mensagem"
          :server-items-length="totalItens"
          :footer-props="{
            itemsPerPageText: 'Items por página',
            itemsPerPageOptions: [10, 15, 20]
          }"
        >
          <template #item.status="{ item }">
            <news-status-chip :item-state="item.state" />
          </template>

          <template #item.actions="{ item }">
            <div class="text-end">
              <v-btn
                small
                depressed
                outlined
                color="secondary"
                @click="gerenciar(item)"
              >
                Gerenciar
              </v-btn>
              <v-btn
                icon
                class="text-right"
                color="red"
                :loading="estaDeletando && item.getId() === uid"
                @click="deleteUser(item)"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
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

import { Component, Vue, Watch } from 'vue-property-decorator'
import { usuarioStore } from '~/store'
import Usuario from '~/src/aplicacao/usuarios/entidade/usuario'

@Component
export default class Index extends Vue {
  usuarios: Usuario[] = []

  opcoes = {}
  totalItens = 0

  buscandoDados = false
  estaDeletando = false
  snackbar = false
  uid = ''
  mensagem = 'Nenhum usuário cadastrado'
  mensagemErro = ''

  headers = [
    {
      text: 'Nome',
      align: 'start',
      value: 'nome'
    },
    {
      text: 'Opções',
      value: 'actions',
      align: 'center',
      class: 'v-data-table-header',
      sortable: false,
      width: '220px'
    }
  ]

  registrar (): void {
    this.$router.push('/usuarios/registrar')
  }

  gerenciar (item: Usuario): void {
    this.$router.push(`/usuarios/permissoes/${item.getId()}`)
  }

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async deleteUser (item: Usuario): Promise<void> {
    try {
      this.uid = item.getId()
      this.estaDeletando = true
      await usuarioStore.deletar(item)
      this.usuarios = this.usuarios.filter(u => u.getId() !== item.getId())
    } catch (error) {
      this.mensagemErro = 'Não foi possível deletar o usuário'
      this.snackbar = true
    } finally {
      this.uid = ''
      this.estaDeletando = false
    }
  }

  async mounted (): Promise<void> {
    try {
      this.buscandoDados = true
      const docSnap = await this.$fire.firestore.collection('contadores').doc('usuarios').get()
      if (docSnap.exists) {
        this.totalItens = docSnap.data().total
      }
    } catch (error) {
      this.mensagem = 'Ocorreu um erro ao buscar os usuarios. Por favor, tente novamento mais tarde.'
    } finally {
      this.buscandoDados = false
    }
  }

  async buscarItens (paginaAtual: number, itensPorPagina: number, paginaAnterior: number): Promise<void> {
    this.buscandoDados = true
    this.usuarios = await usuarioStore.getItens({ paginaAtual, paginaAnterior, itensPorPagina })
    this.buscandoDados = false
  }

  @Watch('opcoes', { deep: true })
  async onOpcoesChanged (
    { page, itemsPerPage }: {page: number, itemsPerPage: number},
    anterior: any
  ): Promise<void> {
    await this.buscarItens(page, itemsPerPage, anterior.page ?? 1)
  }
}
</script>
