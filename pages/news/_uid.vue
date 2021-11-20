<template>
  <v-col align-self="start">
    <div v-if="fetchingNews" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <v-card v-else class="pa-5">
      <v-card-title>
        <h2>
          {{ news.title }}
        </h2>
      </v-card-title>
      <v-card-text class="mb-5">
        <v-chip
          outlined
          small
          :color="statusColor[news.state]"
        >
          {{ statusMap[news.state] }}
        </v-chip>
        Escrito por {{ news.user.name }} • última atualização {{ dateCreated }}
      </v-card-text>
      <v-card-text class="black--text">
        <div v-html="news.newsText" />
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { newsStore } from '@/store'
import News from '~/models/domain/News'
import StatusColorMap from '~/models/helpers/StatusColorMap'
import StatusTranslateMap from '~/models/helpers/StatusTranslateMap'

@Component
export default class NewsUid extends Vue {
  news: News = {
    uid: undefined,
    title: undefined,
    newsText: undefined,
    state: undefined,
    dateCreated: undefined,
    datePublished: undefined,
    user: undefined
  }

  statusColor: StatusColorMap = {
    draft: 'info',
    published: 'success'
  }

  statusMap: StatusTranslateMap = {
    draft: 'rascunho',
    published: 'publicado'
  }

  fetchingNews: Boolean = true

  get dateCreated (): String {
    return new Date(this.news.dateCreated as number).toLocaleDateString('pt-BR')
  }

  get datePublished (): String {
    return new Date(this.news.datePublished as number).toLocaleDateString('pt-BR')
  }

  async beforeCreate (): Promise<void> {
    this.news = await newsStore.getNewsByUid(this.$route.params.uid)
    this.fetchingNews = false
  }
}
</script>
