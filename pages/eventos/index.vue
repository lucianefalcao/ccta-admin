<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="publicarEvento">
          <v-icon left>
            mdi-plus
          </v-icon>
          Publicar Evento
        </v-btn>
      </v-card-actions>

      <v-card-text>
        <v-data-table
          :loading="buscandoDados"
          :options.sync="opcoes"
          loading-text="Carregando..."
          :headers="cabecalho"
          :items="eventos"
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
                @click="exibirEvento(item)"
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
                @click="deletarEvento(item)"
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
import { eventoStore } from '~/store'
import Evento from '~/src/aplicacao/eventos/entidade/evento'
import Snackbar from '~/components/Snackbar.vue'

@Component({
  components: {
    Snackbar
  }
})
export default class Index extends Vue {
  cabecalho = [
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
  snackbar = false
  eventos: Evento[] = []
  mensagem = 'Nenhum evento cadastrado'
  uid = ''
  mensagemErro = ''

  publicarEvento (): void {
    this.$router.push('/eventos/publicar')
  }

  editar (evento: Evento): void {
    eventoStore.context.commit('setEventoSelecionado', evento)
    this.$router.push(`/eventos/editar/${evento.getId()}`)
  }

  exibirEvento (evento: Evento): void {
    eventoStore.context.commit('setEventoSelecionado', evento)
    this.$router.push(`/eventos/${evento.getId()}`)
  }

  async deletarEvento (item: Evento): Promise<void> {
    try {
      this.uid = item.getId()
      this.estaDeletando = true
      await eventoStore.deletar(item.getId())
      this.eventos = this.eventos.filter(e => e.getId() !== item.getId())
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao deletar o edital.'
      this.snackbar = true
    } finally {
      this.uid = ''
      this.estaDeletando = false
    }
  }

  setSnackbar (snackbar: boolean): void {
    this.snackbar = snackbar
  }

  async mounted (): Promise<void> {
    try {
      this.buscandoDados = true
      const docSnap = await this.$fire.firestore.collection('contadores').doc('eventos').get()
      if (docSnap.exists) {
        this.totalItens = docSnap.data().total
      }
    } catch (error) {
      this.mensagem = 'Ocorreu um erro ao buscar os eventos. Por favor, tente novamento mais tarde.'
    } finally {
      this.buscandoDados = false
    }
  }

  async buscarItens (paginaAtual: number, itensPorPagina: number, paginaAnterior: number): Promise<void> {
    this.buscandoDados = true
    this.eventos = await eventoStore.getItens({ paginaAtual, paginaAnterior, itensPorPagina })
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
