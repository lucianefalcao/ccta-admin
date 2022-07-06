<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="criarNoticia">
          <v-icon left>
            mdi-plus
          </v-icon>
          Cadastrar notícia
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-data-table
          :loading="buscandoDados"
          :options.sync="opcoes"
          loading-text="Carregando..."
          :headers="headers"
          :items="noticias"
          :items-per-page="10"
          :no-data-text="mensagem"
          :server-items-length="totalItens"
          :footer-props="{
            itemsPerPageText: 'Items por página',
            itemsPerPageOptions: [10, 15, 20]
          }"
        >
          <template #item.estado="{ item }">
            <noticia-estado-chip :estado-item="item.getEstado()" />
          </template>

          <template #item.actions="{ item }">
            <div class="text-end">
              <v-btn
                small
                depressed
                outlined
                color="secondary"
                @click="exibirNoticia(item)"
              >
                Ver
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
import { noticiaStore } from '~/store'
import Noticia from '~/src/aplicacao/noticias/entidade/noticia'
import NoticiaEstadoChip from '~/components/noticias/NoticiaEstadoChip.vue'
import Snackbar from '~/components/Snackbar.vue'

@Component({
  components: {
    NoticiaEstadoChip,
    Snackbar
  }
})
export default class Index extends Vue {
  noticias: Noticia[] = []

  headers = [
    {
      text: 'Título',
      align: 'start',
      value: 'titulo',
      sortable: false
    },
    {
      text: 'Status',
      align: 'center',
      value: 'estado',
      sortable: false
    },
    {
      text: 'Opções',
      value: 'actions',
      align: 'center',
      class: 'v-data-table-header',
      sortable: false,
      width: '170px'
    }
  ]

  opcoes = {}
  totalItens = 0

  buscandoDados = false
  mensagem = 'Nenhuma notícia cadastrada'
  mensagemErro = ''
  estaDeletando = false
  uid = ''
  snackbar = false

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  criarNoticia (): void {
    this.$router.push('/noticias/criar')
  }

  exibirNoticia (item: Noticia): void {
    noticiaStore.context.commit('setNoticiaSelecionada', item)
    this.$router.push('/noticias/' + item.getId())
  }

  editar (item: Noticia): void {
    noticiaStore.context.commit('setNoticiaSelecionada', item)
    this.$router.push('/noticias/editar/' + item.getId())
  }

  async deletar (item: Noticia): Promise<void> {
    try {
      this.uid = item.getId()
      this.estaDeletando = true
      await noticiaStore.deletar(item)
      this.noticias = this.noticias.filter(n => n.getId() !== item.getId())
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao deletar a notícia.'
      this.snackbar = true
    } finally {
      this.uid = ''
      this.estaDeletando = false
    }
  }

  async mounted (): Promise<void> {
    try {
      this.buscandoDados = true
      const docSnap = await this.$fire.firestore.collection('contadores').doc('noticias').get()
      if (docSnap.exists) {
        this.totalItens = docSnap.data().total
      }
    } catch (error) {
      this.mensagem = 'Ocorreu um erro ao buscar as notícias. Por favor, tente novamento mais tarde.'
    } finally {
      this.buscandoDados = false
    }
  }

  async buscarItens (paginaAtual: number, itensPorPagina: number, paginaAnterior: number): Promise<void> {
    this.buscandoDados = true
    this.noticias = await noticiaStore.getItens({ paginaAtual, paginaAnterior, itensPorPagina })
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

<style lang="scss" scoped>
.v-data-table-header th {
  white-space: nowrap;
}
</style>
