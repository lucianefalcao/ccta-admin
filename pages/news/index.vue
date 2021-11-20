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
          no-data-text="Nenhuma notícia cadastrada"
          :footer-props="{
            itemsPerPageAllText: 'Todas',
            itemsPerPageText: 'Items por página',
            itemsPerPageOptions: [10, 15, 20, -1]
          }"
        >
          <template #item.status="{ item }">
            <v-chip
              small
              :color="statusColor[item.status]"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <div class="text-end">
              <v-btn
                small
                depressed
                outlined
                color="secondary"
                @click="showNews(item.uid)"
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

interface StatusTranslateMap {
  draft: String,
  published: String
}

interface StatusColorMap {
  rascunho: String,
  publicado: String
}

@Component
export default class News extends Vue {
  news: {uid: String, title: String, status: String, actions: String}[] = []

  statusColor: StatusColorMap = {
    rascunho: 'info',
    publicado: 'success'
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
  errorMessage: String = ''

  createNews (): void {
    this.$router.push('/news/create')
  }

  showNews (itemUID: String): void {
    this.$router.push('/news/' + itemUID)
  }

  async mounted (): Promise<void> {
    try {
      this.fetchingNews = true
      const newsPosts = await newsStore.getAllNews()
      newsPosts.forEach((news) => {
        this.news.push({
          uid: news.uid!,
          title: news.title,
          status: this.statusMap[news.state],
          actions: ''
        })
      })
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao buscar as notícias. Por favor, tente novamento mais tarde.'
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
