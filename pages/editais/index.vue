<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="publicar">
          <v-icon left>
            mdi-plus
          </v-icon>
          Publicar Edital
        </v-btn>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :loading="buscandoDados"
          :options.sync="opcoes"
          loading-text="Carregando..."
          :headers="headers"
          :items="editais"
          :items-per-page="10"
          :no-data-text="mensagem"
          :server-items-length="totalItens"
          :footer-props="{
            itemsPerPageText: 'Items por página',
            itemsPerPageOptions: [10, 15, 20]
          }"
        >
          <template #item.actions="{ item }">
            <div class="text-end">
              <v-btn
                small
                depressed
                outlined
                color="secondary"
                :loading="baixandoDocumento && item.getId() === uid"
                @click="download(item)"
              >
                Donwload
              </v-btn>

              <v-btn
                icon
                color="secondary"
                @click="editar(item)"
              >
                <v-icon>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn
                icon
                class="text-right"
                color="red"
                :loading="estaDeletando && item.getId() === uid"
                @click="deletar(item)"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>

      <snackbar
        v-if="snackbar"
        :snackbar="snackbar"
        :mensagem="mensagemErro"
        @fecharSnackbar="setSnackbar"
      />
    </v-card>
  </v-col>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator'
import { editalStore } from '~/store'
import Edital from '~/src/aplicacao/editais/entidade/edital'

@Component
export default class Index extends Vue {
  headers = [
    {
      text: 'Título',
      align: 'start',
      value: 'titulo'
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

  opcoes = {}
  totalItens = 0

  buscandoDados = false
  estaDeletando = false
  baixandoDocumento = false
  snackbar = false
  editais: Edital[] = []
  mensagem = 'Nenhum edital cadastrado'
  uid = ''
  mensagemErro = ''

  publicar (): void {
    this.$router.push('/editais/publicar')
  }

  editar (edital: Edital): void {
    editalStore.context.commit('setEditalSelecionado', edital)
    this.$router.push(`/editais/editar/${edital.getId()}`)
  }

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async deletar (item: Edital): Promise<void> {
    try {
      this.uid = item.getId()
      this.estaDeletando = true
      await editalStore.deletar(item)
      this.editais = this.editais.filter(e => e.getId() !== item.getId())
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao deletar o edital.'
      this.snackbar = true
    } finally {
      this.uid = ''
      this.estaDeletando = false
    }
  }

  async download (item: Edital): Promise<void> {
    try {
      this.uid = item.getId()
      this.baixandoDocumento = true
      const documentoUrl = await editalStore.getDocumentoLink(item.getDocumento())

      const link = document.createElement('a') as HTMLAnchorElement
      link.href = documentoUrl
      link.download = item.getDocumento().split('/')[1]
      link.target = '_blank'
      link.click()
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro baixar o edital.'
      this.snackbar = true
    } finally {
      this.uid = ''
      this.baixandoDocumento = false
    }
  }

  async mounted (): Promise<void> {
    try {
      this.buscandoDados = true
      const docSnap = await this.$fire.firestore.collection('contadores').doc('editais').get()
      if (docSnap.exists) {
        this.totalItens = docSnap.data().total
      }
    } catch (error) {
      console.log(error)
      this.mensagem = 'Ocorreu um erro ao buscar os editais. Por favor, tente novamento mais tarde.'
    } finally {
      this.buscandoDados = false
    }
  }

  async buscarItens (paginaAtual: number, itensPorPagina: number, paginaAnterior: number): Promise<void> {
    this.buscandoDados = true
    this.editais = await editalStore.getItens({ paginaAtual, paginaAnterior, itensPorPagina })
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
