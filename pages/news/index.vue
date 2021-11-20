<template>
  <v-col align-self="start">
    <v-card class="pa-5">
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="createNews">
          <v-icon left>
            {{ icons.mdiPlus }}
          </v-icon>
          Cadastrar notícia
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <div v-if="fetchingNews" class="text-center">
          <v-progress-circular
            color="primary"
            indeterminate
          />
        </div>

        <v-data-table
          v-else
          :headers="headers"
          :items="news"
          :items-per-page="10"
          :no-data-text="message"
          :footer-props="{
            itemsPerPageAllText: 'Todas',
            itemsPerPageText: 'Items por página',
            itemsPerPageOptions: [10, 15, 20, -1]
          }"
        >
          <template #item.status="{ item }">
            <v-chip
              small
              :color="statusColor[item.state]"
            >
              {{ statusMap[item.state] }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <div class="text-end">
              <v-btn
                small
                depressed
                outlined
                color="secondary"
                @click="showNews(item)"
              >
                Ver
              </v-btn>

              <v-btn
                icon
                color="secondary"
              >
                <v-icon>
                  {{ icons.mdiPencil }}
                </v-icon>
              </v-btn>
              <v-btn
                icon
                class="text-right"
                color="red"
              >
                <v-icon>
                  {{ icons.mdiDelete }}
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

import { Component, Vue } from 'vue-property-decorator'
import { mdiDelete, mdiPencil, mdiPlus } from '@mdi/js'
import { newsStore } from '@/store'
import StatusTranslateMap from '@/models/helpers/StatusTranslateMap'
import StatusColorMap from '@/models/helpers/StatusColorMap'
import News from '@/models/domain/News'

@Component
export default class Index extends Vue {
  news: News[] = []

  statusColor: StatusColorMap = {
    draft: 'info',
    published: 'success'
  }

  statusMap: StatusTranslateMap = {
    draft: 'rascunho',
    published: 'publicado'
  }

  icons = {
    mdiDelete,
    mdiPencil,
    mdiPlus
  }

  headers = [
    {
      text: 'Título',
      align: 'start',
      value: 'title'
    },
    {
      text: 'Status',
      align: 'center',
      value: 'status'
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

  fetchingNews: Boolean = false
  message: String = ''

  createNews (): void {
    this.$router.push('/news/create')
  }

  showNews (item: News): void {
    this.$router.push('/news/' + item.uid)
  }

  async mounted (): Promise<void> {
    try {
      this.fetchingNews = true
      this.news = await newsStore.getAllNews()
    } catch (error) {
      this.message = 'Ocorreu um erro ao buscar as notícias. Por favor, tente novamento mais tarde.'
    } finally {
      this.fetchingNews = false
    }
  }
}
</script>

<style lang="scss" scoped>
.v-data-table-header th {
  white-space: nowrap;
}
</style>
