<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-title>
        Sobre
        <v-spacer />
        <v-btn small color="primary" @click="atualizarCentroInfo">
          <v-icon left>
            mdi-plus
          </v-icon>
          {{ centroInfoBotaoTexto }}
        </v-btn>
      </v-card-title>
      <v-card-text>
        {{ descricaoCentro }}
      </v-card-text>

      <v-card-title>
        Cursos
        <v-spacer />
        <v-btn small color="primary" @click="publicarCurso">
          <v-icon left>
            mdi-plus
          </v-icon>
          Cadastrar curso
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :loading="carregandoDados"
          :options.sync="opcoes"
          :headers="headers"
          :items="cursos"
          :items-per-page="10"
          :no-data-text="mensagem"
          :server-items-length="totalItens"
          :footer-props="{
            itemsPerPageText: 'Items por página',
            itemsPerPageOptions: [10, 15, 20]
          }"
        >
          <template #item.tipo="{ item }">
            {{ tipo(item) }}
          </template>
          <template #item.subtipo="{ item }">
            {{ subtipo(item) }}
          </template>
          <template #item.actions="{ item }">
            <div class="text-end">
              <v-btn
                small
                depressed
                outlined
                color="secondary"
                @click="exibirCurso(item)"
              >
                Ver
              </v-btn>

              <v-btn
                icon
                color="secondary"
                @click="editarCurso(item)"
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
                @click="deletarCurso(item)"
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
  </v-col>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator'
import { centroStore, cursoStore } from '~/store'
import Centro from '~/src/aplicacao/centro/entidade/centro'
import Curso from '~/src/aplicacao/cursos/entidade/curso'
import { subtiposLegiveis, tiposLegiveis } from '~/utils/cursoHelper'

@Component
export default class Index extends Vue {
  headers = [
    {
      text: 'Curso',
      align: 'start',
      value: 'nome'
    },
    {
      text: 'Tipo',
      value: 'tipo'
    },
    {
      text: 'Subtipo',
      value: 'subtipo'
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

  cursos: Curso[] = []
  centro: Centro = null

  opcoes = {}
  totalItens = 0

  mensagem = 'Nenhum curso cadastrado'
  uid = ''
  mensagemErro = ''
  snackbar = false

  carregandoDados = false
  estaDeletando = false

  get existeInfoCentro (): boolean {
    return this.centro?.getId() !== undefined
  }

  get centroInfoBotaoTexto (): string {
    return this.existeInfoCentro ? 'Editar informações do centro' : 'Cadastrar informações do centro'
  }

  get descricaoCentro (): string {
    return this.existeInfoCentro ? this.centro?.getDescricao() : 'Nenhuma informação cadastrada.'
  }

  atualizarCentroInfo (): void {
    if (this.existeInfoCentro) {
      centroStore.context.commit('setCentro', this.centro)
      this.$router.push(`/info-centro/editar/${this.centro.getId()}`)
    } else {
      this.$router.push('/info-centro/publicar')
    }
  }

  publicarCurso (): void {
    this.$router.push('/info-centro/cursos/publicar')
  }

  editarCurso (item: Curso): void {
    cursoStore.context.commit('setCursoSelecionado', item)
    this.$router.push(`/info-centro/cursos/editar/${item.getId()}`)
  }

  exibirCurso (item: Curso): void {
    cursoStore.context.commit('setCursoSelecionado', item)
    this.$router.push(`/info-centro/cursos/${item.getId()}`)
  }

  tipo (item: Curso): string {
    return tiposLegiveis[item.getTipo()]
  }

  subtipo (item: Curso): string {
    return subtiposLegiveis[item.getSubtipo()]
  }

  async deletarCurso (item: Curso): Promise<void> {
    try {
      this.uid = item.getId()
      this.estaDeletando = true
      await cursoStore.deletar(item.getId())
      this.cursos = this.cursos.filter(c => c.getId() !== item.getId())
    } catch (error) {
      this.mensagemErro = 'Ocorreu um erro ao deletar o edital.'
      this.snackbar = true
    } finally {
      this.uid = ''
      this.estaDeletando = false
    }
  }

  async beforeCreate (): Promise<void> {
    try {
      this.carregandoDados = true
      this.centro = await centroStore.getCentro()
      const docSnap = await this.$fire.firestore.collection('contadores').doc('cursos').get()
      if (docSnap.exists) {
        this.totalItens = docSnap.data().total
      }
    } catch (error) {
      this.mensagem = 'Ocorreu um erro ao buscar as informações. Por favor, tente novamento mais tarde.'
    } finally {
      this.carregandoDados = false
    }
  }

  async buscarItens (paginaAtual: number, itensPorPagina: number, paginaAnterior: number): Promise<void> {
    this.carregandoDados = true
    this.cursos = await cursoStore.getItens({ paginaAtual, paginaAnterior, itensPorPagina })
    this.carregandoDados = false
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
