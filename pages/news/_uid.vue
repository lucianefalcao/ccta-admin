<template>
  <v-col align-self="start">
    <div v-if="fetchingNews" class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>
    <v-card v-else class="pa-5">
      <v-card-actions class="mb-10">
        <back-button />
        <v-spacer />
        <v-btn
          depressed
          color="secondary"
          @click="editar"
        >
          Editar
        </v-btn>
        <v-btn
          v-if="!isPublished"
          depressed
          color="primary"
          @click="publish"
        >
          Publicar
        </v-btn>
      </v-card-actions>

      <v-card-text class="text-center">
        <v-img contain :src="coverURL" max-height="600" />
      </v-card-text>

      <v-card-title style="word-break: break-word;">
        <h2>
          {{ news.title }}
        </h2>
      </v-card-title>
      <v-card-text class="mb-5">
        <news-status-chip :item-state="news.state" :is-outlined="true" />
        Escrito por {{ news.user.name }} • última atualização {{ lastModified }}
      </v-card-text>

      <v-card-text class="black--text">
        <div v-html="news.newsText" />
      </v-card-text>
    </v-card>

    <snackbar
      v-if="snackbar"
      :snackbar="snackbar"
      :message="errorMessage"
      @closeSnackbar="setSnackbar"
    />
  </v-col>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { newsStore } from '@/store'
import News from '~/models/domain/News'
import BackButton from '@/components/BackButton.vue'
import Snackbar from '@/components/Snackbar.vue'

@Component({
  components: {
    BackButton,
    Snackbar
  }
})
export default class NewsUid extends Vue {
  news: News = {
    uid: undefined,
    title: undefined,
    newsText: undefined,
    state: undefined,
    lastModified: undefined,
    user: undefined
  }

  coverURL: String = ''
  errorMessage: String = ''
  fetchingNews: Boolean = true
  isPublished: Boolean = false
  snackbar: Boolean = false

  get lastModified (): String {
    return new Date(this.news.lastModified as number).toLocaleDateString('pt-BR')
  }

  editar (): void {
    this.$router.push('/news/edit/' + this.news.uid)
  }

  setSnackbar (snackbar: Boolean): void {
    this.snackbar = snackbar
  }

  async publish (): Promise<void> {
    try {
      this.news.state = 'published'
      this.news = await newsStore.updateNews(this.news)
      this.isPublished = true
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao publicar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    }
  }

  async beforeCreate (): Promise<void> {
    try {
      this.news = await newsStore.getNewsByUid(this.$route.params.uid)

      if (this.news.coverPath!.length > 0) {
        this.coverURL = await newsStore.getCover(this.news.coverPath!)
      }

      if (this.news.state === 'published') {
        this.isPublished = true
      }
    } catch (error) {
      this.errorMessage = 'Ocorreu um erro ao buscar a notícia. Por favor, tente novamente.'
      this.snackbar = true
    } finally {
      this.fetchingNews = false
    }
  }
}
</script>
